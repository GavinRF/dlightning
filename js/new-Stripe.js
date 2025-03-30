// Add this script to diagnose Stripe payment authentication issues
// Place before your Stripe payment functions or in a separate file and include it
function configureFirebaseFunctions() {
    // Check if we need to set the region
    const functionsRegion = 'us-central1'; // Change this if your functions are in a different region
    
    // Some Firebase configurations might need region specification
    if (firebase.app().options.region !== functionsRegion) {
      console.log(`Setting Firebase Functions region to ${functionsRegion}`);
      // firebase.app().functions().useEmulator('localhost', 5001);
      firebase.app().functions(functionsRegion);  // uncomment for production
    }
    
    console.log('Firebase Functions configured');
  }
  
  // 2. Function to create direct HTTP requests to Firebase Functions
  // This bypasses potential issues with the httpsCallable method
  async function callFunctionDirectly(functionName, data) {
    // Get fresh authentication token
    const user = firebase.auth().currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Force token refresh
    const token = await user.getIdToken(true);
    
    // Build the function URL
    const projectId = firebase.app().options.projectId;
    const region = 'us-central1'; // Change this if your functions are in a different region
    const functionUrl = `https://${region}-${projectId}.cloudfunctions.net/${functionName}`;
    
    console.log(`Calling function directly: ${functionUrl}`);
    
    // Make direct HTTP request
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data || {})
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Function response error:', response.status, errorText);
      throw new Error(`Function error (${response.status}): ${errorText}`);
    }
    
    return response.json();
  }
  
  // 3. Modified createPaymentIntent function using direct HTTP
  // Replace your existing function with this
  async function createPaymentIntent(priceId) {
    console.log(`Creating payment intent for price ID: ${priceId}`);
    
    try {
      // Ensure user is authenticated
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.error('No user is logged in');
        throw new Error('You must be logged in to create a payment intent');
      }
      
      console.log(`User authenticated: ${currentUser.uid} (${currentUser.email})`);
      
      // Try first with the standard method
      try {
        console.log('Trying with standard httpsCallable method...');
        const createIntentFunction = firebase.functions().httpsCallable('createPaymentIntent');
        const result = await createIntentFunction({ priceId });
        console.log('Standard method succeeded');
        return result.data;
      } catch (standardError) {
        console.warn('Standard method failed, trying direct HTTP method:', standardError);
        
        // If standard method fails, try direct HTTP
        const result = await callFunctionDirectly('createPaymentIntent', { priceId });
        console.log('Direct HTTP method succeeded');
        return result;
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }
  
  // 4. Modified checkSubscriptionStatus function using direct HTTP
  // Replace your existing function with this
  async function checkSubscriptionStatus() {
    try {
      // Ensure user is authenticated
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.error('No user is logged in');
        throw new Error('You must be logged in to check subscription status');
      }
      
      // Try first with the standard method
      try {
        console.log('Trying check subscription with standard method...');
        const checkFunction = firebase.functions().httpsCallable('checkSubscriptionStatus');
        const result = await checkFunction();
        console.log('Standard check method succeeded');
        return result.data;
      } catch (standardError) {
        console.warn('Standard check method failed, trying direct HTTP:', standardError);
        
        // If standard method fails, try direct HTTP
        const result = await callFunctionDirectly('checkSubscriptionStatus');
        console.log('Direct HTTP check method succeeded');
        return result;
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  }
  
  // Initialize our configuration
  configureFirebaseFunctions();

// Add this script to diagnose Stripe payment authentication issues
// Place before your Stripe payment functions or in a separate file and include it

// ========== 1. AUTHENTICATION DIAGNOSTICS ==========
async function runAuthDiagnostics() {
    console.log('======= AUTHENTICATION DIAGNOSTICS START =======');
    
    // Check if Firebase is initialized
    if (!firebase.apps.length) {
      console.error('❌ Firebase not initialized');
      return false;
    }
    console.log('✅ Firebase initialized');
    
    // Check current user
    const user = firebase.auth().currentUser;
    console.log('Current user:', user ? `User UID: ${user.uid} (${user.email})` : 'No user logged in');
    
    if (!user) {
      console.error('❌ No user is logged in');
      return false;
    }
    
    // Check token 
    try {
      console.log('Refreshing authentication token...');
      const token = await user.getIdToken(true);
      console.log(`✅ Token refreshed successfully (${token.substring(0, 10)}...)`);
      
      // Check Firestore access to verify auth is working
      try {
        const userDoc = await firebase.firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        
        if (userDoc.exists) {
          console.log('✅ Successfully accessed Firestore user document');
          console.log('User data exists:', userDoc.data() ? 'Yes' : 'No');
          
          // Check specific data needed for Stripe
          const userData = userDoc.data();
          console.log('Has stripe_customer_id:', userData.stripe_customer_id ? 'Yes' : 'No');
          console.log('Pro account:', userData.pro_account ? 'Yes' : 'No');
        } else {
          console.error('❌ User document does not exist in Firestore');
        }
      } catch (firestoreError) {
        console.error('❌ Error accessing Firestore:', firestoreError);
      }
      
      return true;
    } catch (tokenError) {
      console.error('❌ Error refreshing token:', tokenError);
      return false;
    }
  }
  
  // ========== 2. FUNCTIONS DIAGNOSTICS ==========
  async function testCloudFunction() {
    console.log('======= CLOUD FUNCTIONS DIAGNOSTICS START =======');
    
    // Ensure user is authenticated
    const user = firebase.auth().currentUser;
    if (!user) {
      console.error('❌ No user is logged in for Functions test');
      return false;
    }
    
    // Test Cloud Functions using both methods
    let standardMethodResult = false;
    let directHttpMethodResult = false;
    
    // 1. Try standard httpsCallable method
    try {
      console.log('Testing standard httpsCallable method...');
      const testFunction = firebase.functions().httpsCallable('checkSubscriptionStatus');
      const result = await testFunction();
      console.log('✅ Standard method succeeded');
      console.log('Response:', result.data);
      standardMethodResult = true;
    } catch (error) {
      console.error('❌ Standard method failed:', error);
      if (error.code === 'functions/unauthenticated') {
        console.error('Authentication problem: Firebase Functions reports user as unauthenticated');
      } else if (error.code === 'functions/unavailable') {
        console.error('Connectivity problem: Functions service is unavailable');
      } else if (error.code === 'functions/internal') {
        console.error('Server error: Internal error in Firebase Functions');
      }
    }
    
    // 2. Try direct HTTP method
    try {
      console.log('Testing direct HTTP method...');
      
      // Get fresh token
      const token = await user.getIdToken(true);
      
      // Build the function URL 
      const projectId = firebase.app().options.projectId;
      const region = 'us-central1'; // Change if your functions are in a different region
      const functionUrl = `https://${region}-${projectId}.cloudfunctions.net/checkSubscriptionStatus`;
      
      console.log(`Calling: ${functionUrl}`);
      
      // Make direct HTTP request
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Direct HTTP method succeeded');
        console.log('Response:', data);
        directHttpMethodResult = true;
      } else {
        const errorText = await response.text();
        console.error(`❌ Direct HTTP method failed: ${response.status} ${errorText}`);
      }
    } catch (httpError) {
      console.error('❌ Direct HTTP request failed:', httpError);
    }
    
    // 3. Check CORS configuration
    try {
      console.log('Testing OPTIONS request for CORS...');
      const projectId = firebase.app().options.projectId;
      const region = 'us-central1';
      const functionUrl = `https://${region}-${projectId}.cloudfunctions.net/checkSubscriptionStatus`;
      
      const corsResponse = await fetch(functionUrl, {
        method: 'OPTIONS'
      });
      
      console.log('CORS Headers:', {
        'access-control-allow-origin': corsResponse.headers.get('access-control-allow-origin'),
        'access-control-allow-methods': corsResponse.headers.get('access-control-allow-methods'),
        'access-control-allow-headers': corsResponse.headers.get('access-control-allow-headers')
      });
      
      if (corsResponse.headers.get('access-control-allow-origin')) {
        console.log('✅ CORS appears to be configured');
      } else {
        console.warn('⚠️ CORS headers missing or restricted');
      }
    } catch (corsError) {
      console.error('❌ CORS check failed:', corsError);
    }
    
    // Overall result
    const overallResult = standardMethodResult || directHttpMethodResult;
    console.log(`Cloud Functions test ${overallResult ? 'PASSED' : 'FAILED'} (Standard: ${standardMethodResult}, Direct: ${directHttpMethodResult})`);
    
    return overallResult;
  }
  
  // ========== 3. STRIPE SETUP DIAGNOSTICS ==========
  async function testStripeSetup() {
    console.log('======= STRIPE SETUP DIAGNOSTICS START =======');
    
    // Check if Stripe is loaded
    if (typeof Stripe === 'undefined') {
      console.error('❌ Stripe.js is not loaded');
      return false;
    }
    console.log('✅ Stripe.js is loaded');
    
    // Check specific to your setup
    if (window.stripe) {
      console.log('✅ Stripe instance is already initialized');
    } else {
      console.warn('⚠️ Stripe instance is not initialized yet');
    }
    
    return true;
  }
  
  // ========== 4. MAIN DIAGNOSTIC FUNCTION ==========
  async function runStripeDiagnostics() {
    console.log('===== STARTING COMPREHENSIVE STRIPE DIAGNOSTICS =====');
    
    const authOk = await runAuthDiagnostics();
    console.log('Authentication check:', authOk ? 'PASSED' : 'FAILED');
    
    const functionsOk = await testCloudFunction();
    console.log('Cloud Functions check:', functionsOk ? 'PASSED' : 'FAILED');
    
    const stripeOk = await testStripeSetup();
    console.log('Stripe setup check:', stripeOk ? 'PASSED' : 'FAILED');
    
    console.log('===== DIAGNOSTICS COMPLETE =====');
    
    return {
      authenticationOk: authOk,
      cloudFunctionsOk: functionsOk,
      stripeSetupOk: stripeOk,
      overallStatus: (authOk && functionsOk && stripeOk) ? 'PASSED' : 'FAILED'
    };
  }
  
  // ========== 5. ENHANCED PAYMENT INTENT FUNCTION ==========
  async function createPaymentIntentEnhanced(priceId) {
    console.log('Creating payment intent for price ID:', priceId);
    
    // 1. Check authentication
    const user = firebase.auth().currentUser;
    if (!user) {
      console.error('No authenticated user found when creating payment intent');
      throw new Error('You must be logged in to create a payment intent');
    }
    
    // 2. Refresh token to ensure it's not expired
    try {
      console.log('Refreshing authentication token...');
      await user.getIdToken(true);
      console.log('Token refreshed successfully');
    } catch (tokenError) {
      console.error('Error refreshing token:', tokenError);
      throw new Error(`Authentication error: ${tokenError.message}`);
    }
    
    // 3. Call cloud function with error handling
    try {
      console.log('Calling createPaymentIntent cloud function...');
      const createIntentFunction = firebase.functions().httpsCallable('createPaymentIntent');
      const result = await createIntentFunction({ priceId });
      
      console.log('Payment intent created successfully');
      return result.data;
    } catch (error) {
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details
      });
      
      // Create a more helpful error message
      let errorMessage = 'Failed to create payment intent';
      
      if (error.code === 'functions/unauthenticated') {
        errorMessage = 'Authentication error: Please try logging out and back in';
      } else if (error.code === 'functions/unavailable') {
        errorMessage = 'Server unavailable: Please try again later';
      } else if (error.code === 'functions/internal') {
        errorMessage = 'Server error: Our team has been notified';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }
  
  // ========== 6. ENHANCED STRIPE SETUP ==========
  async function setupStripePaymentEnhanced(priceId) {
    console.log('Setting up Stripe payment for price ID:', priceId);
    
    try {
      // 1. Run diagnostics if needed
      const diagnosticResult = await runStripeDiagnostics();
      console.log('Diagnostic result:', diagnosticResult);
      
      if (!diagnosticResult.overallStatus === 'PASSED') {
        console.warn('Diagnostics failed but continuing with payment setup');
      }
      
      // 2. Get payment intent with enhanced error handling
      const response = await createPaymentIntentEnhanced(priceId);
      const { clientSecret } = response;
      
      if (!clientSecret) {
        throw new Error('Failed to create payment intent: No client secret returned');
      }
      
      console.log('Successfully retrieved client secret');
      
      // 3. Create Stripe Elements instance
      if (!stripe) {
        console.warn('Stripe not initialized, initializing now...');
        initStripe();
        
        if (!stripe) {
          throw new Error('Failed to initialize Stripe');
        }
      }
      
      // 4. Create and mount Elements
      elements = stripe.elements({
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: document.documentElement.style.getPropertyValue('--color-primary') || '#3498db',
            colorBackground: document.documentElement.style.getPropertyValue('--input-bg-color') || '#ffffff',
            colorText: document.documentElement.style.getPropertyValue('--basic-txt-color') || '#333333',
          }
        }
      });
      
      // Create and mount the Payment Element
      paymentElement = elements.create('payment');
      
      const paymentContainer = document.getElementById('payment-element');
      if (paymentContainer) {
        paymentElement.mount('#payment-element');
        console.log('Payment element mounted successfully');
      } else {
        console.error('Payment element container not found');
        throw new Error('Payment container element not found in the DOM');
      }
      
      // Set up form submission
      paymentForm = document.getElementById('subscription-form');
      if (paymentForm) {
        // Remove any existing listeners to prevent duplicates
        const newForm = paymentForm.cloneNode(true);
        paymentForm.parentNode.replaceChild(newForm, paymentForm);
        paymentForm = newForm;
        
        paymentForm.addEventListener('submit', handlePaymentSubmission);
        console.log('Payment form submission handler attached');
      } else {
        console.error('Payment form not found');
        throw new Error('Payment form element not found in the DOM');
      }
      
      return true;
    } catch (error) {
      console.error('Error setting up Stripe payment:', error);
      showPaymentError(error.message || 'Failed to set up payment. Please try again.');
      return false;
    }
  }
  
  // Use these enhanced functions instead of the original ones
  // setupStripePaymentEnhanced should replace setupStripePayment


