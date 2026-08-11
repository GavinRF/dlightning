const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const crypto = require("crypto");

// This codebase owns exactly one function: submitContact. Everything else that
// runs on this Firebase project lives in Screen-Builder-DEV or Client Intake
// DEV. See CLAUDE.md before deploying.
admin.initializeApp();
const db = admin.firestore();

// ============================================================================
// CONTACT FORM
// ============================================================================

// Secrets live in Google Secret Manager, not in .env — .env values are baked
// into the deployment as plaintext and are readable from the Cloud console.
// Bound to submitContact below, which is what exposes them to process.env at
// runtime. Set them with:
//   firebase functions:secrets:set TURNSTILE_SECRET_KEY
//   firebase functions:secrets:set CONTACT_IP_SALT
//   firebase functions:secrets:set RESEND_API_KEY
const turnstileSecretKey = defineSecret("TURNSTILE_SECRET_KEY");

// The salt is what keeps hashed IPs from being reversible. IPv4 is only ~4
// billion addresses, so an unsalted hash is trivially brute-forced back to the
// original address — this is a secret, not a config value.
const contactIpSalt = defineSecret("CONTACT_IP_SALT");

// Read by sendMail(). Every deploy from here now requires this secret to exist
// in Secret Manager, even while email is otherwise unconfigured — a bound
// secret with no value fails the deploy outright.
const resendApiKey = defineSecret("RESEND_API_KEY");

const CONTACT_ALLOWED_ORIGINS = [
  "https://dlightning.org",
  "https://www.dlightning.org",
  "https://dlightning.io",
  "https://www.dlightning.io"
];

// Rate limiting: submissions allowed per IP per rolling window
const CONTACT_RATE_LIMIT_MAX = 5;
const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

// A real person needs at least a few seconds to fill the form in. Anything
// faster is scripted. The upper bound rejects stale/replayed page loads.
const CONTACT_MIN_FILL_MS = 3000;
const CONTACT_MAX_FILL_MS = 24 * 60 * 60 * 1000;

/**
 * Hash an IP so rate-limit records never store the raw address.
 */
function hashIp(ip) {
  return crypto
    .createHash("sha256")
    .update(`${ip}|${process.env.CONTACT_IP_SALT || "dlightning"}`)
    .digest("hex")
    .slice(0, 32);
}

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || "unknown";
}

/**
 * Verify a Cloudflare Turnstile token with Cloudflare's API.
 *
 * This is the check a direct POST cannot forge: the token is issued to a real
 * browser session and can only be redeemed once, server-side, with our secret.
 */
async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // Fail closed. Accepting unverified submissions would recreate exactly the
    // open endpoint this function exists to replace.
    console.error("TURNSTILE_SECRET_KEY is not set - rejecting contact submission");
    return { ok: false, reason: "captcha_not_configured" };
  }

  if (!token) {
    return { ok: false, reason: "captcha_missing" };
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip })
      }
    );

    const outcome = await response.json();

    if (!outcome.success) {
      console.warn("Turnstile rejected token:", outcome["error-codes"]);
      return { ok: false, reason: "captcha_failed" };
    }

    return { ok: true };
  } catch (error) {
    console.error("Turnstile verification error:", error.message);
    return { ok: false, reason: "captcha_unavailable" };
  }
}

/**
 * Consume one slot from this IP's rate-limit window.
 * Returns false when the caller has exhausted the window.
 */
async function consumeRateLimit(ipHash) {
  const ref = db.collection("rate_limits").doc(`contact_${ipHash}`);

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = Date.now();

    if (!snap.exists) {
      tx.set(ref, { count: 1, windowStart: now });
      return true;
    }

    const data = snap.data();

    if (now - data.windowStart > CONTACT_RATE_LIMIT_WINDOW_MS) {
      tx.set(ref, { count: 1, windowStart: now });
      return true;
    }

    if (data.count >= CONTACT_RATE_LIMIT_MAX) {
      return false;
    }

    tx.update(ref, { count: data.count + 1 });
    return true;
  });
}

/**
 * Server-side field validation. The browser runs its own checks for UX, but
 * these are the ones that actually hold - a scripted POST skips the page.
 */
