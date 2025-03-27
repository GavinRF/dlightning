const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const express = require("express");
const Stripe = require("stripe");

// Define secrets
const webhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");

// Initialize Firebase
admin.initializeApp();
const db = admin.firestore();

// Create Stripe customer
// Configure CORS with allowed origins
const corsOptions = {
    origin: [
        'https://dlightning.org',
        'https://www.dlightning.org',
        'http://localhost:5500',
        'http://localhost:5001'
    ],
    optionsSuccessStatus: 200
};

exports.createStripeCustomer = onCall(
    {
        cpu: 1,
        memory: "512MiB",
        region: "us-central1",
        cors: corsOptions,
    },
    async (data, context) => {
        const stripe = new Stripe(stripeSecretKey.value());
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
            throw new Error(`An error occurred while creating the customer: ${error.message}`);
        }
    }
);

// Create checkout session
exports.createCheckoutSession = onCall(
    {
        cpu: 1,
        memory: "512MiB",
        region: "us-central1",
        cors: corsOptions,
    },
    async (data, context) => {
        const stripe = new Stripe(stripeSecretKey.value());
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
            throw new Error(`An error occurred while creating the checkout session: ${error.message}`);
        }
    }
);

// Properly configured webhook handler with Express app to capture raw body
exports.stripeWebhook = onRequest(
    {
        cpu: 1,
        memory: "512MiB",
        region: "us-central1",
        // No CORS needed for webhooks as they're server-to-server calls
    },
    (req, res) => {
        const app = express();
        
        // Configure middleware with rawBody option
        app.use(
            express.json({
                verify: (req, res, buf) => {
                    req.rawBody = buf.toString();
                }
            })
        );
        
        // Handle webhook endpoint
        app.post('/', async (req, res) => {
            const stripe = new Stripe(stripeSecretKey.value());
            
            try {
                const sig = req.headers['stripe-signature'];
                
                if (!sig) {
                    logger.error('Missing Stripe signature');
                    return res.status(400).send('Missing Stripe signature');
                }
                
                let event;
                try {
                    event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret.value());
                } catch (err) {
                    logger.error(`Webhook signature verification failed: ${err.message}`);
                    return res.status(400).send(`Webhook Error: ${err.message}`);
                }
                
                logger.info("Stripe webhook event received:", event.type);
                
                // Handle customer.subscription.created
                if (event.type === 'customer.subscription.created') {
                    await handleSubscriptionCreated(event.data.object);
                }
                
                // Handle customer.subscription.updated
                else if (event.type === 'customer.subscription.updated') {
                    await handleSubscriptionUpdated(event.data.object);
                }
                
                // Handle customer.subscription.deleted
                else if (event.type === 'customer.subscription.deleted') {
                    await handleSubscriptionDeleted(event.data.object);
                }
                
                // Checkout session completed
                else if (event.type === 'checkout.session.completed') {
                    await handleCheckoutCompleted(event.data.object);
                }
                
                // Return success response
                return res.status(200).send({ received: true });
                
            } catch (error) {
                logger.error("Webhook error:", error.message, error.stack);
                return res.status(400).send(`Webhook Error: ${error.message}`);
            }
        });
        
        // Handle all other HTTP methods
        app.all('*', (req, res) => {
            res.status(405).send('Method Not Allowed');
        });
        
        // Forward the request to our Express app
        return app(req, res);
    }
);

// Helper functions for handling different webhook events
async function handleSubscriptionCreated(dataObject) {
    try {
        const userSnapshot = await db
            .collection("users")
            .where("stripe_customer_key", "==", dataObject.customer)
            .get();
        
        if (!userSnapshot.empty) {
            for (const userDoc of userSnapshot.docs) {
                await userDoc.ref.update({
                    pro_account: true,
                    subscription_id: dataObject.id,
                    stripe_subscription_id: dataObject.id,
                    stripe_plan_end_date: admin.firestore.Timestamp.fromMillis(dataObject.current_period_end * 1000),
                    stripe_subscription_status: dataObject.status,
                    stripe_subscription_product_id: dataObject.plan.product,
                    stripe_subscription_price_id: dataObject.plan.id,
                    subscription_status: "active",
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                
                logger.info(`Subscription created for user ${userDoc.id}, customer: ${dataObject.customer}`);
            }
        } else {
            logger.warn(`No user found for customer: ${dataObject.customer}`);
        }
    } catch (error) {
        logger.error("Error in handleSubscriptionCreated:", error);
        throw error;
    }
}

async function handleSubscriptionUpdated(dataObject) {
    try {
        const userSnapshot = await db
            .collection("users")
            .where("stripe_subscription_id", "==", dataObject.id)
            .get();
        
        if (!userSnapshot.empty) {
            for (const userDoc of userSnapshot.docs) {
                await userDoc.ref.update({
                    stripe_plan_end_date: admin.firestore.Timestamp.fromMillis(dataObject.current_period_end * 1000),
                    stripe_subscription_status: dataObject.status,
                    stripe_subscription_product_id: dataObject.plan.product,
                    stripe_subscription_price_id: dataObject.plan.id,
                    subscription_status: dataObject.status,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                
                logger.info(`Subscription updated for ID: ${dataObject.id}, status: ${dataObject.status}`);
            }
        } else {
            logger.warn(`No user found for subscription ID: ${dataObject.id}`);
        }
    } catch (error) {
        logger.error("Error in handleSubscriptionUpdated:", error);
        throw error;
    }
}

async function handleSubscriptionDeleted(dataObject) {
    try {
        const userSnapshot = await db
            .collection("users")
            .where("stripe_subscription_id", "==", dataObject.id)
            .get();
        
        if (!userSnapshot.empty) {
            for (const userDoc of userSnapshot.docs) {
                await userDoc.ref.update({
                    pro_account: false,
                    stripe_plan_end_date: admin.firestore.Timestamp.fromMillis(dataObject.current_period_end * 1000),
                    stripe_subscription_status: dataObject.status,
                    stripe_subscription_product_id: dataObject.plan.product,
                    stripe_subscription_price_id: dataObject.plan.id,
                    subscription_status: "cancelled",
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                
                logger.info(`Subscription deleted for ID: ${dataObject.id}, user: ${userDoc.id}`);
            }
        } else {
            logger.warn(`No user found for deleted subscription ID: ${dataObject.id}`);
        }
    } catch (error) {
        logger.error("Error in handleSubscriptionDeleted:", error);
        throw error;
    }
}

async function handleCheckoutCompleted(session) {
    try {
        // Update checkout session status
        await db.collection("checkout_sessions").doc(session.id).update({
            status: "completed",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        // Find associated user and update their status
        const checkoutDoc = await db.collection("checkout_sessions").doc(session.id).get();
        if (checkoutDoc.exists) {
            const userId = checkoutDoc.data().userId;
            
            await db.collection("users").doc(userId).update({
                pro_account: true,
                subscription_id: session.subscription,
                subscription_status: "active",
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            
            logger.info(`User ${userId} updated with pro account status from checkout session`);
        }
    } catch (error) {
        logger.error("Error in handleCheckoutCompleted:", error);
        throw error;
    }
}