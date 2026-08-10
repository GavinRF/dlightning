const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const crypto = require("crypto");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

// Initialize services
admin.initializeApp();
const db = admin.firestore();
const app = express();

// Initialize OpenAI lazily. Constructing the client eagerly throws when
// OPENAI_API_KEY is absent, which fails source analysis for the whole codebase
// and blocks deploying functions that have nothing to do with OpenAI.
let openaiClient = null;
function getOpenAI() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

// CORS setup
app.use(cors({ origin: true }));
app.use(express.json());

// ============================================================================
// CLIENT INTAKE FUNCTIONS
// ============================================================================

/**
 * Create a new client intake session with OpenAI Assistant
 */
exports.createClientIntakeSession = onCall({ cors: true }, async (data, context) => {
  try {
    const { clientInfo } = data;

    if (!clientInfo || !clientInfo.name || !clientInfo.email) {
      throw new HttpsError("invalid-argument", "Client name and email are required");
    }

    // Create OpenAI Assistant thread
    const thread = await getOpenAI().beta.threads.create();

    // Generate session ID
    const sessionId = `intake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store initial client data in Firestore
    const intakeData = {
      sessionId,
      threadId: thread.id,
      clientInfo: {
        name: clientInfo.name,
        email: clientInfo.email,
        company: clientInfo.company || null,
        phone: clientInfo.phone || null,
      },
      status: "active",
      stage: "initial",
      responses: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastActivity: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("client_intakes").doc(sessionId).set(intakeData);

    // Send initial message to OpenAI Assistant
    const initialPrompt = `You are a friendly UX consultant at Dlightning, a UX/Experience Design agency. You're having a relaxed, curious conversation with a prospective client — not running an intake form or interview.

Client Information:
- Name: ${clientInfo.name}
- Email: ${clientInfo.email}
- Company: ${clientInfo.company || 'Not provided'}
- Phone: ${clientInfo.phone || 'Not provided'}

Your goal right now is simply to get them talking and feeling comfortable. Open with a warm, brief greeting (use their name), then ask one open, easy-to-answer question that invites them to share what's on their mind about their project or business — something like what they're working on or what prompted them to reach out.

Tone rules:
- Sound like a real person, warm and genuinely curious — not a checklist.
- Ask ONE question, then stop. Don't stack multiple questions.
- Keep it short (1-3 sentences). No bullet-point agendas, no listing topics you'll cover.`;

    await getOpenAI().beta.threads.messages.create(thread.id, {
      role: "user",
      content: initialPrompt
    });

    return {
      sessionId,
      threadId: thread.id,
      message: "Client intake session created successfully"
    };

  } catch (error) {
    console.error("Error creating client intake session:", error);
    throw new HttpsError("internal", error.message);
  }
});

/**
 * Send message to OpenAI Assistant and get response
 */
