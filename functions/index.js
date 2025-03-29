const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
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

// Create our main Express app
const app = express();

// Setup CORS with more permissive options - this is critical
const corsOptions = {
    origin: true, // Allow any origin
    methods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Apply CORS middleware to all routes - must come before other middleware
app.use(cors(corsOptions));

// Apply other middleware
app.use(express.json());

// Special handling for preflight requests
app.options('*', cors(corsOptions));

// Auth middleware that verifies the Firebase token
const authenticateUser = async (req, res, next) => {
    // Handle OPTIONS requests immediately (though this should be covered by the CORS middleware)
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No valid token provided' });
    }
    
    try {
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        logger.error("Authentication error:", error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Create Stripe customer
app.post('/create-customer', authenticateUser, async (req, res) => {
    const stripe = new Stripe(stripeSecretKey.value());
    logger.info("createStripeCustomer function called");

    if (!req.body.email) {
        logger.error("Missing email in request");
        return res.status(400).json({ error: "The function must be called with email." });
    }

    try {
        logger.info("Creating Stripe customer for email:", req.body.email);
        const customer = await stripe.customers.create({ email: req.body.email });

        logger.info("Customer created:", customer.id);

        await db.collection("users").doc(req.user.uid).update({
            stripe_customer_key: customer.id,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info("User document updated with customer key");
        return res.status(200).json({ customerId: customer.id });
    } catch (error) {
        logger.error("Stripe customer creation error:", error);
        return res.status(500).json({ error: `An error occurred while creating the customer: ${error.message}` });
    }
});

// Create checkout session
app.post('/create-checkout', authenticateUser, async (req, res) => {
    const stripe = new Stripe(stripeSecretKey.value());
    logger.info("createCheckoutSession function called");

    if (!req.body.customerId || !req.body.priceId) {
        logger.error("Missing required data:", { data: req.body });
        return res.status(400).json({ error: "The function must be called with customerId and priceId." });
    }

    try {
        // Get domain from data or use default
        const domain = req.body.domain || 'https://dlightning.org';
        
        logger.info("Creating checkout session for customer:", req.body.customerId);
        const session = await stripe.checkout.sessions.create({
            customer: req.body.customerId,
            mode: "subscription",
            line_items: [
                {
                    price: req.body.priceId,
                    quantity: 1,
                },
            ],
            success_url: req.body.successUrl || 
                `${domain}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: req.body.cancelUrl || 
                `${domain}/subscription-cancel`,
            // Add metadata to help identify the user on webhook events
            metadata: {
                userId: req.user.uid
            }
        });

        logger.info("Checkout session created:", session.id);

        // Store checkout session details in Firestore
        await db.collection("checkout_sessions").doc(session.id).set({
            userId: req.user.uid,
            sessionId: session.id,
            customerId: req.body.customerId,
            priceId: req.body.priceId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: "created",
        });

        logger.info("Session stored in Firestore");
        return res.status(200).json({ sessionId: session.id, url: session.url });
    } catch (error) {
        logger.error("Stripe session creation error:", error);
        return res.status(500).json({ error: `An error occurred while creating the checkout session: ${error.message}` });
    }
});

// Simple health check route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Webhook handler needs special body parsing for Stripe signature verification
const webhookApp = express();

// Allow CORS on the webhook app as well
webhookApp.use(cors({ origin: true }));

// Special body parsing for Stripe webhooks
webhookApp.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        }
    })
);

webhookApp.post('/', async (req, res) => {
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

// Export the Express app as Cloud Functions
exports.api = onRequest(
    {
        cpu: 1,
        memory: "512MiB",
        region: "us-central1",
        cors: true // Ensure CORS is enabled at the function level too
    },
    app
);

exports.stripeWebhook = onRequest(
    {
        cpu: 1,
        memory: "512MiB",
        region: "us-central1",
        cors: true // Enable CORS for webhook endpoint too
    },
    webhookApp
);

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