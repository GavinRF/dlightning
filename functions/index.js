const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors')({
  origin: true,  // Allow any origin (or specify ['https://dlightning.org'])
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
});

// Helper function to verify authentication
async function verifyAuth(req) {
  // Get the auth header
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  
  try {
    // Extract and verify token
    const idToken = authHeader.substring(7);
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    console.error('Auth error:', error);
    throw new Error('Invalid authentication');
  }
}

// Create a payment intent - CORS-enabled HTTP endpoint
// exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
//   // First, handle CORS preflight request
//   return cors(req, res, async () => {
//     try {
//       // Check for OPTIONS method (preflight)
//       if (req.method === 'OPTIONS') {
//         res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//         res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//         res.status(204).send('');
//         return;
//       }
      
//       // Verify auth token
//       let uid;
//       try {
//         uid = await verifyAuth(req);
//       } catch (authError) {
//         console.error('Authentication failed:', authError);
//         res.status(401).json({ error: 'You must be logged in to create a payment intent' });
//         return;
//       }
      
//       console.log(`User authenticated: ${uid}`);
      
//       // Extract data from request
//       const data = req.body || {};
//       const { priceId } = data;
      
//       if (!priceId) {
//         res.status(400).json({ error: 'Price ID is required' });
//         return;
//       }
      
//       // Get user from Firestore
//       const userSnapshot = await admin.firestore().collection('users').doc(uid).get();
//       if (!userSnapshot.exists) {
//         console.error(`User document not found for uid: ${uid}`);
//         res.status(404).json({ error: 'User not found' });
//         return;
//       }
      
//       const userData = userSnapshot.data();
//       const userEmail = userData.email;
      
//       // Check if user already has a Stripe customer ID
//       let customerId = userData.stripe_customer_id;
      
//       if (!customerId) {
//         console.log('Creating new Stripe customer...');
//         // Create a new customer in Stripe
//         const customer = await stripe.customers.create({
//           email: userEmail,
//           metadata: {
//             firebaseUid: uid
//           }
//         });
        
//         customerId = customer.id;
        
//         // Save the customer ID to Firestore
//         await admin.firestore().collection('users').doc(uid).update({
//           stripe_customer_id: customerId
//         });
//         console.log(`Created new customer: ${customerId}`);
//       } else {
//         console.log(`Using existing customer: ${customerId}`);
//       }
      
//       // Get price info from Stripe
//       const price = await stripe.prices.retrieve(priceId);
      
//       // Create a subscription
//       const subscription = await stripe.subscriptions.create({
//         customer: customerId,
//         items: [{ price: priceId }],
//         payment_behavior: 'default_incomplete',
//         payment_settings: { save_default_payment_method: 'on_subscription' },
//         expand: ['latest_invoice.payment_intent']
//       });
      
//       console.log(`Created subscription: ${subscription.id}`);
      
//       // Return the client secret
//       res.json({
//         subscriptionId: subscription.id,
//         clientSecret: subscription.latest_invoice.payment_intent.client_secret
//       });
      
//     } catch (error) {
//       console.error('Error creating payment intent:', error);
//       res.status(500).json({
//         error: error.message || 'An error occurred while creating the payment intent'
//       });
//     }
//   });
// });

// Check subscription status - CORS-enabled HTTP endpoint
exports.checkSubscriptionStatus = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Check for OPTIONS method (preflight)
      if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(204).send('');
        return;
      }
      
      // Verify auth token
      let uid;
      try {
        uid = await verifyAuth(req);
      } catch (authError) {
        console.error('Authentication failed:', authError);
        res.status(401).json({ error: 'You must be logged in to check subscription status' });
        return;
      }
      
      // Get user from Firestore
      const userSnapshot = await admin.firestore().collection('users').doc(uid).get();
      if (!userSnapshot.exists) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      const userData = userSnapshot.data();
      const customerId = userData.stripe_customer_id;
      
      if (!customerId) {
        res.json({ isActive: false });
        return;
      }
      
      // Get subscriptions from Stripe
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1
      });
      
      const isActive = subscriptions.data.length > 0;
      
      res.json({ isActive });
      
    } catch (error) {
      console.error('Error checking subscription status:', error);
      res.status(500).json({
        error: error.message || 'An error occurred while checking subscription status'
      });
    }
  });
});

// Other functions should be updated similarly...
// For completeness, here's an updated customer portal function
exports.createPortalSession = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      // Check for OPTIONS method (preflight)
      if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.status(204).send('');
        return;
      }
      
      // Verify auth token
      let uid;
      try {
        uid = await verifyAuth(req);
      } catch (authError) {
        res.status(401).json({ error: 'You must be logged in to access the customer portal' });
        return;
      }
      
      // Get user from Firestore
      const userSnapshot = await admin.firestore().collection('users').doc(uid).get();
      if (!userSnapshot.exists) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      const userData = userSnapshot.data();
      const customerId = userData.stripe_customer_id;
      
      if (!customerId) {
        res.status(404).json({ error: 'No Stripe customer found for this user' });
        return;
      }
      
      const data = req.body || {};
      
      // Create customer portal session
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: data.returnUrl || process.env.APP_URL || 'https://dlightning.org/account'
      });
      
      res.json({ url: session.url });
      
    } catch (error) {
      console.error('Error creating portal session:', error);
      res.status(500).json({
        error: error.message || 'An error occurred while creating the portal session'
      });
    }
  });
});

// Add this to your index.js file in your Firebase Functions

// Create Checkout Session - CORS-enabled HTTP endpoint
exports.createCheckoutSession = functions.https.onRequest((req, res) => {
    return cors(req, res, async () => {
      try {
        // Check for OPTIONS method (preflight)
        if (req.method === 'OPTIONS') {
          res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
          res.status(204).send('');
          return;
        }
        
        // Verify auth token
        let uid;
        try {
          uid = await verifyAuth(req);
        } catch (authError) {
          console.error('Authentication failed:', authError);
          res.status(401).json({ error: 'You must be logged in to create a checkout session' });
          return;
        }
        
        // Extract data from request
        const data = req.body || {};
        const { priceId, successUrl, cancelUrl } = data;
        
        if (!priceId) {
          res.status(400).json({ error: 'Price ID is required' });
          return;
        }
        
        if (!successUrl || !cancelUrl) {
          res.status(400).json({ error: 'Success and cancel URLs are required' });
          return;
        }
        
        // Get user from Firestore
        const userSnapshot = await admin.firestore().collection('users').doc(uid).get();
        if (!userSnapshot.exists) {
          console.error(`User document not found for uid: ${uid}`);
          res.status(404).json({ error: 'User not found' });
          return;
        }
        
        const userData = userSnapshot.data();
        const userEmail = userData.email;
        
        // Check if user already has a Stripe customer ID
        let customerId = userData.stripe_customer_id;
        
        if (!customerId) {
          console.log('Creating new Stripe customer...');
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
            stripe_customer_id: customerId,
            stripe_customer_key: customerId // For compatibility with your webhook code
          });
          console.log(`Created new customer: ${customerId}`);
        } else {
          console.log(`Using existing customer: ${customerId}`);
        }
        
        // Create a checkout session
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          allow_promotion_codes: true,
          success_url: successUrl,
          cancel_url: cancelUrl,
          metadata: {
            firebaseUid: uid
          }
        });
        
        console.log(`Created checkout session: ${session.id}`);
        
        // Return the session URL
        res.json({
          url: session.url
        });
        
      } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({
          error: error.message || 'An error occurred while creating the checkout session'
        });
      }
    });
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