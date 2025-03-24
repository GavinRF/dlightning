const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Stripe = require('stripe');
// const cors = require('cors')({ origin: true });


admin.initializeApp();
const db = admin.firestore();

const stripe = new Stripe(functions.config().stripe.secret, {
    apiVersion: '2023-10-16'
});

// Create Stripe customer
exports.createStripeCustomer = functions.https.onCall(async (data, context) => {
    console.log('createStripeCustomer function called');

    if (!context.auth) {
        console.error('Unauthenticated request');
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }

    if (!data.email) {
        console.error('Missing email in request');
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with email.'
        );
    }

    try {
        console.log('Creating Stripe customer for email:', data.email);
        const customer = await stripe.customers.create({
            email: data.email
        });

        console.log('Customer created:', customer.id);
        
        await db.collection('users').doc(context.auth.uid).update({
            stripe_customer_key: customer.id,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        console.log('User document updated with customer key');
        return { customerId: customer.id };
    } catch (error) {
        console.error('Stripe customer creation error:', error);
        throw new functions.https.HttpsError(
            'internal',
            'An error occurred while creating the customer.'
        );
    }
});

// Create checkout session
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    console.log('createCheckoutSession function called');

    if (!context.auth) {
        console.error('Unauthenticated request');
        throw new functions.https.HttpsError(
            'unauthenticated',
            'The function must be called while authenticated.'
        );
    }

    if (!data.customerId || !data.priceId) {
        console.error('Missing required data:', { data });
        throw new functions.https.HttpsError(
            'invalid-argument',
            'The function must be called with customerId and priceId.'
        );
    }

    try {
        console.log('Creating checkout session for customer:', data.customerId);
        const session = await stripe.checkout.sessions.create({
            customer: data.customerId,
            mode: 'subscription',
            line_items: [{
                price: data.priceId,
                quantity: 1
            }],
            success_url: data.successUrl || 'https://dlightning.org/ux-mobile-mock-tool.html?subscription=success',
            cancel_url: data.cancelUrl || 'https://dlightning.org/ux-mobile-mock-tool.html?subscription=cancel'
        });

        console.log('Checkout session created:', session.id);

        await db.collection('checkout_sessions').doc(session.id).set({
            userId: context.auth.uid,
            sessionId: session.id,
            customerId: data.customerId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: 'created'
        });

        console.log('Session stored in Firestore');
        return { url: session.url };
    } catch (error) {
        console.error('Stripe session creation error:', error);
        throw new functions.https.HttpsError(
            'internal',
            'An error occurred while creating the checkout session.'
        );
    }
});

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