function validateContactFields({ name, email, phone, comments }) {
  const errors = [];

  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const cleanPhone = typeof phone === "string" ? phone.trim() : "";
  const cleanComments = typeof comments === "string" ? comments.trim() : "";

  if (cleanName.length < 2 || cleanName.length > 100) {
    errors.push("Please enter your name.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail) || cleanEmail.length > 254) {
    errors.push("Please enter a valid email address.");
  }

  const phoneDigits = cleanPhone.replace(/\D/g, "");
  if (phoneDigits.length && (phoneDigits.length < 7 || phoneDigits.length > 15)) {
    errors.push("Please enter a valid phone number.");
  }

  if (cleanComments.length > 1000) {
    errors.push("Please keep your message under 1000 characters.");
  }

  return {
    errors,
    values: {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone || null,
      comments: cleanComments || null
    }
  };
}

/**
 * Send mail through Resend. No-ops when unconfigured so the endpoint keeps
 * working (and still stores the lead) before email is set up.
 */
async function sendMail({ to, subject, replyTo, text, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !from || !to) {
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        ...(html ? { html } : {}),
        ...(replyTo ? { reply_to: replyTo } : {})
      })
    });

    if (!response.ok) {
      console.error("Resend error:", response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Resend request failed:", error.message);
    return false;
  }
}

// Straight to the scheduler rather than back to contact.html — sending someone
// to the page they just submitted from is a dead end.
const BOOKING_URL = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1c2Ui9MTkZEcu97MepuTZnO2HjTkt_4mCeJK19OAbDeXT9sTH57Z-GEKZVnKjjxcO33KsGlO8F?gv=true";
const BLOG_URL = "https://dlightning.org/blog/";

/**
 * Anything typed into the form is untrusted and goes into an HTML email body,
 * so it has to be escaped.
 */
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[char]);
}

/**
 * Autoreply body, as matching text and HTML parts.
 *
 * Does three things the old one-liner didn't: quotes their message back so they
 * have a record of what they sent, sets a concrete expectation, and offers the
 * two things a waiting lead can actually use — a booking slot and something to
 * read. First name only, because people type all sorts into a name field and
 * "Hi Jane Smith-Watson," reads like a mail merge.
 */
function buildAutoreply({ name, comments }) {
  const firstName = name.split(/\s+/)[0];

  const text = [
    `Hi ${firstName},`,
    "",
    "Thanks for reaching out — your message is with us."
  ];

  if (comments) {
    text.push("", "Here's what you sent, for your records:", "");
    comments.split("\n").forEach((line) => text.push(`  ${line}`));
  }

  text.push(
    "",
    "Someone will read it properly and reply within one business day.",
    "",
    "If you'd rather skip the back-and-forth, book a time directly:",
    BOOKING_URL,
    "",
    "And if you're in a reading mood, we write about design and product",
    `validation here: ${BLOG_URL}`,
    "",
    "— Dlightning"
  );

  const quoted = comments
    ? `<blockquote style="margin:24px 0;padding:4px 0 4px 16px;border-left:3px solid #5db2ff;color:#555">${escapeHtml(comments).replace(/\n/g, "<br>")}</blockquote>`
    : "";

  // Deliberately plain: no images, no background colours, no table scaffolding.
  // It reads as a person's email rather than a campaign, which is both more
  // honest and better for deliverability, and it degrades cleanly in dark mode.
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1a1a1a;max-width:560px">
  <p>Hi ${escapeHtml(firstName)},</p>
  <p>Thanks for reaching out — your message is with us.</p>
  ${quoted}
  <p>Someone will read it properly and reply within one business day.</p>
  <p>If you'd rather skip the back-and-forth, <a href="${BOOKING_URL}" style="color:#0a7cd4">book a time directly</a>.</p>
  <p>And if you're in a reading mood, we write about design and product validation <a href="${BLOG_URL}" style="color:#0a7cd4">on the blog</a>.</p>
  <p style="margin-top:32px;color:#666">— Dlightning</p>
</div>`;

  return { text: text.join("\n"), html };
}

/**
 * Deep link to a lead document in the Firestore console. Nothing reads the
 * `leads` collection yet, so this link is the only practical way to reach a
 * submission after the fact. The project id comes from the runtime rather than
 * being hardcoded.
 */
function leadConsoleUrl(id) {
  const project = process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT;
  return `https://console.firebase.google.com/project/${project}/firestore/data/~2Fleads~2F${id}`;
}

