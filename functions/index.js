const { onCall } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const express = require("express");
const Stripe = require("stripe");
const cors = require('cors');

// Define secrets
const webhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");

// Initialize Firebase
admin.initializeApp();
const db = admin.firestore();

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

// Create Stripe customer
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

// Create checkout session - FIXED
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
            // Get domain from data or use default
            const domain = data.domain || 'https://dlightning.org';
            
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
                success_url: data.successUrl || 
                    `${domain}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: data.cancelUrl || 
                    `${domain}/subscription-cancel`,
                // Add metadata to help identify the user on webhook events
                metadata: {
                    userId: context.auth.uid
                }
            });

            logger.info("Checkout session created:", session.id);

            // Store checkout session details in Firestore
            await db.collection("checkout_sessions").doc(session.id).set({
                userId: context.auth.uid,
                sessionId: session.id,
                customerId: data.customerId,
                priceId: data.priceId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                status: "created",
            });

            logger.info("Session stored in Firestore");
            return { sessionId: session.id, url: session.url };
        } catch (error) {
            logger.error("Stripe session creation error:", error);
            throw new Error(`An error occurred while creating the checkout session: ${error.message}`);
        }
    }
);

// Properly configured webhook handler with Express app to capture raw body - FIXED
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
                
                // Handle the different event types
                switch(event.type) {
                    case 'customer.subscription.created':
                        await handleSubscriptionCreated(event.data.object);
                        break;
                    
                    case 'customer.subscription.updated':
                        await handleSubscriptionUpdated(event.data.object);
                        break;
                    
                    case 'customer.subscription.deleted':
                        await handleSubscriptionDeleted(event.data.object);
                        break;
                    
                    case 'checkout.session.completed':
                        await handleCheckoutCompleted(event.data.object);
                        break;
                        
                    default:
                        logger.info(`Unhandled event type: ${event.type}`);
                }
                
                // Return success response
                return res.status(200).json({ received: true });
                
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
async function handleSubscriptionCreated(subscription) {
    try {
        logger.info("Processing subscription created:", subscription.id);
        
        const userSnapshot = await db
            .collection("users")
            .where("stripe_customer_key", "==", subscription.customer)
            .get();
        
        if (!userSnapshot.empty) {
            for (const userDoc of userSnapshot.docs) {
                await userDoc.ref.update({
                    pro_account: true,
                    subscription_id: subscription.id,
                    stripe_subscription_id: subscription.id,
                    stripe_plan_end_date: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
                    stripe_subscription_status: subscription.status,
                    stripe_subscription_product_id: subscription.plan.product,
                    stripe_subscription_price_id: subscription.plan.id,
                    subscription_status: "active",
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                
                logger.info(`Subscription created for user ${userDoc.id}, customer: ${subscription.customer}`);
            }
        } else {
            logger.warn(`No user found for customer: ${subscription.customer}`);
        }
    } catch (error) {
        logger.error("Error in handleSubscriptionCreated:", error);
        throw error;
    }
}

async function handleSubscriptionUpdated(subscription) {
    try {
        logger.info("Processing subscription updated:", subscription.id);
        
        const userSnapshot = await db
            .collection("users")
            .where("stripe_subscription_id", "==", subscription.id)
            .get();
        
        if (!userSnapshot.empty) {
            for (const userDoc of userSnapshot.docs) {
                await userDoc.ref.update({
                    stripe_plan_end_date: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
                    stripe_subscription_status: subscription.status,
                    stripe_subscription_product_id: subscription.plan.product,
                    stripe_subscription_price_id: subscription.plan.id,
                    subscription_status: subscription.status,
                    pro_account: subscription.status === 'active', // Update pro_account based on status
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                
                logger.info(`Subscription updated for ID: ${subscription.id}, status: ${subscription.status}`);
            }
        } else {
            logger.warn(`No user found for subscription ID: ${subscription.id}`);
        }
    } catch (error) {
        logger.error("Error in handleSubscriptionUpdated:", error);
        throw error;
    }
}

async function handleSubscriptionDeleted(subscription) {
    try {
        logger.info("Processing subscription deleted:", subscription.id);
        
        const userSnapshot = await db
            .collection("users")
            .where("stripe_subscription_id", "==", subscription.id)
            .get();
        
        if (!userSnapshot.empty) {
            for (const userDoc of userSnapshot.docs) {
                await userDoc.ref.update({
                    pro_account: false,
                    stripe_plan_end_date: admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000),
                    stripe_subscription_status: "canceled",
                    subscription_status: "cancelled",
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                
                logger.info(`Subscription deleted for ID: ${subscription.id}, user: ${userDoc.id}`);
            }
        } else {
            logger.warn(`No user found for deleted subscription ID: ${subscription.id}`);
        }
    } catch (error) {
        logger.error("Error in handleSubscriptionDeleted:", error);
        throw error;
    }
}

async function handleCheckoutCompleted(session) {
    try {
        logger.info("Processing checkout session completed:", session.id);
        
        // Update checkout session status
        await db.collection("checkout_sessions").doc(session.id).update({
            status: "completed",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        // There are two ways to find the associated user:
        // 1. From metadata (preferred)
        // 2. From the checkout_sessions collection (fallback)
        
        let userId = session.metadata?.userId;
        
        // If userId not in metadata, try to get it from checkout_sessions
        if (!userId) {
            const checkoutDoc = await db.collection("checkout_sessions").doc(session.id).get();
            if (checkoutDoc.exists) {
                userId = checkoutDoc.data().userId;
            } else {
                logger.error(`No checkout session found with ID: ${session.id}`);
                return;
            }
        }
        
        if (userId) {
            // If we have a subscription, update the user's subscription info
            if (session.subscription) {
                await db.collection("users").doc(userId).update({
                    pro_account: true,
                    subscription_id: session.subscription,
                    stripe_subscription_id: session.subscription,
                    subscription_status: "active",
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                
                logger.info(`User ${userId} updated with pro account status from checkout session`);
            } else {
                logger.warn(`Checkout session ${session.id} completed but no subscription ID found`);
            }
        } else {
            logger.error(`Could not determine user ID for checkout session: ${session.id}`);
        }
    } catch (error) {
        logger.error("Error in handleCheckoutCompleted:", error);
        throw error;
    }
}

// cd functions
// firebase deploy --only functions  <--## only needs to be run when changes to functions are made
// firebase functions:config:get
// firebase serve --only hosting

// clean up directory
// rm -rf node_modules
// rm package-lock.json
// npm install firebase-admin@latest firebase-functions@latest stripe@latest

//stop port
// lsof -i :5001
// kill -9 <PID>
// Ctrl + C <-- stops firebase emulators etc.

// other commands •
// https://github.com/firebase/firebase-tools
// firebase emulators:start
// firebase projects:list
// firebase use <your-project-id>
// npm outdated