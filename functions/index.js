const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

// Initialize services
admin.initializeApp();
const db = admin.firestore();
const app = express();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    const thread = await openai.beta.threads.create();

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
    const initialPrompt = `You are a UX consultant intake specialist for Dlightning, a UX/Experience Design agency.

Your role is to conduct a structured client intake interview to understand their project needs.

Client Information:
- Name: ${clientInfo.name}
- Email: ${clientInfo.email}
- Company: ${clientInfo.company || 'Not provided'}
- Phone: ${clientInfo.phone || 'Not provided'}

Please start the intake process by:
1. Greeting the client warmly
2. Briefly explaining Dlightning's expertise in experience design and product validation
3. Ask the first question about their project goals

Keep responses conversational, professional, and focused on gathering key information about their UX/design needs.`;

    await openai.beta.threads.messages.create(thread.id, {
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
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message
    });

    // Create and run assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID, // You'll need to create this
      instructions: `Continue the client intake interview. Ask follow-up questions to understand:
      - Project scope and timeline
      - Target audience
      - Current challenges
      - Budget considerations
      - Desired outcomes

      Keep responses concise and professional. Guide the conversation to gather comprehensive project requirements.`
    });

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    while (runStatus.status === "in_progress" || runStatus.status === "queued") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }

    if (runStatus.status === "completed") {
      // Get the assistant's response
      const messages = await openai.beta.threads.messages.list(threadId, {
        order: "desc",
        limit: 1
      });

      const assistantResponse = messages.data[0].content[0].text.value;

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
        lastActivity: admin.firestore.FieldValue.serverTimestamp()
      });

      return {
        response: assistantResponse,
        sessionId: sessionId
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

    const completion = await openai.chat.completions.create({
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