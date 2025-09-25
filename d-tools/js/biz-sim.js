// Enhanced Game State Management
let gameState = {
    companyName: "YourStartup Inc.",
    founded: new Date(),
    foundedDisplay: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    }),
    teamSize: 1,
    salary: 0, // newly added assuming total salaries of all employees divided by 12 months is added to burn rate
    runway: 100000, // Starting runway in dollars
    oneTimeRevenue: 0, // one time payments
    totalRevenue: 0,

    monthlyRevenue: 0, // recurring payments
    recurringPayTime: [], // recurring payments time
    revenueStreams: [], // Array of active revenue streams with their details
    revenueHistory: [], // Month-by-month revenue history
    monthlyBurn: 1000, // Base monthly burn rate
    
    currentMonth: 1,
    currentYear: 1,
    timeToMVP: 0,
    selectedCards: [],
    cardsGenerated: 0,
    customers: 0, 
    milestonesHit: {},
    // Performance tracking
    lastUpdateTime: Date.now(),
    cardRenderQueue: [],
    // Extra stats
    engagement: 0,
    growth: 0,
    confidence: 0,
    reach: 0,
    credibility: 0,
    loyalty: 0,
    scalability: 0, 
    predictability: 0,
    retention: 0
};

// Function to calculate the current game date based on months elapsed
function getCurrentGameDate() {
    const foundedDate = new Date(gameState.founded);
    const monthsElapsed = gameState.currentMonth - 1;
    // Add months to the founded date
    const currentGameDate = new Date(foundedDate);
    currentGameDate.setMonth(currentGameDate.getMonth() + monthsElapsed);
    
    return currentGameDate;
}

// Function to format game date for display
    function formatGameDate(date, includeTime = false) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };
        
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        return date.toLocaleDateString('en-US', options);
    }