exports.sendIntakeMessage = onCall({ cors: true }, async (data, context) => {
  try {
    const { sessionId, message } = data;

    if (!sessionId || !message) {
      throw new HttpsError("invalid-argument", "Session ID and message are required");
    }

    // Get intake session from Firestore
    const intakeDoc = await db.collection("client_intakes").doc(sessionId).get();
    if (!intakeDoc.exists) {
      throw new HttpsError("not-found", "Intake session not found");
    }

    const intakeData = intakeDoc.data();
    const threadId = intakeData.threadId;

    // Send user message to OpenAI thread
    await getOpenAI().beta.threads.messages.create(threadId, {
      role: "user",
      content: message
    });

    // Create and run assistant
    const run = await getOpenAI().beta.threads.runs.create(threadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID, // You'll need to create this
      instructions: `You're having a relaxed, natural conversation with a prospective client — your job is to get them talking and feeling heard, NOT to interrogate them or run through a checklist.

      How to respond:
      - React to what they actually said first — acknowledge it, show you understood, maybe reflect it back briefly. Be a curious human, not a form.
      - Then ask ONE follow-up question that naturally flows from what they just told you. Follow their lead and their energy; let them steer.
      - Never stack multiple questions in one message. Never list out topics or an agenda. Never fire off rapid-fire fact-gathering questions.
      - Keep it short and conversational (usually 1-3 sentences).

      Over the course of the chat you'd like to loosely understand things like their goals, who they serve, what's challenging them, and what success looks like — but treat these as things to learn organically through the conversation, NOT a script to march through. If they don't volunteer something, that's fine; don't force it.

      When — and ONLY when — the conversation has naturally run its course and your message is a final sign-off (a warm closing that does not ask the client any further question), append the exact token [[INTAKE_COMPLETE]] on its own line at the very end of that message. Do not include this token in any message where you are still asking a question or expecting a reply. Never explain or mention the token.`
    });

    // Wait for completion
    let runStatus = await getOpenAI().beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status === "in_progress" || runStatus.status === "queued") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await getOpenAI().beta.threads.runs.retrieve(threadId, run.id);
    }

    if (runStatus.status === "completed") {
      // Get the assistant's response
      const messages = await getOpenAI().beta.threads.messages.list(threadId, {
        order: "desc",
        limit: 1
      });

      const rawResponse = messages.data[0].content[0].text.value;

      // The assistant appends [[INTAKE_COMPLETE]] only on its final sign-off
      // message. Detect it, then strip it so the client never sees the token.
      const isComplete = /\[\[\s*INTAKE_COMPLETE\s*\]\]/i.test(rawResponse);
      const assistantResponse = rawResponse
        .replace(/\[\[\s*INTAKE_COMPLETE\s*\]\]/gi, "")
        .trim();

      // Update Firestore with conversation
      const updatedResponses = [
        ...(intakeData.responses || []),
        {
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          userMessage: message,
          assistantResponse: assistantResponse,
          type: "conversation"
        }
      ];

      await db.collection("client_intakes").doc(sessionId).update({
        responses: updatedResponses,
        lastActivity: admin.firestore.FieldValue.serverTimestamp(),
        ...(isComplete ? { stage: "conversation_complete" } : {})
      });

      return {
        response: assistantResponse,
        sessionId: sessionId,
        isComplete: isComplete
      };
    } else {
      throw new Error("Assistant run failed: " + runStatus.status);
    }

  } catch (error) {
    console.error("Error sending intake message:", error);
    throw new HttpsError("internal", error.message);
  }
});

/**
 * Complete client intake and generate summary
 */
exports.completeClientIntake = onCall({ cors: true }, async (data, context) => {
  try {
    const { sessionId } = data;

    if (!sessionId) {
      throw new HttpsError("invalid-argument", "Session ID is required");
    }

    // Get intake session
    const intakeDoc = await db.collection("client_intakes").doc(sessionId).get();
    if (!intakeDoc.exists) {
      throw new HttpsError("not-found", "Intake session not found");
    }

    const intakeData = intakeDoc.data();

    // Generate summary using OpenAI
    const summaryPrompt = `Based on the client intake conversation, please provide a structured summary of:

1. **Client Information**
2. **Project Overview**
3. **Key Requirements**
4. **Timeline & Budget**
5. **Next Steps Recommended**

Format as a professional client brief that the Dlightning team can use for project planning.

Client: ${intakeData.clientInfo.name} (${intakeData.clientInfo.email})
Company: ${intakeData.clientInfo.company || 'Not provided'}`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a UX consultant creating client intake summaries." },
        { role: "user", content: summaryPrompt }
      ],
      max_tokens: 1000
    });

    const summary = completion.choices[0].message.content;

    // Update intake with completion
    await db.collection("client_intakes").doc(sessionId).update({
      status: "completed",
      summary: summary,
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create a lead in CRM collection
    const leadData = {
      clientInfo: intakeData.clientInfo,
      source: "intake_portal",
      summary: summary,
      responses: intakeData.responses,
      sessionId: sessionId,
      status: "new_lead",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection("leads").add(leadData);

    return {
      summary: summary,
      sessionId: sessionId,
      message: "Intake completed and lead created"
    };

  } catch (error) {
    console.error("Error completing client intake:", error);
    throw new HttpsError("internal", error.message);
  }
});

// ============================================================================
// EXISTING STRIPE FUNCTIONS (preserved from original)
// ============================================================================

// Stripe helper functions
async function updateUserSubscription(userId, subscription) {
  try {
    const updateData = {
      pro_account: subscription.status === "active",
      subscription_status: subscription.status,
      subscription_current_period_end: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
      subscription_start_date: admin.firestore.Timestamp.fromMillis(subscription.start_date * 1000),
      stripe_customer_id: subscription.customer,
      stripe_subscription_id: subscription.id,
      stripe_plan_end_date: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
      stripe_subscription_status: subscription.status,
      last_updated: admin.firestore.FieldValue.serverTimestamp()
    };

    if (subscription.items && subscription.items.data && subscription.items.data[0]) {
      const price = subscription.items.data[0].price;
      updateData.stripe_subscription_product_id = price.product;
      updateData.stripe_subscription_price_id = price.id;
    }

    await db.collection("users").doc(userId).update(updateData);
    console.log(`Updated subscription for user ${userId} with status: ${subscription.status}`);
    return true;
  } catch (error) {
    console.error(`Error updating user subscription: ${error.message}`);
    return false;
  }
}

