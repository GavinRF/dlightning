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
  
  // Initialize our configuration
  configureFirebaseFunctions();
  
  
  // Optional function to handle successful payment without redirect
  async function handleSuccessfulPayment() {
    try {
      // Show success message
      const formContainer = document.getElementById('subscription-form');
      if (formContainer) {
        formContainer.innerHTML = `
          <div class="subscription-success">
            <i class="fas fa-check-circle"></i>
            <h2>Payment Successful!</h2>
            <p>Thank you for your subscription. Your account has been upgraded.</p>
            <button class="close-subscription-modal" onclick="document.querySelector('.subscription-modal').style.display='none'">
              Close
            </button>
          </div>
        `;
      }
      
      // Update user's subscription status in Firestore
      if (firebase.auth().currentUser) {
        const userId = firebase.auth().currentUser.uid;
        await firebase.firestore().collection('users').doc(userId).update({
          pro_account: true,
          subscription_status: 'active',
          subscription_updated: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('User subscription status updated successfully');
      }
      
      // Show notification
      if (window.projectManager && typeof window.projectManager.showNotification === 'function') {
        window.projectManager.showNotification('Subscription activated successfully!', 'success');
      }
      
    } catch (error) {
      console.error('Error handling successful payment:', error);
      if (window.projectManager && typeof window.projectManager.showNotification === 'function') {
        window.projectManager.showNotification('Payment processed, but there was an issue updating your account. Please contact support.', 'warning');
      }
    }
  }


// ----- STRIPE INTEGRATION -----
// Configure Stripe with publishable key (this should be your actual publishable key)
const stripePublishableKey = 'pk_live_51Img78K5ZALgdbfFCDxjFQ8p0ZdoaozqL4qKqkJYRir3pGzcrlRBGvdqoq8ERRLVhhK7Y78q3PDpLhsH7pNss30U00RkPCgolE';
let stripe;
let elements;
let paymentElement;
let paymentForm;

// Initialize Stripe
function initStripe() {
    if (window.stripe) {
      return window.stripe; // Return existing instance if available
    }
    
    try {
      const stripePublishableKey = 'pk_live_51Img78K5ZALgdbfFCDxjFQ8p0ZdoaozqL4qKqkJYRir3pGzcrlRBGvdqoq8ERRLVhhK7Y78q3PDpLhsH7pNss30U00RkPCgolE';
      window.stripe = Stripe(stripePublishableKey);
      console.log('Stripe initialized');
      return window.stripe;
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      return null;
    }
  }

  // Simple function to ensure Stripe is globally available
  function ensureStripe() {
    // First check if window.stripe is already set
    if (window.stripe) {
      return window.stripe;
    }
    // If not, try to initialize
    initStripe();
    // Return the result (could still be null/undefined if initialization failed)
    return window.stripe;
  }

// Direct HTTP method to call Firebase Functions
async function callFirebaseFunction(functionName, data = {}) {
  // Get current user
  const user = firebase.auth().currentUser;
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  // Get fresh token
  const token = await user.getIdToken(true);
  
  // Create URL
  const projectId = firebase.app().options.projectId;
  const region = 'us-central1';
  const functionUrl = `https://${region}-${projectId}.cloudfunctions.net/${functionName}`;
  
  console.log(`Calling function: ${functionUrl}`);
  
  // Make request
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  // Handle error responses
  if (!response.ok) {
    let errorMessage = 'Function call failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (e) {
      // If can't parse JSON
      errorMessage = `HTTP error ${response.status}`;
    }
    throw new Error(errorMessage);
  }
  
  // Return response data
  return response.json();
}

// Create customer portal session
async function createCustomerPortal(returnUrl) {
  try {
    const result = await callFirebaseFunction('createPortalSession', { returnUrl });
    return result;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
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

// Initialize Stripe when the document is ready
document.addEventListener('DOMContentLoaded', initStripe);

////// // / /// / SEND TO STRIPE /// /// /// /// // / / / / // / / // / / //// 
// Handle subscription
ProjectManager.prototype.handleSubscriptionPurchase = async function(button) {
    const modal = button.closest('.modal');
    const selectedCard = modal.querySelector('.subscription-card.selected');
    
    if (!selectedCard) {
        this.showNotification('Please select a subscription plan', 'warning');
        return;
    }

    try {
        // Show loading state
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        const plan = selectedCard.dataset.plan; // 'monthly' or 'yearly'
        
        // Get the current user from Firebase authentication
        const currentUser = firebase.auth().currentUser;

        if (!currentUser) {
            throw new Error('User not authenticated');
        }
        
        // Force token refresh before proceeding
        try {
            await currentUser.getIdToken(true);
            console.log('Auth token refreshed successfully');
        } catch (tokenError) {
            console.error('Token refresh failed:', tokenError);
            throw new Error(`Authentication error: ${tokenError.message}`);
        }
        
        const baseUrl = window.location.origin + window.location.pathname;
        const successUrl = `${baseUrl}?subscription=success`;
        const cancelUrl = `${baseUrl}?subscription=cancel`;

        // Call Firebase Function to create a checkout session
        try {
            // Get fresh token
            const token = await currentUser.getIdToken();
            const projectId = firebase.app().options.projectId;
            const functionUrl = `https://us-central1-${projectId}.cloudfunctions.net/createCheckoutSession`;
            
            console.log(`Calling checkout session API: ${functionUrl}`);
            
            // Determine price ID based on plan
            const priceId = plan === 'yearly' 
                ? 'price_1PnTdKK5ZALgdbfFhyRw7qma'  // Yearly price ID
                : 'price_1PnTWAK5ZALgdbfFDXytlpJ6'; // Monthly price ID
            
            // Make direct HTTP request
            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    priceId: priceId,
                    successUrl: successUrl,
                    cancelUrl: cancelUrl
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Checkout session creation failed: ${response.status} ${errorText}`);
                throw new Error(`Error creating checkout session: ${errorText}`);
            }
            
            const result = await response.json();
            
            if (!result.url) {
                throw new Error('No checkout URL returned from server');
            }
            
            // Redirect to Stripe Checkout
            console.log('Redirecting to Stripe Checkout:', result.url);
            window.location.href = result.url;
            
        } catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }

    } catch (error) {
        console.error('Subscription error:', error);
        
        let errorMessage = error.message || 'Please try again';
        
        // Handle common errors with more user-friendly messages
        if (errorMessage.includes('CORS') || errorMessage.includes('Network Error')) {
            errorMessage = 'Connection issue. Please try again later.';
        } else if (errorMessage.includes('internal') || errorMessage.includes('Server error')) {
            errorMessage = 'Server issue. Please try again later.';
        } else if (errorMessage.includes('timeout')) {
            errorMessage = 'Connection timeout. Please check your internet and try again.';
        }
        
        this.showNotification('❌ ' + errorMessage, 'error');
        
        // Reset button state
        button.disabled = false;
        button.textContent = 'Subscribe Now';
    }
}

// Function to check subscription status from URL parameters (call this on page load)
ProjectManager.prototype.checkSubscriptionStatus = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const subscriptionStatus = urlParams.get("subscription");

    if (subscriptionStatus === "success") {
        this.showNotification("✅ Subscription successful!", "success");
        // Remove query parameters from URL (so the toast only shows once)
        window.history.replaceState(null, "", window.location.pathname);
        
        // Update user UI to reflect pro status
        setTimeout(() => {
            this.refreshUserStatus();
        }, 2000);
    } else if (subscriptionStatus === "cancel") {
        this.showNotification("❌ Subscription process canceled.", "error");
        // Remove query parameters from URL (so the toast only shows once)
        window.history.replaceState(null, "", window.location.pathname);
    }
}

// Function to refresh the user's subscription status
ProjectManager.prototype.refreshUserStatus = async function() {
    try {
        if (!firebase.auth().currentUser) return;
        
        const userDoc = await firebase.firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .get();
            
        if (userDoc.exists && userDoc.data().pro_account) {
            this.showNotification("✨ Pro features activated!", "success");
            // Update UI elements here to reflect pro status
        }
    } catch (error) {
        console.error('Error refreshing user status:', error);
    }
}

ProjectManager.prototype.showSubscriptionModal = function(heading, subtext, currentUser) {
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
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${heading || 'Upgrade to Pro'}</h2>
            <p>${subtext || 'Unlock the full potential of Dlightning.'}</p>

            <div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">
                <ul class="features-list">
                    <lable><b>Subscription Features Include</b></lable>
                    <li>Unlimited projects and screens</li>
                    <li>Early Access to new components</li>
                    <li>Image saving abilities</li>
                </ul>
            </div>

            <div class="subscription-cards">
                <div class="subscription-card" data-plan="monthly" onclick="projectManager.selectPlan(this)">
                    <h3>1 Month Subscription</h3>
                    <div class="price">$8.00</div>
                    <div class="price-subtext">¢27/day</div>
                </div>
                
                <div class="subscription-card" data-plan="yearly" onclick="projectManager.selectPlan(this)">
                    <h3>1 Year Subscription</h3>
                    <div class="price">$72.00</div>
                    <div class="price-subtext">$6.00/month</div>
                </div>
            </div>
            <div class="modal-buttons">
                <button onclick="projectManager.handleSubscriptionPurchase(this)">Subscribe Now &emsp;<i class="fas fa-arrow-up-right-from-square"></i></button>
                <button onclick="this.closest('.modal').remove()">Cancel</button>
            </div>
            <img src="img/stripe-logo.svg" style="width: 86px; margin: 0 -24px -34px 0; float: right;">
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'flex';
    
    // Add close button functionality
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
}

// Helper method to handle plan selection
ProjectManager.prototype.selectPlan = function(card) {
    // Remove selected class from all cards
    card.parentElement.querySelectorAll('.subscription-card').forEach(c => 
        c.classList.remove('selected')
    );
    // Add selected class to clicked card
    card.classList.add('selected');
}
  
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

document.head.appendChild(subscriptionStyles);


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