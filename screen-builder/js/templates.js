 /// templates ///

  // ── TEMPLATE PICKER ─────────────────────────────────────────────────────────
  // ── CATALOG ─────────────────────────────────────────────────────────────────
  // Categories group the picker (a chip row filters to one; "All" shows every
  // category as its own section). App packs come first, then single screens.
  const TEMPLATE_CATEGORIES = [
    { id: 'essentials',   label: 'Essentials' },
    { id: 'social',       label: 'Social' },
    { id: 'shopping',     label: 'Shopping' },
    { id: 'food',         label: 'Food & Drink' },
    { id: 'finance',      label: 'Finance' },
    { id: 'health',       label: 'Health & Fitness' },
    { id: 'travel',       label: 'Travel' },
    { id: 'media',        label: 'Media' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'education',    label: 'Education' },
    { id: 'ai',           label: 'AI' },
    { id: 'business',     label: 'Business' },
  ];

  // One card per template, in this order within its category. The key is the TEMPLATES
  // entry it builds (keys are stable ids — onboarding refers to template1/template2).
  // Search matches title, blurb, tags (extra words people might search for) and the
  // category name.
  const TEMPLATE_CARDS = [
    // Essentials
    { key: 'login',          cat: 'essentials', title: 'Login',           blurb: 'Sign in, social sign-in, and sign up', tags: 'sign in sign up register auth password account' },
    { key: 'onboarding',     cat: 'essentials', title: 'Onboarding',      blurb: 'Welcome screen with page dots', tags: 'welcome intro walkthrough splash get started' },
    { key: 'verifyCode',     cat: 'essentials', title: 'Verify Code',     blurb: 'One-time code entry and resend', tags: 'otp 2fa two factor sms verification code auth' },
    { key: 'forgotPassword', cat: 'essentials', title: 'Forgot Password', blurb: 'Reset link request', tags: 'reset password recover account auth' },
    { key: 'permissions',    cat: 'essentials', title: 'Permissions',     blurb: 'Ask for notifications and location', tags: 'allow access location notifications camera privacy onboarding' },
    { key: 'settings',       cat: 'essentials', title: 'Settings',        blurb: 'Toggles, account links, and log out', tags: 'preferences account toggles profile options' },
    { key: 'editProfile',    cat: 'essentials', title: 'Edit Profile',    blurb: 'Photo, name, bio, and save', tags: 'account profile form user details' },
    { key: 'notifications',  cat: 'essentials', title: 'Notifications',   blurb: 'Reminder card and activity list', tags: 'alerts activity inbox reminders' },
    { key: 'search',         cat: 'essentials', title: 'Search',          blurb: 'Recent searches, trending, and results', tags: 'find lookup query results filter' },
    { key: 'emptyState',     cat: 'essentials', title: 'Empty State',     blurb: 'Nothing-here-yet message with an action', tags: 'empty blank zero state no results placeholder' },
    { key: 'success',        cat: 'essentials', title: 'Success',         blurb: 'Confirmation with next steps', tags: 'done complete confirmation thank you check' },
    { key: 'help',           cat: 'essentials', title: 'Help Center',     blurb: 'Search, topics, and FAQ', tags: 'support faq help questions contact' },
    { key: 'template3',      cat: 'essentials', title: 'Contact Form',    blurb: 'Inputs, dropdown, message box, and actions', tags: 'support feedback form email inquiry' },
    // Social
    { key: 'social',         cat: 'social', title: 'Social Feed',  blurb: 'Feed filters, posts, and a center-action nav', tags: 'feed posts timeline community friends' },
    { key: 'explore',        cat: 'social', title: 'Explore',      blurb: 'Search, topics, and a photo grid', tags: 'discover trending grid search photos' },
    { key: 'postDetail',     cat: 'social', title: 'Post',         blurb: 'Post with comments and a reply box', tags: 'comments thread detail replies' },
    { key: 'createPost',     cat: 'social', title: 'New Post',     blurb: 'Composer with photos and audience', tags: 'compose create write upload share' },
    { key: 'chatInbox',      cat: 'social', title: 'Chats',        blurb: 'Conversation list with stories', tags: 'inbox messages dm conversations' },
    { key: 'messaging',      cat: 'social', title: 'Messaging',    blurb: 'Chat with photos, reactions, and voice notes', tags: 'chat dm conversation inbox text' },
    { key: 'template1',      cat: 'social', title: 'Profile',      blurb: 'Cover photo, bio, follow buttons, and a photo grid', tags: 'user account bio avatar social portfolio' },
    // Shopping
    { key: 'ecommerce',      cat: 'shopping', title: 'Shop',           blurb: 'Promo, categories, and product cards', tags: 'store ecommerce products retail catalog' },
    { key: 'productDetail',  cat: 'shopping', title: 'Product',        blurb: 'Gallery, sizes, reviews, and add to bag', tags: 'item detail pdp sizes reviews ecommerce' },
    { key: 'cart',           cat: 'shopping', title: 'Bag',            blurb: 'Items, promo code, and totals', tags: 'cart basket ecommerce order' },
    { key: 'checkout',       cat: 'shopping', title: 'Checkout',       blurb: 'Steps, order summary, delivery, and payment', tags: 'cart bag payment order purchase ecommerce shipping' },
    { key: 'orderPlaced',    cat: 'shopping', title: 'Order Placed',   blurb: 'Thank-you screen with delivery date', tags: 'confirmation receipt success purchase' },
    { key: 'orderTracking',  cat: 'shopping', title: 'Order Tracking', blurb: 'Shipping progress and timeline', tags: 'track shipping delivery status package' },
    { key: 'writeReview',    cat: 'shopping', title: 'Write a Review', blurb: 'Star rating, fit, and written review', tags: 'review rating stars feedback product' },
    // Food & Drink
    { key: 'foodHome',         cat: 'food', title: 'Food Delivery',  blurb: 'Cuisines, offers, and nearby restaurants', tags: 'delivery takeout restaurants order doordash ubereats' },
    { key: 'restaurant',       cat: 'food', title: 'Restaurant',     blurb: 'Menu, dishes, reviews, and reservations', tags: 'food menu dining delivery cafe' },
    { key: 'foodCart',         cat: 'food', title: 'Food Order',     blurb: 'Your order, tip, and place order', tags: 'cart basket checkout delivery tip' },
    { key: 'deliveryTracking', cat: 'food', title: 'Live Delivery',  blurb: 'Courier on the map and order status', tags: 'tracking courier driver eta map order status' },
    { key: 'rateOrder',        cat: 'food', title: 'Rate Your Order', blurb: 'Rate the food and the courier', tags: 'rating stars review feedback delivery' },
    { key: 'booking',          cat: 'food', title: 'Booking',        blurb: 'Date, time slots, party size, and confirm', tags: 'reservation appointment schedule table date time' },
    { key: 'recipe',           cat: 'food', title: 'Recipe',         blurb: 'Ingredients, steps, and servings', tags: 'cooking ingredients instructions meal kitchen' },
    // Finance
    { key: 'wallet',      cat: 'finance', title: 'Wallet',      blurb: 'Balance, quick actions, spending, and transactions', tags: 'bank banking finance money payments fintech budget balance' },
    { key: 'sendMoney',   cat: 'finance', title: 'Send Money',  blurb: 'Recipient, amount, and note', tags: 'transfer pay payment send request p2p venmo' },
    { key: 'transferDone', cat: 'finance', title: 'Money Sent', blurb: 'Transfer confirmation and receipt', tags: 'payment sent success receipt confirmation' },
    { key: 'cards',       cat: 'finance', title: 'Cards',       blurb: 'Card controls and limits', tags: 'credit debit card freeze limit bank' },
    { key: 'budget',      cat: 'finance', title: 'Budget',      blurb: 'Spending by category against limits', tags: 'spending budget categories money planning' },
    { key: 'stockDetail', cat: 'finance', title: 'Investments', blurb: 'Portfolio, chart, and holdings', tags: 'stocks crypto invest portfolio trading chart' },
    // Health & Fitness
    { key: 'fitnessHome', cat: 'health', title: 'Fitness',    blurb: 'Daily stats, goals, and workouts', tags: 'health workout steps activity gym exercise' },
    { key: 'workout',     cat: 'health', title: 'Workout',    blurb: 'Exercise list and start button', tags: 'exercise training gym routine sets reps' },
    { key: 'workoutDone', cat: 'health', title: 'Workout Done', blurb: 'Summary stats and streak', tags: 'complete summary calories results' },
    { key: 'nutrition',   cat: 'health', title: 'Nutrition',  blurb: 'Calories, macros, and meals', tags: 'food diet calories macros meal log' },
    { key: 'habits',      cat: 'health', title: 'Habits',     blurb: 'Daily check-ins and streaks', tags: 'habit tracker routine streak goals wellness' },
    { key: 'meditation',  cat: 'health', title: 'Meditation', blurb: 'Session player and sounds', tags: 'mindfulness calm sleep breathe relax wellness' },
    // Travel
    { key: 'travelHome',    cat: 'travel', title: 'Travel',      blurb: 'Destination search and featured stays', tags: 'trip vacation hotel airbnb booking explore' },
    { key: 'hotelDetail',   cat: 'travel', title: 'Stay',        blurb: 'Photos, amenities, reviews, and reserve', tags: 'hotel listing airbnb room rental property' },
    { key: 'tripItinerary', cat: 'travel', title: 'Itinerary',   blurb: 'Day-by-day trip plan', tags: 'trip plan schedule timeline travel days' },
    { key: 'boardingPass',  cat: 'travel', title: 'Boarding Pass', blurb: 'Flight details and gate info', tags: 'flight ticket airline airport gate' },
    { key: 'mapLocation',   cat: 'travel', title: 'Map',         blurb: 'Map, filters, and nearby places', tags: 'location places nearby directions navigation travel' },
    { key: 'rideRequest',   cat: 'travel', title: 'Ride',        blurb: 'Route, ride options, and request', tags: 'uber lyft taxi rideshare car driver transport' },
    { key: 'rideTracking',  cat: 'travel', title: 'Driver On the Way', blurb: 'Driver, car, and arrival time', tags: 'uber lyft taxi driver eta tracking' },
    { key: 'rateRide',      cat: 'travel', title: 'Rate Your Ride', blurb: 'Trip summary, rating, and tip', tags: 'uber lyft rating stars tip feedback' },
    // Media
    { key: 'streamingHome', cat: 'media', title: 'Streaming',   blurb: 'Featured show and rows of titles', tags: 'netflix tv movies shows watch video' },
    { key: 'showDetail',    cat: 'media', title: 'Show',        blurb: 'Show info, seasons, and episodes', tags: 'movie series episodes detail tv' },
    { key: 'mediaGallery',  cat: 'media', title: 'Video',       blurb: 'Video player and an up-next queue', tags: 'video streaming player watch youtube media' },
    { key: 'musicLibrary',  cat: 'media', title: 'Music Library', blurb: 'Playlists, albums, and recents', tags: 'music spotify playlists albums songs library' },
    { key: 'nowPlaying',    cat: 'media', title: 'Now Playing', blurb: 'Music player, volume, and queue', tags: 'music audio player songs podcast spotify media' },
    { key: 'podcast',       cat: 'media', title: 'Podcast',     blurb: 'Show page and episode list', tags: 'podcast episodes audio listen show' },
    { key: 'newsHome',      cat: 'media', title: 'News',        blurb: 'Top story and headlines by section', tags: 'news headlines articles magazine reading' },
    { key: 'blog',          cat: 'media', title: 'Article',     blurb: 'Article with author, quotes, and newsletter', tags: 'blog article post news reading story' },
    // Productivity
    { key: 'dashboard',     cat: 'productivity', title: 'Dashboard', blurb: 'Stats, charts, and recent activity', tags: 'analytics stats charts kpi metrics admin reports' },
    { key: 'tasks',         cat: 'productivity', title: 'Tasks',     blurb: 'Today\'s to-dos and progress', tags: 'todo to-do checklist reminders list' },
    { key: 'taskDetail',    cat: 'productivity', title: 'Task',      blurb: 'Details, subtasks, and comments', tags: 'todo task detail subtasks assignee' },
    { key: 'projects',      cat: 'productivity', title: 'Projects',  blurb: 'Projects with progress and team', tags: 'project management team board kanban' },
    { key: 'notes',         cat: 'productivity', title: 'Notes',     blurb: 'Pinned and recent notes', tags: 'notes notebook memo writing' },
    { key: 'noteEditor',    cat: 'productivity', title: 'Note',      blurb: 'Rich text note editor', tags: 'editor write document text notes' },
    { key: 'calendar',      cat: 'productivity', title: 'Calendar',  blurb: 'Month view and a day agenda', tags: 'schedule events agenda planner dates' },
    // Education
    { key: 'education',     cat: 'education', title: 'Course',       blurb: 'Course progress, modules, and next lesson', tags: 'learning course lesson school study progress' },
    { key: 'courseCatalog', cat: 'education', title: 'Courses',      blurb: 'Browse courses by topic', tags: 'catalog browse learn classes udemy' },
    { key: 'lesson',        cat: 'education', title: 'Lesson',       blurb: 'Video lesson with notes', tags: 'lecture video class study' },
    { key: 'quiz',          cat: 'education', title: 'Quiz',         blurb: 'Question with answer options', tags: 'test question exam practice answers' },
    { key: 'quizResult',    cat: 'education', title: 'Quiz Results', blurb: 'Score, XP, and review', tags: 'score results grade complete xp' },
    // AI
    { key: 'aiHome',     cat: 'ai', title: 'AI Home',      blurb: 'Assistant welcome with starter prompts', tags: 'ai chatbot assistant gpt prompts llm' },
    { key: 'aiChat',     cat: 'ai', title: 'AI Assistant', blurb: 'Assistant chat with reasoning, replies, and follow-ups', tags: 'ai chatbot assistant gpt conversation llm' },
    { key: 'aiHistory',  cat: 'ai', title: 'AI History',   blurb: 'Saved chats grouped by day', tags: 'ai chats history conversations saved' },
    { key: 'imageGen',   cat: 'ai', title: 'Image Generator', blurb: 'Styles, results grid, and prompt box', tags: 'ai image generation art midjourney dalle create' },
    // Business
    { key: 'template2',      cat: 'business', title: 'Landing Page', blurb: 'Hero, testimonial, FAQ, and footer', tags: 'website marketing home homepage saas startup' },
    { key: 'pricing',        cat: 'business', title: 'Pricing',      blurb: 'Billing toggle, plan comparison, and FAQ', tags: 'plans subscription upgrade paywall billing pro' },
    { key: 'waitlist',       cat: 'business', title: 'Waitlist',     blurb: 'Coming-soon signup', tags: 'launch coming soon beta signup early access' },
    { key: 'propertyList',   cat: 'business', title: 'Listings',     blurb: 'Search, filters, and homes for sale', tags: 'real estate homes property rent zillow listings' },
    { key: 'propertyDetail', cat: 'business', title: 'Listing',      blurb: 'Photos, facts, agent, and tour', tags: 'real estate home property house detail' },
  ];

  // App packs: several screens built in one go, already connected for Connect mode /
  // the prototype player (Pro only). `screens` are TEMPLATES keys, built in order; an
  // entry's `go` links (see TEMPLATE DEFINITIONS) resolve to the pack's other screens.
  // The first screen becomes the prototype's start screen if the project has none.
  const TEMPLATE_PACKS = [
    { key: 'pack:auth',      cat: 'essentials', title: 'Sign-up Flow',     blurb: 'Welcome, sign in, verify, and permissions', tags: 'auth onboarding login register',
      screens: ['onboarding', 'login', 'verifyCode', 'permissions', 'success', 'forgotPassword'] },
    { key: 'pack:social',    cat: 'social', title: 'Social App',          blurb: 'Feed, explore, posting, chats, and profile', tags: 'instagram twitter community',
      screens: ['social', 'postDetail', 'explore', 'createPost', 'chatInbox', 'messaging', 'template1'] },
    { key: 'pack:shop',      cat: 'shopping', title: 'Shopping App',      blurb: 'Browse, product, bag, checkout, tracking, and review', tags: 'ecommerce store retail',
      screens: ['ecommerce', 'productDetail', 'cart', 'checkout', 'orderPlaced', 'orderTracking', 'writeReview'] },
    { key: 'pack:food',      cat: 'food', title: 'Food Delivery App',     blurb: 'Restaurants, menu, order, live tracking, and rating', tags: 'delivery takeout doordash ubereats',
      screens: ['foodHome', 'restaurant', 'foodCart', 'deliveryTracking', 'rateOrder', 'booking'] },
    { key: 'pack:finance',   cat: 'finance', title: 'Banking App',        blurb: 'Wallet, send money, cards, budget, and investing', tags: 'fintech bank money',
      screens: ['wallet', 'sendMoney', 'transferDone', 'cards', 'budget', 'stockDetail'] },
    { key: 'pack:fitness',   cat: 'health', title: 'Fitness App',         blurb: 'Today, workouts, nutrition, and habits', tags: 'health gym wellness',
      screens: ['fitnessHome', 'workout', 'workoutDone', 'nutrition', 'habits', 'meditation'] },
    { key: 'pack:travel',    cat: 'travel', title: 'Travel App',          blurb: 'Search stays, book, plan the trip, and fly', tags: 'airbnb hotel vacation trip',
      screens: ['travelHome', 'hotelDetail', 'tripItinerary', 'boardingPass', 'mapLocation'] },
    { key: 'pack:ride',      cat: 'travel', title: 'Ride App',            blurb: 'Pick a ride, follow your driver, and rate the trip', tags: 'uber lyft taxi rideshare',
      screens: ['rideRequest', 'rideTracking', 'rateRide'] },
    { key: 'pack:streaming', cat: 'media', title: 'Streaming App',        blurb: 'Browse, show page, and watch', tags: 'netflix tv movies video',
      screens: ['streamingHome', 'showDetail', 'mediaGallery'] },
    { key: 'pack:music',     cat: 'media', title: 'Music App',            blurb: 'Library, now playing, and podcasts', tags: 'spotify audio podcasts',
      screens: ['musicLibrary', 'nowPlaying', 'podcast'] },
    { key: 'pack:tasks',     cat: 'productivity', title: 'Productivity App', blurb: 'Tasks, projects, calendar, and notes', tags: 'todo planner workspace',
      screens: ['tasks', 'taskDetail', 'projects', 'calendar', 'notes', 'noteEditor'] },
    { key: 'pack:learning',  cat: 'education', title: 'Learning App',     blurb: 'Courses, lessons, quizzes, and results', tags: 'course school study duolingo',
      screens: ['courseCatalog', 'education', 'lesson', 'quiz', 'quizResult'] },
    { key: 'pack:ai',        cat: 'ai', title: 'AI Assistant App',         blurb: 'Home, chat, history, and image studio', tags: 'chatgpt chatbot llm',
      screens: ['aiHome', 'aiChat', 'aiHistory', 'imageGen'] },
    { key: 'pack:saas',      cat: 'business', title: 'SaaS Website',       blurb: 'Landing, pricing, sign in, and dashboard', tags: 'startup marketing website',
      screens: ['template2', 'pricing', 'login', 'dashboard'] },
    { key: 'pack:realestate', cat: 'business', title: 'Real Estate App',   blurb: 'Listings, home details, and tour booked', tags: 'homes property zillow',
      screens: ['propertyList', 'propertyDetail', 'success'] },
  ];
  const PACKS_BY_KEY = Object.fromEntries(TEMPLATE_PACKS.map(p => [p.key, p]));
  const categoryLabel = id => TEMPLATE_CATEGORIES.find(c => c.id === id)?.label || '';

  const cardHtml = ({ key, cat, title, blurb, tags = '', screens }) => {
    const search = `${title} ${blurb} ${tags} ${cat} ${categoryLabel(cat)}${screens ? ' app packs flow' : ''}`.toLowerCase();
    const badge = screens
      ? `<span class="template-pack-meta"><span class="template-pro-badge">PRO</span>${screens.length} screens</span>`
      : '';
    return /*HTML*/`
          <div class="template-card${screens ? ' template-pack' : ''}" data-template="${key}" data-cat="${cat}" data-search="${search}">
            <h3>${title}</h3>${badge}
            <p>${blurb}</p>
            <div class="template-preview"><div class="tp-scale"></div></div>
          </div>`;
  };

  function createTemplateModal() {
    const modal = document.createElement('div');
    modal.id = 'template-modal';
    modal.className = 'modal';

    const section = (id, label, cards) => cards.length ? /*HTML*/`
        <section class="template-section" data-section="${id}">
          <h4 class="template-section-title">${label}</h4>
          <div class="templates-container">${cards.map(cardHtml).join('')}
          </div>
        </section>` : '';
    const chips = [{ id: 'all', label: 'All' }, { id: 'packs', label: 'App packs' }, ...TEMPLATE_CATEGORIES]
      .map(c => `<button type="button" class="template-cat-chip${c.id === 'all' ? ' active' : ''}" data-cat="${c.id}">${c.label}</button>`)
      .join('');

    modal.innerHTML = /*HTML*/`
      <div class="modal-content">
        <div class="template-modal-top">
          <div class="modal-header">
            <h2>Templates</h2>
            <div class="picker-search-wrap template-search-wrap">
              <input type="search" class="template-search" placeholder="Search templates or categories..." aria-label="Search templates" autocomplete="off" spellcheck="false">
              <span class="picker-search-count" aria-live="polite"></span>
              <button type="button" class="picker-search-clear" aria-label="Clear search" title="Clear search" hidden><i class="fas fa-times"></i></button>
            </div>
            <button class="close-modal">&times;</button>
          </div>
          <div class="template-cat-chips" role="toolbar" aria-label="Template categories">${chips}</div>
        </div>
        ${section('packs', 'App packs <span>Whole apps, screens already connected</span>', TEMPLATE_PACKS)}
        ${TEMPLATE_CATEGORIES.map(c => section(c.id, c.label, TEMPLATE_CARDS.filter(card => card.cat === c.id))).join('')}
        <div class="template-search-empty" hidden>
          <p class="template-search-empty-msg">No templates match your search.</p>
          <button type="button" class="picker-empty-btn" data-empty-action="clear">Clear search</button>
          <button type="button" class="picker-empty-btn" data-empty-action="all-cats">Search all categories</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  // ── PREVIEWS ────────────────────────────────────────────────────────────────
  // Each card's thumbnail is generated from its TEMPLATES entry: the component's
  // real variant HTML (setupVariants) with the template's copy applied, so a preview
  // always matches what the template builds. Components without variant markup get
  // a static look-alike from PREVIEW_HTML. `after` hooks don't run in previews.
  const PREVIEW_HTML = {
    heading: e => {
      const h = e.level || 'h1';
      return `<div class="heading-wrapper"><${h} class="usa" contenteditable="true" style="margin: 0;">Heading Text</${h}></div>`;
    },
    paragraph: () => '<div><p class="usa" contenteditable="true">This is a paragraph. Click to edit.</p></div>',
    label: () => '<label class="field-label-element usa" contenteditable="true">Label Text</label>',
    adjustableSpace: () => '<div style="height: 16px;"></div>',
    icon: e => `<div style="text-align: center;"><i class="${e.icon || 'fas fa-bolt-lightning'}" style="font-size: ${e.size || 24}px; color: var(${e.icon ? '--color-primary' : '--color-accent'});"></i></div>`,
    chipGroup: () => '<div class="chip-group-container">'
      + '<div class="chip" style="background-color: var(--color-primary);"><span class="chip-text usa" contenteditable="true">Pill</span></div>'.repeat(3)
      + '</div>',
    checkbox: () => '<div class="custom-checkbox-wrapper"><div class="fa-regular fa-square checkbox-square-icon"></div>'
      + '<span class="usa" contenteditable="true" style="font-size: 16px; color: var(--basic-txt-color);">click to edit</span></div>',
    radio: e => '<div class="radio-wrapper" style="display: flex; align-items: center;"><label class="radio-label">'
      + `<div class="radio-outer-circle custom-radio"${e.checked ? ' style="border-color: var(--color-primary);"' : ''}>`
      + `<span class="radio-dot" style="background-color: var(--color-primary);${e.checked ? ' display: block;' : ''}"></span></div></label>`
      + '<span style="color: var(--basic-txt-color);">click to edit</span></div>',
    dropdown: () => '<div class="custom-dropdown-container"><div class="dropdown-header"><div class="selected-text">Select an option</div><i class="fas fa-chevron-down"></i></div></div>',
    tabs: e => '<div class="tabs-container"' + (e.style && e.style !== 'classic' ? ` data-tab-style="${e.style}"` : '') + '>'
      + '<div class="tabs-wrapper" style="display: flex; width: 100%;">'
      + '<div class="ui-tab usa selected" contenteditable="true" style="background-color: var(--color-primary); color: white;">Tab 1</div>'
      + '<div class="ui-tab usa" contenteditable="true" style="background-color: var(--neutral-gray); color: var(--basic-txt-color);">Tab 2</div>'
      + '</div></div>',
    accordion: e => {
      const classic = !e.style || e.style === 'classic';
      return '<div class="accordion-container"' + (classic ? ' style="border: .12rem solid var(--color-primary);"' : ` data-accordion-style="${e.style}"`) + '>'
        + '<div class="accordion-header"' + (classic ? ' style="background-color: var(--color-primary);"' : '') + '>'
        + '<span class="usa" contenteditable="true">Section Title</span><i class="fas fa-chevron-down"></i></div></div>';
    },
    bottomNav: e => {
      const style = window.Components?.bottomNav?.STYLES?.[e.variant || 0]?.id;
      const items = [['fa-home', 'Home'], ['fa-search', 'Search'], ['fa-plus', 'Add'], ['fa-heart', 'Like'], ['fa-user', 'Profile']]
        .map(([icon, label]) => `<div class="nav-item-container"><div class="bottom-nav-item"><i class="fas ${icon}"></i><span class="usa" contenteditable="true">${label}</span></div></div>`)
        .join('');
      return `<div class="tp-bottom-nav"><div class="bottomNav bottom-navbar"${style && style !== 'classic' ? ` data-nav-style="${style}"` : ''}>${items}</div></div>`;
    },
    progressTracker: e => '<div class="progress-tracker-container"><div class="steps-container" style="display: flex; align-items: center; justify-content: center;">'
      + (e.steps || ['Step 1', 'Step 2', 'Step 3']).map((label, i) => `<div class="step-container" style="display: flex; flex-direction: column; align-items: center; margin: 0 4px;">`
          + `<div class="step-circle" style="width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; background-color: ${i === (e.current || 0) ? 'var(--color-primary); color: white' : 'var(--neutral-gray); color: #666'};">${i + 1}</div>`
          + `<div class="step-label" style="font-size: 12px; margin-top: 5px;">${label}</div></div>`)
        .join('<div style="height: 2px; background-color: #E0E0E0; flex: 1; margin-top: -14px;"></div>')
      + '</div></div>',
    graph: () => '<div style="height: 90px; display: flex; align-items: flex-end; justify-content: center; gap: 10px; padding: 8px; border-radius: 6px; background-color: var(--input-bg-color);">'
      + [60, 35, 75, 50, 90].map(h => `<div style="width: 22px; height: ${h}%; background-color: var(--color-primary); border-radius: 4px 4px 0 0;"></div>`).join('')
      + '</div>',
    lineGraph: e => e.variant === 2
      ? '<div class="line-graph-wrapper line-graph--stat"><div class="line-graph-body"><div class="line-graph-stat">'
        + '<div class="line-graph-stat-title">Revenue</div><div class="line-graph-stat-row"><div class="line-graph-stat-value">$12,480</div><div class="line-graph-stat-change">▲ 12.5%</div></div></div>'
        + '<svg viewBox="0 0 100 30" preserveAspectRatio="none" style="width: calc(100% + 32px); margin: 8px -16px 0; height: 40px; display: block;"><path d="M0 24 C 20 18, 30 22, 45 16 S 75 14, 100 4 L 100 30 L 0 30 Z" style="fill: var(--color-primary); opacity: .18"/><path d="M0 24 C 20 18, 30 22, 45 16 S 75 14, 100 4" fill="none" stroke-width="2" vector-effect="non-scaling-stroke" style="stroke: var(--color-primary)"/></svg></div></div>'
      : '<div style="height: 90px; padding: 8px; border-radius: 6px; background-color: var(--input-bg-color);">'
        + '<svg viewBox="0 0 100 50" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;"><path d="M0 40 C 15 30, 25 34, 40 26 S 70 24, 100 6 L 100 50 L 0 50 Z" style="fill: var(--color-primary); opacity: .18"/><path d="M0 40 C 15 30, 25 34, 40 26 S 70 24, 100 6" fill="none" stroke-width="2.5" vector-effect="non-scaling-stroke" style="stroke: var(--color-primary)"/></svg></div>',
    pieGraph: () => '<div style="display: flex; align-items: center; justify-content: center; gap: 16px; padding: 6px 0;">'
      + '<div style="width: 80px; height: 80px; border-radius: 50%; background: conic-gradient(var(--color-primary) 0 45%, var(--color-accent) 45% 75%, var(--neutral-gray) 75% 100%);"></div>'
      + '<div style="font-size: 12px; line-height: 1.8; color: var(--basic-txt-color);">Direct<br>Social<br>Email</div></div>',
    bulletedList: () => '<ul style="margin: 4px 0; padding-left: 22px;">'
      + '<li class="bullet-list-item-text usa" contenteditable="true">List item</li>'.repeat(3) + '</ul>',
    floatingActionButton: () => '<div style="display: flex; justify-content: flex-end;"><div style="width: 48px; height: 48px; border-radius: 50%; background-color: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center;"><i class="fas fa-plus"></i></div></div>',
    table: () => '<table class="data-table-main" style="width: 100%; border-collapse: collapse; font-size: 12px;">'
      + '<tr>' + ['Name', 'Status', 'Value'].map(t => `<th style="padding: 5px; text-align: left; background-color: var(--color-primary); color: white;">${t}</th>`).join('') + '</tr>'
      + '<tr>' + ['Item One', 'Active', '$1,200'].map(t => `<td style="padding: 5px; border-bottom: 1px solid var(--neutral-gray);">${t}</td>`).join('') + '</tr></table>',
  };

  // Editor-only chrome that variant markup carries (row delete buttons, add buttons…)
  const PREVIEW_STRIP = '.delete-fc-row, .delete-fc-col, .comparison-add-row-btn, .noti-visibility-toggle, .nav-add-btn, .nav-delete-btn, .resize-handle, .tabs-controls, .tabs-end-controls';

  // Wrappers the editor's factory puts around a component's variant markup
  const PREVIEW_WRAP = { avatar: 'avatar-container align-content' };

  let previewUid = 0;

  function buildPreviewItem(entry) {
    const snippet = PREVIEW_HTML[entry.type];
    let html = snippet ? snippet(entry) : null;
    if (html == null) {
      const variants = setupVariants(entry.type);
      html = variants?.[entry.variant || 0] ?? variants?.[0];
    }
    if (html == null) return null;

    const item = document.createElement('div');
    // tp-<component type>: tp-navbar, tp-hero, tp-bottomNav are styled in ux-mock-bldr.css (.tp-scale)
    item.className = `tp-item tp-${entry.type}`;
    item.innerHTML = PREVIEW_WRAP[entry.type] ? `<div class="${PREVIEW_WRAP[entry.type]}">${html}</div>` : html;
    item.querySelectorAll(PREVIEW_STRIP).forEach(n => n.remove());
    if (entry.text) setTexts(item, entry.text, null);
    if (entry.placeholder) setPlaceholders(item, entry.placeholder, null);

    // Inline SVG ids (gradients) would collide with the same ids on real screens —
    // and a url(#id) that resolves into the hidden modal renders nothing.
    item.querySelectorAll('[id]').forEach(n => {
      const old = n.id;
      const fresh = `tp${++previewUid}-${old}`;
      n.id = fresh;
      item.querySelectorAll('*').forEach(el => {
        for (const attr of el.attributes) {
          if (attr.value.includes(`#${old})`)) attr.value = attr.value.split(`#${old})`).join(`#${fresh})`);
        }
      });
    });
    item.querySelectorAll('[contenteditable]').forEach(n => n.removeAttribute('contenteditable'));
    return item;
  }

  // Show only cards in the chosen category (chip) whose title/blurb/tags contain every
  // word of the query. "App packs" shows only packs; a category shows its packs + screens.
  function filterTemplates(modal, query) {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    const cat = modal.querySelector('.template-cat-chip.active')?.dataset.cat || 'all';
    let shown = 0;
    modal.querySelectorAll('.template-section').forEach(section => {
      let inSection = 0;
      section.querySelectorAll('.template-card').forEach(card => {
        const inCat = cat === 'all' || card.dataset.cat === cat ||
          (cat === 'packs' && card.classList.contains('template-pack'));
        const isPackOnly = cat === 'packs' && !card.classList.contains('template-pack');
        const match = inCat && !isPackOnly && words.every(w => card.dataset.search.includes(w));
        card.hidden = !match;
        if (match) inSection++;
      });
      section.hidden = inSection === 0;
      shown += inSection;
    });
    window.setSearchCount?.(modal.querySelector('.template-search'), words.length ? shown : null, 'template');
    const empty = modal.querySelector('.template-search-empty');
    empty.hidden = shown > 0;
    if (!shown) {
      const label = modal.querySelector('.template-cat-chip.active')?.textContent || '';
      empty.querySelector('.template-search-empty-msg').textContent = words.length
        ? `No templates match "${query.trim()}"${cat !== 'all' ? ` in ${label}` : ''}.`
        : 'No templates in this category.';
      empty.querySelector('[data-empty-action="clear"]').hidden = !words.length;
      // a chip narrows the search: offer the same search across every category
      empty.querySelector('[data-empty-action="all-cats"]').hidden = cat === 'all' || !words.length;
    }
  }

  // Fill every card's thumbnail (once — on first open, when all component modules are loaded)
  function renderTemplatePreviews(modal) {
    if (modal.dataset.previewsBuilt) return;
    modal.dataset.previewsBuilt = 'true';
    modal.querySelectorAll('.template-card').forEach(card => {
      const key = PACKS_BY_KEY[card.dataset.template]?.screens[0] || card.dataset.template;
      fillPreview(card.querySelector('.tp-scale'), TEMPLATES[key] || [], key);
      setupPreviewScroll(card);
    });
  }

  function fillPreview(scale, entries, label) {
    let columns = null; // row for the latest Columns entry; `column` entries fill its cells
    entries.filter(entry => !entry.tab).forEach(entry => {
      if (entry.type === 'columns') {
        columns = document.createElement('div');
        columns.className = 'tp-item tp-columns';
        columns.style.cssText = 'display: flex; gap: 6px;';
        columns.innerHTML = '<div style="flex: 1; min-width: 0;"></div><div style="flex: 1; min-width: 0;"></div>';
        scale.appendChild(columns);
        return;
      }
      for (let i = 0; i < (entry.repeat || 1); i++) {
        try {
          const item = buildPreviewItem(entry);
          const cell = entry.column != null && columns?.children[entry.column];
          if (item) (cell || scale).appendChild(item);
        } catch (err) {
          console.warn(`[templates] preview ${label}/${entry.type} failed:`, err);
        }
      }
    });
  }

  // Mount a standalone thumbnail (.template-preview > .tp-scale) for any entry list into
  // `container`, with the hover glide on `hoverTarget` (default: container) — used by
  // the welcome tutorial's template step. Empty entries → an empty phone (blank screen).
  function mountTemplatePreview(container, entries, hoverTarget = container) {
    const preview = document.createElement('div');
    preview.className = 'template-preview';
    const scale = document.createElement('div');
    scale.className = 'tp-scale' + (entries.length ? '' : ' tp-blank');
    preview.appendChild(scale);
    fillPreview(scale, entries, 'tutorial');
    container.appendChild(preview);
    setupPreviewScroll(hoverTarget);
    requestAnimationFrame(() => {
      preview.classList.toggle('tp-more', preview.scrollHeight - preview.clientHeight > 2);
    });
    return preview;
  }

  // Scrollbars are hidden app-wide, so a thumbnail taller than its box gives no hint
  // that it scrolls. Hovering a card glides its thumbnail to the bottom of the screen;
  // leaving glides it back to the top. Scrolling it yourself takes over.
  const PREVIEW_SCROLL_PX_PER_SEC = 90;

  function setupPreviewScroll(card) {
    const preview = card.querySelector('.template-preview');
    if (!preview) return;
    let frame = null;
    let manual = false; // the user scrolled this thumbnail themselves (wheel/touch)

    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = null; };
    const glideTo = (target, speed) => {
      stop();
      let last = performance.now();
      const step = now => {
        const dt = (now - last) / 1000;
        last = now;
        const cur = preview.scrollTop;
        const dist = target - cur;
        if (Math.abs(dist) < 1) { preview.scrollTop = target; frame = null; return; }
        preview.scrollTop = cur + Math.sign(dist) * Math.min(Math.abs(dist), speed * dt);
        frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };
    const updateFade = () => {
      const more = preview.scrollHeight - preview.clientHeight - preview.scrollTop > 2;
      preview.classList.toggle('tp-more', more);
    };

    card.addEventListener('mouseenter', () => {
      manual = false;
      updateFade();
      // short pause so sweeping the pointer across the grid doesn't set everything moving
      stop();
      const delay = setTimeout(() => {
        if (!manual && card.matches(':hover')) glideTo(preview.scrollHeight - preview.clientHeight, PREVIEW_SCROLL_PX_PER_SEC);
      }, 350);
      card.addEventListener('mouseleave', () => clearTimeout(delay), { once: true });
    });
    card.addEventListener('mouseleave', () => { if (!manual) glideTo(0, PREVIEW_SCROLL_PX_PER_SEC * 6); });
    preview.addEventListener('wheel', () => { manual = true; stop(); }, { passive: true });
    preview.addEventListener('touchstart', () => { manual = true; stop(); }, { passive: true });
    preview.addEventListener('scroll', updateFade, { passive: true });
  }

  // Initialize the template system
  let openPickerFn = null;   // set by initializeTemplateSystem (no picker on the gallery page)
  let placeAfter = null;     // the screen the open picker builds after (openPickerFn's `after`)

  function initializeTemplateSystem() {
    // Create the modal if it doesn't exist
    let templateModal = document.getElementById('template-modal');
    if (!templateModal) {
      templateModal = createTemplateModal();
    }

    //first check if user can create more canvases
  async function canCreateMoreCanvases(currentCanvasCount) {
    // The editor's limits (ux-mock-bldr.js state: 2 signed out — unlimited on a local dev
    // server — and 3 free), the same ones createNewCanvas enforces
    const limits = editor.state;
    if (!firebase.auth().currentUser && currentCanvasCount >= limits.signedOutScreenLimit) {
      showAuthModal('Sign In to create more screens', 'Signed-in designers can save projects and add more screens!');
      return false;
    }
    
    if (firebase.auth().currentUser && currentCanvasCount >= limits.freeScreenLimit) {
      try {
        const isProAccount = await imageManager.checkProAccess(firebase.auth().currentUser.uid);   // cached + live
        
        if (!isProAccount) {
          projectManager.showSubscriptionModal('Upgrade to Create Unlimited Screens', 'You\'ve reached the limit for free screens.');
          return false;
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
        return false;
      }
    }
    
    // If we've reached here, the user can create more canvases
    return true;
  }
    
    // Get reference to the add template button
    const addTemplateBtn = document.getElementById('addTemplateBtn');
    if (!addTemplateBtn) {
      console.error('Add Template button not found');
      return;
    }
    
    // after: a .canvas-wrapper to build the picked template / pack right after (the screen
    // ⋯ menu's "Add template after"); none = at the end, as the sidebar button does
    openPickerFn = async ({ after = null } = {}) => {
      // Locked screens count too (as in createNewCanvas)
      const currentCanvasCount = document.querySelectorAll('.canvas-wrapper, .locked-screen').length;
      
      const canCreate = await canCreateMoreCanvases(currentCanvasCount);
      placeAfter = canCreate ? after : null;
      if (canCreate) {
        renderTemplatePreviews(templateModal);
        // each open starts with the full gallery
        const search = templateModal.querySelector('.template-search');
        search.value = '';
        templateModal.querySelector('.picker-search-clear').hidden = true;
        templateModal.querySelectorAll('.template-cat-chip').forEach(c => c.classList.toggle('active', c.dataset.cat === 'all'));
        filterTemplates(templateModal, '');
        templateModal.querySelector('.modal-content').scrollTop = 0;
        templateModal.style.display = 'flex';
        search.focus();
        // measure now that the modal is laid out: fade the bottom of thumbnails that continue
        templateModal.querySelectorAll('.template-preview').forEach(p => {
          p.classList.toggle('tp-more', p.scrollHeight - p.clientHeight - p.scrollTop > 2);
        });
      } else {
        // The modal message is already shown by the canCreateMoreCanvases function
        // No need to show another modal here
      }
    };
    addTemplateBtn.addEventListener('click', () => openPickerFn());
    
    const searchInput = templateModal.querySelector('.template-search');
    const searchClear = templateModal.querySelector('.picker-search-clear');
    const clearTemplateSearch = () => {
      searchInput.value = '';
      searchClear.hidden = true;
      filterTemplates(templateModal, '');
      searchInput.focus();
    };
    searchInput.addEventListener('input', () => {
      searchClear.hidden = !searchInput.value;
      filterTemplates(templateModal, searchInput.value);
    });
    searchClear.addEventListener('click', clearTemplateSearch);
    templateModal.querySelector('[data-empty-action="clear"]').addEventListener('click', clearTemplateSearch);
    templateModal.querySelector('[data-empty-action="all-cats"]').addEventListener('click', () => {
      templateModal.querySelectorAll('.template-cat-chip').forEach(c => c.classList.toggle('active', c.dataset.cat === 'all'));
      filterTemplates(templateModal, searchInput.value);
      templateModal.querySelector('.modal-content').scrollTop = 0;
      searchInput.focus();
    });
    // Esc clears the search, then closes the modal. Capture phase on window, so the
    // editor's own Escape (deselect, shortcuts.js) doesn't run while the modal is open.
    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || templateModal.style.display !== 'flex') return;
      e.preventDefault();
      e.stopPropagation();
      if (searchInput.value) clearTemplateSearch();
      else templateModal.style.display = 'none';
    }, true);
    // Enter builds the template when the search narrows it to one card
    searchInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      const visible = templateModal.querySelectorAll('.template-card:not([hidden])');
      if (visible.length === 1) visible[0].click();
    });

    templateModal.querySelector('.template-cat-chips').addEventListener('click', (e) => {
      const chip = e.target.closest('.template-cat-chip');
      if (!chip) return;
      templateModal.querySelectorAll('.template-cat-chip').forEach(c => c.classList.toggle('active', c === chip));
      filterTemplates(templateModal, searchInput.value);
      templateModal.querySelector('.modal-content').scrollTop = 0;
    });

    // Close modal when clicking the close button
    const closeBtn = templateModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
      templateModal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    templateModal.addEventListener('click', (e) => {
      if (e.target === templateModal) {
        templateModal.style.display = 'none';
      }
    });
    
    // Handle template selection
    const templateCards = templateModal.querySelectorAll('.template-card');
    templateCards.forEach(card => {
      card.addEventListener('click', () => {
        const templateType = card.getAttribute('data-template');
        templateModal.style.display = 'none';
        const after = placeAfter?.isConnected ? placeAfter : null;
        placeAfter = null;
        if (PACKS_BY_KEY[templateType]) applyPack(templateType, { after });
        else applyTemplate(templateType, { after });
      });
    });
  }
  
  // ── TEMPLATE DEFINITIONS ────────────────────────────────────────────────────
  // Each template is a list of component entries, built top to bottom by
  // applyTemplate() through editor.insertComponent — synchronously, one at a time,
  // so every entry's variant and copy land on the exact element it created.
  //
  //   type        component type (same as the sidebar button's data-component)
  //   variant     variant index to switch to (bottomNav: style index)
  //   style       style id for components with styles instead of variants
  //               (tabs: classic|underline|segmented|pills, accordion: classic|faq|card)
  //   level       heading level, 'h1'…'h6' (heading only)
  //   repeat      insert this entry N times
  //   text        string → the component's first editable text element
  //               { selector: 'copy' }      → first match inside the component
  //               { selector: ['a', 'b'] }  → successive matches
  //   placeholder { selector: 'copy' } → placeholder / data-placeholder attribute
  //   after(el)   custom tweak, run after text; may be async (not run in previews)
  //   tab         0-based tab of the tabs component above it that this one shows on
  //               (js/components/tabs.js); omitted = shown on all tabs. Previews show
  //               only tab 0's content.
  //   end         (tabs) add its "End of tab content" line: entries without `tab` after
  //               it land below the line and show on every tab
  //   column      0-based column of the nearest Columns entry above it to place this
  //               component in (e.g. two stat cards side by side)
  //   steps       (progressTracker) step labels; current = 0-based selected step —
  //               spread tracker(steps, current) into the entry
  //   checked     (radio) start selected — spread radioOn into the entry
  //
  // Selectors are scoped to the inserted component, so other components on the
  // screen can never shift them. A selector that matches nothing logs a warning.
  // Convention: follow a top navbar with an adjustableSpace so the first component has
  // breathing room — except before full-bleed media meant to sit flush: a hero (which
  // always inserts flush under the navbar anyway) or a full-width image (image variant 1).
  // The picker's thumbnails are generated from these entries (renderTemplatePreviews).
  const BTN = '[role="button"]';
  const PRICE = '.card-content > div:first-child > div:last-child'; // card variant 5 (product)
  const centered = el => {
    const p = el.querySelector('p');
    if (p) Object.assign(p.style, { textAlign: 'center', opacity: '0.7' });
  };

  // Template helpers for charts: stat-card copy, and editing a chart's data-graph state
  // after insert (run as an entry's `after`, so not in thumbnails)
  const stat = (title, value, change) => ({ '.line-graph-stat-title': title, '.line-graph-stat-value': value, '.line-graph-stat-change': change });
  const pts = (values) => values.map((value, i) => ({ label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i % 12], value }));
  const graphData = (type, edit) => (el) => {
    const wrapper = el.querySelector('[data-graph]');
    if (!wrapper) return;
    const state = JSON.parse(wrapper.dataset.graph);
    edit(state);
    wrapper.dataset.graph = JSON.stringify(state);
    window.Components[type].setup(wrapper);
  };

  // Progress tracker: build the steps (it inserts with one) and select `current`
  const tracker = (steps, current = 0) => ({
    steps, current,
    after: el => {
      const add = queryOwn(el, '.pt-add-step')[0]?.closest('button');
      for (let i = 1; i < steps.length; i++) add?.click();
      setTexts(el, { '.pt-step-label, .step-label': steps }, 'progressTracker');
      queryOwn(el, '[data-step]')[current]?.click();
    },
  });

  // Radio: start selected (same look as clicking it in play)
  const radioOn = {
    checked: true,
    after: el => {
      const radio = queryOwn(el, '.custom-radio')[0];
      if (!radio) return;
      radio.style.borderColor = 'var(--color-primary)';
      const dot = radio.querySelector('.radio-dot');
      if (dot) dot.style.display = 'block';
    },
  };
  const RADIO_LABEL = 'span:not(.radio-dot)';

  // ── Pack links ──
  // An entry's `go` connects its elements to other screens when it's built as part of an
  // app pack (TEMPLATE_PACKS): { selector: 'templateKey' | 'back' | [successive…] }.
  // Use the element Connect mode would link (a [role=button], .card-con, .nav-item-container…)
  // or ROOT for the component's own root. Ignored when the template is used on its own.
  // goTransition: 'fade' | 'up' | 'none' for those links (default: slide).
  const ROOT = '@root';

  // Bottom tab bar from [label, icon, screen] ×5 — the same bar on every screen of an app
  // highlights the right tab in play (bottomNav.play), and tabs switch without a slide.
  const tabBar = (variant, items) => ({
    type: 'bottomNav', variant,
    text: { '[contenteditable="true"]': items.map(i => i[0]) },
    after: el => setIcons(el, '.bottom-nav-item > i', items.map(i => `fas ${i[1]}`)),
    go: { '.nav-item-container': items.map(i => i[2] || null) },
    goTransition: 'none',
  });

  // Shelf with exactly these labels (default items trimmed, or the last one copied when
  // there are more labels than the variant starts with); icons for the tiles style
  const shelf = (variant, labels, icons) => ({
    type: 'shelf', variant,
    after: el => {
      const items = queryOwn(el, '.shelf-item');
      items.slice(labels.length).forEach(n => n.remove());
      const last = items[Math.min(items.length, labels.length) - 1];
      for (let i = items.length; i < labels.length && last; i++) {
        const copy = last.cloneNode(true);
        copy.classList.remove('active');
        last.parentNode.appendChild(copy);
      }
      queryOwn(el, '.shelf-label').forEach((n, i) => { if (labels[i] != null) n.textContent = labels[i]; });
      if (icons) setIcons(el, '.shelf-icon i', icons.map(i => `fas ${i}`));
    },
  });

  // Progress bar at pct% (variant 1 shows the label beside it)
  const progress = (pct, variant = 1) => ({
    type: 'progressBar', variant,
    after: el => {
      // The bar follows its editable percentage text (components/progressBar.js)
      const text = queryOwn(el, '.progress-group [contenteditable="true"]')[0];
      if (text) { text.textContent = `${pct}%`; notifyEdit(text); return; }
      const bar = queryOwn(el, '.progress-bar > div')[0];
      if (bar) bar.style.width = `${pct}%`;
      const label = queryOwn(el, '.progress-label, .progress-value')[0];
      if (label) label.textContent = `${pct}%`;
    },
  });

  // A large centered icon (success / empty states)
  const bigIcon = (icon, size = 64) => ({
    type: 'icon', icon, size,
    after: el => {
      const i = queryOwn(el, '.iconContainerClass i')[0];
      if (!i) return;
      i.className = icon;
      i.style.fontSize = `${size}px`;
      i.style.color = 'var(--color-primary)';
      const control = el.querySelector('input.iconControls');
      if (control) control.value = size;
    },
  });

  // Star rating (js/components/rating.js): variant 1 = score + stars + count
  const rated = (value, text, variant = 1) => ({
    type: 'rating', variant, text,
    after: el => window.Components.rating.setRating(el, value),
  });
  // Quantity stepper (js/components/stepper.js): 0 plain, 1 labeled row, 2 filled pill
  const qty = (value, variant = 0, text) => ({
    type: 'stepper', variant, ...(text ? { text } : {}),
    after: el => window.Components.stepper.setValue(el, value),
  });

  const center = el => {
    queryOwn(el, 'h1, h2, h3, h4, p').forEach(n => { n.style.textAlign = 'center'; });
  };
  const LI_TITLE = '.li-content > span:first-child';

  // Tab bars shared by the screens of one app (and its app pack)
  const SOCIAL_TABS = tabBar(2, [['Home', 'fa-house', 'social'], ['Explore', 'fa-compass', 'explore'], ['Post', 'fa-plus', 'createPost'], ['Inbox', 'fa-comment', 'chatInbox'], ['Profile', 'fa-user', 'template1']]);
  const SHOP_TABS = tabBar(1, [['Shop', 'fa-store', 'ecommerce'], ['Search', 'fa-magnifying-glass', null], ['Bag', 'fa-bag-shopping', 'cart'], ['Orders', 'fa-box', 'orderTracking'], ['Account', 'fa-user', null]]);
  const FOOD_TABS = tabBar(0, [['Home', 'fa-house', 'foodHome'], ['Search', 'fa-magnifying-glass', null], ['Orders', 'fa-receipt', 'deliveryTracking'], ['Saved', 'fa-heart', null], ['Profile', 'fa-user', null]]);
  const BANK_TABS = tabBar(0, [['Home', 'fa-house', 'wallet'], ['Cards', 'fa-credit-card', 'cards'], ['Pay', 'fa-paper-plane', 'sendMoney'], ['Budget', 'fa-chart-pie', 'budget'], ['Invest', 'fa-arrow-trend-up', 'stockDetail']]);
  const FIT_TABS = tabBar(4, [['Today', 'fa-house', 'fitnessHome'], ['Workouts', 'fa-dumbbell', 'workout'], ['Food', 'fa-apple-whole', 'nutrition'], ['Habits', 'fa-list-check', 'habits'], ['Mind', 'fa-spa', 'meditation']]);
  const TRAVEL_TABS = tabBar(1, [['Explore', 'fa-magnifying-glass', 'travelHome'], ['Saved', 'fa-heart', null], ['Trips', 'fa-suitcase', 'tripItinerary'], ['Tickets', 'fa-ticket', 'boardingPass'], ['Profile', 'fa-user', null]]);
  const STREAM_TABS = tabBar(3, [['Home', 'fa-house', 'streamingHome'], ['Search', 'fa-magnifying-glass', null], ['Watch', 'fa-play', 'mediaGallery'], ['Downloads', 'fa-download', null], ['Profile', 'fa-user', null]]);
  const MUSIC_TABS = tabBar(3, [['Home', 'fa-house', null], ['Search', 'fa-magnifying-glass', null], ['Library', 'fa-layer-group', 'musicLibrary'], ['Podcasts', 'fa-podcast', 'podcast'], ['Playing', 'fa-music', 'nowPlaying']]);
  const WORK_TABS = tabBar(2, [['Tasks', 'fa-list-check', 'tasks'], ['Projects', 'fa-folder', 'projects'], ['New', 'fa-plus', 'taskDetail'], ['Calendar', 'fa-calendar', 'calendar'], ['Notes', 'fa-note-sticky', 'notes']]);
  const LEARN_TABS = tabBar(4, [['Learn', 'fa-house', 'education'], ['Courses', 'fa-book', 'courseCatalog'], ['Practice', 'fa-bullseye', 'quiz'], ['Saved', 'fa-bookmark', null], ['Profile', 'fa-user', null]]);

  // AI apps: chats live in a slide-out sidebar (the navbar's menu icon opens it in play)
  const AI_SIDEBAR = {
    type: 'sidebar', variant: 1, // right drawer, under the navbar's menu icon
    text: { '.sidebar-header h3': 'Assistant', '.sidebar-nav-item > span': ['New chat', 'Onboarding ideas', 'History', 'Image studio'] },
    after: el => {
      setIcons(el, '.sidebar-nav-item > i', ['fas fa-pen-to-square icon-container', 'fas fa-message icon-container', 'fas fa-clock-rotate-left icon-container', 'fas fa-wand-magic-sparkles icon-container']);
      window.Components.sidebar.setOpen(el, false); // tucked away so the screen shows
    },
    go: { '.sidebar-nav-item': ['aiHome', 'aiChat', 'aiHistory', 'imageGen'] },
  };
  // Navbar whose menu icon opens AI_SIDEBAR (an overlay link — the sidebar starts closed in play)
  const aiNav = title => ({
    type: 'navbar', variant: 2, text: { '.nav-title-text': title },
    go: { '.icon-container:has(.fa-bars)': 'overlay:sidebar' },
  });

  const TEMPLATES = {
    template1: [ // Profile
      { type: 'navbar', variant: 6, text: { '.nav-brand-text': 'Profile' } },
      { type: 'image', variant: 1 }, // cover photo
      { type: 'avatar', variant: 6, text: { '.avatar-text': 'Maya Patel', '.avatar-sub-txt': '@mayadesigns' } },
      { type: 'paragraph', text: 'Product designer in Portland. Into film cameras, good coffee, and clean interfaces.' },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Design', 'Photography', 'Travel'] } },
      { type: 'button', variant: 4, text: { [BTN]: ['MESSAGE', 'FOLLOW'] }, go: { [BTN]: ['messaging'] } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Recent work' } },
      { type: 'imgGallery', variant: 2, go: { '.img-gallery-grid-item': ['postDetail', 'postDetail', 'postDetail'] } },
      SOCIAL_TABS,
    ],

    template2: [ // Landing page
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Northwind' } },
      { type: 'hero', variant: 2, text: { '.hx-title': 'Ship faster, together', '.hx-text': 'Plan, build, and launch in one place.', '.hx-btn': 'Start for free' }, go: { '.hx-btn': 'login' } },
      { type: 'heading', level: 'h2', text: 'Why teams switch' },
      { type: 'paragraph', text: 'Bring your tasks, docs, and conversations together so nothing slips through the cracks. Set up in minutes, no training required.' },
      { type: 'button', variant: 3, text: 'SEE PRICING', go: { [BTN]: 'pricing' } },
      { type: 'blockquote', variant: 2, text: { '.blockquote-element': 'We cut our weekly status meetings in half. Everyone just knows where things stand.', '.bq-name': 'Jordan Lee', '.bq-role': 'Head of Product, Northwind' } },
      { type: 'heading', level: 'h3', text: 'Frequently asked questions' },
      { type: 'accordion', style: 'faq', text: 'How does the free plan work?' },
      { type: 'accordion', style: 'faq', text: 'Can I change plans later?' },
      { type: 'accordion', style: 'faq', text: 'Is my data secure?' },
      { type: 'adjustableSpace' },
      { type: 'footer', variant: 1, text: { '.footer-heading': 'Northwind', '.footer-copyright-text': '© 2025 Northwind. All rights reserved.' } },
    ],

    template3: [ // Contact form
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Contact Us' } },
      { type: 'adjustableSpace' },
      { type: 'heading', text: 'Get in touch' },
      { type: 'paragraph', text: "Questions or feedback? Send us a message and we'll reply within one business day." },
      { type: 'input', variant: 2, text: { '.ui-input-label': 'Full name' }, placeholder: { '.ui-input-base': 'Jane Doe' } },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Email' }, placeholder: { '.ui-input-base': 'you@example.com' } },
      { type: 'label', text: 'Topic' },
      { type: 'dropdown' },
      { type: 'textarea', variant: 1, text: { '.ui-input-label': 'Message' }, placeholder: { '.ui-input-base': 'How can we help?' } },
      { type: 'checkbox', text: { 'span': 'Email me a copy of this message' } },
      { type: 'adjustableSpace' },
      { type: 'button', variant: 4, text: { [BTN]: ['CANCEL', 'SEND'] } },
    ],

    login: [
      { type: 'adjustableSpace' },
      { type: 'image', variant: 5 }, // circle crop, for a logo
      { type: 'tabs', style: 'segmented', text: { '.ui-tab': ['Sign In', 'Sign Up'] }, end: true },
      // Sign In tab
      { type: 'heading', text: 'Welcome back', tab: 0 },
      { type: 'paragraph', text: 'Sign in to continue where you left off.', tab: 0 },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Email' }, placeholder: { '.ui-input-base': 'you@example.com' }, tab: 0 },
      { type: 'input', variant: 5, text: { '.ui-input-label': 'Password', '.ui-input-password-hint': 'Forgot password?' }, go: { '.ui-input-password-hint': 'forgotPassword' }, tab: 0 },
      { type: 'checkbox', text: { 'span': 'Remember me' }, tab: 0 },
      { type: 'button', variant: 0, text: 'SIGN IN', go: { [BTN]: 'dashboard|verifyCode' }, tab: 0 },
      { type: 'paragraph', text: "Don't have an account? Sign up", after: centered, tab: 0 },
      // Sign Up tab
      { type: 'heading', text: 'Create your account', tab: 1 },
      { type: 'paragraph', text: 'It only takes a minute.', tab: 1 },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Name' }, placeholder: { '.ui-input-base': 'Jane Doe' }, tab: 1 },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Email' }, placeholder: { '.ui-input-base': 'you@example.com' }, tab: 1 },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Password' }, placeholder: { '.ui-input-base': 'At least 8 characters' }, tab: 1 },
      { type: 'button', variant: 0, text: 'CREATE ACCOUNT', go: { [BTN]: 'verifyCode|dashboard' }, tab: 1 },
      // Both tabs (below the end line)
      { type: 'hzDivider', variant: 1, text: { '.hzRule-text': 'OR' } },
      { type: 'button', variant: 3, text: 'CONTINUE WITH GOOGLE', go: { [BTN]: 'permissions|dashboard' } },
      { type: 'adjustableSpace' },
    ],

    onboarding: [
      { type: 'adjustableSpace' },
      { type: 'image', variant: 0 }, // illustration
      { type: 'heading', text: 'Plan trips together', after: el => { const h = el.querySelector('h1'); if (h) h.style.textAlign = 'center'; } },
      { type: 'paragraph', text: 'Share itineraries, split costs, and keep the whole group on the same page.', after: el => { const p = el.querySelector('p'); if (p) p.style.textAlign = 'center'; } },
      { type: 'pagination', variant: 1 },
      { type: 'adjustableSpace' },
      { type: 'button', variant: 0, text: 'GET STARTED', go: { [BTN]: 'login' } },
      { type: 'paragraph', text: 'I already have an account', after: centered, go: { [ROOT]: 'login' } },
    ],

    settings: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Settings' } },
      { type: 'adjustableSpace' },
      { type: 'avatar', variant: 6, text: { '.avatar-text': 'Jordan Lee', '.avatar-sub-txt': 'jordan@example.com' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Preferences' } },
      { type: 'toggleSwitch', variant: 1, text: { '.toggle-title': 'Push notifications', '.toggle-desc': 'Messages, mentions, and reminders' } },
      { type: 'toggleSwitch', variant: 1, text: { '.toggle-title': 'Dark mode', '.toggle-desc': 'Easier on the eyes at night' } },
      { type: 'toggleSwitch', variant: 3, text: { '.toggle-row-label': ['Email updates', 'Sound effects', 'Location services'] },
        after: el => setIcons(el, '.toggle-row-icon i', ['fas fa-envelope', 'fas fa-volume-high', 'fas fa-location-dot']) },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Account' } },
      { type: 'listItem', variant: 3, text: 'Profile information', after: el => setIcon(el, '.li-icon i', 'fas fa-user') },
      { type: 'listItem', variant: 3, text: 'Privacy & security', after: el => setIcon(el, '.li-icon i', 'fas fa-lock') },
      { type: 'listItem', variant: 3, text: 'Help & support', after: el => setIcon(el, '.li-icon i', 'fas fa-circle-question') },
      { type: 'adjustableSpace' },
      { type: 'button', variant: 3, text: 'LOG OUT' },
    ],

    social: [
      { type: 'navbar', variant: 5, text: { '.nav-pill span': ['All', 'Friends', 'Popular', 'New'] } },
      { type: 'adjustableSpace' },
      { type: 'card', variant: 4, text: { '.card-social-name': 'Alex Rivera', '.card-social-time': '12 min ago', '.card-text': 'Golden hour at the pier never gets old 🌅' }, go: { [ROOT]: 'postDetail' } },
      { type: 'card', variant: 7, text: { '.card-title': 'A weekend in Lisbon', '.card-text': 'Tiled streets, tram 28, and far too many pastéis de nata.' }, go: { [ROOT]: 'postDetail' } },
      { type: 'card', variant: 4, text: { '.card-social-name': 'Sam Chen', '.card-social-time': '1 hour ago', '.card-text': 'Finished my first marathon today! Thank you all for the support 🏃' }, go: { [ROOT]: 'postDetail' } },
      SOCIAL_TABS,
    ],

    messaging: [
      { type: 'navbar', variant: 3, text: { '.nav-username': 'John Smith', '.nav-status': 'Online' } },
      { type: 'adjustableSpace' },
      { type: 'hzDivider', variant: 1, text: { '.hzRule-text': 'Today' } },
      { type: 'leftChat', text: { '.chat-avatar': 'JS', '.chat-content': 'Hey! Are we still on for Saturday?', '.chat-timestamp': '10:02 AM' } },
      { type: 'rightChat', text: { '.chat-content': 'Definitely. I booked a table at that new place downtown.', '.chat-timestamp': '10:04 AM' } },
      { type: 'leftChat', variant: 1, text: { '.chat-avatar': 'JS', '.chat-content': 'Is this the one? The view looks amazing', '.chat-timestamp': '10:05 AM' } },
      { type: 'rightChat', variant: 4, text: { '.chat-content': "That's it! 7:30 on the rooftop.", '.chat-timestamp': '10:06 AM' } },
      { type: 'leftChat', variant: 2, text: { '.chat-avatar': 'JS', '.chat-timestamp': '10:08 AM' } },
      { type: 'leftChat', variant: 3, text: { '.chat-avatar': 'JS' } },
      { type: 'chatInput', variant: 4 }, // pinned to the bottom
    ],

    // AI welcome + prompt box (chatInput variant 5). In play, a prompt card or a typed message
    // puts the welcome away and the conversation starts.
    aiHome: [
      aiNav('Assistant'),
      { type: 'adjustableSpace' },
      { type: 'aiWelcome' },
      { type: 'chatInput', variant: 5 }, // pinned to the bottom
      AI_SIDEBAR,
    ],

    // leftChat / rightChat variant 5 = AI response, 6 = with reasoning (in play, replies
    // stream into a copy of the last one)
    aiChat: [
      aiNav('Assistant'),
      { type: 'adjustableSpace' },
      { type: 'leftChat', variant: 5, text: { '.chat-content': 'Hi! I’m your assistant. I can help you:', '.chat-ai-list li': ['Brainstorm ideas for your app', 'Write and polish copy', 'Plan your next steps'] } },
      { type: 'rightChat', text: { '.chat-avatar': 'ME', '.chat-content': 'How can I make my app’s onboarding feel faster?', '.chat-timestamp': '9:41 AM' } },
      { type: 'leftChat', variant: 6 },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Show an example', 'What about sign-up?', 'Make it shorter'] } },
      { type: 'chatInput', variant: 5 }, // pinned to the bottom
      AI_SIDEBAR,
    ],

    notifications: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Notifications' } },
      { type: 'adjustableSpace' },
      { type: 'tabs', style: 'underline', text: { '.ui-tab': ['All', 'Mentions'] } },
      // All tab
      { type: 'notificationBanner', variant: 3, text: { '.noti-title': 'Design review', '.noti-body': 'Starts in 15 minutes in Room 4B.', '.noti-btn-secondary': 'Dismiss', '.notification-action-btn': 'Join' }, tab: 0 },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Today' }, tab: 0 },
      { type: 'listItem', variant: 6, text: { '.usa': ['Emma Wilson followed you', '2m ago'], '.li-action span': 'Follow' }, tab: 0 },
      { type: 'listItem', variant: 6, text: { '.usa': ['Liam commented on your post', '18m ago'], '.li-action span': 'Reply' }, tab: 0 },
      { type: 'listItem', variant: 6, text: { '.usa': ['Ava liked your photo', '1h ago'], '.li-action span': 'View' }, tab: 0 },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Earlier' }, tab: 0 },
      { type: 'listItem', variant: 6, text: { '.usa': ['Noah mentioned you', 'Yesterday'], '.li-action span': 'Reply' }, tab: 0 },
      { type: 'listItem', variant: 6, text: { '.usa': ['Your weekly summary is ready', '2d ago'], '.li-action span': 'Open' }, tab: 0 },
      // Mentions tab
      { type: 'listItem', variant: 6, text: { '.usa': ['Mia mentioned you in Design Team', '35m ago'], '.li-action span': 'Reply' }, tab: 1 },
      { type: 'listItem', variant: 6, text: { '.usa': ['Noah mentioned you', 'Yesterday'], '.li-action span': 'Reply' }, tab: 1 },
      { type: 'bottomNav', variant: 0, text: { '[contenteditable="true"]': ['Home', 'Search', 'Create', 'Alerts', 'Profile'] } },
    ],

    dashboard: [
      { type: 'navbar', variant: 8, text: { '.nav-title-text': 'Analytics' } },
      { type: 'adjustableSpace' },
      { type: 'heading', level: 'h2', text: 'Good morning, Sam' },
      { type: 'paragraph', text: "Here's how your store did this week." },
      // 2×2 KPI tiles: stat cards in Columns
      { type: 'columns' },
      { type: 'lineGraph', variant: 2, column: 0, text: stat('Revenue', '$12.4k', '▲ 8.2%'), after: graphData('lineGraph', st => { st.points = pts([31, 38, 35, 44, 49, 58]); }) },
      { type: 'lineGraph', variant: 2, column: 1, text: stat('Orders', '342', '▲ 5.1%'), after: graphData('lineGraph', st => { st.points = pts([40, 36, 45, 43, 52, 55]); }) },
      { type: 'columns' },
      { type: 'lineGraph', variant: 2, column: 0, text: stat('Visitors', '8.9k', '▼ 2.4%'), after: graphData('lineGraph', st => { st.points = pts([62, 66, 58, 55, 57, 50]); }) },
      { type: 'lineGraph', variant: 2, column: 1, text: stat('Conversion', '3.8%', '▲ 0.6%'), after: graphData('lineGraph', st => { st.points = pts([28, 30, 29, 34, 33, 38]); }) },
      { type: 'card2', variant: 7, text: { '.card-title': 'Monthly goal', '.card-text': '$37.5k of $50k' } },
      { type: 'heading', level: 'h3', text: 'Sales trend' },
      { type: 'lineGraph', variant: 3, text: { '.line-graph-legend-name': ['This year', 'Last year'] } },
      { type: 'heading', level: 'h3', text: 'Sales by channel' },
      { type: 'pieGraph', variant: 1, text: { '.pie-graph-center-value': '$12.4k', '.pie-graph-center-label': 'This week' },
        after: graphData('pieGraph', st => { ['Online', 'In store', 'Social', 'Email'].forEach((l, i) => { if (st.segments[i]) st.segments[i].label = l; }); }) },
      { type: 'heading', level: 'h3', text: 'Top products' },
      { type: 'graph', variant: 1, text: { '.bar-graph-month-label': ['Sneakers', 'Hoodies', 'Caps', 'Socks', 'Bags'] } },
      { type: 'heading', level: 'h3', text: 'Recent activity' },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'New order #1042', '.card-text': '2 items • $86.00', '.card-time': '5 min ago' } },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Payout sent', '.card-text': '$2,340 to account ending 4821', '.card-time': '2 hours ago' } },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'New 5-star review', '.card-text': '"Fast shipping and great quality!"', '.card-time': 'Yesterday' } },
      { type: 'bottomNav', variant: 4, text: { '[contenteditable="true"]': ['Home', 'Orders', 'Add', 'Reports', 'Account'] } },
    ],

    ecommerce: [ // Shop
      { type: 'navbar', variant: 7, text: { '.nav-brand-text': 'SHOP' } },
      { type: 'hero', variant: 5, text: { '.hx-title': 'Summer Sale', '.hx-text': 'Up to 40% off selected styles. This week only.' } },
      { type: 'searchBar', variant: 1, placeholder: { '.search-minimal-input': 'Search shoes, bags, and more' } },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['New In', 'Shoes', 'Bags'] } },
      { type: 'heading', level: 'h2', text: 'Trending now' },
      { type: 'card', variant: 5, text: { '.card-title': 'Canvas Sneakers', '.card-text': 'Lightweight everyday sneakers in organic cotton.', [PRICE]: '$64' }, go: { '.card-image': 'productDetail', '.card-button': 'cart' } },
      { type: 'card', variant: 5, text: { '.card-title': 'Leather Tote', '.card-text': 'Hand-stitched and roomy enough for a 15" laptop.', [PRICE]: '$129' }, go: { '.card-image': 'productDetail', '.card-button': 'cart' } },
      { type: 'card2', variant: 1, text: { '.card-title': 'Free shipping', '.card-text': 'On every order over $50.' }, after: el => setIcon(el, '.card-icon-large i', 'fas fa-truck-fast') },
      SHOP_TABS,
    ],

    checkout: [ // pairs with Shop — same products
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Checkout' } },
      { type: 'adjustableSpace' },
      { type: 'progressTracker', ...tracker(['Bag', 'Delivery', 'Payment'], 2) },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Order summary' } },
      { type: 'listItem', variant: 5, text: { '.li-content > span:first-child': 'Canvas Sneakers', '.li-subtitle': 'Size 9 • Qty 1 • $64' } },
      { type: 'listItem', variant: 5, text: { '.li-content > span:first-child': 'Leather Tote', '.li-subtitle': 'Tan • Qty 1 • $129' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Delivery' } },
      { type: 'radio', ...radioOn, text: { [RADIO_LABEL]: 'Standard • Free • 3–5 days' } },
      { type: 'radio', text: { [RADIO_LABEL]: 'Express • $12 • Next day' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Payment' } },
      { type: 'input', variant: 4, text: { '.ui-input-label': 'Card number' }, placeholder: { '.ui-input-base': '1234 5678 9012 3456' } },
      { type: 'columns' },
      { type: 'input', variant: 4, column: 0, text: { '.ui-input-label': 'Expiry' }, placeholder: { '.ui-input-base': 'MM / YY' } },
      { type: 'input', variant: 4, column: 1, text: { '.ui-input-label': 'CVC' }, placeholder: { '.ui-input-base': '123' } },
      { type: 'checkbox', text: { 'span': 'Save card for next time' } },
      { type: 'listItem', variant: 4, text: { '.usa': ['Total', '$193'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-receipt') },
      { type: 'button', variant: 0, text: 'PLACE ORDER', go: { [BTN]: 'orderPlaced' } },
      { type: 'paragraph', text: 'Payments are secure and encrypted.', after: centered },
    ],

    wallet: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Wallet' } },
      { type: 'adjustableSpace' },
      { type: 'lineGraph', variant: 2, text: stat('Total balance', '$8,245.60', '▲ $320 this month'),
        after: graphData('lineGraph', st => { st.points = pts([7400, 7650, 7520, 7900, 7880, 8245]); }) },
      { type: 'button', variant: 7, text: { [BTN]: ['Send', 'Request', 'Top up'] }, go: { [BTN]: ['sendMoney', 'sendMoney'] } },
      { type: 'heading', level: 'h3', text: 'Spending this month' },
      { type: 'graph', variant: 1 }, // horizontal: spending by category (its default bars)
      { type: 'heading', level: 'h3', text: 'Recent transactions' },
      { type: 'listItem', variant: 4, text: { '.usa': ['Blue Bottle Coffee', '−$6.50'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-mug-hot') },
      { type: 'listItem', variant: 4, text: { '.usa': ['Salary', '+$3,200'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-building-columns') },
      { type: 'listItem', variant: 4, text: { '.usa': ['City Metro', '−$2.75'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-train-subway') },
      { type: 'listItem', variant: 4, text: { '.usa': ['Grocery Market', '−$84.20'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-basket-shopping') },
      BANK_TABS,
    ],

    pricing: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Upgrade' } },
      { type: 'adjustableSpace' },
      { type: 'heading', text: 'Go Pro' },
      { type: 'paragraph', text: 'Unlock every feature and work without limits. Try it free for 14 days.' },
      { type: 'featureComparisonCard', variant: 2, text: { '.fc-plan-name': ['Pro', 'Pro'], '.fc-features span': ['Unlimited projects', 'Team collaboration', 'Priority support', 'Unlimited projects', 'Team collaboration', 'Priority support'] }, go: { '.fc-cta': ['login', 'login'] } },
      { type: 'featureComparisonCard', variant: 0, text: {
          '.comparison-card-header': 'Compare plans',
          // column headers are plain cells in the variant markup; setup turns them into labels
          '.comparison-card-grid > [contenteditable="true"], .comparison-col-label': ['Features', 'Free', 'Pro'],
          '.comparison-card-row span': ['Unlimited projects', 'Team collaboration', 'Priority support'],
        }, after: el => {
          // Free plan lacks rows 2 and 3 (values run Free, Pro, Free, Pro…)
          const values = queryOwn(el, '.comparison-card-value i');
          [2, 4].forEach(i => { if (values[i]) values[i].className = 'fas fa-xmark'; });
        } },
      { type: 'heading', level: 'h3', text: 'Questions?' },
      { type: 'accordion', style: 'faq', text: 'What happens after my trial?' },
      { type: 'accordion', style: 'faq', text: 'Can I cancel anytime?' },
      { type: 'accordion', style: 'faq', text: 'Do you offer student discounts?' },
      { type: 'adjustableSpace' },
      { type: 'paragraph', text: 'Cancel anytime. No hidden fees.', after: centered },
    ],

    booking: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Book a Table' } },
      { type: 'adjustableSpace' },
      { type: 'card', variant: 3, text: { '.card-title': 'Osteria Bella', '.card-text': 'Italian • $$ • 0.8 mi away' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Date' } },
      { type: 'datePicker', variant: 2, text: { '.dp-m-caption': 'Select a date' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Time' } },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['6:00 PM', '7:30 PM', '9:00 PM'] } },
      qty(2, 1, { '.stepper-title': 'Party size', '.stepper-desc': 'Up to 8 guests online' }),
      { type: 'textarea', variant: 3, text: { '.ui-input-label': 'Special requests' }, placeholder: { '.ui-input-base': 'Allergies, celebrations, seating…' } },
      { type: 'listItem', variant: 4, text: { '.usa': ['Deposit (refundable)', '$20'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-receipt') },
      { type: 'button', variant: 0, text: 'CONFIRM BOOKING', go: { [BTN]: 'success' } },
    ],

    mediaGallery: [ // Video
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Watch' } },
      { type: 'adjustableSpace' },
      { type: 'video', variant: 1, text: { '.video-time': '4:12 / 18:40' } },
      { type: 'heading', level: 'h2', text: 'Chasing the Northern Lights' },
      { type: 'paragraph', text: '1.4M views • 3 days ago' },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Travel', 'Nature', '4K'] } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Up next' } },
      { type: 'video', variant: 3, text: { '.video-queue-title': 'Iceland Road Trip in 4K', '.video-queue-duration': '12:08', '.video-queue-metadata .usa': ['980K views', '1 week ago'] } },
      { type: 'video', variant: 3, text: { '.video-queue-title': 'Camping Under the Stars', '.video-queue-duration': '8:32', '.video-queue-metadata .usa': ['412K views', '2 weeks ago'] } },
      { type: 'video', variant: 3, text: { '.video-queue-title': '10 Hidden Waterfalls', '.video-queue-duration': '15:47', '.video-queue-metadata .usa': ['2.1M views', '1 month ago'] } },
      STREAM_TABS,
    ],

    nowPlaying: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Now Playing' } },
      { type: 'adjustableSpace' },
      { type: 'musicPlayer', variant: 1, text: { '[contenteditable="true"]': ['Midnight Drive', 'The Night Owls', '2:14', '4:05'] } },
      { type: 'slider', variant: 2 }, // volume
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Up next' } },
      { type: 'listItem', variant: 5, text: { '.li-content > span:first-child': 'City Lights', '.li-subtitle': 'The Night Owls • 3:48' } },
      { type: 'listItem', variant: 5, text: { '.li-content > span:first-child': 'Neon Rain', '.li-subtitle': 'Luna Park • 4:21' } },
      { type: 'listItem', variant: 5, text: { '.li-content > span:first-child': 'Slow Motion', '.li-subtitle': 'Echo Bay • 3:05' } },
      MUSIC_TABS,
    ],

    restaurant: [
      { type: 'navbar', variant: 1 }, // logo + menu
      { type: 'hero', variant: 0, text: { '.hx-title': 'Osteria Bella', '.hx-text': 'Fresh, seasonal Italian made from scratch every day.' } },
      rated(4.7, { '.rating-score': '4.7', '.rating-count': '(2,318 reviews)' }),
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Starters', 'Mains', 'Desserts'] } },
      { type: 'heading', level: 'h2', text: 'Popular dishes' },
      { type: 'card', variant: 3, text: { '.card-title': 'Pasta Carbonara', '.card-text': 'Guanciale, pecorino, egg yolk, black pepper • $18' } },
      { type: 'card', variant: 3, text: { '.card-title': 'Grilled Salmon', '.card-text': 'Lemon butter, charred broccolini • $24' } },
      { type: 'card', variant: 5, text: { '.card-title': 'Chocolate Lava Cake', '.card-text': 'Warm, gooey center with vanilla bean gelato.', [PRICE]: '$12', '.card-button': 'Add to Order' }, go: { '.card-button': 'foodCart' } },
      { type: 'heading', level: 'h2', text: 'What diners say' },
      { type: 'blockquote', variant: 2, text: { '.blockquote-element': 'Best carbonara outside of Rome. The staff made our anniversary feel special.', '.bq-name': 'Priya S.', '.bq-role': 'Local Guide' } },
      { type: 'button', variant: 0, text: 'RESERVE A TABLE', go: { [BTN]: 'booking' } },
      FOOD_TABS,
    ],

    blog: [
      { type: 'navbar', variant: 0 },
      { type: 'image', variant: 1 }, // featured image
      { type: 'heading', text: 'The Art of Creating User Interfaces' },
      { type: 'avatar', variant: 6, text: { '.avatar-text': 'Jane Designer', '.avatar-sub-txt': 'Mar 12 • 6 min read' } },
      { type: 'paragraph', text: "User interface design is at the heart of every digital product. It's what people see, touch, and ultimately judge your product by." },
      { type: 'blockquote', variant: 1, text: { '.blockquote-element': 'Good design is obvious. Great design is transparent.', '.bq-cite': '— Joe Sparano' } },
      { type: 'paragraph', text: 'A well-designed interface can make the difference between a product that succeeds and one that fails. People expect interfaces that are intuitive, responsive, and help them get things done.' },
      { type: 'heading', level: 'h2', text: 'Principles to remember' },
      { type: 'bulletedList', after: el => {
          // ships with two items — add a third, then fill all three
          el.querySelector('.add-bullet-text')?.closest('div, button')?.click();
          setTexts(el, { '.bullet-list-item-text': ['Consistency across the interface', 'Clear visual hierarchy and focus', 'Design around real user needs'] }, 'bulletedList');
        } },
      { type: 'blockquote', variant: 3, text: { '.blockquote-element': 'Design is not just what it looks like and feels like. Design is how it works.', '.bq-cite': '— Steve Jobs' } },
      { type: 'paragraph', text: 'Great UI design is iterative. Gather feedback, test with real people, and keep refining.' },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Design', 'UI/UX', 'Tips'] } },
      { type: 'footer', variant: 2 },
    ],

    education: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Learn' } },
      { type: 'hero', variant: 0, text: { '.hx-title': 'JavaScript Fundamentals', '.hx-text': 'Pick up right where you left off.' } },
      { type: 'progressBar', variant: 0 }, // 76% — the label matches the bar's default fill
      { type: 'card2', variant: 8, text: { '.card-title': '7-day streak!', '.card-text': 'A lesson every day this week', '.achievement-content > div:last-child p': '120/200 XP to next level' } },
      { type: 'heading', level: 'h2', text: 'Module 1: Getting Started' },
      { type: 'accordion', style: 'card', text: 'Week 1: JavaScript Basics' },
      { type: 'listItem', variant: 3, text: 'Lesson 1: Introduction to JavaScript', go: { [ROOT]: 'lesson' } },
      { type: 'listItem', variant: 3, text: 'Lesson 2: Variables and Data Types', go: { [ROOT]: 'lesson' } },
      { type: 'accordion', style: 'card', text: 'Week 2: Functions & Objects' },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Up next' } },
      { type: 'video', variant: 3, text: { '.video-queue-title': 'Lesson 3: Working with Arrays', '.video-queue-duration': '14:20', '.video-queue-metadata .usa': ['Module 1', '15 min'] },
        after: el => setIcon(el, '.video-queue-metadata .icon-container i', 'fas fa-book-open'), go: { [ROOT]: 'lesson' } },
      LEARN_TABS,
    ],

    mapLocation: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Explore Nearby' } },
      { type: 'adjustableSpace' },
      { type: 'searchBar', variant: 0, placeholder: { '.search-input': 'Search places...' } },
      { type: 'map', variant: 1, text: { '.map-chip-text': ['Cafe', 'Museum', 'Hotel'] } }, // nearby places — chips match the list below
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Food', 'Hotels', 'Sights'] } },
      { type: 'listItem', variant: 5, text: { '.li-content > span:first-child': 'Central Park Cafe', '.li-subtitle': '⭐ 4.5 (238) • 0.3 mi • Open now' } },
      { type: 'listItem', variant: 5, text: { '.li-content > span:first-child': 'City Museum', '.li-subtitle': '⭐ 4.8 (512) • 0.7 mi • Closes 6 PM' } },
      { type: 'listItem', variant: 5, text: { '.li-content > span:first-child': 'Riverside Hotel', '.li-subtitle': '⭐ 4.2 (189) • 1.2 mi • From $149' }, go: { [ROOT]: 'hotelDetail' } },
      { type: 'floatingActionButton', after: el => setIcon(el, '.fab-icon', 'fas fa-diamond-turn-right fab-icon') },
    ],

    calendar: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Calendar' } },
      { type: 'adjustableSpace' },
      { type: 'datePicker', variant: 3 },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Today' } },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Team standup', '.card-text': '9:00 – 9:30 AM • Zoom', '.card-time': 'In 20 min' } },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Client presentation', '.card-text': '2:30 – 4:00 PM • Room B', '.card-time': 'This afternoon' } },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Dinner with friends', '.card-text': '7:30 PM • Osteria Bella', '.card-time': 'Tonight' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Tomorrow' } },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Dentist appointment', '.card-text': '10:00 AM • City Dental', '.card-time': 'Tomorrow' } },
      WORK_TABS,
    ],

    // ── Essentials ──
    verifyCode: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Verify' } },
      { type: 'adjustableSpace' },
      bigIcon('fas fa-shield-halved', 56),
      { type: 'heading', text: 'Check your phone', after: center },
      { type: 'paragraph', text: 'We sent a 6-digit code to (555) 014-2290. Enter it below to continue.', after: center },
      { type: 'input', variant: 4, text: { '.ui-input-label': 'Verification code' }, placeholder: { '.ui-input-base': '6-digit code' } },
      { type: 'button', variant: 0, text: 'VERIFY', go: { [BTN]: 'permissions|success' } },
      { type: 'paragraph', text: "Didn't get it? Resend code in 0:42", after: centered },
    ],

    forgotPassword: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Reset Password' } },
      { type: 'adjustableSpace' },
      bigIcon('fas fa-key', 56),
      { type: 'heading', text: 'Forgot your password?', after: center },
      { type: 'paragraph', text: "Enter the email you signed up with and we'll send you a link to reset it.", after: center },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Email' }, placeholder: { '.ui-input-base': 'you@example.com' } },
      { type: 'button', variant: 0, text: 'SEND RESET LINK', go: { [BTN]: 'back' } },
      { type: 'button', variant: 3, text: 'BACK TO SIGN IN', go: { [BTN]: 'back' } },
    ],

    permissions: [
      { type: 'adjustableSpace' },
      bigIcon('fas fa-bell', 64),
      { type: 'heading', text: 'Stay in the loop', after: center },
      { type: 'paragraph', text: 'Turn on a few things so the app can work its best. You can change these anytime in Settings.', after: center },
      { type: 'toggleSwitch', variant: 1, text: { '.toggle-title': 'Notifications', '.toggle-desc': 'Replies, reminders, and updates' } },
      { type: 'toggleSwitch', variant: 1, text: { '.toggle-title': 'Location', '.toggle-desc': 'Show what’s happening near you' } },
      { type: 'toggleSwitch', variant: 1, text: { '.toggle-title': 'Contacts', '.toggle-desc': 'Find friends who are already here' } },
      { type: 'adjustableSpace' },
      { type: 'button', variant: 0, text: 'CONTINUE', go: { [BTN]: 'success' } },
      { type: 'button', variant: 3, text: 'NOT NOW', go: { [BTN]: 'success' } },
    ],

    editProfile: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Edit Profile' } },
      { type: 'adjustableSpace' },
      { type: 'image', variant: 5 }, // round profile photo
      { type: 'paragraph', text: 'Change photo', after: centered },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Name' }, placeholder: { '.ui-input-base': 'Maya Patel' } },
      { type: 'input', variant: 9, text: { '.ui-input-label': 'Username' }, placeholder: { '.ui-input-base': 'mayadesigns' } },
      { type: 'textarea', variant: 1, text: { '.ui-input-label': 'Bio' }, placeholder: { '.ui-input-base': 'Tell people a little about yourself' } },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Website' }, placeholder: { '.ui-input-base': 'mayapatel.design' } },
      { type: 'toggleSwitch', variant: 1, text: { '.toggle-title': 'Private account', '.toggle-desc': 'Only approved followers see your posts' } },
      { type: 'button', variant: 4, text: { [BTN]: ['CANCEL', 'SAVE'] }, go: { [BTN]: ['back', 'back'] } },
    ],

    search: [
      { type: 'navbar', variant: 4 }, // back + search field
      { type: 'adjustableSpace' },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Recent' } },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Running shoes', '.li-subtitle': '2 days ago' }, after: el => setIcon(el, '.li-icon i', 'fas fa-clock-rotate-left') },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Coffee near me', '.li-subtitle': 'Last week' }, after: el => setIcon(el, '.li-icon i', 'fas fa-clock-rotate-left') },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Trending' } },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Summer outfits', 'Weekend trips', 'Home office'] } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Top results' } },
      { type: 'card', variant: 2, text: { '.card-title': 'Trail Running Guide', '.card-text': 'Everything you need for your first trail race.' } },
      { type: 'card', variant: 2, text: { '.card-title': 'Best Shoes of the Year', '.card-text': 'We tested 40 pairs so you don’t have to.' } },
    ],

    emptyState: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Favorites' } },
      { type: 'adjustableSpace' },
      { type: 'adjustableSpace' },
      bigIcon('fas fa-heart', 72),
      { type: 'heading', level: 'h2', text: 'No favorites yet', after: center },
      { type: 'paragraph', text: 'Tap the heart on anything you love and it will show up here.', after: center },
      { type: 'button', variant: 0, text: 'START EXPLORING', go: { [BTN]: 'back' } },
      { type: 'adjustableSpace' },
    ],

    success: [
      { type: 'adjustableSpace' },
      { type: 'adjustableSpace' },
      bigIcon('fas fa-circle-check', 80),
      { type: 'heading', text: "You're all set!", after: center },
      { type: 'paragraph', text: "Everything's confirmed. We've sent the details to your email.", after: center },
      { type: 'card2', variant: 3, text: { '.card-title': 'What happens next', '.card-text': 'You’ll get a reminder the day before. Need to change something? You can update it anytime.' } },
      { type: 'adjustableSpace' },
      { type: 'button', variant: 0, text: 'CONTINUE', go: { [BTN]: 'propertyList|onboarding' } },
      { type: 'button', variant: 3, text: 'ADD TO CALENDAR' },
    ],

    help: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Help Center' } },
      { type: 'adjustableSpace' },
      { type: 'heading', level: 'h2', text: 'How can we help?' },
      { type: 'searchBar', variant: 0, placeholder: { '.search-input': 'Search help articles' } },
      { type: 'columns' },
      { type: 'card2', variant: 0, column: 0, text: { '.card-title': 'Account', '.card-text': 'Login, profile, security' }, after: el => setIcon(el, '.card-icon-large i', 'fas fa-user-shield') },
      { type: 'card2', variant: 0, column: 1, text: { '.card-title': 'Billing', '.card-text': 'Plans, invoices, refunds' }, after: el => setIcon(el, '.card-icon-large i', 'fas fa-credit-card') },
      { type: 'heading', level: 'h3', text: 'Popular questions' },
      { type: 'accordion', style: 'faq', text: 'How do I change my email?' },
      { type: 'accordion', style: 'faq', text: 'Can I get a refund?' },
      { type: 'accordion', style: 'faq', text: 'How do I delete my account?' },
      { type: 'card2', variant: 2, text: { '.card-title': 'Still need help?', '.card-text': 'Our team usually replies within an hour.', '.card-action-btn span': ['Chat with us', 'Email'] } },
    ],

    // ── Social ──
    explore: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Explore' } },
      { type: 'adjustableSpace' },
      { type: 'searchBar', variant: 1, placeholder: { '.search-minimal-input': 'Search people, places, tags' } },
      shelf(3, ['For You', 'Travel', 'Food', 'Art', 'Fitness']),
      { type: 'imgGallery', variant: 2, go: { '.img-gallery-grid-item': ['postDetail', 'postDetail', 'postDetail', 'postDetail', 'postDetail', 'postDetail'] } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Suggested for you' } },
      { type: 'listItem', variant: 6, text: { '.usa': ['Lena Ortiz', 'Followed by Sam'], '.li-action span': 'Follow' }, go: { [ROOT]: 'template1' } },
      { type: 'listItem', variant: 6, text: { '.usa': ['Kai Nakamura', 'New to the app'], '.li-action span': 'Follow' }, go: { [ROOT]: 'template1' } },
      SOCIAL_TABS,
    ],

    postDetail: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Post' } },
      { type: 'adjustableSpace' },
      { type: 'card', variant: 4, text: { '.card-social-name': 'Alex Rivera', '.card-social-time': '12 min ago', '.card-text': 'Golden hour at the pier never gets old 🌅' }, go: { '.card-avatar': 'template1' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': '24 comments' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: 'Sam Chen', '.li-subtitle': 'This is unreal. Where exactly is this?' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: 'Priya Shah', '.li-subtitle': 'Adding this to my weekend list 😍' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: 'Alex Rivera', '.li-subtitle': '@Sam Santa Monica, right before sunset!' } },
      { type: 'chatInput', variant: 4 }, // pinned to the bottom
    ],

    createPost: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'New Post' } },
      { type: 'adjustableSpace' },
      { type: 'avatar', variant: 6, text: { '.avatar-text': 'Maya Patel', '.avatar-sub-txt': 'Posting to Everyone' } },
      { type: 'textarea', variant: 3, text: { '.ui-input-label': 'Caption' }, placeholder: { '.ui-input-base': "What's on your mind?" } },
      { type: 'image', variant: 2 }, // two photos
      { type: 'listItem', variant: 3, text: 'Tag people', after: el => setIcon(el, '.li-icon i', 'fas fa-user-tag') },
      { type: 'listItem', variant: 3, text: 'Add location', after: el => setIcon(el, '.li-icon i', 'fas fa-location-dot') },
      { type: 'toggleSwitch', variant: 1, text: { '.toggle-title': 'Allow comments', '.toggle-desc': 'Anyone can reply to this post' } },
      { type: 'button', variant: 4, text: { [BTN]: ['SAVE DRAFT', 'POST'] }, go: { [BTN]: ['back', 'social'] } },
    ],

    chatInbox: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Chats' } },
      { type: 'adjustableSpace' },
      { type: 'searchBar', variant: 1, placeholder: { '.search-minimal-input': 'Search chats' } },
      shelf(2, ['Your story', 'Sam', 'Priya', 'Leo', 'Ava']),
      { type: 'listItem', variant: 6, text: { '.usa': ['John Smith', 'Definitely. 7:30 on the rooftop.'], '.li-action span': '2m' }, go: { [ROOT]: 'messaging' } },
      { type: 'listItem', variant: 6, text: { '.usa': ['Design Team', 'Mia: New mockups are up 🎨'], '.li-action span': '1h' }, go: { [ROOT]: 'messaging' } },
      { type: 'listItem', variant: 6, text: { '.usa': ['Priya Shah', 'Haha that’s amazing'], '.li-action span': '3h' }, go: { [ROOT]: 'messaging' } },
      { type: 'listItem', variant: 6, text: { '.usa': ['Mom', 'Call me when you land ❤️'], '.li-action span': 'Mon' }, go: { [ROOT]: 'messaging' } },
      SOCIAL_TABS,
    ],

    // ── Shopping ──
    productDetail: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Canvas Sneakers' } },
      { type: 'imgGallery', variant: 5 }, // pager with thumbnails
      { type: 'heading', level: 'h2', text: 'Canvas Sneakers' },
      rated(4.8, { '.rating-score': '4.8', '.rating-count': '(1,204 reviews)' }),
      { type: 'heading', level: 'h3', text: '$64' },
      { type: 'paragraph', text: 'Lightweight everyday sneakers in organic cotton canvas with a cushioned recycled-rubber sole.' },
      { type: 'slider', variant: 3 }, // size steps
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Chalk', 'Black', 'Sage'] } },
      { type: 'button', variant: 0, text: 'ADD TO BAG', go: { [BTN]: 'cart' } },
      { type: 'accordion', style: 'card', text: 'Details & materials' },
      { type: 'accordion', style: 'card', text: 'Shipping & returns' },
      { type: 'heading', level: 'h3', text: 'Reviews' },
      rated(4.8, { '.rating-big': '4.8', '.rating-count': '1,204 ratings' }, 3),
      { type: 'blockquote', variant: 2, text: { '.blockquote-element': 'Comfortable right out of the box. I wear them every day.', '.bq-name': 'Jamie R.', '.bq-role': 'Verified buyer' } },
    ],

    cart: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Your Bag' } },
      { type: 'adjustableSpace' },
      { type: 'card', variant: 2, text: { '.card-title': 'Canvas Sneakers', '.card-text': 'Chalk · Size 9 — $64' } },
      qty(1),
      { type: 'card', variant: 2, text: { '.card-title': 'Leather Tote', '.card-text': 'Tan — $129' } },
      qty(1),
      { type: 'input', variant: 9, text: { '.ui-input-label': 'Promo code' }, placeholder: { '.ui-input-base': 'SUMMER20' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Summary' } },
      { type: 'listItem', variant: 4, text: { '.usa': ['Subtotal', '$193'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-bag-shopping') },
      { type: 'listItem', variant: 4, text: { '.usa': ['Shipping', 'Free'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-truck-fast') },
      { type: 'button', variant: 0, text: 'CHECKOUT · $193', go: { [BTN]: 'checkout' } },
      SHOP_TABS,
    ],

    orderPlaced: [
      { type: 'adjustableSpace' },
      { type: 'adjustableSpace' },
      bigIcon('fas fa-circle-check', 80),
      { type: 'heading', text: 'Order placed!', after: center },
      { type: 'paragraph', text: 'Thanks, Jordan. Order #1042 is confirmed and a receipt is on its way to your inbox.', after: center },
      { type: 'card2', variant: 0, text: { '.card-title': 'Arriving Thu, Jun 12', '.card-text': 'Standard delivery to 221 Pine St, Portland' }, after: el => setIcon(el, '.card-icon-large i', 'fas fa-truck-fast') },
      { type: 'adjustableSpace' },
      { type: 'button', variant: 0, text: 'TRACK ORDER', go: { [BTN]: 'orderTracking' } },
      { type: 'button', variant: 3, text: 'CONTINUE SHOPPING', go: { [BTN]: 'ecommerce' } },
    ],

    orderTracking: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Order #1042' } },
      { type: 'adjustableSpace' },
      { type: 'card2', variant: 7, text: { '.card-title': 'Out for delivery', '.card-text': 'Arriving today by 8 PM', '.card-simple > div > span': '🚚' } },
      { type: 'progressTracker', ...tracker(['Ordered', 'Shipped', 'Delivered'], 1) },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Updates' } },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Out for delivery', '.card-text': 'Portland, OR', '.card-time': '9:12 AM' } },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Arrived at local facility', '.card-text': 'Portland, OR', '.card-time': 'Yesterday' } },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Shipped', '.card-text': 'Reno, NV', '.card-time': 'Jun 9' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: 'Canvas Sneakers + 1 more', '.li-subtitle': '2 items · $193' } },
      { type: 'button', variant: 4, text: { [BTN]: ['GET HELP', 'WRITE A REVIEW'] }, go: { [BTN]: [null, 'writeReview'] } },
      SHOP_TABS,
    ],

    // ── Food & Drink ──
    foodHome: [
      { type: 'navbar', variant: 6, text: { '.nav-brand-text': 'Deliver to Home ▾' } },
      { type: 'adjustableSpace' },
      { type: 'searchBar', variant: 1, placeholder: { '.search-minimal-input': 'Search dishes or restaurants' } },
      shelf(0, ['All', 'Pizza', 'Sushi', 'Burgers', 'Healthy', 'Dessert'], ['fa-utensils', 'fa-pizza-slice', 'fa-fish', 'fa-burger', 'fa-leaf', 'fa-ice-cream']),
      { type: 'card2', variant: 1, text: { '.card-title': '$0 delivery fee', '.card-text': 'On your first 3 orders' }, after: el => setIcon(el, '.card-icon-large i', 'fas fa-motorcycle') },
      { type: 'heading', level: 'h3', text: 'Near you' },
      { type: 'card', variant: 0, text: { '.card-title': 'Osteria Bella', '.card-text': 'Italian · ⭐ 4.8 · 20–30 min · $1.99 delivery' }, go: { [ROOT]: 'restaurant' } },
      { type: 'card', variant: 0, text: { '.card-title': 'Sakura Sushi Bar', '.card-text': 'Japanese · ⭐ 4.6 · 25–35 min · Free delivery' }, go: { [ROOT]: 'restaurant' } },
      { type: 'card', variant: 2, text: { '.card-title': 'Green Bowl Co.', '.card-text': 'Salads & bowls · 15–25 min' }, go: { [ROOT]: 'restaurant' } },
      FOOD_TABS,
    ],

    foodCart: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Your Order' } },
      { type: 'adjustableSpace' },
      { type: 'avatar', variant: 6, text: { '.avatar-text': 'Osteria Bella', '.avatar-sub-txt': 'Delivery in 20–30 min' } },
      { type: 'listItem', variant: 4, text: { '.usa': ['Pasta Carbonara', '$18'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-bowl-food') },
      qty(1, 2),
      { type: 'listItem', variant: 4, text: { '.usa': ['Chocolate Lava Cake', '$12'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-cake-candles') },
      qty(1, 2),
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Tip your courier' } },
      { type: 'button', variant: 7, text: { [BTN]: ['10%', '15%', '20%'] } },
      { type: 'textarea', variant: 3, text: { '.ui-input-label': 'Delivery note' }, placeholder: { '.ui-input-base': 'Gate code, leave at door…' } },
      { type: 'listItem', variant: 4, text: { '.usa': ['Total', '$36.49'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-receipt') },
      { type: 'button', variant: 0, text: 'PLACE ORDER', go: { [BTN]: 'deliveryTracking' } },
    ],

    deliveryTracking: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'On the Way' } },
      { type: 'map', variant: 2, text: { '.map-eta-time': '12 min', '.map-eta-sub': 'Marco is 1.8 mi away' } },
      { type: 'progressTracker', ...tracker(['Confirmed', 'Preparing', 'On the way'], 2) },
      { type: 'avatar', variant: 10, text: { '.avatar-text': 'Marco · Courier', '.avatar-phone': '(555) 201-8890' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Your order' } },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Osteria Bella', '.li-subtitle': 'Pasta Carbonara, Chocolate Lava Cake' }, after: el => setIcon(el, '.li-icon i', 'fas fa-store') },
      { type: 'button', variant: 3, text: 'DELIVERED? RATE YOUR ORDER', go: { [BTN]: 'rateOrder' } },
      FOOD_TABS,
    ],

    recipe: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Recipe' } },
      { type: 'image', variant: 1 },
      { type: 'heading', text: 'Lemon Garlic Pasta' },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['25 min', 'Serves 4', 'Vegetarian'] } },
      { type: 'paragraph', text: 'A bright, weeknight pasta that comes together in the time it takes to boil water.' },
      { type: 'tabs', style: 'segmented', text: { '.ui-tab': ['Ingredients', 'Steps'] } },
      { type: 'checkbox', text: { 'span': '12 oz spaghetti' }, tab: 0 },
      { type: 'checkbox', text: { 'span': '4 cloves garlic, sliced' }, tab: 0 },
      { type: 'checkbox', text: { 'span': '1 lemon, zest and juice' }, tab: 0 },
      { type: 'checkbox', text: { 'span': 'Parmesan and parsley' }, tab: 0 },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Boil the pasta', '.card-text': 'Salt the water well and cook until al dente.', '.card-time': '10 min' }, tab: 1 },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Make the sauce', '.card-text': 'Sizzle garlic in olive oil, add lemon and pasta water.', '.card-time': '5 min' }, tab: 1 },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Toss and serve', '.card-text': 'Finish with parmesan, parsley, and black pepper.', '.card-time': '2 min' }, tab: 1 },
    ],

    // ── Finance ──
    sendMoney: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Send Money' } },
      { type: 'adjustableSpace' },
      { type: 'searchBar', variant: 1, placeholder: { '.search-minimal-input': 'Name, @username, or phone' } },
      shelf(2, ['Sam', 'Priya', 'Leo', 'Mom', 'Ava']),
      { type: 'avatar', variant: 6, text: { '.avatar-text': 'Sam Chen', '.avatar-sub-txt': '@samchen' } },
      { type: 'input', variant: 9, text: { '.ui-input-label': 'Amount' }, placeholder: { '.ui-input-base': '0.00' },
        after: el => setIcon(el, '.ui-input-prefix i', 'fas fa-dollar-sign') },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['$10', '$25', '$50'] } },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Note' }, placeholder: { '.ui-input-base': 'Pizza night 🍕' } },
      { type: 'listItem', variant: 4, text: { '.usa': ['From Checking ••4821', '$8,245.60'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-building-columns') },
      { type: 'button', variant: 0, text: 'SEND', go: { [BTN]: 'transferDone' } },
    ],

    transferDone: [
      { type: 'adjustableSpace' },
      { type: 'adjustableSpace' },
      bigIcon('fas fa-paper-plane', 72),
      { type: 'heading', text: '$25.00 sent', after: center },
      { type: 'paragraph', text: 'Sam Chen will get it right away. Pizza night 🍕', after: center },
      { type: 'listItem', variant: 4, text: { '.usa': ['To', 'Sam Chen'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-user') },
      { type: 'listItem', variant: 4, text: { '.usa': ['From', 'Checking ••4821'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-building-columns') },
      { type: 'listItem', variant: 4, text: { '.usa': ['Date', 'Jun 10, 9:41 AM'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-calendar') },
      { type: 'adjustableSpace' },
      { type: 'button', variant: 0, text: 'DONE', go: { [BTN]: 'wallet' } },
      { type: 'button', variant: 3, text: 'SHARE RECEIPT' },
    ],

    cards: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Cards' } },
      { type: 'adjustableSpace' },
      { type: 'card2', variant: 1, text: { '.card-title': 'Everyday Debit', '.card-text': '•••• •••• •••• 4821 · Exp 08/28' }, after: el => setIcon(el, '.card-icon-large i', 'fab fa-cc-visa') },
      { type: 'button', variant: 7, text: { [BTN]: ['Freeze', 'Details', 'PIN'] } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Monthly limit' } },
      progress(42),
      { type: 'paragraph', text: '$1,260 of $3,000 spent this month' },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Controls' } },
      { type: 'toggleSwitch', variant: 3, text: { '.toggle-row-label': ['Online payments', 'Contactless', 'ATM withdrawals'] },
        after: el => setIcons(el, '.toggle-row-icon i', ['fas fa-globe', 'fas fa-wifi', 'fas fa-money-bill']) },
      { type: 'listItem', variant: 3, text: 'Order a new card', after: el => setIcon(el, '.li-icon i', 'fas fa-credit-card') },
      BANK_TABS,
    ],

    budget: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Budget' } },
      { type: 'adjustableSpace' },
      { type: 'tabs', style: 'pills', text: { '.ui-tab': ['June', 'May'] }, end: true },
      { type: 'pieGraph', variant: 1, text: { '.pie-graph-center-value': '$2,140', '.pie-graph-center-label': 'of $3,000' },
        after: graphData('pieGraph', st => { ['Housing', 'Food', 'Transport', 'Fun'].forEach((l, i) => { if (st.segments[i]) st.segments[i].label = l; }); }) },
      { type: 'heading', level: 'h3', text: 'Categories' },
      { type: 'listItem', variant: 4, text: { '.usa': ['Groceries', '$412 / $500'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-basket-shopping') },
      progress(82, 0),
      { type: 'listItem', variant: 4, text: { '.usa': ['Dining out', '$268 / $250'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-utensils') },
      progress(100, 0),
      { type: 'listItem', variant: 4, text: { '.usa': ['Transport', '$96 / $200'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-train-subway') },
      progress(48, 0),
      { type: 'alert', variant: 2, text: 'You’re $18 over on dining out this month.' },
      BANK_TABS,
    ],

    stockDetail: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Invest' } },
      { type: 'adjustableSpace' },
      { type: 'lineGraph', variant: 2, text: stat('Portfolio', '$24,310.18', '▲ 2.4% today'),
        after: graphData('lineGraph', st => { st.points = pts([21800, 22400, 22100, 23050, 23600, 24310]); }) },
      { type: 'tabs', style: 'segmented', text: { '.ui-tab': ['1 Month', '1 Year'] }, end: true },
      { type: 'heading', level: 'h3', text: 'Holdings' },
      { type: 'listItem', variant: 4, text: { '.usa': ['AAPL · 12 shares', '+1.8%'] }, after: el => setIcon(el, '.icon-container i', 'fab fa-apple') },
      { type: 'listItem', variant: 4, text: { '.usa': ['VTI · 30 shares', '+0.9%'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-chart-line') },
      { type: 'listItem', variant: 4, text: { '.usa': ['BTC · 0.05', '−3.2%'] }, after: el => setIcon(el, '.icon-container i', 'fab fa-bitcoin') },
      { type: 'button', variant: 4, text: { [BTN]: ['SELL', 'BUY'] } },
      BANK_TABS,
    ],

    // ── Health & Fitness ──
    fitnessHome: [
      { type: 'navbar', variant: 6, text: { '.nav-brand-text': 'Today' } },
      { type: 'adjustableSpace' },
      { type: 'heading', level: 'h2', text: 'Morning, Jordan 💪' },
      { type: 'columns' },
      { type: 'card2', variant: 6, column: 0, text: { 'h1': '8,432', '.card-text': 'Steps' }, after: el => setIcon(el, '.card-stat-header i', 'fas fa-shoe-prints') },
      { type: 'card2', variant: 6, column: 1, text: { 'h1': '540', '.card-text': 'Calories' }, after: el => setIcon(el, '.card-stat-header i', 'fas fa-fire') },
      { type: 'paragraph', text: 'Daily goal · 84%' },
      progress(84, 3),
      { type: 'heading', level: 'h3', text: 'Today’s workout' },
      { type: 'card', variant: 7, text: { '.card-title': 'Full Body Strength', '.card-text': '45 min · 6 exercises · Intermediate' }, go: { [ROOT]: 'workout' } },
      { type: 'heading', level: 'h3', text: 'This week' },
      { type: 'graph', variant: 0 },
      FIT_TABS,
    ],

    workout: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Full Body Strength' } },
      { type: 'video', variant: 1, text: { '.video-time': '0:00 / 45:00' } },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['45 min', 'Intermediate', 'Dumbbells'] } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Exercises' } },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Goblet Squats', '.li-subtitle': '3 sets × 12 reps' }, after: el => setIcon(el, '.li-icon i', 'fas fa-dumbbell') },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Push-ups', '.li-subtitle': '3 sets × 15 reps' }, after: el => setIcon(el, '.li-icon i', 'fas fa-dumbbell') },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Bent-over Rows', '.li-subtitle': '3 sets × 10 reps' }, after: el => setIcon(el, '.li-icon i', 'fas fa-dumbbell') },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Plank', '.li-subtitle': '3 × 45 seconds' }, after: el => setIcon(el, '.li-icon i', 'fas fa-stopwatch') },
      { type: 'button', variant: 0, text: 'START WORKOUT', go: { [BTN]: 'workoutDone' } },
      FIT_TABS,
    ],

    workoutDone: [
      { type: 'adjustableSpace' },
      bigIcon('fas fa-trophy', 72),
      { type: 'heading', text: 'Workout complete!', after: center },
      { type: 'paragraph', text: 'Full Body Strength · 46 min', after: center },
      { type: 'columns' },
      { type: 'card2', variant: 6, column: 0, text: { 'h1': '412', '.card-text': 'Calories' }, after: el => setIcon(el, '.card-stat-header i', 'fas fa-fire') },
      { type: 'card2', variant: 6, column: 1, text: { 'h1': '132', '.card-text': 'Avg BPM' }, after: el => setIcon(el, '.card-stat-header i', 'fas fa-heart-pulse') },
      { type: 'card2', variant: 8, text: { '.card-title': '5-day streak!', '.card-text': 'Your longest this month', '.achievement-content > div:last-child p': '320/500 XP to next level' } },
      { type: 'textarea', variant: 3, text: { '.ui-input-label': 'How did it feel?' }, placeholder: { '.ui-input-base': 'Add a note…' } },
      { type: 'button', variant: 0, text: 'DONE', go: { [BTN]: 'fitnessHome' } },
    ],

    nutrition: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Nutrition' } },
      { type: 'adjustableSpace' },
      { type: 'lineGraph', variant: 2, text: stat('Calories left', '1,240', 'of 2,100 kcal'),
        after: graphData('lineGraph', st => { st.points = pts([2050, 1980, 2200, 2100, 1900, 860]); }) },
      { type: 'paragraph', text: 'Protein · 92 / 140 g' },
      progress(66),
      { type: 'paragraph', text: 'Carbs · 140 / 220 g' },
      progress(64),
      { type: 'paragraph', text: 'Fat · 38 / 70 g' },
      progress(54),
      { type: 'heading', level: 'h3', text: 'Meals' },
      { type: 'listItem', variant: 4, text: { '.usa': ['Breakfast · Oats & berries', '420'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-mug-hot') },
      { type: 'listItem', variant: 4, text: { '.usa': ['Lunch · Chicken bowl', '640'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-bowl-food') },
      { type: 'listItem', variant: 3, text: 'Add dinner', after: el => setIcon(el, '.li-icon i', 'fas fa-plus') },
      FIT_TABS,
    ],

    habits: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Habits' } },
      { type: 'adjustableSpace' },
      { type: 'datePicker', variant: 1 },
      { type: 'card2', variant: 7, text: { '.card-title': 'Today', '.card-text': '3 of 5 habits done', '.card-simple > div > span': '60%' } },
      { type: 'checkbox', text: { 'span': '💧 Drink 8 glasses of water' } },
      { type: 'checkbox', text: { 'span': '📖 Read 20 pages' } },
      { type: 'checkbox', text: { 'span': '🧘 Meditate 10 minutes' } },
      { type: 'checkbox', text: { 'span': '🚶 Walk 10,000 steps' } },
      { type: 'checkbox', text: { 'span': '😴 In bed by 11 PM' } },
      { type: 'card2', variant: 8, text: { '.card-title': '12-day streak', '.card-text': 'Keep it going!', '.achievement-content > div:last-child p': 'Best: 21 days' } },
      FIT_TABS,
    ],

    meditation: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Mind' } },
      { type: 'hero', variant: 10, text: { '.hx-title': 'Sleep better tonight', '.hx-text': 'A 10-minute wind-down to quiet a busy mind.', '.hx-btn': 'Begin' } },
      { type: 'musicPlayer', variant: 1, text: { '[contenteditable="true"]': ['Evening Wind-down', 'Guided · 10 min', '3:20', '10:00'] } },
      { type: 'heading', level: 'h3', text: 'Sounds' },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Rain', 'Ocean', 'Forest'] } },
      { type: 'heading', level: 'h3', text: 'Courses' },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Breathe to relax', '.li-subtitle': '5 sessions · 5 min each' }, after: el => setIcon(el, '.li-icon i', 'fas fa-wind') },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Focus at work', '.li-subtitle': '7 sessions · 8 min each' }, after: el => setIcon(el, '.li-icon i', 'fas fa-brain') },
      FIT_TABS,
    ],

    // ── Travel ──
    travelHome: [
      { type: 'hero', variant: 13, text: { '.hx-greeting': 'Hi, Alex 👋', '.hx-title': 'Where to next?', '.hx-chip': ['Beaches', 'Mountains', 'Cities'] } },
      { type: 'heading', level: 'h3', text: 'Featured stays' },
      { type: 'card', variant: 0, text: { '.card-title': 'Casa Azul, Lisbon', '.card-text': '⭐ 4.9 · Entire apartment · $142 / night' }, go: { [ROOT]: 'hotelDetail' } },
      { type: 'card', variant: 0, text: { '.card-title': 'Cliffside Cabin, Big Sur', '.card-text': '⭐ 4.8 · Ocean views · $260 / night' }, go: { [ROOT]: 'hotelDetail' } },
      { type: 'heading', level: 'h3', text: 'Popular destinations' },
      { type: 'imgGallery', variant: 3 },
      TRAVEL_TABS,
    ],

    hotelDetail: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Casa Azul' } },
      { type: 'imgGallery', variant: 4 },
      { type: 'heading', level: 'h2', text: 'Casa Azul, Lisbon' },
      rated(4.9, { '.rating-score': '4.9', '.rating-count': '(312 reviews) · Alfama' }),
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Wi-Fi', 'Kitchen', 'Balcony'] } },
      { type: 'paragraph', text: 'A sunny two-bedroom flat with river views, tiled floors, and a balcony made for slow breakfasts.' },
      { type: 'map', variant: 3, text: { '.map-location-name': 'Casa Azul', '.map-location-address': 'Rua dos Remédios 42, Lisbon' }, go: { [ROOT]: 'mapLocation' } },
      { type: 'blockquote', variant: 2, text: { '.blockquote-element': 'The view from the balcony at sunset was worth the trip alone.', '.bq-name': 'Hannah K.', '.bq-role': 'Stayed in May' } },
      { type: 'listItem', variant: 4, text: { '.usa': ['$142 / night', 'Jun 14 – 18'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-calendar') },
      qty(2, 1, { '.stepper-title': 'Guests', '.stepper-desc': 'Up to 4 · Children welcome' }),
      { type: 'button', variant: 0, text: 'RESERVE', go: { [BTN]: 'tripItinerary' } },
    ],

    tripItinerary: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Lisbon Trip' } },
      { type: 'adjustableSpace' },
      { type: 'card2', variant: 7, text: { '.card-title': 'Jun 14 – 18', '.card-text': '4 nights · 2 travelers', '.card-simple > div > span': 'in 5 days' } },
      { type: 'tabs', style: 'underline', text: { '.ui-tab': ['Day 1', 'Day 2'] } },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Flight to Lisbon', '.card-text': 'TAP 202 · SFO → LIS', '.card-time': '7:05 AM' }, go: { [ROOT]: 'boardingPass' }, tab: 0 },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Check in at Casa Azul', '.card-text': 'Rua dos Remédios 42', '.card-time': '3:00 PM' }, tab: 0 },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Dinner in Bairro Alto', '.card-text': 'Table for 2 at Taberna', '.card-time': '8:30 PM' }, tab: 0 },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Tram 28 + castle', '.card-text': 'São Jorge Castle tickets', '.card-time': '10:00 AM' }, tab: 1 },
      { type: 'listItem', variant: 11, text: { '.tl-title': 'Pastéis de Belém', '.card-text': 'Get there before noon', '.card-time': '1:00 PM' }, tab: 1 },
      TRAVEL_TABS,
    ],

    boardingPass: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Boarding Pass' } },
      { type: 'adjustableSpace' },
      { type: 'card2', variant: 1, text: { '.card-title': 'SFO → LIS', '.card-text': 'TAP Air Portugal · Flight TP 202' }, after: el => setIcon(el, '.card-icon-large i', 'fas fa-plane-departure') },
      { type: 'columns' },
      { type: 'listItem', variant: 4, column: 0, text: { '.usa': ['Gate', 'G12'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-door-open') },
      { type: 'listItem', variant: 4, column: 1, text: { '.usa': ['Seat', '14A'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-chair') },
      { type: 'columns' },
      { type: 'listItem', variant: 4, column: 0, text: { '.usa': ['Boards', '6:25'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-clock') },
      { type: 'listItem', variant: 4, column: 1, text: { '.usa': ['Group', '3'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-users') },
      bigIcon('fas fa-qrcode', 140),
      { type: 'paragraph', text: 'Show this code at security and the gate.', after: centered },
      { type: 'alert', variant: 0, text: 'Boarding starts in 1 hr 20 min.' },
      TRAVEL_TABS,
    ],

    rideRequest: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Choose a Ride' } },
      { type: 'map', variant: 2, text: { '.map-eta-time': '18 min', '.map-eta-sub': '6.2 mi · to Union Station' } },
      { type: 'radio', ...radioOn, text: { [RADIO_LABEL]: 'Standard · 4 seats · $14.20' } },
      { type: 'radio', text: { [RADIO_LABEL]: 'Comfort · Newer cars · $18.90' } },
      { type: 'radio', text: { [RADIO_LABEL]: 'XL · 6 seats · $24.50' } },
      { type: 'listItem', variant: 3, text: 'Visa •••• 4821', after: el => setIcon(el, '.li-icon i', 'fas fa-credit-card') },
      { type: 'button', variant: 0, text: 'REQUEST STANDARD', go: { [BTN]: 'rideTracking' } },
    ],

    rideTracking: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Driver On the Way' } },
      { type: 'map', variant: 2, text: { '.map-eta-time': '3 min', '.map-eta-sub': 'Daniel is 0.6 mi away' } },
      { type: 'avatar', variant: 10, text: { '.avatar-text': 'Daniel · Prius 8KJR221', '.avatar-phone': '(555) 310-4471' } },
      { type: 'progressTracker', ...tracker(['Matched', 'Arriving', 'On trip'], 1) },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Union Station', '.li-subtitle': 'Drop-off · ETA 9:58 AM' }, after: el => setIcon(el, '.li-icon i', 'fas fa-location-dot') },
      { type: 'button', variant: 4, text: { [BTN]: ['CANCEL RIDE', 'SHARE TRIP'] }, go: { [BTN]: ['back'] } },
      { type: 'button', variant: 3, text: 'ARRIVED? RATE YOUR RIDE', go: { [BTN]: 'rateRide' } },
    ],

    // ── Media ──
    streamingHome: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'FLIX' } },
      { type: 'hero', variant: 7, text: { '.hx-eyebrow': 'New season', '.hx-title': 'The Long Coast', '.hx-text': 'Two strangers, one road trip, and a secret neither can outrun.', '.hx-btn': '▶ Play' }, go: { '.hx-btn': 'showDetail' } },
      shelf(3, ['Series', 'Movies', 'Kids', 'Docs']),
      { type: 'heading', level: 'h3', text: 'Continue watching' },
      { type: 'video', variant: 3, text: { '.video-queue-title': 'The Long Coast · S2 E3', '.video-queue-duration': '38:10', '.video-queue-metadata .usa': ['21 min left', 'Drama'] }, go: { [ROOT]: 'showDetail' } },
      { type: 'heading', level: 'h3', text: 'Trending now' },
      { type: 'imgGallery', variant: 3, go: { '.img-gallery-strip-thumb': ['showDetail', 'showDetail', 'showDetail'] } },
      { type: 'heading', level: 'h3', text: 'Because you watched Northern Lights' },
      { type: 'imgGallery', variant: 3 },
      STREAM_TABS,
    ],

    showDetail: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'The Long Coast' } },
      { type: 'video', variant: 0, text: { '.video-title': 'Season 2 Trailer', '.video-duration': '2:14' } },
      { type: 'heading', level: 'h2', text: 'The Long Coast' },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['2025', 'TV-14', '2 Seasons'] } },
      { type: 'button', variant: 4, text: { [BTN]: ['+ MY LIST', '▶ PLAY'] }, go: { [BTN]: [null, 'mediaGallery'] } },
      { type: 'paragraph', text: 'Two strangers share a ride down Highway 1 and discover they are running from the same thing.' },
      { type: 'tabs', style: 'underline', text: { '.ui-tab': ['Season 2', 'Season 1'] } },
      { type: 'video', variant: 3, text: { '.video-queue-title': 'E1 · Fog Line', '.video-queue-duration': '52:04', '.video-queue-metadata .usa': ['Watched', 'Drama'] }, go: { [ROOT]: 'mediaGallery' }, tab: 0 },
      { type: 'video', variant: 3, text: { '.video-queue-title': 'E2 · Big Sur', '.video-queue-duration': '48:40', '.video-queue-metadata .usa': ['Watched', 'Drama'] }, go: { [ROOT]: 'mediaGallery' }, tab: 0 },
      { type: 'video', variant: 3, text: { '.video-queue-title': 'E3 · No Service', '.video-queue-duration': '38:10', '.video-queue-metadata .usa': ['21 min left', 'Drama'] }, go: { [ROOT]: 'mediaGallery' }, tab: 0 },
      { type: 'video', variant: 3, text: { '.video-queue-title': 'E1 · Pilot', '.video-queue-duration': '55:12', '.video-queue-metadata .usa': ['Season 1', 'Drama'] }, go: { [ROOT]: 'mediaGallery' }, tab: 1 },
      STREAM_TABS,
    ],

    musicLibrary: [
      { type: 'navbar', variant: 6, text: { '.nav-brand-text': 'Library' } },
      { type: 'adjustableSpace' },
      shelf(3, ['Playlists', 'Albums', 'Artists', 'Downloaded']),
      { type: 'listItem', variant: 7, text: 'Liked Songs · 482 songs', after: el => setIcon(el, '.li-feature-icon-con i', 'fas fa-heart'), go: { [ROOT]: 'nowPlaying' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: 'Late Night Drive', '.li-subtitle': 'Playlist · 38 songs' }, go: { [ROOT]: 'nowPlaying' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: 'Focus Flow', '.li-subtitle': 'Playlist · 112 songs' }, go: { [ROOT]: 'nowPlaying' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: 'Neon Rain', '.li-subtitle': 'Album · Luna Park' }, go: { [ROOT]: 'nowPlaying' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Recently played' } },
      { type: 'imgGallery', variant: 3, go: { '.img-gallery-strip-thumb': ['nowPlaying', 'nowPlaying', 'nowPlaying'] } },
      MUSIC_TABS,
    ],

    podcast: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Podcast' } },
      { type: 'adjustableSpace' },
      { type: 'card', variant: 2, text: { '.card-title': 'Build Mode', '.card-text': 'Weekly conversations with people who make things. 214 episodes.' } },
      { type: 'button', variant: 4, text: { [BTN]: ['FOLLOW', '▶ LATEST'] }, go: { [BTN]: [null, 'nowPlaying'] } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Episodes' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: '#214 · Shipping your first app', '.li-subtitle': 'Jun 9 · 48 min' }, go: { [ROOT]: 'nowPlaying' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: '#213 · Design systems that last', '.li-subtitle': 'Jun 2 · 55 min' }, go: { [ROOT]: 'nowPlaying' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: '#212 · Pricing for indie makers', '.li-subtitle': 'May 26 · 41 min' }, go: { [ROOT]: 'nowPlaying' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: '#211 · From side project to company', '.li-subtitle': 'May 19 · 62 min' }, go: { [ROOT]: 'nowPlaying' } },
      MUSIC_TABS,
    ],

    newsHome: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'The Daily' } },
      shelf(1, ['Top Stories', 'World', 'Business', 'Tech', 'Sports']),
      { type: 'hero', variant: 1, text: { '.hx-tag': 'Climate', '.hx-meta': '6 min read', '.hx-title': 'Cities race to cool their streets', '.hx-text': 'From white roofs to pocket forests, here’s what’s working.' }, go: { [ROOT]: 'blog' } },
      { type: 'card', variant: 3, text: { '.card-title': 'Markets rally on rate-cut hopes', '.card-text': 'Business · 2h ago' }, go: { [ROOT]: 'blog' } },
      { type: 'card', variant: 3, text: { '.card-title': 'The quiet return of the flip phone', '.card-text': 'Tech · 4h ago' }, go: { [ROOT]: 'blog' } },
      { type: 'card', variant: 3, text: { '.card-title': 'Underdogs take the title in overtime', '.card-text': 'Sports · 5h ago' }, go: { [ROOT]: 'blog' } },
      { type: 'footer', variant: 2 },
    ],

    // ── Productivity ──
    tasks: [
      { type: 'navbar', variant: 6, text: { '.nav-brand-text': 'Today' } },
      { type: 'adjustableSpace' },
      { type: 'card2', variant: 7, text: { '.card-title': 'Tuesday, June 10', '.card-text': '3 of 7 tasks done', '.card-simple > div > span': '43%' } },
      progress(43, 3),
      { type: 'tabs', style: 'pills', text: { '.ui-tab': ['Today', 'Upcoming'] } },
      { type: 'checkbox', text: { 'span': 'Review launch checklist' }, tab: 0 },
      { type: 'checkbox', text: { 'span': 'Reply to Sam about pricing' }, tab: 0 },
      { type: 'checkbox', text: { 'span': 'Draft Q3 roadmap' }, tab: 0 },
      { type: 'listItem', variant: 3, text: 'Design review prep · 2 PM', after: el => setIcon(el, '.li-icon i', 'fas fa-flag'), go: { [ROOT]: 'taskDetail' }, tab: 0 },
      { type: 'listItem', variant: 3, text: 'Send invoices · Thu', after: el => setIcon(el, '.li-icon i', 'fas fa-calendar'), go: { [ROOT]: 'taskDetail' }, tab: 1 },
      { type: 'listItem', variant: 3, text: 'Team offsite planning · Fri', after: el => setIcon(el, '.li-icon i', 'fas fa-calendar'), go: { [ROOT]: 'taskDetail' }, tab: 1 },
      WORK_TABS,
    ],

    taskDetail: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Task' } },
      { type: 'adjustableSpace' },
      { type: 'heading', level: 'h2', text: 'Design review prep' },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['High priority', 'Today 2 PM', 'Launch'] } },
      { type: 'avatar', variant: 6, text: { '.avatar-text': 'Assigned to Mia Wong', '.avatar-sub-txt': 'Product Design' } },
      { type: 'textarea', variant: 3, text: { '.ui-input-label': 'Description' }, placeholder: { '.ui-input-base': 'Collect the final mockups and open questions for the 2 PM review.' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Subtasks · 1 of 3' } },
      { type: 'checkbox', text: { 'span': 'Export the checkout screens' } },
      { type: 'checkbox', text: { 'span': 'List open questions' } },
      { type: 'checkbox', text: { 'span': 'Book the room' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Comments' } },
      { type: 'listItem', variant: 5, text: { [LI_TITLE]: 'Jordan Lee', '.li-subtitle': 'Can we include the empty states too?' } },
      { type: 'button', variant: 0, text: 'MARK COMPLETE', go: { [BTN]: 'back' } },
    ],

    projects: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Projects' } },
      { type: 'adjustableSpace' },
      { type: 'searchBar', variant: 1, placeholder: { '.search-minimal-input': 'Search projects' } },
      { type: 'card2', variant: 7, text: { '.card-title': 'Website Redesign', '.card-text': '12 tasks · Due Jun 30', '.card-simple > div > span': '68%' }, go: { [ROOT]: 'tasks' } },
      progress(68, 0),
      { type: 'card2', variant: 7, text: { '.card-title': 'Mobile App Launch', '.card-text': '24 tasks · Due Jul 15', '.card-simple > div > span': '35%' }, go: { [ROOT]: 'tasks' } },
      progress(35, 0),
      { type: 'card2', variant: 7, text: { '.card-title': 'Brand Guidelines', '.card-text': '6 tasks · Done', '.card-simple > div > span': '100%' }, go: { [ROOT]: 'tasks' } },
      progress(100, 0),
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Team' } },
      { type: 'avatar', variant: 9 },
      WORK_TABS,
    ],

    notes: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Notes' } },
      { type: 'adjustableSpace' },
      { type: 'searchBar', variant: 1, placeholder: { '.search-minimal-input': 'Search notes' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Pinned' } },
      { type: 'card2', variant: 3, text: { '.card-title': '📌 Launch plan', '.card-text': 'Beta invites go out Monday. Press kit, landing page copy, and app store screenshots…' }, go: { [ROOT]: 'noteEditor' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Recent' } },
      { type: 'card2', variant: 3, text: { '.card-title': 'Meeting notes · Jun 9', '.card-text': 'Decided to ship dark mode first. Jordan owns the settings screen.' }, go: { [ROOT]: 'noteEditor' } },
      { type: 'card2', variant: 5, text: { '.card-title': 'Groceries', '.card-list li': ['Oat milk', 'Lemons', 'Pasta'] }, go: { [ROOT]: 'noteEditor' } },
      { type: 'card2', variant: 3, text: { '.card-title': 'Book ideas', '.card-text': 'A lighthouse keeper who receives letters from the future.' }, go: { [ROOT]: 'noteEditor' } },
      WORK_TABS,
    ],

    noteEditor: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Launch plan' } },
      { type: 'adjustableSpace' },
      { type: 'heading', text: 'Launch plan' },
      { type: 'paragraph', text: 'Edited just now · Shared with Design Team' },
      { type: 'textarea', variant: 8 }, // rich text editor
      { type: 'bulletedList', after: el => {
          el.querySelector('.add-bullet-text')?.closest('div, button')?.click();
          setTexts(el, { '.bullet-list-item-text': ['Beta invites go out Monday', 'Finish the press kit', 'App store screenshots'] }, 'bulletedList');
        } },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['#launch', '#marketing', '#q3'] } },
    ],

    // ── Education ──
    courseCatalog: [
      { type: 'navbar', variant: 0, text: { '.nav-brand-text': 'Courses' } },
      { type: 'adjustableSpace' },
      { type: 'searchBar', variant: 1, placeholder: { '.search-minimal-input': 'What do you want to learn?' } },
      shelf(0, ['Code', 'Design', 'Business', 'Language', 'Music'], ['fa-code', 'fa-pen-nib', 'fa-briefcase', 'fa-language', 'fa-music']),
      { type: 'card', variant: 1, text: { '.card-featured-tag': 'Bestseller', '.card-title': 'JavaScript Fundamentals', '.card-text': '24 lessons · Beginner · ⭐ 4.9', '.card-button': 'Continue' }, go: { '.card-button': 'education', [ROOT]: 'education' } },
      { type: 'card', variant: 2, text: { '.card-title': 'UI Design Basics', '.card-text': '18 lessons · Beginner · ⭐ 4.8' }, go: { [ROOT]: 'education' } },
      { type: 'card', variant: 2, text: { '.card-title': 'Spanish in 30 Days', '.card-text': '30 lessons · All levels · ⭐ 4.7' }, go: { [ROOT]: 'education' } },
      LEARN_TABS,
    ],

    lesson: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Lesson 3' } },
      { type: 'video', variant: 1, text: { '.video-time': '4:32 / 14:20' } },
      { type: 'heading', level: 'h2', text: 'Working with Arrays' },
      progress(32),
      { type: 'tabs', style: 'underline', text: { '.ui-tab': ['Overview', 'Notes'] } },
      { type: 'paragraph', text: 'Learn how to create arrays, add and remove items, and loop over them with map, filter, and forEach.', tab: 0 },
      { type: 'codeBlock', tab: 0 },
      { type: 'textarea', variant: 3, text: { '.ui-input-label': 'My notes' }, placeholder: { '.ui-input-base': 'Jot down what you learned…' }, tab: 1 },
      { type: 'button', variant: 4, text: { [BTN]: ['PREVIOUS', 'TAKE QUIZ'] }, go: { [BTN]: ['back', 'quiz'] } },
    ],

    quiz: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Quiz' } },
      { type: 'adjustableSpace' },
      progress(60),
      { type: 'paragraph', text: 'Question 3 of 5' },
      { type: 'heading', level: 'h2', text: 'Which method returns a new array with only the items that pass a test?' },
      { type: 'radio', text: { [RADIO_LABEL]: 'map()' } },
      { type: 'radio', ...radioOn, text: { [RADIO_LABEL]: 'filter()' } },
      { type: 'radio', text: { [RADIO_LABEL]: 'forEach()' } },
      { type: 'radio', text: { [RADIO_LABEL]: 'reduce()' } },
      { type: 'adjustableSpace' },
      { type: 'button', variant: 0, text: 'CHECK ANSWER', go: { [BTN]: 'quizResult' } },
      { type: 'paragraph', text: 'Skip question', after: centered },
    ],

    quizResult: [
      { type: 'adjustableSpace' },
      bigIcon('fas fa-medal', 72),
      { type: 'heading', text: 'Nice work!', after: center },
      { type: 'paragraph', text: 'You got 4 of 5 right on Working with Arrays.', after: center },
      { type: 'columns' },
      { type: 'card2', variant: 6, column: 0, text: { 'h1': '80%', '.card-text': 'Score' }, after: el => setIcon(el, '.card-stat-header i', 'fas fa-bullseye') },
      { type: 'card2', variant: 6, column: 1, text: { 'h1': '+40', '.card-text': 'XP earned' }, after: el => setIcon(el, '.card-stat-header i', 'fas fa-star') },
      { type: 'card2', variant: 8, text: { '.card-title': '8-day streak!', '.card-text': 'A lesson every day', '.achievement-content > div:last-child p': '160/200 XP to next level' } },
      { type: 'button', variant: 0, text: 'CONTINUE', go: { [BTN]: 'education' } },
      { type: 'button', variant: 3, text: 'REVIEW ANSWERS', go: { [BTN]: 'quiz' } },
    ],

    // ── AI ──
    aiHistory: [
      aiNav('History'),
      { type: 'adjustableSpace' },
      { type: 'searchBar', variant: 1, placeholder: { '.search-minimal-input': 'Search chats' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Today' } },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Onboarding ideas', '.li-subtitle': 'How can I make my app’s onboarding feel faster?' }, after: el => setIcon(el, '.li-icon i', 'fas fa-message'), go: { [ROOT]: 'aiChat' } },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Launch tweet drafts', '.li-subtitle': 'Write 5 short posts announcing…' }, after: el => setIcon(el, '.li-icon i', 'fas fa-message'), go: { [ROOT]: 'aiChat' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Previous 7 days' } },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Trip to Lisbon', '.li-subtitle': 'Plan a 4-day itinerary for…' }, after: el => setIcon(el, '.li-icon i', 'fas fa-message'), go: { [ROOT]: 'aiChat' } },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'Logo concepts', '.li-subtitle': 'Image · 4 results' }, after: el => setIcon(el, '.li-icon i', 'fas fa-image'), go: { [ROOT]: 'imageGen' } },
      { type: 'listItem', variant: 2, text: { [LI_TITLE]: 'SQL help', '.li-subtitle': 'Why is this query slow?' }, after: el => setIcon(el, '.li-icon i', 'fas fa-message'), go: { [ROOT]: 'aiChat' } },
      AI_SIDEBAR,
    ],

    imageGen: [
      aiNav('Image Studio'),
      { type: 'adjustableSpace' },
      shelf(3, ['Photo', 'Illustration', '3D', 'Watercolor', 'Pixel']),
      { type: 'rightChat', text: { '.chat-avatar': 'ME', '.chat-content': 'A cozy reading nook by a rainy window, warm light', '.chat-timestamp': '9:41 AM' } },
      { type: 'imgGallery', variant: 2 },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Upscale', 'Variations', 'Edit'] } },
      { type: 'chatInput', variant: 5 }, // pinned to the bottom
      AI_SIDEBAR,
    ],

    // ── Business ──
    waitlist: [
      { type: 'hero', variant: 9, text: { '.hx-eyebrow': 'Coming this fall', '.hx-title': 'Your money, on autopilot' } },
      { type: 'paragraph', text: 'Join the waitlist and be first to try the app that saves, invests, and pays your bills for you.' },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Email' }, placeholder: { '.ui-input-base': 'you@example.com' } },
      { type: 'button', variant: 0, text: 'JOIN THE WAITLIST', go: { [BTN]: 'success' } },
      { type: 'avatar', variant: 9 },
      { type: 'paragraph', text: '2,400+ people already signed up', after: centered },
      { type: 'columns' },
      { type: 'card2', variant: 0, column: 0, text: { '.card-title': 'Auto-save', '.card-text': 'Round up every purchase' }, after: el => setIcon(el, '.card-icon-large i', 'fas fa-piggy-bank') },
      { type: 'card2', variant: 0, column: 1, text: { '.card-title': 'Bill pay', '.card-text': 'Never miss a due date' }, after: el => setIcon(el, '.card-icon-large i', 'fas fa-file-invoice-dollar') },
      { type: 'footer', variant: 1, text: { '.footer-heading': 'Autopilot', '.footer-copyright-text': '© 2025 Autopilot Inc.' } },
    ],

    propertyList: [
      { type: 'navbar', variant: 4 }, // search bar navbar
      { type: 'adjustableSpace' },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['For sale', '2+ beds', 'Under $900k'] } },
      { type: 'map', variant: 1, text: { '.map-chip-text': ['$720k', '$865k', '$1.1M'] } },
      { type: 'paragraph', text: '48 homes in Portland, OR' },
      { type: 'card', variant: 0, text: { '.card-title': '$720,000', '.card-text': '3 bd · 2 ba · 1,840 sq ft · 2210 SE Ash St' }, go: { [ROOT]: 'propertyDetail' } },
      { type: 'card', variant: 0, text: { '.card-title': '$865,000', '.card-text': '4 bd · 3 ba · 2,410 sq ft · 418 NE Going St' }, go: { [ROOT]: 'propertyDetail' } },
      { type: 'card', variant: 2, text: { '.card-title': '$549,000', '.card-text': '2 bd · 1 ba · Condo · Pearl District' }, go: { [ROOT]: 'propertyDetail' } },
    ],

    propertyDetail: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': '2210 SE Ash St' } },
      { type: 'imgGallery', variant: 5 },
      { type: 'heading', level: 'h2', text: '$720,000' },
      { type: 'paragraph', text: '2210 SE Ash St, Portland, OR · Listed 3 days ago' },
      { type: 'columns' },
      { type: 'listItem', variant: 4, column: 0, text: { '.usa': ['Beds', '3'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-bed') },
      { type: 'listItem', variant: 4, column: 1, text: { '.usa': ['Baths', '2'] }, after: el => setIcon(el, '.icon-container i', 'fas fa-bath') },
      { type: 'paragraph', text: 'A sunny 1920s bungalow with a remodeled kitchen, original fir floors, and a big backyard with raised garden beds.' },
      { type: 'accordion', style: 'card', text: 'Facts & features' },
      { type: 'accordion', style: 'card', text: 'Monthly cost · est. $4,120' },
      { type: 'avatar', variant: 10, text: { '.avatar-text': 'Rachel Kim · Agent', '.avatar-phone': '(555) 448-1290' } },
      { type: 'datePicker', variant: 2, text: { '.dp-m-caption': 'Pick a tour date' } },
      { type: 'button', variant: 0, text: 'SCHEDULE A TOUR', go: { [BTN]: 'success' } },
    ],

    // ── Ratings ──
    rateOrder: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Rate Your Order' } },
      { type: 'adjustableSpace' },
      { type: 'avatar', variant: 6, text: { '.avatar-text': 'Osteria Bella', '.avatar-sub-txt': 'Delivered by Marco · 7:42 PM' } },
      { type: 'rating', variant: 2, text: { '.rating-title': 'How was your food?', '.rating-caption': 'Tap a star to rate' } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'What stood out?' } },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Tasty', 'Hot & fresh', 'Fast delivery'] } },
      { type: 'textarea', variant: 3, text: { '.ui-input-label': 'Anything else?' }, placeholder: { '.ui-input-base': 'Tell the restaurant what you thought' } },
      { type: 'rating', variant: 2, text: { '.rating-title': 'How was Marco?', '.rating-caption': 'Rate your courier' } },
      { type: 'button', variant: 0, text: 'SUBMIT', go: { [BTN]: 'foodHome' } },
    ],

    rateRide: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Your Trip' } },
      { type: 'map', variant: 2, text: { '.map-eta-time': '$14.20', '.map-eta-sub': '6.2 mi · 18 min · Union Station' } },
      { type: 'rating', variant: 2, text: { '.rating-title': 'How was your ride with Daniel?', '.rating-caption': 'Tap a star to rate' } },
      { type: 'chipGroup', text: { '[contenteditable="true"]': ['Great driving', 'Clean car', 'Friendly'] } },
      { type: 'hzDivider', variant: 2, text: { '.hzRule-text': 'Add a tip' } },
      { type: 'button', variant: 7, text: { [BTN]: ['$2', '$3', '$5'] } },
      { type: 'button', variant: 0, text: 'DONE', go: { [BTN]: 'rideRequest' } },
    ],

    writeReview: [
      { type: 'navbar', variant: 2, text: { '.nav-title-text': 'Write a Review' } },
      { type: 'adjustableSpace' },
      { type: 'card', variant: 2, text: { '.card-title': 'Canvas Sneakers', '.card-text': 'Chalk · Size 9 · Delivered Jun 12' } },
      { type: 'rating', variant: 2, text: { '.rating-title': 'Overall rating', '.rating-caption': 'Tap a star to rate' } },
      { type: 'slider', variant: 3, text: { '.cs-label': 'Size ordered' } },
      { type: 'input', variant: 1, text: { '.ui-input-label': 'Headline' }, placeholder: { '.ui-input-base': 'Sum it up in a few words' } },
      { type: 'textarea', variant: 1, text: { '.ui-input-label': 'Review' }, placeholder: { '.ui-input-base': 'What did you like or dislike?' } },
      { type: 'image', variant: 2 }, // add photos
      { type: 'button', variant: 0, text: 'SUBMIT REVIEW', go: { [BTN]: 'orderTracking' } },
    ],
  };

  // ── HELPERS ─────────────────────────────────────────────────────────────────
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => r()));
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // Delay between components while a template builds (visual only; 0 = instant)
  const BUILD_STAGGER_MS = 90;

  // Where a component's own content lives (special components have no .component-content)
  const contentOf = el => el.querySelector(':scope > .component-content') || el;

  // Elements inside a component, excluding the builder's own chrome
  function queryOwn(el, selector) {
    return Array.from(contentOf(el).querySelectorAll(selector))
      .filter(n => !n.closest('.variant-controls, .color-swatch-container, .alignment-arrow, .delete-btn'));
  }

  // label = null → preview mode: no warnings, and plain-text specs also match .usa
  // (preview markup hasn't been through the builder, which makes those editable)
  function setTexts(el, spec, label) {
    const warn = msg => { if (label) console.warn(`[templates] ${label}: ${msg}`); };
    if (typeof spec === 'string') {
      const target = queryOwn(el, label ? '[contenteditable="true"]' : '[contenteditable="true"], .usa')[0];
      if (target) { target.textContent = spec; notifyEdit(target); }
      else warn(`no editable text for "${spec}"`);
      return;
    }
    Object.entries(spec).forEach(([selector, value]) => {
      const values = Array.isArray(value) ? value : [value];
      const targets = queryOwn(el, selector);
      if (targets.length < values.length) warn(`"${selector}" matched ${targets.length}, expected ${values.length}`);
      values.forEach((v, i) => { if (targets[i]) { targets[i].textContent = v; notifyEdit(targets[i]); } });
    });
  }

  function setPlaceholders(el, spec, label) {
    Object.entries(spec).forEach(([selector, value]) => {
      const target = queryOwn(el, selector)[0];
      if (!target) {
        if (label) console.warn(`[templates] ${label}: placeholder target "${selector}" not found`);
        return;
      }
      const attr = target.hasAttribute('data-placeholder') ? 'data-placeholder' : 'placeholder';
      target.setAttribute(attr, value);
    });
  }

  function setIcon(el, selector, className) {
    const icon = queryOwn(el, selector)[0];
    if (icon) icon.className = className;
    else console.warn(`[templates] icon target "${selector}" not found`);
  }

  // Successive matches of selector get successive class names
  function setIcons(el, selector, classNames) {
    const icons = queryOwn(el, selector);
    if (icons.length < classNames.length) console.warn(`[templates] icon target "${selector}" matched ${icons.length}, expected ${classNames.length}`);
    classNames.forEach((c, i) => { if (icons[i]) icons[i].className = c; });
  }

  // Free accounts are capped at 28 components per project (same rule as
  // handleComponentAddition). Checked once, up front, for the whole template so a
  // template never stops half-built.
  async function templateFitsComponentLimit(entries) {
    const user = firebase.auth().currentUser;
    if (!user) return true;
    const adding = entries
      .filter(e => !editor.isSpecialComponent(e.type))
      .reduce((n, e) => n + (e.repeat || 1), 0);
    const existing = document.querySelectorAll('.canvas-content .component-container').length;
    if (existing + adding <= 28) return true;
    if (await imageManager.checkProAccess(user.uid)) return true;
    projectManager.showSubscriptionModal(
      'Upgrade to Add More Components',
      `This template adds ${adding} components — free accounts are limited to 28 components per project.`
    );
    return false;
  }

  // ── BUILDER ─────────────────────────────────────────────────────────────────
  // Create a new screen and build the template on it.
  // Components that keep their text in state (charts' data-graph) update it on input
  function notifyEdit(el) {
    if (el.isConnected) el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Build a template's entries onto a new screen. Returns { wrapper, links } — links are
  // the entries' `go` requests ({ el, to, transition }) for applyPack to resolve once
  // every screen of a pack exists — or null if the screen couldn't be created.
  // after: a .canvas-wrapper to place the new screen right after (else it goes at the end)
  async function buildTemplateScreen(templateName, entries, { after = null } = {}) {
    // createNewCanvas runs its own screen-limit checks; undefined means blocked
    const wrapper = await editor.createNewCanvas({ copyStatusLook: true });
    if (!wrapper) return null;
    if (after?.isConnected && after.nextElementSibling !== wrapper) {
      after.after(wrapper);
      editor.updateCanvasNumbers();
      // Screens are stored by position: everything after the new one shifted
      window.projectManager?.markAllCanvasesChanged?.('Template screen inserted');
    }
    const canvas = wrapper.querySelector('.canvas');
    // Name the screen after its template ("Login"); saved by markScreenChanged below
    const title = editor.cleanScreenName(TEMPLATE_CARDS.find(c => c.key === templateName)?.title);
    if (title) {
      canvas.setAttribute('data-screen-name', title);
      editor.renderScreenLabel(wrapper);
    }
    if (!canvas.classList.contains('selected')) canvas.click();

    // Bring the new screen into view up front so the build-up is visible
    editor.scrollSelectedScreenIntoView();

    const pending = [];
    const links = [];
    let first = true;
    let lastColumns = null; // most recent Columns component, for entries with `column`
    for (const entry of entries) {
      for (let i = 0; i < (entry.repeat || 1); i++) {
        // Build-up effect: pause between components so the screen assembles in
        // front of the user. Each component is fully finished (variant + copy)
        // before the pause, so this is purely visual — nothing waits on timing.
        if (!first) await sleep(BUILD_STAGGER_MS);
        first = false;
        if (!canvas.isConnected) return null; // screen was deleted mid-build

        const label = `${templateName}/${entry.type}`;
        try {
          const el = editor.insertComponent(canvas, entry.type, {
            variant: entry.variant ?? null,
            level: entry.level ?? null,
            scroll: false,
            tabPanel: false, // placed by entry.tab below
          });
          if (!el) { console.warn(`[templates] ${label}: component was not created`); continue; }
          if (entry.type === 'columns') lastColumns = el;
          if (entry.column != null) {
            const wrap = lastColumns?.querySelector('.columns-wrapper');
            const col = wrap?.querySelectorAll(':scope > .column-container')[entry.column];
            if (col) col.appendChild(el);
            else console.warn(`[templates] ${label}: no column ${entry.column} to place it in`);
          }
          if (entry.style) {
            const styler = window.Components?.[entry.type]?.setStyle;
            if (styler) styler.call(window.Components[entry.type], el, entry.style);
            else console.warn(`[templates] ${label}: no setStyle for "${entry.style}"`);
          }
          if (entry.end) window.Components?.tabs?.addEnd(el);
          if (entry.tab != null) window.Components?.tabs?.assign(el, entry.tab);
          if (entry.text) setTexts(el, entry.text, label);
          if (entry.placeholder) setPlaceholders(el, entry.placeholder, label);
          if (entry.after) {
            const result = entry.after(el);
            if (result && typeof result.then === 'function') pending.push(result);
          }
          if (entry.go) {
            collectLinks(el, entry, label).forEach(link => {
              // Overlays are on this screen: link now, pack or not
              if (link.to.startsWith('overlay:')) linkElement(link.el, { action: 'overlay', overlay: link.to.slice(8) });
              else links.push(link);
            });
          }
        } catch (err) {
          console.error(`[templates] ${label} failed:`, err);
        }
      }
    }
    await Promise.all(pending);

    const phoneScrollCon = canvas.querySelector('.phoneScrollCon');
    if (phoneScrollCon) phoneScrollCon.scrollTop = 0;
    editor.scrollSelectedScreenIntoView();

    // The wrapper's data-canvas-id is stamped by projectSys's MutationObserver —
    // let it run before marking the screen as changed.
    await nextFrame();
    markScreenChanged(wrapper, `Applied template: ${templateName}`);
    return { wrapper, links };
  }

  function markScreenChanged(wrapper, why) {
    const canvasId = wrapper.getAttribute('data-canvas-id');
    if (canvasId && window.projectManager?.addCanvasToChanged) {
      window.projectManager.addCanvasToChanged(canvasId, why);
      window.projectManager.contentChanged = true;
    }
  }

  // An entry's `go` spec → link requests on the elements it names. Keys are selectors
  // (ROOT = the component's own root element, the one Connect mode links when you click
  // a plain component); values are a screen key, 'back', or 'overlay:<modal|bottomSheet|
  // sidebar>' (opens that overlay on the same screen — applied even outside a pack), or an
  // array for successive matches (null skips one); 'a|b' links to the first of those
  // screens the pack has.
  function collectLinks(el, entry, label) {
    const out = [];
    Object.entries(entry.go).forEach(([selector, value]) => {
      const values = Array.isArray(value) ? value : [value];
      const targets = selector === ROOT ? [contentOf(el).firstElementChild].filter(Boolean) : queryOwn(el, selector);
      if (targets.length < values.filter(v => v != null).length) console.warn(`[templates] ${label}: go "${selector}" matched ${targets.length}, expected ${values.length}`);
      values.forEach((to, i) => { if (to && targets[i]) out.push({ el: targets[i], to, transition: entry.goTransition || null }); });
    });
    return out;
  }

  async function applyTemplate(templateName, { after = null } = {}) {
    const entries = TEMPLATES[templateName];
    if (!entries) return console.error(`Unknown template type: ${templateName}`);

    if (!(await templateFitsComponentLimit(entries))) return;
    await buildTemplateScreen(templateName, entries, { after });
    // A single screen has no pack to link to: its `go` links are dropped
  }

  // App packs are Pro: they add several screens at once, past the free screen limit.
  async function canUsePacks() {
    const user = firebase.auth().currentUser;
    if (!user) {
      showAuthModal('Sign in to use app packs', 'App packs build a whole app — every screen already connected — in one click.');
      return false;
    }
    try {
      if (await imageManager.checkProAccess(user.uid)) return true;
    } catch (err) {
      console.error('Error checking subscription status:', err);
      return false;
    }
    projectManager.showSubscriptionModal('Upgrade to Use App Packs', 'App packs build a whole app — every screen already connected — in one click.');
    return false;
  }

  // Build every screen of a pack in order, then connect them: each `go` request becomes
  // a prototype link to the pack screen built from that template key (requests for
  // screens the pack doesn't include are dropped).
  async function applyPack(packKey, { after = null } = {}) {
    const pack = PACKS_BY_KEY[packKey];
    if (!pack) return console.error(`Unknown app pack: ${packKey}`);
    if (!(await canUsePacks())) return;

    const built = [];
    for (const key of pack.screens) {
      const entries = TEMPLATES[key];
      if (!entries) { console.error(`[templates] ${packKey}: unknown template ${key}`); continue; }
      const result = await buildTemplateScreen(key, entries, { after });
      if (!result) break; // blocked or deleted mid-build: connect what was built
      built.push({ key, ...result });
      if (after) after = result.wrapper;   // the pack's screens stay in order
    }
    if (!built.length) return;

    const screenIds = {};
    built.forEach(({ key, wrapper }) => { screenIds[key] ??= wrapper.getAttribute('data-canvas-id'); });
    built.forEach(({ wrapper, links }) => {
      links.forEach(({ el, to, transition }) => {
        if (!el.isConnected) return;
        // 'a|b' = the first of these screens the pack has (one template, several packs)
        const key = to.split('|').find(k => k === 'back' || screenIds[k]);
        if (key === 'back') linkElement(el, { action: 'back' });
        else if (key) linkElement(el, { action: 'navigate', target: screenIds[key], transition });
      });
      markScreenChanged(wrapper, `Applied app pack: ${pack.title}`);
    });

    // Play starts at the pack's first screen unless the project already has a start screen
    const proto = window.prototypeMode;
    const start = proto?.getStartScreen?.();
    if (proto?.setStartScreen && !(start && document.querySelector(`.canvas-wrapper[data-canvas-id="${CSS.escape(start)}"]`))) {
      proto.setStartScreen(screenIds[built[0].key]);
    }
    proto?.refresh?.();

    // Show the start of the flow
    built[0].wrapper.querySelector('.canvas')?.click();
    editor.scrollSelectedScreenIntoView();
    window.projectManager?.showNotification?.(`${pack.title}: ${built.length} connected screens added. Press Play to try it.`, 'success');
  }

  // Same attributes prototype.js's setLink writes (data-proto-* — see its header)
  function linkElement(el, { action, target, overlay, transition }) {
    el.setAttribute('data-proto-action', action);
    if (action === 'navigate') el.setAttribute('data-proto-target', target);
    if (action === 'overlay') el.setAttribute('data-proto-overlay', overlay);
    if (action === 'navigate' && transition) el.setAttribute('data-proto-transition', transition);
  }

  // Exposed for debugging / tests, and for the read-only template gallery (templates.html),
  // which renders its tiles with the picker's own preview code
  window.screenTemplates = {
    TEMPLATES, TEMPLATE_CARDS, TEMPLATE_PACKS, TEMPLATE_CATEGORIES, applyTemplate, applyPack, mountTemplatePreview,
    // Open the picker ({ after: wrapper } builds the pick right after that screen)
    openPicker: (opts) => openPickerFn?.(opts),
  };

  // Initialize the template system once the editor is up (not on the gallery page: no editor there)
  if (window.TEMPLATE_GALLERY) {
    // nothing to wire
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initializeTemplateSystem, 500));
  } else {
    setTimeout(initializeTemplateSystem, 500);
  }