// Function to get a relative time description
    function getRelativeTimeDescription(gameDate, foundedDate) {
        const monthsElapsed = Math.round((gameDate - foundedDate) / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month
        
        if (monthsElapsed === 0) {
            return "Founding";
        } else if (monthsElapsed === 1) {
            return "1 month in";
        } else if (monthsElapsed < 12) {
            return `${monthsElapsed} months in`;
        } else {
            const years = Math.floor(monthsElapsed / 12);
            const remainingMonths = monthsElapsed % 12;
            if (remainingMonths === 0) {
                return years === 1 ? "1 year in" : `${years} years in`;
            } else {
                return `${years}y ${remainingMonths}m in`;
            }
        }
    }

    let isLoading = false;

// Performance optimizations
    const CARD_RENDER_BATCH_SIZE = 3;
    const SCROLL_THROTTLE_MS = 100;
    let scrollTimeout = null;

// Cache DOM elements for better performance
    const domCache = {
        teamSize: null,
        currentMonth: null,
        runway: null,
        revenue: null,
        simulatorContainer: null,
        selectionsBtn: null,
        companyName: null
    };

// Initialize DOM cache
    function initDOMCache() {
        domCache.teamSize = document.getElementById('teamSize');
        domCache.currentMonth = document.getElementById('currentMonth');
        domCache.runway = document.getElementById('runway');
        domCache.revenue = document.getElementById('revenue');
        domCache.simulatorContainer = document.getElementById('simulatorContainer');
        domCache.selectionsBtn = document.getElementById('selectionsBtn');
        domCache.companyName = document.getElementById('companyName');
    }

    function getAllCardTypes() {
        return [
            ...validationMethods,
            ...teamMembers,
            ...productFeatures,
            ...marketingStrategies,
            ...businessModels,
            ...revenueCards
        ];
    }

// Enhanced card generation with better performance
    function generateBusinessCard() {
        const allCards = getAllCardTypes();
        const card = allCards[Math.floor(Math.random() * allCards.length)];
        gameState.cardsGenerated++;

        const categoryConfig = {
            validation: { emoji: "🎯", color: "validation" },
            team: { emoji: "🤝", color: "team" },
            product: { emoji: "⚡", color: "product" },
            marketing: { emoji: "📈", color: "marketing" },
            business: { emoji: "💼", color: "business" },
            revenue: { emoji: "💰", color: "revenue" }
        };

        const config = categoryConfig[card.category] || { emoji: "❓", color: "default" };
        const metricsHTML = generateMetricsHTML(card);

        return `
            <div class="business-card ${config.color}" style="animation-delay: ${gameState.cardsGenerated * 0.1}s">
                <div class="card-header ${config.color}">
                    <div class="card-type-wrapper">
                        <div><p>Decision #${gameState.cardsGenerated}</p></div>
                        <a href="javascript:learnMore('${card.category}')">
                            <div class="card-type">${card.category}&nbsp; ${config.emoji}</div>
                        </a>
                    </div>
                    <h2>${card.title}</h2>
                </div>
                <div class="card-svg-section">
                    <div class="svg-container">
                        <img class="card-img" src="${card.svg}" alt="${card.title}" loading="lazy"/>
                    </div>
                </div>
                <div class="card-body">
                    ${metricsHTML}
                    <div class="card-content">
                        <div class="content-desc">${card.description}</div>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-skip" onclick="skipCard(this)">Skip</button>
                        <button class="btn btn-select" onclick="selectCard(this, ${JSON.stringify(card).replace(/"/g, '&quot;')})">Add</button>
                    </div>
                </div>
            </div>
        `;
    }

// Optimized metrics HTML generation
function generateMetricsHTML(card) {
    if (card.category === 'team') {
        return `
            <div class="impact-metrics">
                <div class="metric">
                    <span class="metric-label">Salary</span>
                    <span class="metric-value">$${(card.salary / 1000).toFixed(0)}k</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Level</span>
                    <span class="metric-value">${card.level}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Monthly Cost</span>
                    <span class="metric-value">$${(card.salary / 12 / 1000).toFixed(1)}k</span>
                </div>
            </div>
        `;
    } else if (card.category === 'revenue') {
        return `
            <div class="impact-metrics">
                <div class="metric">
                    <span class="metric-label">Revenue</span>
                    <span class="metric-value">+$${(card.impact.monthlyRevenue / 1000).toFixed(1)}k</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Time</span>
                    <span class="metric-value">${card.impact.time || 0}mo</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Type</span>
                    <span class="metric-value">Recurring</span>
                </div>
            </div>
        `;
    } else {
        const impactKeys = Object.keys(card.impact || {});
        return `
            <div class="impact-metrics">
                ${impactKeys.slice(0, 3).map(key => `
                    <div class="metric">
                        <span class="metric-label">${key.charAt(0).toUpperCase() + key.slice(1)}</span>
                        <span class="metric-value">${formatMetricValue(key, card.impact[key])}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Helper function to format metric values
    function formatMetricValue(key, value) {
        if (key === 'cost') {
            const absValue = Math.abs(value);
            return '$' + (absValue / 1000).toFixed(0) + (absValue > 1000000 ? 'M' : 'k');
        }
        if (key === 'time') {
            return (value > 0 ? '+' : '') + value + 'mo';
        }
        return (value > 0 ? '+' : '') + value + (key === 'time' ? 'mo' : '%');
    }

// Enhanced game state updates with proper time and financial tracking
function updateGameStats(card) {
    const prevMonth = gameState.currentMonth;
    
    // Update time progression
    if (card.impact && card.impact.time) {
        gameState.currentMonth += Math.abs(card.impact.time);
    }
    
    // Update team size and monthly burn
    if (card.category === 'team') {
        gameState.teamSize++;
        gameState.monthlyBurn += card.salary / 12; // Add monthly salary to burn rate
    }

    // Update one-time costs
    if (card.impact && card.impact.cost) {
        gameState.runway += card.impact.cost; // Cost impacts are negative
    }
    
    // Update monthly revenue - needs to track how many months using recurringPayTime and add the montlyRevenue that many months
    // 
    if (card.impact && card.impact.monthlyRevenue) {
        gameState.monthlyRevenue += card.impact.monthlyRevenue;
    }

        // ===== NEW METRICS TRACKING CODE =====
    
    // Update customers based on card impacts and revenue growth
    if (card.impact) {
        // Direct customer impact from card
        if (card.impact.customers) {
            gameState.customers += card.impact.customers;
        }
        
        // Growth tracking
        if (card.impact.growth) {
            gameState.growth += card.impact.growth;
        }
        
        // Engagement tracking
        if (card.impact.engagement) {
            gameState.engagement += card.impact.engagement;
        }
        
        // Confidence tracking
        if (card.impact.confidence) {
            gameState.confidence += card.impact.confidence;
        }
        
        // Credibility tracking
        if (card.impact.credibility) {
            gameState.credibility += card.impact.credibility;
        }
        
        // Reach tracking
        if (card.impact.reach) {
            gameState.reach += card.impact.reach;
        }
        
        // Retention affects engagement
        if (card.impact.retention) {
            gameState.engagement += Math.floor(card.impact.retention * 0.5);
        }
        
        // Quality affects confidence
        if (card.impact.quality) {
            gameState.confidence += Math.floor(card.impact.quality * 0.3);
        }
        
        // Scalability affects reach
        if (card.impact.scalability) {
            gameState.reach += Math.floor(card.impact.scalability * 0.4);
        }
    }

    // Category-specific customer and metric impacts
    switch (card.category) {
        case 'validation':
            // Validation activities build confidence and attract customers
            gameState.confidence += Math.floor(Math.random() * 5) + 5;
            gameState.customers += Math.floor(Math.random() * 10) + 10;
            break;
            
        case 'team':
            // Team members boost credibility and capacity for growth
            gameState.credibility += Math.floor(Math.random() * 8) + 4;
            gameState.growth += Math.floor(Math.random() * 6) + 2;
            break;
            
        case 'product':
            // Product features boost engagement and attract customers
            gameState.engagement += Math.floor(Math.random() * 5) + 8;
            gameState.customers += Math.floor(Math.random() * 20) + 25;
            break;
            
        case 'marketing':
            // Marketing directly impacts reach, growth, and customer acquisition
            gameState.reach += Math.floor(Math.random() * 20) + 15;
            gameState.growth += Math.floor(Math.random() * 12) + 8;
            gameState.customers += Math.floor(Math.random() * 50) + 50;
            break;
            
        case 'business':
            // Business model decisions affect confidence and credibility
            gameState.confidence += Math.floor(Math.random() * 12) + 6;
            gameState.credibility += Math.floor(Math.random() * 10) + 5;
            break;
            
        case 'revenue':
            // Revenue cards directly bring customers and boost confidence
            gameState.customers += Math.floor(Math.random() * 20) + 15;
            gameState.confidence += Math.floor(Math.random() * 15) + 10;
            break;
    }
        
    // Apply natural growth over time
        const monthsPassed = gameState.currentMonth - prevMonth;
        if (monthsPassed > 0) {
            // Compound monthly growth
            const monthlyGrowthRate = Math.max(0, gameState.growth / 100);
            for (let i = 0; i < monthsPassed; i++) {
                gameState.customers = Math.floor(gameState.customers * (1 + monthlyGrowthRate * 0.1));
            }
            
            // Engagement tends to decrease over time without attention
            gameState.engagement = Math.max(0, gameState.engagement - (monthsPassed * 2));
        }
        
        // Cap all percentage-based metrics at 100
        gameState.growth = Math.min(100, gameState.growth);
        gameState.engagement = Math.min(100, gameState.engagement);
        gameState.confidence = Math.min(100, gameState.confidence);
        gameState.credibility = Math.min(100, gameState.credibility);
        gameState.reach = Math.min(100, gameState.reach);
        
        // Ensure no negative values
        gameState.customers = Math.max(0, gameState.customers);
        gameState.engagement = Math.max(0, gameState.engagement);
        gameState.credibility = Math.max(0, gameState.credibility);
        gameState.reach = Math.max(0, gameState.reach);

        // Calculate net monthly burn (burn rate minus revenue)
        const netBurn = Math.max(0, gameState.monthlyBurn - gameState.monthlyRevenue);
        
        // Update runway based on months passed and burn rate
        //const monthsPassed = gameState.currentMonth - prevMonth;
        if (monthsPassed > 0 && netBurn > 0) {
            gameState.runway -= (netBurn * monthsPassed);
        }
        
        // Add revenue for months passed
        if (monthsPassed > 0 && gameState.monthlyRevenue > 0) {
            gameState.totalRevenue += (gameState.monthlyRevenue * monthsPassed);
        }

        // Update year tracking
        gameState.currentYear = Math.floor((gameState.currentMonth - 1) / 12) + 1;
        
        updateUI();
        updateSelectionsButtonText();

    }

    function recalculateAllMetrics() {
        // Reset derived metrics
        gameState.customers = 0;
        gameState.growth = 0;
        gameState.engagement = 0;
        gameState.confidence = 0;
        gameState.credibility = 0;
        gameState.reach = 0;
        
        // Recalculate from all selected cards
        gameState.selectedCards.forEach(card => {
            // Apply the metrics tracking logic without affecting time/money
            const tempCard = { ...card, impact: { ...card.impact } };
            // Remove financial impacts to avoid double-counting
            delete tempCard.impact.time;
            delete tempCard.impact.cost;
            delete tempCard.impact.monthlyRevenue;
            
            // Apply just the metric tracking part
            if (tempCard.impact) {
                if (tempCard.impact.customers) gameState.customers += tempCard.impact.customers;
                if (tempCard.impact.growth) gameState.growth += tempCard.impact.growth;
                if (tempCard.impact.engagement) gameState.engagement += tempCard.impact.engagement;
                if (tempCard.impact.confidence) gameState.confidence += tempCard.impact.confidence;
                if (tempCard.impact.credibility) gameState.credibility += tempCard.impact.credibility;
                if (tempCard.impact.reach) gameState.reach += tempCard.impact.reach;
                if (tempCard.impact.retention) gameState.engagement += Math.floor(tempCard.impact.retention * 0.5);
                if (tempCard.impact.quality) gameState.confidence += Math.floor(tempCard.impact.quality * 0.3);
                if (tempCard.impact.scalability) gameState.reach += Math.floor(tempCard.impact.scalability * 0.4);
            }
            
            // Category-specific impacts
            switch (tempCard.category) {
                case 'validation':
                    gameState.confidence += 7;
                    gameState.customers += 15;
                    break;
                case 'team':
                    gameState.credibility += 6;
                    gameState.growth += 4;
                    break;
                case 'product':
                    gameState.engagement += 12;
                    gameState.customers += 37;
                    break;
                case 'marketing':
                    gameState.reach += 17;
                    gameState.growth += 10;
                    gameState.customers += 75;
                    break;
                case 'business':
                    gameState.confidence += 9;
                    gameState.credibility += 7;
                    break;
                case 'revenue':
                    gameState.customers += 22;
                    gameState.confidence += 12;
                    break;
            }
        });
        
        // Estimate customers from revenue if needed
        if (gameState.customers < 10 && gameState.monthlyRevenue > 1000) {
            gameState.customers = Math.floor(gameState.monthlyRevenue / 100);
        }
        
        // Cap all metrics
        gameState.growth = Math.min(100, Math.max(0, gameState.growth));
        gameState.engagement = Math.min(100, Math.max(0, gameState.engagement));
        gameState.confidence = Math.min(100, Math.max(0, gameState.confidence));
        gameState.credibility = Math.min(100, Math.max(0, gameState.credibility));
        gameState.reach = Math.min(100, Math.max(0, gameState.reach));
        gameState.customers = Math.max(0, gameState.customers);
    }

// Optimized UI update function
    function updateUI() {
        if (!domCache.teamSize) initDOMCache();
        
        // Update team size
        domCache.teamSize.textContent = gameState.teamSize;
        
        // Update month display with year tracking
        const displayMonth = ((gameState.currentMonth - 1) % 12) + 1;
        if (gameState.currentYear > 1) {
            domCache.currentMonth.textContent = `Y${gameState.currentYear} M${displayMonth}`;
        } else {
            domCache.currentMonth.textContent = `M${displayMonth}`;
        }
        
        // Updated runway display - show actual dollar amount
        let runwayDisplay;
        
        if (gameState.runway >= 1000000) {
            runwayDisplay = '$' + (gameState.runway / 1000000).toFixed(1) + 'M';
        } else if (gameState.runway >= 1000) {
            runwayDisplay = '$' + (gameState.runway / 1000).toFixed(0) + 'K';
        } else if (gameState.runway >= 0) {
            runwayDisplay = '$' + gameState.runway.toFixed(0);
        } else {
            // Handle negative runway
            const absRunway = Math.abs(gameState.runway);
            if (absRunway >= 1000000) {
                runwayDisplay = '-$' + (absRunway / 1000000).toFixed(1) + 'M';
            } else if (absRunway >= 1000) {
                runwayDisplay = '-$' + (absRunway / 1000).toFixed(0) + 'K';
            } else {
                runwayDisplay = '-$' + absRunway.toFixed(0);
            }
        }
        
        domCache.runway.textContent = runwayDisplay;
        
        // Update revenue display
        domCache.revenue.textContent = '$' + (gameState.monthlyRevenue / 1000).toFixed(1) + 'k/mo';
    }

// Enhanced selections button update
    function updateSelectionsButtonText() {
        if (!domCache.selectionsBtn) return;
        
        const count = gameState.selectedCards.length;
        const icon = '<i class="fas fa-eye mr-2"></i>';
        domCache.selectionsBtn.innerHTML = count > 0 ? 
            `${icon}Selections (${count})` : 
            '<i class="fas fa-pencil mr-2"></i>Selections';
    }

// Optimized company name update
    function updateCompanyName() {
        if (!domCache.companyName) return;
        
        const names = [
            "InnovateCorp", "VentureFlow", "BuildFast Inc", "ScaleUp Labs", 
            "NextGen Ventures", "DisruptTech", "GrowthEngine Co", "LaunchPad Inc",
            "StartupForge", "RapidScale", "TechCatalyst", "BuildForward"
        ];
        const randomName = names[Math.floor(Math.random() * names.length)];
        // update game state
        gameState.companyName = randomName;
        domCache.companyName.textContent = randomName;
    }

// Function to check if we're on a large screen
    function isLargeScreen() {
        return window.innerWidth >= 1330;
    }

// Function to update both modals if they're open
    function updateOpenModals() {
        // Update selections modal if it's open
        const selectionsModal = document.getElementById('selectionsModal');
        if (selectionsModal && selectionsModal.style.display === 'flex') {
            populateSelections();
        }
        
        // Update company metrics modal if it's open
        const companyMetricsModal = document.getElementById('companyMetricsModal');
        if (companyMetricsModal && companyMetricsModal.style.display === 'flex') {
            populateCompanyMetrics();
        }
    }

// Enhanced card selection with real calendar dates
    function selectCard(button, card) {
        const cardElement = button.closest('.business-card');
        cardElement.classList.add('selected-card');
        
        // Calculate the current game date
        const currentGameDate = getCurrentGameDate();
        
        // Add metadata to card with real calendar date
        card.selectedAt = formatGameDate(currentGameDate);
        card.selectedAtDate = new Date(currentGameDate); // Store as Date object for calculations
        card.selectedMonth = gameState.currentMonth;
        card.selectedYear = gameState.currentYear;
        card.relativeTime = getRelativeTimeDescription(currentGameDate, gameState.founded);
        
        // Update game state
        gameState.selectedCards.push(card);
        updateGameStats(card);

        // Update open modals on large screens
        if (isLargeScreen()) {
            updateOpenModals();
        }

        // Smooth card removal
        $(cardElement).slideUp(300, function() {
            $(this).remove();
        });
        
        // Load replacement card
        loadMoreCards(1);
    }

    function skipCard(button) {
        const cardElement = button.closest('.business-card');
        cardElement.classList.add('skipped-card');

        $(cardElement).slideUp(300, function() {
            $(this).remove();
        });
        
        loadMoreCards(1);
    }

// Enhanced outcome checking with better performance
function checkForOutcomes() {
    const recentSelections = gameState.selectedCards.slice(-3);
    const categoryCount = gameState.selectedCards.reduce((acc, card) => {
        acc[card.category] = (acc[card.category] || 0) + 1;
        return acc;
    }, {});
    
    // Check for various triggers with improved logic
    const triggers = [
        { condition: !categoryCount.validation && gameState.selectedCards.length > 5, outcome: "no_validation" },
        { condition: gameState.teamSize === 1 && gameState.selectedCards.length > 8, outcome: "solo_founder" },
        { condition: gameState.runway < 10000 && gameState.monthlyRevenue < 2000 && gameState.selectedCards.length > 6, outcome: "high_cost" },
        { condition: !categoryCount.marketing && gameState.selectedCards.length > 6, outcome: "no_marketing" },
        { condition: gameState.selectedCards.length > 25 && gameState.customers < 15 && gameState.teamSize > 5, outcome: "employee_quit" }
    ];
    
    triggers.forEach(trigger => {
        if (trigger.condition) {
            const outcome = outcomeCards.challenges.find(c => c.trigger === trigger.outcome);
            if (outcome) queueOutcomeCard(outcome);
        }
        // is this the right place to do this?
        if (trigger.condition && trigger.outcome === "employee_quit") {
            gameState.teamSize -= 1;
        }

    });
    
    // Check for positive outcomes
    recentSelections.forEach(selection => {
        const positiveOutcome = outcomeCards.positive.find(outcome => 
            outcome.trigger === selection.title.toLowerCase().replace(/\s+/g, '_') ||
            outcome.trigger === selection.category
        );
        
        if (positiveOutcome && Math.random() > 0.7) {
            queueOutcomeCard(positiveOutcome);
        }
    });
    
    // Revenue-based opportunities
        if (gameState.monthlyRevenue > 5000 && gameState.growth > 0) {
            const opportunity = outcomeCards.opportunities.find(o => o.trigger === "strong_growth");
            if (opportunity && Math.random() > 0.6) {
                queueOutcomeCard(opportunity);
            }
        }
        
        if (gameState.monthlyRevenue > 300000 && gameState.selectedCards.length > 15 && gameState.customers > 10) {
            const opportunity = outcomeCards.opportunities.find(o => o.trigger === "proven_model");
            if (opportunity && Math.random() > 0.75) {
                queueOutcomeCard(opportunity);
            }
        }
        
        if (gameState.monthlyRevenue > 50000 && gameState.selectedCards.length > 25) {
            const opportunity = outcomeCards.opportunities.find(o => o.trigger === "b2c_struggles");
            if (opportunity && Math.random() > 0.4) {
                queueOutcomeCard(opportunity);
            }
        }
    }

    let outcomeQueue = [];

    function queueOutcomeCard(outcome) {
        if (!outcomeQueue.find(c => c.title === outcome.title)) {
            outcomeQueue.push(outcome);
        }
    }

    function generateOutcomeCard() {
        if (outcomeQueue.length === 0) return null;
        
        const outcome = outcomeQueue.shift();
        const typeConfig = {
            positive: { emoji: "✨", color: "positive" },
            challenge: { emoji: "⚠️", color: "challenge" },
            opportunity: { emoji: "🚀", color: "opportunity" }
        };
        
        const config = typeConfig[outcome.type] || { emoji: "❓", color: "default" };
        let actionsHTML = generateOutcomeActions(outcome);
        
        return `
            <div class="business-card ${config.color} outcome-card" style="animation-delay: 0s">
                <div class="card-header ${config.color}">
                    <div class="card-type-wrapper">
                        <div><p>Outcome</p></div>
                        <div class="card-type">${outcome.type.toUpperCase()} ${config.emoji}</div>
                    </div>
                    <h2>${outcome.title}</h2>
                </div>
                <div class="card-svg-section">
                    <div class="svg-container">
                        <img class="card-img" src="${outcome.svg}" alt="${outcome.title}" loading="lazy"/>
                    </div>
                </div>
                <div class="card-body">
                    <div class="card-content">
                        <div class="content-desc">${outcome.description}</div>
                    </div>
                    ${outcome.followUp ? `
                        <div class="follow-up-section">
                            <strong>Follow-up:</strong> ${outcome.followUp}
                        </div>
                    ` : ''}
                    ${actionsHTML}
                </div>
            </div>
        `;
    }

    function generateOutcomeActions(outcome) {
        if (outcome.type === 'opportunity' && outcome.choices) {
            return `
                <div class="action-buttons">
                    ${outcome.choices.map((choice, index) => `
                        <button class="btn ${index === 0 ? 'btn-select' : 'btn-skip'}" 
                                onclick="handleOpportunityChoice(${JSON.stringify(choice).replace(/"/g, '&quot;')}, this)">
                            ${choice.text}
                        </button>
                    `).join('')}
                </div>
            `;
        } else if (outcome.type === 'challenge' && outcome.solutions) {
            return `
                <div class="solutions-section">
                    <h4>💡 Potential Solutions:</h4>
                    <ul class="solutions-list">
                        ${outcome.solutions.map(solution => `<li>${solution}</li>`).join('')}
                    </ul>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-select" onclick="acknowledgeOutcome(${JSON.stringify(outcome).replace(/"/g, '&quot;')}, this)">
                        Acknowledge
                    </button>
                </div>
            `;
        }
        
        return `
            <div class="action-buttons">
                <button class="btn btn-select" onclick="acknowledgeOutcome(${JSON.stringify(outcome).replace(/"/g, '&quot;')}, this)">
                    Acknowledge
                </button>
            </div>
        `;
    }

    function handleOpportunityChoice(choice, button) {
        // Apply the impact of the choice
        if (choice.impact.cost) gameState.runway += choice.impact.cost;
        if (choice.impact.time) gameState.currentMonth += choice.impact.time;
        
        updateGameStats({ impact: choice.impact, category: 'outcome' });
        selectCard(button, { 
            title: choice.text, 
            description: `Chose: ${choice.text}`,
            impact: choice.impact,
            category: 'outcome'
        });
    }

    function acknowledgeOutcome(outcome, button) {
        updateGameStats(outcome);
        selectCard(button, outcome);
    }