// ----- STRIPE INTEGRATION -----
// Configure Stripe with publishable key (this should be your actual publishable key)
const stripePublishableKey = 'pk_live_51Img78K5ZALgdbfFCDxjFQ8p0ZdoaozqL4qKqkJYRir3pGzcrlRBGvdqoq8ERRLVhhK7Y78q3PDpLhsH7pNss30U00RkPCgolE';
let stripe;
let elements;
let paymentElement;
let paymentForm;

// Initialize Stripe (call this after DOM content is loaded)
function initStripe() {
  if (!window.Stripe) {
    console.error('Stripe.js not loaded');
    return;
  }
  
  stripe = Stripe(stripePublishableKey);
}

function ensureAuthReady() {
    return new Promise((resolve) => {
      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
  
  // Then in setupStripePayment
  async function setupStripePayment(priceId) {
    try {
      // Wait for auth to be fully initialized
      const user = await ensureAuthReady();
      if (!user) {
        throw new Error('You must be logged in to make a payment');
      }
      
      // Proceed with payment intent creation
      const response = await createPaymentIntent(priceId);
      const { clientSecret } = response;
    
    if (!clientSecret) {
      throw new Error('Failed to create payment intent');
    }
    
    // Create payment elements
    elements = stripe.elements({
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: document.documentElement.style.getPropertyValue('--color-primary') || '#3498db',
          colorBackground: document.documentElement.style.getPropertyValue('--input-bg-color') || '#ffffff',
          colorText: document.documentElement.style.getPropertyValue('--basic-txt-color') || '#333333',
        }
      }
    });
    
    // Create and mount the Payment Element
    paymentElement = elements.create('payment');
    
    const paymentContainer = document.getElementById('payment-element');
    if (paymentContainer) {
      paymentElement.mount('#payment-element');
    } else {
      console.error('Payment element container not found');
    }
    
    // Set up form submission
    paymentForm = document.getElementById('subscription-form');
    if (paymentForm) {
      paymentForm.addEventListener('submit', handlePaymentSubmission);
    }
    
  } catch (error) {
    console.error('Error setting up Stripe payment:', error);
    showPaymentError(error.message || 'Failed to set up payment. Please try again.');
  }
}

// Replace the createPaymentIntent function in new-Stripe.js with this version
async function createPaymentIntent(priceId) {
    console.log(`Creating payment intent for price ID: ${priceId}`);
    
    try {
      // 1. Ensure user is authenticated
      const currentUser = firebase.auth().currentUser;
      if (!currentUser) {
        console.error('No user is logged in');
        throw new Error('You must be logged in to create a payment intent');
      }
      
      console.log(`User authenticated: ${currentUser.uid} (${currentUser.email})`);
      
      // 2. Force token refresh to ensure it's not expired
      try {
        console.log('Refreshing authentication token...');
        await currentUser.getIdToken(true);
        console.log('Token refreshed successfully');
      } catch (tokenError) {
        console.error('Token refresh failed:', tokenError);
        throw new Error(`Authentication error: ${tokenError.message}`);
      }
      
      // 3. Make sure the user exists in Firestore
      try {
        const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
        
        if (!userDoc.exists) {
          console.error('User document does not exist in Firestore');
          
          // Try to create the user document
          await firebase.firestore().collection('users').doc(currentUser.uid).set({
            email: currentUser.email,
            display_name: currentUser.displayName || currentUser.email,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
          });
          
          console.log('Created new user document in Firestore');
        } else {
          console.log('User document exists in Firestore');
        }
      } catch (firestoreError) {
        console.error('Firestore check failed:', firestoreError);
        // Continue anyway, as this is just a verification step
      }
      
      // 4. Call the Firebase function with error handling
      console.log('Calling createPaymentIntent Firebase function...');
      const createIntentFunction = firebase.functions().httpsCallable('createPaymentIntent');
      
      // 5. Add a timeout to detect hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - Firebase function did not respond')), 20000);
      });
      
      // 6. Call the function with a timeout race
      const result = await Promise.race([
        createIntentFunction({ priceId }),
        timeoutPromise
      ]);
      
      console.log('Payment intent created successfully');
      return result.data;
      
    } catch (error) {
      // 7. Enhanced error handling
      console.error('Error creating payment intent:', error);
      
      // Create a more helpful error message
      let errorMessage = 'Failed to create payment intent';
      
      if (error.code === 'functions/unauthenticated') {
        errorMessage = 'Authentication error: Please try logging out and back in';
      } else if (error.code === 'functions/unavailable') {
        errorMessage = 'Server unavailable: Please try again later';
      } else if (error.code === 'functions/internal') {
        errorMessage = 'Server error: Our team has been notified';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

// Handle payment form submission
async function handlePaymentSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const submitButton = form.querySelector('button[type="submit"]');
  
  // Show processing state
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  }
  
  try {
    hidePaymentError();
    
    // Confirm payment with Stripe
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success.html`,
      },
      redirect: 'if_required'
    });
    
    if (error) {
      throw error;
    }
    
    // If we get here without redirect, payment succeeded
    await handleSuccessfulPayment();
    
  } catch (error) {
    console.error('Payment failed:', error);
    showPaymentError(error.message || 'Payment failed. Please try again.');
    
    // Reset button
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Subscribe';
    }
  }
}

// Handle successful payment
async function handleSuccessfulPayment() {
  try {
    // Update user's subscription status in Firestore
    const user = firebase.auth().currentUser;
    if (!user) throw new Error('User not authenticated');
    
    await firebase.firestore().collection('users').doc(user.uid).update({
      pro_account: true,
      subscription_status: 'active',
      subscription_start_date: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Show success UI
    const subscriptionModal = document.getElementById('subscription-modal');
    if (subscriptionModal) {
      subscriptionModal.innerHTML = `
        <div class="modal-content subscription-success">
          <h2><i class="fas fa-check-circle"></i> Subscription Activated!</h2>
          <p>Thank you for subscribing to the Pro plan. Your account has been upgraded.</p>
          <button class="close-subscription-modal">Continue</button>
        </div>
      `;
      
      document.querySelector('.close-subscription-modal').addEventListener('click', () => {
        const modal = document.getElementById('subscription-modal');
        if (modal) modal.style.display = 'none';
        
        // Refresh page or update UI to reflect pro status
        window.location.reload();
      });
    }
    
  } catch (error) {
    console.error('Error handling successful payment:', error);
    showPaymentError('Payment processed, but account update failed. Please contact support.');
  }
}

// Show payment error
function showPaymentError(message) {
  const errorElement = document.getElementById('payment-error');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

// Hide payment error
function hidePaymentError() {
  const errorElement = document.getElementById('payment-error');
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}

// Replace the showSubscriptionModal method in your code with this improved version

ProjectManager.prototype.showSubscriptionModal = function(heading, subtext, currentUser) {
    // Check if stripe.js is loaded
    if (typeof Stripe === 'undefined') {
      console.error('Stripe.js not loaded! Loading it now...');
      const stripeScript = document.createElement('script');
      stripeScript.src = 'https://js.stripe.com/v3/';
      stripeScript.onload = () => {
        console.log('Stripe.js loaded successfully, retrying modal...');
        this.showSubscriptionModal(heading, subtext, currentUser);
      };
      document.head.appendChild(stripeScript);
      return;
    }
    
    // Ensure user is logged in
    if (!firebase.auth().currentUser) {
      this.showNotification('Please log in to subscribe', 'warning');
      showAuthModal('Log in to Subscribe', 'Create faster with <i>Dlightning⚡</i>');
      return;
    }
    
    const existingModal = document.querySelector('#subscription-modal');
    if (existingModal) {
      existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal subscription-modal';
    modal.id = 'subscription-modal';
    
    const plans = [
      {
        id: 'price_1PnTWAK5ZALgdbfFDXytlpJ6',
        name: 'Pro Monthly',
        price: '$8.00',
        period: 'month',
        features: [
          'Unlimited projects',
          'Firebase image storage',
          'Advanced components',
        ]
      },
      {
        id: 'price_1PnTdKK5ZALgdbfFhyRw7qma',
        name: 'Pro Yearly',
        price: '$72.00',
        period: 'year',
        badge: 'SAVE 36%',
        features: [
          'Unlimited projects',
          'Firebase image storage',
          'Advanced components',
        ]
      }
    ];
    
    // Default to monthly plan
    let selectedPlanId = plans[0].id;
    
    modal.innerHTML = `
      <div class="modal-content subscription-content">
        <button class="close-modal">&times;</button>
        <h2>${heading || 'Upgrade to Pro'}</h2>
        <p class="subscription-subtext">${subtext || 'Unlock the full potential of Dlightning.'}</p>
        
        <div class="subscription-plans">
          ${plans.map((plan, index) => `
            <div class="plan-card ${index === 0 ? 'selected' : ''}" data-plan-id="${plan.id}">
              ${plan.badge ? `<span class="plan-badge">${plan.badge}</span>` : ''}
              <h3>${plan.name}</h3>
              <div class="plan-price">
                <span class="price">${plan.price}</span>
                <span class="period">/${plan.period}</span>
              </div>
              <ul class="plan-features">
                ${plan.features.map(feature => `
                  <li><i class="fas fa-check"></i> ${feature}</li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
        
        <form id="subscription-form" class="payment-form">
          <div id="payment-element"></div>
          <div id="payment-error" class="payment-error"></div>
          <button type="submit" class="payment-button">Subscribe Now</button>
        </form>
        
        <div id="subscription-debug" style="margin-top: 10px; font-size: 12px; color: #666;">
          <button id="run-diagnostics" style="padding: 5px; font-size: 11px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 3px;">Run Diagnostics</button>
          <div id="diagnostic-output" style="display: none; margin-top: 5px; background: #f9f9f9; padding: 10px; border-radius: 4px; max-height: 200px; overflow-y: auto;"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Initialize Stripe if not already initialized
    if (!window.stripe) {
      initStripe();
    }
    
    // Prepare authentication
    ensureAuthenticated().then(isAuthenticated => {
      if (!isAuthenticated) {
        showPaymentError('Authentication failed. Please try logging out and back in.');
        return;
      }
      
      // Add diagnostic button handler
      const diagnosticBtn = modal.querySelector('#run-diagnostics');
      const diagnosticOutput = modal.querySelector('#diagnostic-output');
      
      if (diagnosticBtn) {
        diagnosticBtn.addEventListener('click', async () => {
          diagnosticBtn.disabled = true;
          diagnosticBtn.textContent = 'Running...';
          diagnosticOutput.style.display = 'block';
          diagnosticOutput.innerHTML = 'Running diagnostics...';
          
          try {
            const results = await runStripeDiagnostics();
            diagnosticOutput.innerHTML = `
              <strong>Diagnostics Results:</strong><br>
              - Auth: ${results.authenticationOk ? '✅' : '❌'}<br>
              - Functions: ${results.cloudFunctionsOk ? '✅' : '❌'}<br>
              - Stripe: ${results.stripeSetupOk ? '✅' : '❌'}<br>
              <br>
              <strong>User:</strong> ${firebase.auth().currentUser?.email || 'Not logged in'}<br>
              <strong>UID:</strong> ${firebase.auth().currentUser?.uid || 'N/A'}<br>
              <strong>Overall:</strong> ${results.overallStatus}
            `;
          } catch (error) {
            diagnosticOutput.innerHTML = `Error running diagnostics: ${error.message}`;
          } finally {
            diagnosticBtn.disabled = false;
            diagnosticBtn.textContent = 'Run Diagnostics';
          }
        });
      }
      
      // Add plan selection functionality
      const planCards = modal.querySelectorAll('.plan-card');
      planCards.forEach(card => {
        card.addEventListener('click', async () => {
          // Update selection UI
          planCards.forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          
          // Get the plan ID
          const newPlanId = card.dataset.planId;
          
          // If it's different from the current plan, recreate the payment elements
          if (newPlanId !== selectedPlanId) {
            selectedPlanId = newPlanId;
            
            // Clear existing payment element
            if (paymentElement) {
              paymentElement.destroy();
            }
            
            // Show loading state
            const paymentContainer = document.getElementById('payment-element');
            if (paymentContainer) {
              paymentContainer.innerHTML = '<div class="loading-spinner"></div>';
            }
            
            // Handle subscription errors
            hidePaymentError();
            
            // Setup payment with new plan using the enhanced method
            await setupStripePaymentEnhanced(selectedPlanId);
          }
        });
      });
      
      // Set up payment elements
      setupStripePaymentEnhanced(selectedPlanId);
    });
    
    // Close button functionality
    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  };
  
  // Helper function to ensure user is authenticated
  async function ensureAuthenticated() {
    return new Promise(async (resolve) => {
      // Check if already authenticated
      if (firebase.auth().currentUser) {
        try {
          // Force token refresh
          await firebase.auth().currentUser.getIdToken(true);
          resolve(true);
        } catch (e) {
          console.error('Token refresh failed:', e);
          resolve(false);
        }
        return;
      }
      
      // Wait for auth state to resolve
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        unsubscribe();
        if (user) {
          try {
            // Force token refresh
            await user.getIdToken(true);
            resolve(true);
          } catch (e) {
            console.error('Token refresh failed:', e);
            resolve(false);
          }
        } else {
          resolve(false);
        }
      });
      
      // Set a timeout in case auth takes too long
      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  }

// Add method to check subscription status
ProjectManager.prototype.checkSubscriptionStatus = async function() {
  if (!this.currentUser) return;
  
  try {
    const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
    
    if (userDoc.exists) {
      const userData = userDoc.data();
      const isProAccount = userData.pro_account === true;
      const subscriptionStatus = userData.subscription_status;
      
      // If subscription status is not active but pro_account is true, something's wrong
      if (isProAccount && subscriptionStatus !== 'active') {
        console.warn('Inconsistent subscription state detected');
        
        // Check with Stripe (via Firebase Function)
        const checkSubscriptionFunction = firebase.functions().httpsCallable('checkSubscriptionStatus');
        const result = await checkSubscriptionFunction();
        
        if (result.data.isActive) {
          // Fix the inconsistency
          await this.db.collection('users').doc(this.currentUser.uid).update({
            subscription_status: 'active'
          });
        } else {
          // Subscription inactive according to Stripe
          await this.db.collection('users').doc(this.currentUser.uid).update({
            pro_account: false,
            subscription_status: 'inactive'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error checking subscription status:', error);
  }
};

// Add CSS for the subscription modal
const subscriptionStyles = document.createElement('style');
subscriptionStyles.textContent = `
  .subscription-modal .modal-content {
    max-width: 800px;
    width: 90%;
    padding: 30px;
    border-radius: 10px;
  }
  
  .subscription-subtext {
    text-align: center;
    margin-bottom: 30px;
    color: var(--placeholder-color);
  }
  
  .subscription-plans {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .plan-card {
    flex: 1;
    min-width: 250px;
    padding: 20px;
    border: 2px solid var(--neutral-gray);
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    transition: transform 0.2s, border-color 0.2s;
  }
  
  .plan-card:hover {
    transform: translateY(-5px);
  }
  
  .plan-card.selected {
    border-color: var(--color-primary);
    background-color: rgba(var(--color-primary-rgb), 0.05);
  }
  
  .plan-badge {
    position: absolute;
    top: -10px;
    right: -10px;
    background-color: var(--color-accent);
    color: #000;
    font-size: 12px;
    font-weight: bold;
    padding: 5px 10px;
    border-radius: 20px;
  }
  
  .plan-price {
    margin: 15px 0;
    font-size: 24px;
  }
  
  .price {
    font-weight: bold;
  }
  
  .period {
    font-size: 16px;
    color: var(--placeholder-color);
  }
  
  .plan-features {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .plan-features li {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }
  
  .plan-features i {
    color: var(--color-primary);
    margin-right: 8px;
  }
  
  .payment-form {
    margin-top: 20px;
    padding: 20px;
    border-radius: 8px;
    background-color: rgba(var(--neutral-gray-rgb), 0.2);
  }
  
  #payment-element {
    margin-bottom: 20px;
  }
  
  .payment-error {
    color: #e74c3c;
    margin-bottom: 15px;
    padding: 10px;
    background-color: rgba(231, 76, 60, 0.1);
    border-radius: 4px;
    display: none;
  }
  
  .payment-button {
    background-color: var(--color-primary);
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.2s;
  }
  
  .payment-button:hover {
    filter: brightness(1.1);
  }
  
  .payment-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .subscription-terms {
    margin-top: 20px;
    font-size: 12px;
    text-align: center;
    color: var(--placeholder-color);
  }
  
  .subscription-success {
    text-align: center;
    padding: 40px;
  }
  
  .subscription-success h2 {
    color: var(--color-primary);
    margin-bottom: 20px;
  }
  
  .subscription-success i {
    font-size: 48px;
    margin-bottom: 20px;
    color: #2ecc71;
  }
  
  .close-subscription-modal {
    background-color: var(--color-primary);
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 4px;
    margin-top: 20px;
    cursor: pointer;
  }
  
  @media (max-width: 768px) {
    .subscription-plans {
      flex-direction: column;
    }
    
    .plan-card {
      min-width: 100%;
    }
  }
`;

document.head.appendChild(subscriptionStyles);

// Add utility to convert hex color to RGB
// This is used for rgba values in CSS
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    '52, 152, 219'; // Default blue RGB
}

// Set CSS color variables as RGB for transparency
document.addEventListener('DOMContentLoaded', () => {
  const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary').trim();
  const neutralGray = getComputedStyle(document.documentElement)
    .getPropertyValue('--neutral-gray').trim();
    
  document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(primaryColor));
  document.documentElement.style.setProperty('--neutral-gray-rgb', hexToRgb(neutralGray));
  
  // Add the Stripe.js script
  const stripeScript = document.createElement('script');
  stripeScript.src = 'https://js.stripe.com/v3/';
  stripeScript.onload = initStripe;
  document.head.appendChild(stripeScript);
});

// ----- ACCOUNT MANAGEMENT -----

// Create a modal for account and subscription management
class AccountManager {
    constructor() {
      this.db = firebase.firestore();
      this.auth = firebase.auth();
      this.currentUser = null;
      this.subscriptionData = null;
      this.initAuthListener();
    }
  
    initAuthListener() {
      this.auth.onAuthStateChanged(async (user) => {
        this.currentUser = user;
        if (user) {
          await this.fetchSubscriptionData();
        }
      });
    }
  
    async fetchSubscriptionData() {
      if (!this.currentUser) return null;
      
      try {
        const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
        if (!userDoc.exists) return null;
        
        const userData = userDoc.data();
        this.subscriptionData = {
          isPro: userData.pro_account === true,
          status: userData.subscription_status || 'none',
          startDate: userData.subscription_start_date ? userData.subscription_start_date.toDate() : null,
          endDate: userData.subscription_current_period_end ? 
                   new Date(userData.subscription_current_period_end) : null,
          lastPayment: userData.last_payment_date ? userData.last_payment_date.toDate() : null,
          paymentStatus: userData.last_payment_status || 'none'
        };
        
        return this.subscriptionData;
      } catch (error) {
        console.error('Error fetching subscription data:', error);
        return null;
      }
    }
  
    // Show account modal
    async showAccountModal() {
      // Ensure we have the latest data
      await this.fetchSubscriptionData();
      
      const existingModal = document.querySelector('#account-modal');
      if (existingModal) {
        existingModal.remove();
      }
      
      const modal = document.createElement('div');
      modal.className = 'modal account-modal';
      modal.id = 'account-modal';
      
      if (!this.currentUser) {
        modal.innerHTML = `
          <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2>Account</h2>
            <p>You need to sign in to access your account settings.</p>
            <button id="account-sign-in-btn" class="account-action-btn">Sign In</button>
          </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
          modal.style.display = 'none';
        });
        
        modal.querySelector('#account-sign-in-btn').addEventListener('click', () => {
          modal.style.display = 'none';
          showAuthModal();
        });
        
        return;
      }
      
      // User is signed in, show account details
      const userData = await this.db.collection('users').doc(this.currentUser.uid).get().then(doc => doc.data());
      const isPro = userData.pro_account === true;
      const subscriptionStatus = userData.subscription_status || 'none';
      
      // Format dates
      const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };
      
      const nextBillingDate = this.subscriptionData?.endDate ? formatDate(this.subscriptionData.endDate) : 'N/A';
      const subscriptionStart = this.subscriptionData?.startDate ? formatDate(this.subscriptionData.startDate) : 'N/A';
      
      modal.innerHTML = `
        <div class="modal-content account-content">
          <button class="close-modal">&times;</button>
          <h2>Account Settings</h2>
          
          <div class="account-section user-info-section">
            <div class="user-profile">
              <img src="${this.currentUser.photoURL || 'https://firebasestorage.googleapis.com/v0/b/experience-builder-m-v-wxacv7.appspot.com/o/avatar-placeholder.png?alt=media&token=6e0896e6-0285-46d9-b251-6b8ee8f690f4'}" 
                   alt="Profile" class="profile-image">
              <div>
                <h3>${this.currentUser.displayName || 'User'}</h3>
                <p>${this.currentUser.email}</p>
              </div>
            </div>
            <button id="sign-out-btn" class="account-action-btn secondary">Sign Out</button>
          </div>
          
          <div class="account-section subscription-section">
            <h3>Subscription</h3>
            <div class="subscription-details">
              <div class="subscription-status">
                <span class="status-label">Status:</span>
                <span class="status-value ${isPro ? 'active' : 'inactive'}">
                  ${isPro ? 'Active' : 'Free Tier'}
                </span>
              </div>
              
              ${isPro ? `
                <div class="subscription-info">
                  <div><span>Plan:</span> <span>Pro Plan</span></div>
                  <div><span>Started:</span> <span>${subscriptionStart}</span></div>
                  <div><span>Next billing date:</span> <span>${nextBillingDate}</span></div>
                </div>
                <div class="subscription-actions">
                  <button id="manage-subscription-btn" class="account-action-btn">Manage Subscription</button>
                </div>
              ` : `
                <div class="subscription-upgrade">
                  <p>Upgrade to Pro to unlock all features:</p>
                  <ul>
                    <li><i class="fas fa-check"></i> Unlimited projects</li>
                    <li><i class="fas fa-check"></i> Firebase image storage</li>
                    <li><i class="fas fa-check"></i> Advanced components</li>
                    <li><i class="fas fa-check"></i> Priority support</li>
                  </ul>
                  <button id="upgrade-subscription-btn" class="account-action-btn primary">Upgrade to Pro</button>
                </div>
              `}
            </div>
          </div>
          
          <div class="account-section">
            <h3>Preferences</h3>
            <div class="preferences-options">
              <div class="preference-item">
                <label for="theme-preference">Theme</label>
                <select id="theme-preference" class="preference-select">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      modal.style.display = 'flex';
      
      // Set theme preference
      const themePreference = localStorage.getItem('theme-preference') || 'system';
      const themeSelect = modal.querySelector('#theme-preference');
      if (themeSelect) {
        themeSelect.value = themePreference;
        
        themeSelect.addEventListener('change', () => {
          localStorage.setItem('theme-preference', themeSelect.value);
          applyTheme(themeSelect.value);
        });
      }
      
      // Add event listeners
      modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
      });
      
      modal.querySelector('#sign-out-btn').addEventListener('click', async () => {
        try {
          if (projectManager) {
            await projectManager.handleSignOut();
          }
          await this.auth.signOut();
          modal.style.display = 'none';
        } catch (error) {
          console.error('Error signing out:', error);
        }
      });
      
      // Pro-specific buttons
      if (isPro) {
        modal.querySelector('#manage-subscription-btn').addEventListener('click', () => {
          this.openCustomerPortal();
        });
      } else {
        modal.querySelector('#upgrade-subscription-btn').addEventListener('click', () => {
          modal.style.display = 'none';
          if (projectManager) {
            projectManager.showSubscriptionModal();
          }
        });
      }
      
      // Close on outside click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    }
    
    // Open Stripe customer portal for subscription management
    async openCustomerPortal() {
      try {
        if (!this.currentUser) {
          throw new Error('You must be logged in to manage your subscription');
        }
        
        // Show loading state
        const manageBtn = document.querySelector('#manage-subscription-btn');
        if (manageBtn) {
          manageBtn.disabled = true;
          manageBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }
        
        // Call Firebase function to create portal session
        const createPortalSession = firebase.functions().httpsCallable('createPortalSession');
        const result = await createPortalSession({
          returnUrl: window.location.origin + '/account'
        });
        
        // Redirect to portal
        window.location.href = result.data.url;
        
      } catch (error) {
        console.error('Error opening customer portal:', error);
        
        // Show error
        const manageBtn = document.querySelector('#manage-subscription-btn');
        if (manageBtn) {
          manageBtn.disabled = false;
          manageBtn.textContent = 'Manage Subscription';
        }
        
        alert('Error opening subscription management portal: ' + error.message);
      }
    }
  }
  
  // Apply theme based on preference
  function applyTheme(preference) {
    const isDark = preference === 'dark' || 
                  (preference === 'system' && 
                   window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }
  
  // Initialize theme on page load
  function initTheme() {
    const preference = localStorage.getItem('theme-preference') || 'system';
    applyTheme(preference);
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (localStorage.getItem('theme-preference') === 'system') {
        applyTheme('system');
      }
    });
  }
  
  // Add CSS for account modal
  const accountStyles = document.createElement('style');
  accountStyles.textContent = `
    .account-modal .modal-content {
      max-width: 600px;
      width: 90%;
      padding: 30px;
      border-radius: 10px;
    }
    
    .account-section {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--neutral-gray);
    }
    
    .account-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }
    
    .user-info-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .user-profile {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .profile-image {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .user-profile h3 {
      margin: 0 0 5px 0;
    }
    
    .user-profile p {
      margin: 0;
      color: var(--placeholder-color);
    }
    
    .account-action-btn {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      border: none;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .account-action-btn.primary {
      background-color: var(--color-primary);
      color: white;
    }
    
    .account-action-btn.secondary {
      background-color: var(--neutral-gray);
      color: var(--basic-txt-color);
    }
    
    .account-action-btn:hover {
      filter: brightness(1.1);
    }
    
    .subscription-details {
      margin-top: 15px;
    }
    
    .subscription-status {
      margin-bottom: 15px;
    }
    
    .status-label {
      font-weight: bold;
      margin-right: 10px;
    }
    
    .status-value {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: bold;
    }
    
    .status-value.active {
      background-color: #e3fcef;
      color: #2ecc71;
    }
    
    .status-value.inactive {
      background-color: #f8f9fa;
      color: #6c757d;
    }
    
    .subscription-info {
      margin: 20px 0;
    }
    
    .subscription-info div {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .subscription-info div span:first-child {
      font-weight: 500;
      color: var(--placeholder-color);
    }
    
    .subscription-upgrade ul {
      list-style: none;
      padding: 0;
      margin: 15px 0;
    }
    
    .subscription-upgrade li {
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }
    
    .subscription-upgrade li i {
      color: var(--color-primary);
      margin-right: 10px;
    }
    
    .preferences-options {
      margin-top: 15px;
    }
    
    .preference-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    
    .preference-select {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid var(--neutral-gray);
      background-color: var(--input-bg-color);
      color: var(--basic-txt-color);
      min-width: 150px;
    }
    
    /* Dark theme support */
    
    
    
    .dark-theme .status-value.active {
      background-color: rgba(46, 204, 113, 0.2);
    }
    
    .dark-theme .status-value.inactive {
      background-color: rgba(108, 117, 125, 0.2);
    }
  `;
  
  document.head.appendChild(accountStyles);
  
  // Initialize account manager and theme
  document.addEventListener('DOMContentLoaded', () => {
    window.accountManager = new AccountManager();
    initTheme();
    
    // Add account button to UI
    const userProfileSection = document.querySelector('.user-profile-section');
    if (userProfileSection) {
      const accountBtn = document.createElement('button');
      accountBtn.className = 'account-btn';
      accountBtn.innerHTML = '<i class="fas fa-user-cog"></i>';
      accountBtn.title = 'Account Settings';
      accountBtn.style.cssText = `
        background: none;
        border: none;
        color: var(--basic-txt-color);
        font-size: 18px;
        cursor: pointer;
        margin-right: 10px;
      `;
      
      accountBtn.addEventListener('click', () => {
        window.accountManager.showAccountModal();
      });
      
      // Insert before the logout button
      const logoutBtn = userProfileSection.querySelector('.logout-btn');
      if (logoutBtn) {
        userProfileSection.insertBefore(accountBtn, logoutBtn);
      } else {
        userProfileSection.appendChild(accountBtn);
      }
    }
  });