async function getUserIdFromCustomerId(customerId) {
  try {
    const userQuery = await db.collection("users").where("stripe_customer_id", "==", customerId).limit(1).get();
    if (userQuery.empty) {
      console.warn(`No user found for Stripe customer: ${customerId}`);
      return null;
    }
    return userQuery.docs[0].id;
  } catch (error) {
    console.error(`Error finding user for customer: ${error.message}`);
    return null;
  }
}

async function createStripeCustomer(user) {
  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.displayName || user.email,
      metadata: {
        firebaseUID: user.uid
      }
    });

    await db.collection("users").doc(user.uid).update({
      stripe_customer_id: customer.id
    });

    return customer.id;
  } catch (error) {
    console.error(`Error creating Stripe customer: ${error.message}`);
    throw error;
  }
}

async function getOrCreateCustomerId(userId) {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) {
    throw new Error(`User with ID ${userId} not found`);
  }

  const userData = userDoc.data();
  if (userData.stripe_customer_id) {
    return userData.stripe_customer_id;
  }

  const user = await admin.auth().getUser(userId);
  return createStripeCustomer(user);
}

async function logPaymentActivity(userId, invoice) {
  try {
    await db.collection("payment_logs").add({
      user_id: userId,
      payment_intent: invoice.payment_intent,
      payment_status: invoice.status,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      invoice: invoice.invoice,
      subscription: invoice.subscription,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
  } catch (error) {
    console.error(`Error logging payment: ${error.message}`);
  }
}

// Express routes for Stripe
app.post("/createCheckoutSession", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { priceId, successUrl, cancelUrl } = req.body;
    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const customerId = await getOrCreateCustomerId(userId);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      metadata: {
        firebaseUID: userId
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/createPortalSession", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const { returnUrl } = req.body;
    if (!returnUrl) {
      return res.status(400).json({ error: "Missing return URL" });
    }

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    if (!userData.stripe_customer_id) {
      return res.status(400).json({ error: "No subscription found for this user" });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: returnUrl,
    });

    return res.status(200).json({ url: portalSession.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post("/checkSubscriptionStatus", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();
    const subscriptionData = {
      isActive: Boolean(userData.pro_account),
      status: userData.subscription_status || "none",
      currentPeriodEnd: userData.subscription_current_period_end?.toDate() || null,
      customerId: userData.stripe_customer_id || null,
      subscriptionId: userData.stripe_subscription_id || null,
    };

    return res.status(200).json(subscriptionData);
  } catch (error) {
    console.error("Error checking subscription status:", error);
    return res.status(500).json({ error: error.message });
  }
});

// Export Express app
exports.api = onRequest({ cors: true }, app);

// Cloud Functions for Stripe
exports.createCheckoutSession = onCall({ cors: true }, async (data, context) => {
  if (!context.auth) {
    throw new HttpsError("unauthenticated", "User must be logged in");
  }

  const userId = context.auth.uid;
  const { priceId, successUrl, cancelUrl } = data;

  if (!priceId || !successUrl || !cancelUrl) {
    throw new HttpsError("invalid-argument", "Missing required parameters");
  }

  try {
    const customerId = await getOrCreateCustomerId(userId);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer: customerId,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      metadata: {
        firebaseUID: userId
      }
    });

    return { url: session.url };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new HttpsError("internal", error.message);
  }
});

exports.createPortalSession = onCall({ cors: true }, async (data, context) => {
  if (!context.auth) {
    throw new HttpsError("unauthenticated", "User must be logged in");
  }

  const userId = context.auth.uid;
  const { returnUrl } = data;

  if (!returnUrl) {
    throw new HttpsError("invalid-argument", "Missing return URL");
  }

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User not found");
    }

    const userData = userDoc.data();
    if (!userData.stripe_customer_id) {
      throw new HttpsError("failed-precondition", "No subscription found for this user");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: returnUrl,
    });

    return { url: portalSession.url };
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw new HttpsError("internal", error.message);
  }
});