// Enhanced milestone checking
    function checkRevenueMilestones() {
        if (!gameState.milestonesHit) gameState.milestonesHit = {};
        
        if (gameState.monthlyRevenue >= 1000 && !gameState.milestonesHit.first1k) {
            queueOutcomeCard(outcomeCards.revenueMilestones[0]);
            gameState.milestonesHit.first1k = true;
        }
        
        const netBurn = gameState.monthlyBurn - gameState.monthlyRevenue;
        if (netBurn <= 0 && gameState.monthlyRevenue > 2000 && !gameState.milestonesHit.profitable) {
            queueOutcomeCard(outcomeCards.revenueMilestones[1]);
            gameState.milestonesHit.profitable = true;
        }
    }

// Optimized card loading with batching
    function loadMoreCards(cardCount = CARD_RENDER_BATCH_SIZE) {
        if (isLoading) return;
        isLoading = true;

        const container = domCache.simulatorContainer || document.getElementById('simulatorContainer');
        
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-more';
        loadingDiv.innerHTML = '⚡ Generating business opportunities...';
        container.appendChild(loadingDiv);

        setTimeout(() => {
            container.removeChild(loadingDiv);
            
            // Check for outcomes and milestones
            checkForOutcomes();
            checkRevenueMilestones();
            
            // Add outcome card if queued (25% chance)
            if (outcomeQueue.length > 0 && Math.random() > 0.75) {
                const outcomeHTML = generateOutcomeCard();
                if (outcomeHTML) {
                    const cardElement = document.createElement('div');
                    cardElement.innerHTML = outcomeHTML;
                    container.appendChild(cardElement.firstElementChild);
                    cardCount--;
                }
            }
            
            // Add regular cards in batch
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < cardCount; i++) {
                const cardHTML = generateBusinessCard();
                const cardElement = document.createElement('div');
                cardElement.innerHTML = cardHTML;
                fragment.appendChild(cardElement.firstElementChild);
            }
            container.appendChild(fragment);
            
            isLoading = false;
        }, 800);
    }

