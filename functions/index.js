// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

// Create a payment intent
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to create a payment intent'
    );
  }
  
  try {
    const { priceId } = data;
    const uid = context.auth.uid;
    
    // Get user from Firestore
    const userSnapshot = await admin.firestore().collection('users').doc(uid).get();
    if (!userSnapshot.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User not found'
      );
    }
    
    const userData = userSnapshot.data();
    const userEmail = userData.email;
    
    // Check if user already has a Stripe customer ID
    let customerId = userData.stripe_customer_id;
    
    if (!customerId) {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          firebaseUid: uid
        }
      });
      
      customerId = customer.id;
      
      // Save the customer ID to Firestore
      await admin.firestore().collection('users').doc(uid).update({
        stripe_customer_id: customerId
      });
    }
    
    // Get price info from Stripe
    const price = await stripe.prices.retrieve(priceId);
    
    // Create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent']
    });
    
    // Return the client secret
    return {
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret
    };
    
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'An error occurred while creating the payment intent'
    );
  }
});

// Check subscription status
exports.checkSubscriptionStatus = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to check subscription status'
    );
  }
  
  try {
    const uid = context.auth.uid;
    
    // Get user from Firestore
    const userSnapshot = await admin.firestore().collection('users').doc(uid).get();
    if (!userSnapshot.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User not found'
      );
    }
    
    const userData = userSnapshot.data();
    const customerId = userData.stripe_customer_id;
    
    if (!customerId) {
      return { isActive: false };
    }
    
    // Get subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1
    });
    
    const isActive = subscriptions.data.length > 0;
    
    return { isActive };
    
  } catch (error) {
    console.error('Error checking subscription status:', error);
    
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'An error occurred while checking subscription status'
    );
  }
});

// Webhook handler for Stripe events
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      endpointSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handleSuccessfulPayment(event.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handleFailedPayment(event.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return res.status(200).json({ received: true });
    
  } catch (error) {
    console.error(`Error handling webhook event ${event.type}:`, error);
    return res.status(500).send(`Error handling webhook: ${error.message}`);
  }
});

// Helper functions for webhook handler
async function handleSubscriptionChange(subscription) {
  try {
    const customerId = subscription.customer;
    
    // Get Firebase UID from Stripe customer
    const customer = await stripe.customers.retrieve(customerId);
    const firebaseUid = customer.metadata.firebaseUid;
    
    if (!firebaseUid) {
      console.error('No Firebase UID found in customer metadata');
      return;
    }
    
    // Update user in Firestore
    const userRef = admin.firestore().collection('users').doc(firebaseUid);
    
    await userRef.update({
      pro_account: subscription.status === 'active',
      subscription_status: subscription.status,
      subscription_id: subscription.id,
      subscription_current_period_end: new Date(subscription.current_period_end * 1000),
      subscription_updated_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Updated subscription status for user ${firebaseUid} to ${subscription.status}`);
    
  } catch (error) {
    console.error('Error handling subscription change:', error);
    throw error;
  }
}

async function handleSubscriptionCancelled(subscription) {
  try {
    const customerId = subscription.customer;
    
    // Get Firebase UID from Stripe customer
    const customer = await stripe.customers.retrieve(customerId);
    const firebaseUid = customer.metadata.firebaseUid;
    
    if (!firebaseUid) {
      console.error('No Firebase UID found in customer metadata');
      return;
    }
    
    // Update user in Firestore
    const userRef = admin.firestore().collection('users').doc(firebaseUid);
    
    await userRef.update({
      pro_account: false,
      subscription_status: 'cancelled',
      subscription_id: subscription.id,
      subscription_cancelled_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Marked subscription as cancelled for user ${firebaseUid}`);
    
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
    throw error;
  }
}

async function handleSuccessfulPayment(invoice) {
  try {
    if (!invoice.subscription) {
      // Not a subscription invoice
      return;
    }
    
    const customerId = invoice.customer;
    
    // Get Firebase UID from Stripe customer
    const customer = await stripe.customers.retrieve(customerId);
    const firebaseUid = customer.metadata.firebaseUid;
    
    if (!firebaseUid) {
      console.error('No Firebase UID found in customer metadata');
      return;
    }
    
    // Update user in Firestore
    const userRef = admin.firestore().collection('users').doc(firebaseUid);
    
    await userRef.update({
      pro_account: true,
      subscription_status: 'active',
      last_payment_status: 'succeeded',
      last_payment_date: admin.firestore.FieldValue.serverTimestamp(),
      last_invoice_id: invoice.id
    });
    
    console.log(`Updated payment status for user ${firebaseUid} to succeeded`);
    
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}

async function handleFailedPayment(invoice) {
  try {
    if (!invoice.subscription) {
      // Not a subscription invoice
      return;
    }
    
    const customerId = invoice.customer;
    
    // Get Firebase UID from Stripe customer
    const customer = await stripe.customers.retrieve(customerId);
    const firebaseUid = customer.metadata.firebaseUid;
    
    if (!firebaseUid) {
      console.error('No Firebase UID found in customer metadata');
      return;
    }
    
    // Update user in Firestore
    const userRef = admin.firestore().collection('users').doc(firebaseUid);
    
    await userRef.update({
      last_payment_status: 'failed',
      last_payment_date: admin.firestore.FieldValue.serverTimestamp(),
      last_invoice_id: invoice.id
    });
    
    console.log(`Updated payment status for user ${firebaseUid} to failed`);
    
  } catch (error) {
    console.error('Error handling failed payment:', error);
    throw error;
  }
}

// Create customer portal session
exports.createPortalSession = functions.https.onCall(async (data, context) => {
  // Ensure user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to access the customer portal'
    );
  }
  
  try {
    const uid = context.auth.uid;
    
    // Get user from Firestore
    const userSnapshot = await admin.firestore().collection('users').doc(uid).get();
    if (!userSnapshot.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User not found'
      );
    }
    
    const userData = userSnapshot.data();
    const customerId = userData.stripe_customer_id;
    
    if (!customerId) {
      throw new functions.https.HttpsError(
        'not-found',
        'No Stripe customer found for this user'
      );
    }
    
    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: data.returnUrl || `${process.env.APP_URL}/account`
    });
    
    return { url: session.url };
    
  } catch (error) {
    console.error('Error creating portal session:', error);
    
    throw new functions.https.HttpsError(
      'internal',
      error.message || 'An error occurred while creating the portal session'
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
// npm outdated