exports.checkSubscriptionStatus = onCall({ cors: true }, async (data, context) => {
  if (!context.auth) {
    throw new HttpsError("unauthenticated", "User must be logged in");
  }

  const userId = context.auth.uid;

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User not found");
    }

    const userData = userDoc.data();
    return {
      isActive: Boolean(userData.pro_account),
      status: userData.subscription_status || "none",
      currentPeriodEnd: userData.subscription_current_period_end || null,
      customerId: userData.stripe_customer_id || null,
      subscriptionId: userData.stripe_subscription_id || null,
    };
  } catch (error) {
    console.error("Error checking subscription status:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Stripe Webhook
exports.stripeWebhook = onRequest({
  cors: true,
  preserveRawBody: true,
  rawBody: true,
  region: "us-central1",
  memory: "1024MiB",
  timeoutSeconds: 60
}, async (req, res) => {
  const origin = req.headers.origin;
  if (["https://dlightning.org", "https://dlightning.io"].includes(origin)) {
    res.set("Access-Control-Allow-Origin", origin);
  }
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Stripe-Signature");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    console.error("No Stripe signature header found");
    return res.status(400).json({ error: "Missing Stripe-Signature header" });
  }

  let event;
  let endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = req.rawBody || req.body;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log(`✓ Webhook signature verified for event: ${event.type}`);
  } catch (err) {
    console.error("Webhook signature verification failed:", {
      error: err.message,
      code: err.code,
      hasEndpointSecret: !!endpointSecret,
      signatureHeader: sig ? sig.substring(0, 20) + "..." : "Missing",
      bodyLength: body ? body.length : 0,
    });
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log(`Processing webhook event: ${event.type} (ID: ${event.id})`);

  try {
    switch (event.type) {
      case "customer.subscription.created": {
        const subscription = event.data.object;
        const userId = await getUserIdFromCustomerId(subscription.customer);
        if (userId) {
          await updateUserSubscription(userId, subscription);
          const updateData = {
            last_payment_date: admin.firestore.FieldValue.serverTimestamp(),
            last_payment_status: "succeeded"
          };
          if (subscription.status === "active") {
            updateData.pro_account = true;
          }
          await db.collection("users").doc(userId).update(updateData);
          console.log(`✓ Processed subscription.created for user ${userId}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const userId = await getUserIdFromCustomerId(subscription.customer);
        if (userId) {
          await updateUserSubscription(userId, subscription);
          await db.collection("users").doc(userId).update({
            pro_account: subscription.status === "active"
          });
          console.log(`✓ Processed subscription.updated for user ${userId} (status: ${subscription.status})`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const userId = await getUserIdFromCustomerId(subscription.customer);
        if (userId) {
          await updateUserSubscription(userId, subscription);
          await db.collection("users").doc(userId).update({
            pro_account: false
          });
          console.log(`✓ Processed subscription.deleted for user ${userId}`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const userId = await getUserIdFromCustomerId(invoice.customer);
        if (userId && invoice.subscription) {
          await logPaymentActivity(userId, invoice);
          await db.collection("users").doc(userId).update({
            last_payment_date: admin.firestore.Timestamp.fromMillis(invoice.created * 1000),
            last_payment_status: "succeeded",
            last_payment_amount: invoice.amount_paid / 100
          });
          console.log(`✓ Processed payment_succeeded for user ${userId}`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const userId = await getUserIdFromCustomerId(invoice.customer);
        if (userId) {
          await logPaymentActivity(userId, invoice);
          await db.collection("users").doc(userId).update({
            last_payment_date: admin.firestore.Timestamp.fromMillis(invoice.created * 1000),
            last_payment_status: "failed"
          });
          console.log(`✓ Processed payment_failed for user ${userId}`);
        }
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.firebaseUID;
        if (userId && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await updateUserSubscription(userId, subscription);
          console.log(`✓ Processed checkout.session.completed for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({
      received: true,
      eventId: event.id,
      eventType: event.type
    });
  } catch (error) {
    console.error(`Error processing webhook event ${event.type}:`, {
      error: error.message,
      eventId: event.id,
      stack: error.stack
    });
    return res.status(200).json({
      received: true,
      eventId: event.id,
      error: `Processing error: ${error.message}`
    });
  }
});

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
async function sendMail({ to, subject, replyTo, text }) {
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
      await sendMail({
        to: values.email,
        subject: "Thanks for reaching out to Dlightning",
        text: [
          `Hi ${values.name},`,
          "",
          "Thanks for getting in touch. Your message reached us and we'll reply personally within one business day.",
          "",
          "If it's easier, you're welcome to book a time directly: https://dlightning.org/contact.html",
          "",
          "- Dlightning"
        ].join("\n")
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