/**
 * Contact form submission endpoint.
 *
 * Replaces the public Google Forms `formResponse` action, which accepted any
 * POST from anywhere. Layers, cheapest first:
 *   1. Origin allowlist
 *   2. Honeypot field + minimum fill time (silently accepted, never stored)
 *   3. Cloudflare Turnstile, verified server-side
 *   4. Per-IP rate limit
 *   5. Field validation
 * Survivors land in the `leads` collection alongside intake-portal leads.
 */
exports.submitContact = onRequest({
  cors: false,
  region: "us-central1",
  memory: "256MiB",
  timeoutSeconds: 30,
  // Stated explicitly so the allUsers invoker binding is reapplied on every
  // deploy. A public contact endpoint needs it, and it does not weaken
  // anything — the origin allowlist, Turnstile and rate limit below are what
  // actually guard this function.
  invoker: "public",
  // Binding a secret here is what injects it into process.env for this
  // function.
  secrets: [turnstileSecretKey, contactIpSalt, resendApiKey]
}, async (req, res) => {
  const origin = req.headers.origin;
  const originAllowed = CONTACT_ALLOWED_ORIGINS.includes(origin);

  if (originAllowed) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Vary", "Origin");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method Not Allowed" });
  }

  if (!originAllowed) {
    console.warn("Contact submission from disallowed origin:", origin);
    return res.status(403).json({ success: false, error: "Forbidden" });
  }

  try {
    const body = req.body || {};
    const { name, email, phone, comments, turnstileToken, renderedAt } = body;

    // --- Trap 1: honeypot. Hidden from users, irresistible to form fillers. ---
    // Respond 200 so the bot records a success and doesn't probe for the real rule.
    if (typeof body.website === "string" && body.website.trim().length > 0) {
      console.info("Contact submission caught by honeypot");
      return res.status(200).json({ success: true });
    }

    // --- Trap 2: fill time ---
    const startedAt = Number(renderedAt);
    if (Number.isFinite(startedAt)) {
      const elapsed = Date.now() - startedAt;
      if (elapsed < CONTACT_MIN_FILL_MS || elapsed > CONTACT_MAX_FILL_MS) {
        console.info(`Contact submission rejected on fill time: ${elapsed}ms`);
        return res.status(200).json({ success: true });
      }
    }

    const ip = clientIp(req);

    // --- Turnstile ---
    const captcha = await verifyTurnstile(turnstileToken, ip);
    if (!captcha.ok) {
      const message = captcha.reason === "captcha_not_configured"
        ? "The contact form is temporarily unavailable. Please email info@dlightning.org."
        : "We couldn't verify that you're human. Please refresh the page and try again.";
      return res.status(403).json({ success: false, error: message });
    }

    // --- Rate limit ---
    const ipHash = hashIp(ip);
    const withinLimit = await consumeRateLimit(ipHash);
    if (!withinLimit) {
      return res.status(429).json({
        success: false,
        error: "You've sent several messages already. Please try again later, or email info@dlightning.org."
      });
    }

    // --- Validation ---
    const { errors, values } = validateContactFields({ name, email, phone, comments });
    if (errors.length) {
      return res.status(400).json({ success: false, error: errors.join(" ") });
    }

    // --- Store as a lead, matching the intake-portal lead shape ---
    const leadData = {
      clientInfo: {
        name: values.name,
        email: values.email,
        company: null,
        phone: values.phone
      },
      source: "contact_form",
      message: values.comments,
      status: "new_lead",
      meta: {
        ipHash,
        userAgent: (req.headers["user-agent"] || "").slice(0, 300),
        origin
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const lead = await db.collection("leads").add(leadData);

    // --- Notify (best effort - a mail failure must not lose the lead) ---
    await sendMail({
      to: process.env.CONTACT_NOTIFY_TO,
      subject: `New contact form submission from ${values.name}`,
      replyTo: values.email,
      text: [
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        `Phone: ${values.phone || "-"}`,
        "",
        values.comments || "(no message)",
        "",
        `Lead ID: ${lead.id}`,
        leadConsoleUrl(lead.id)
      ].join("\n")
    });

    if (process.env.CONTACT_AUTOREPLY === "true") {
      const autoreply = buildAutoreply(values);
      await sendMail({
        to: values.email,
        subject: "We've got your message",
        text: autoreply.text,
        html: autoreply.html
      });
    }

    return res.status(200).json({ success: true, id: lead.id });
  } catch (error) {
    console.error("Contact submission error:", error);
    return res.status(500).json({
      success: false,
      error: "Something went wrong on our end. Please email info@dlightning.org."
    });
  }
});