// Throttled scroll handler for better performance
    function setupInfiniteScroll() {
        const container = domCache.simulatorContainer || document.getElementById('simulatorContainer');
        
        container.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            
            scrollTimeout = setTimeout(() => {
                if (container.scrollTop + container.clientHeight >= container.scrollHeight - 500) {
                    loadMoreCards();
                }
                scrollTimeout = null;
            }, SCROLL_THROTTLE_MS);
        });
    }

// Enhanced initialization with better error handling
function initializeSimulator() {
    try {
        initDOMCache();
        
        const container = domCache.simulatorContainer;
        if (!container) {
            console.error('Simulator container not found');
            return;
        }
        
        container.style.marginBottom = '14px';
        
        // Add instructions card first
        const instructionsHTML = generateInstructionsCard();
        const instructionsElement = document.createElement('div');
        instructionsElement.innerHTML = instructionsHTML;
        container.appendChild(instructionsElement.firstElementChild);
        
        // Initialize with cards
        for (let i = 0; i < 2; i++) {
            loadMoreCards();
        }
        
        setupInfiniteScroll();
        updateCompanyName();
        //Calculate metrics for existing selections
        if (gameState.selectedCards.length > 0) {
            recalculateAllMetrics();
        }
        updateUI();
        initializeCompanyMetricsModal();
        
        // Add event listeners
        domCache.selectionsBtn?.addEventListener('click', showSelectionsModal);

        // Modal event listeners
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('selectionsModal');
            if (modal && e.target === modal) {
                closeSelectionsModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSelectionsModal();
            }
        });
        
        console.log('Startup Simulator initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize simulator:', error);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeSimulator);