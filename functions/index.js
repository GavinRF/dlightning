const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const Stripe = require("stripe");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const webhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");

exports.myFunction = onRequest({ secrets: [stripeSecretKey] }, async (req, res) => {
    const secretKey = stripeSecretKey.value();  // ✅ Accessing at runtime
    console.log("Stripe Secret Key:", secretKey);  // Debugging output
    res.send("Secret Loaded!");
  });

// Create Stripe customer
exports.createStripeCustomer = onCall(
    {
        cpu: 1,
        memory: "512MiB",
        region: "us-central1",
        cors: true, // Enable CORS for this function
    },
    async (data, context) => {
        logger.info("createStripeCustomer function called");

        if (!context.auth) {
            logger.error("Unauthenticated request");
            throw new Error("The function must be called while authenticated.");
        }

        if (!data.email) {
            logger.error("Missing email in request");
            throw new Error("The function must be called with email.");
        }

        try {
            logger.info("Creating Stripe customer for email:", data.email);
            const customer = await stripe.customers.create({ email: data.email });

            logger.info("Customer created:", customer.id);

            await db.collection("users").doc(context.auth.uid).update({
                stripe_customer_key: customer.id,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            logger.info("User document updated with customer key");
            return { customerId: customer.id };
        } catch (error) {
            logger.error("Stripe customer creation error:", error);
            throw new Error("An error occurred while creating the customer.");
        }
    }
);

// Create checkout session
exports.createCheckoutSession = onCall(
    {
        cpu: 1,
        memory: "512MiB",
        region: "us-central1",
        cors: true, // Enable CORS for this function
    },
    async (data, context) => {
        logger.info("createCheckoutSession function called");

        if (!context.auth) {
            logger.error("Unauthenticated request");
            throw new Error("The function must be called while authenticated.");
        }

        if (!data.customerId || !data.priceId) {
            logger.error("Missing required data:", { data });
            throw new Error("The function must be called with customerId and priceId.");
        }

        try {
            logger.info("Creating checkout session for customer:", data.customerId);
            const session = await stripe.checkout.sessions.create({
                customer: data.customerId,
                mode: "subscription",
                line_items: [
                    {
                        price: data.priceId,
                        quantity: 1,
                    },
                ],
                success_url:
                    data.successUrl ||
                    "https://dlightning.org/ux-mobile-mock-tool.html?subscription=success",
                cancel_url:
                    data.cancelUrl ||
                    "https://dlightning.org/ux-mobile-mock-tool.html?subscription=cancel",
            });

            logger.info("Checkout session created:", session.id);

            await db.collection("checkout_sessions").doc(session.id).set({
                userId: context.auth.uid,
                sessionId: session.id,
                customerId: data.customerId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                status: "created",
            });

            logger.info("Session stored in Firestore");
            return { url: session.url };
        } catch (error) {
            logger.error("Stripe session creation error:", error);
            throw new Error("An error occurred while creating the checkout session.");
        }
    }
);

// Stripe Webhook (Gen 2 HTTP function)
const app = express();
app.use(express.json({ verify: (req, res, buf) => (req.rawBody = buf) }));
app.use(cors({ origin: true }));

app.post("/webhook", async (req, res) => {

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, signature, webhookSecret);
    } catch (err) {
        logger.error("Webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    logger.info("Stripe webhook event received:", event.type);

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object;
            logger.info("Checkout session completed:", session.id);

            await db.collection("checkout_sessions").doc(session.id).update({
                status: "completed",
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            const checkoutDoc = await db.collection("checkout_sessions").doc(session.id).get();
            if (checkoutDoc.exists) {
                const userId = checkoutDoc.data().userId;

                await db.collection("users").doc(userId).update({
                    pro_account: true,
                    subscription_id: session.subscription,
                    subscription_status: "active",
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                logger.info(`User ${userId} updated with pro account status`);
            }
            break;
        }

        case "customer.subscription.updated": {
            const subscription = event.data.object;
            logger.info("Subscription updated:", subscription.id);

            const userSnapshot = await db
                .collection("users")
                .where("subscription_id", "==", subscription.id)
                .limit(1)
                .get();

            if (!userSnapshot.empty) {
                const userId = userSnapshot.docs[0].id;

                await db.collection("users").doc(userId).update({
                    subscription_status: subscription.status,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                logger.info(`User ${userId} subscription status updated to ${subscription.status}`);
            }
            break;
        }

        case "customer.subscription.deleted": {
            const subscription = event.data.object;
            logger.info("Subscription deleted:", subscription.id);

            const userSnapshot = await db
                .collection("users")
                .where("subscription_id", "==", subscription.id)
                .limit(1)
                .get();

            if (!userSnapshot.empty) {
                const userId = userSnapshot.docs[0].id;

                await db.collection("users").doc(userId).update({
                    pro_account: false,
                    subscription_status: "cancelled",
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                logger.info(`User ${userId} subscription cancelled, pro account revoked`);
            }
            break;
        }
    }

    res.status(200).send({ received: true });
});

exports.stripeWebhook = onRequest(
    {
        cpu: 1,
        memory: "512MiB",
        region: "us-central1",
        cors: true,
    },
    (req, res) => {
        return app(req, res);
    }
);