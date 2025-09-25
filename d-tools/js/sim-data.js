// generate the instructions card
function generateInstructionsCard() {
    return `
        <div class="business-card instructions" style="animation-delay: 0s">
            <div class="card-header instructions">
                <div class="card-type-wrapper">
                    <div><p>Getting Started</p></div>
                    <div class="card-type">TUTORIAL</div>
                </div>
                <h1><i>Dlightning⚡</i> Startup Simulator</h1>
            </div>
            <img src="svg/market-launch-animate.svg" alt="launching" loading="lazy"/>
            <div class="card-body">
                <a class="storyset-link" href="https://storyset.com/online" target="_blank">Illustrations by Storyset</a>
                <div class="impact-metrics">
                    <div class="metric">
                        <span class="metric-value">📊</span>
                        <span class="metric-label">View Stats</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">💡</span>
                        <span class="metric-label">Make Choices</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">📋</span>
                        <span class="metric-label">Track Progress</span>
                    </div>
                </div>
                <div class="card-content">
                    <div class="content-title">
                        Build Your Startup
                    </div>
                    <div class="content-desc">
                        You'll see cards with business decisions. Each choice impacts your team size, timeline, and budget. 
                        <strong>Add</strong> cards you want for your startup or <strong>Skip</strong> ones you don't
                    </div>
                </div>

                <div style="background: #f0f9ff; border-radius: 8px; padding: 12px; margin: 12px 0; font-size: 13px;">
                    <strong>Pro Tip:</strong> Balance your budget and runway by carefully chosing when to scale up.
                </div>

                <div class="action-buttons">
                    <button class="btn btn-skip" onclick="skipCard(this)">
                        Skip Tutorial
                    </button>
                    <button class="btn btn-select" onclick="skipCard(this)">
                        Start Building
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Business simulation data
const validationMethods = [
    {
        title: "Customer Discovery Interviews",
        description: "Talk to 20+ potential customers to understand their pain points",
        impact: { time: .5, cost: 500, confidence: 15, customers: 5 },
        category: "validation",
        svg: "svg/active-support-animate.svg"
    },
    {
        title: "Landing Page MVP",
        description: "Create a simple page to test demand before building",
        impact: { time: 1, cost: 1000, confidence: 10 },
        category: "validation",
        svg: "svg/static-website-animate.svg"
    },
    {
        title: "Prototype Testing",
        description: "Build interactive mockup for user validation",
        impact: { time: 1, cost: 3000, confidence: 20 },
        category: "validation",
        svg: "svg/prototyping-process-animate.svg"
    },
    {
        title: "A/B Testing Framework",
        description: "Set up systematic testing for all major decisions",
        impact: { time: 2, cost: 2000, confidence: 12 },
        category: "validation",
        svg: "svg/usability-testing-animate.svg"
    }
];

const teamMembers = [
    {
        title: "UX/UI Designer",
        description: "Create intuitive, beautiful user experiences that drive engagement",
        salary: 85000,
        impact: { time: 1, quality: 25 },
        category: "team",
        level: "Mid-Senior",
        svg: "svg/mobile-wireframe-animate.svg"
    },
    {
        title: "Full-Stack Developer",
        description: "Build and maintain your platform with versatile technical skills",
        salary: 95000,
        impact: { time: 2, quality: 30 },
        category: "team",
        level: "Mid Level",
        svg: "svg/coding-animate.svg"
    },
    {
        title: "Customer Success Manager",
        description: "Retain and grow existing users through exceptional support",
        salary: 75000,
        impact: { time: 1, quality: 10, retention: 40 },
        category: "team",
        level: "Mid Level",
        svg: "svg/follow-the-leader-animate.svg"
    },
    {
        title: "Content Marketing Manager",
        description: "Scale thought leadership and drive organic growth",
        salary: 70000,
        impact: { time: .5, quality: 30, growth: 35 },
        category: "team",
        level: "Mid Level",
        svg: "svg/mobile-marketing-animate.svg"
    },
    {
        title: "DevOps Engineer",
        description: "Scale infrastructure and ensure platform reliability",
        salary: 105000,
        impact: { time: 1.5, quality: 40, scalability: 50 },
        category: "team",
        level: "Senior Level",
        svg: "svg/programmer-animate.svg"
    },
    {
        title: "Sales Manager",
        description: "Drive enterprise sales and close high-value deals",
        salary: 90000,
        impact: { time: 1, credibility: 25, growth: 20},
        category: "team",
        level: "Senior Level",
        svg: "svg/finance-animate.svg"
    },
    {
        title: "Product Manager",
        description: "Coordinate development priorities and market strategy",
        salary: 110000,
        impact: { time: 2, quality: 35, predictability: 30},
        category: "team",
        level: "Senior Level",
        svg: "svg/selecting-team-animate.svg"
    }
];

const productFeatures = [
    {
        title: "AI-Powered Recommendations",
        description: "Intelligent suggestions based on user behavior and industry trends",
        impact: { time: 3, cost: 15000, reach: 25, engagement: 30, retention: -10 },
        category: "product",
        svg: "svg/robotics-animate.svg"
    },
    {
        title: "Real-time Collaboration",
        description: "Add features for collaboration",
        impact: { time: 2, cost: 8000, reach: 25, engagement: 60, retention: 10 },
        category: "product",
        svg: "svg/design-team-animate.svg"
    },
    {
        title: "Mobile Application",
        description: "Native iOS and Android apps for on-the-go access",
        impact: { time: 4, cost: 25000, reach: 50, engagement: 10, retention: -5 },
        category: "product",
        svg: "svg/mobile-login-animate.svg"
    },
    {
        title: "Integration Marketplace",
        description: "Connect your product with popular business tools and platforms by connecting APIs",
        impact: { time: 3.5, cost: 12000, reach: 30, engagement: 20, retention: 20 },
        category: "product",
        svg: "svg/website-setup-animate.svg"
    }
];

const marketingStrategies = [
    {
        title: "Content-Led Growth",
        description: "Build audience through educational blog posts and guides",
        impact: { time: 1, cost: 3000, growth: 35, credibility: 35, loyalty: 10 },
        category: "marketing",
        svg: "svg/social-dashboard-animate.svg"
    },
    {
        title: "Partnership Program",
        description: "Strategic alliances with business accelerators and incubators",
        impact: { time: 2, cost: 5000, growth: 15, credibility: 15, loyalty: 20 },
        category: "marketing",
        svg: "svg/live-collaboration-animate.svg"
    },
    {
        title: "Community Building",
        description: "Create engaged entrepreneur community around your platform",
        impact: { time: 4, cost: 4000, growth: 45, credibility: 25, loyalty: 50 },
        category: "marketing",
        svg: "svg/group-chat-animate.svg"
    },
    {
        title: "Paid Acquisition",
        description: "Targeted ads on Google, LinkedIn, and Facebook",
        impact: { time: .5, cost: 8000, growth: 25, credibility: -5, loyalty: 5 },
        category: "marketing",
        svg: "svg/mobile-payments-animate.svg"
    }
];

const businessModels = [
    {
        title: "Freemium SaaS",
        description: "Free tier with premium features for power users",
        impact: { time: 3.5, cost: 2000, growth: 25, oneTimeRevenue: 2000, scalability: 40, predictability: -5 },
        category: "business",
        svg: "svg/setup-wizard-animate.svg"
    },
    {
        title: "Enterprise Licensing",
        description: "Custom solutions for large organizations and corporations",
        impact: { time: 2, cost: 5000, growth: 5, oneTimeRevenue: 6000, scalability: 60, predictability: 15 },
        category: "business",
        svg: "svg/business-deal-animate.svg"
    },
    {
        title: "Marketplace Commission",
        description: "Take percentage of transactions facilitated through platform",
        impact: { time: 3, cost: 3600, growth: 15, oneTimeRevenue: -1000, scalability: 10, predictability: 5 },
        category: "business",
        svg: "svg/paid-idea-animate.svg"
    },
    {
        title: "Subscription Tiers",
        description: "Multiple pricing levels based on features and usage",
        impact: { time: 3, cost: 2500, growth: 5, oneTimeRevenue: 1000, scalability: 30, predictability: 45 },
        category: "business",
        svg: "svg/subscriber-animate.svg"
    }
];
// End business model cards

// Revenue-generating cards to add to existing arrays
    const revenueCards = [
        {
            title: "Paying Customer",
            description: "Paying customer $100/month",
            impact: { monthlyRevenue: 100, recurringPayTime: 36, confidence: 25, time: 0, customers: 1 },
            category: "revenue",
            svg: "svg/credit-card-payment-animate.svg"
        },
        {
            title: "Beta Customer Program", 
            description: "10 beta customers at $50/month each to test and provide feedback",
            impact: { monthlyRevenue: 500, recurringPayTime: 3, confidence: 15,  time: 1.5, customers: 10 },
            category: "revenue",
            svg: "svg/product-tour-animate.svg"
        },
        {
            title: "Freelance/Consulting Revenue",
            description: "Use your expertise to generate $3k/month while building your product by consulting for another company",
            impact: { monthlyRevenue: 3000, recurringPayTime: 2, confidence: 30, time: 1, focus: -10 },
            category: "revenue",
            svg: "svg/online-consulting-animate.svg"
        },
        { // should only appear if business model subscriptions are selected
            title: "Subscription Launch",
            description: "Launch paid subscriptions at $29/month, acquire 20 customers",
            impact: { monthlyRevenue: 580, recurringPayTime: 6, confidence: 15, growth: 25, time: 2, customers: 20 },
            category: "revenue",
            svg: "svg/subscriber-gold-animate.svg"
        },
        {
            title: "Enterprise Pilot Deal",
            description: "Land a 6-month pilot with a corporation for $5k/month",
            impact: { monthlyRevenue: 5000, recurringPayTime: 6, credibility: 30, complexity: 15, time: .5 },
            category: "revenue",
            svg: "svg/happy-announcement-animate.svg"
        },
        {
            title: "Affiliate Program Launch",
            description: "Partners drive $1.5k in monthly recurring revenue through referrals",
            impact: { monthlyRevenue: 1500, recurringPayTime: 8, time: .5, customers: 10 },
            category: "revenue",
            svg: "svg/payment-information-animate.svg"
        },
        {
            title: "Upsell Existing Customers",
            description: "Increase average revenue per customer by $75/month through premium features",
            impact: { monthlyRevenue: 750, recurringPayTime: 36, retention: -5, time: 1 },
            category: "revenue",
            svg: "svg/operating-system-upgrade-animate.svg"
        },
        {
            title: "Corporate Training Contract",
            description: "Monthly training sessions generate $2.5k recurring revenue",
            impact: { monthlyRevenue: 2500, recurringPayTime: 2, retention: 25, time: 1, customers: 25 },
            category: "revenue",
            svg: "svg/product-presentation-animate-copy.svg"
        }
    ];
// End revenue-generating cards

// Outcome cards 
const outcomeCards = {
    // POSITIVE OUTCOMES
    positive: [
        {
            title: "Early Customer Traction",
            description: "Your customer discovery interviews paid off! 3 potential customers are ready to pre-order.",
            trigger: "customer_discovery_interviews",
            impact: { monthlyRevenue: 300, recurringPayTime: 24, confidence: 20, time: -1, customers: 3 },
            category: "outcome",
            type: "positive",
            svg: "svg/in-no-time-animate.svg",
            followUp: "A local startup accelerator noticed your early traction and wants to meet."
        },
        {
            title: "Viral Product Demo",
            description: "Your prototype testing went viral on social media. 10k signups in 48 hours!",
            trigger: "prototype_testing",
            impact: { customers: 1000, engagement: 30, time: -.5, cost: -2000 },
            category: "outcome",
            type: "positive",
            svg: "svg/deconstructed-animate.svg",
            followUp: "TechCrunch wants to write about your rapid user growth."
        },
        {
            title: "Key Hire Success",
            description: "Your new UX designer just won a design award, boosting your company's credibility.",
            trigger: "ux_ui_designer",
            impact: { credibility: 25, recruitment: 15, time: 1 },
            category: "outcome",
            type: "positive",
            svg: "svg/awards-animate.svg",
            followUp: "Other top designers are now interested in joining your team."
        },
        {
            title: "Partnership Goldmine",
            description: "Your partnership program landed a major client worth $50k annually.",
            trigger: "partnership_program",
            impact: { oneTimeRevenue: 50000, credibility: 30, time: -1, growth: 20 },
            category: "outcome",
            type: "positive",
            svg: "svg/shared-goals-animate.svg",
            followUp: "They want to introduce you to their network of similar companies."
        },
        {
            title: "Community Champions",
            description: "Your user community is creating content and tutorials, reducing your marketing costs.",
            trigger: "community_building",
            impact: { engagement: 40, cost: -5000, time: -2, loyalty: 35 },
            category: "outcome",
            type: "positive",
            svg: "svg/team-spirit-animate.svg",
            followUp: "Users are asking about a referral program and premium community features."
        }
    ],

// NEGATIVE CHALLENGES
    challenges: [
        {
            title: "Feature Creep Crisis",
            description: "Without customer validation, you built features nobody wants. Pivot required.",
            trigger: "no_validation",
            impact: { time: .5, cost: 10000, confidence: -25 },
            category: "outcome",
            type: "challenge",
            svg: "svg/bug-fixing-animate.svg",
            followUp: "Your team is frustrated, and you need to rebuild user trust.",
            solutions: ["Start customer interviews now", "Simplify to core features", "Run user surveys"]
        },
        {
            title: "Founder Burnout",
            description: "Working alone is taking its toll. You're making mistakes and missing opportunities.",
            trigger: "solo_founder",
            impact: { time: .5, quality: -20, growth: -15, confidence: -15 },
            category: "outcome",
            type: "challenge",
            svg: "svg/student-stress-animate.svg",
            followUp: "A potential co-founder approached you, but you're not sure about giving up equity.",
            solutions: ["Find a co-founder", "Hire more employees", "Join founder support group"]
        },
        {
            title: "Cash Flow Crunch",
            description: "Your expensive staff/features are burning through budget faster than expected.",
            trigger: "high_budget",
            impact: { cost: 15000, time: .5, stress: 30, confidence: -45 },
            category: "outcome",
            type: "challenge",
            svg: "svg/money-stress-animate.svg",
            followUp: "You need to either raise funds or significantly cut costs within 2 months.",
            solutions: ["Seek angel investment", "Reduce feature scope", "Find paying customers quickly"]
        },
        {
            title: "Launch Day Disaster",
            description: "Your mobile app crashes under load. No DevOps means no quick recovery.",
            trigger: "no_devops",
            impact: { cost: 25000, time: 1.5, reputation: -30, customers: -500, confidence: -30 },
            category: "outcome",
            type: "challenge",
            svg: "svg/500-internal-server-error-animate.svg",
            followUp: "Social media is buzzing with complaints. Your App Store rating dropped to 2 stars.",
            solutions: ["Hire DevOps engineer immediately", "Use cloud auto-scaling", "Issue public apology"]
        },
        {
            title: "Marketing Void",
            description: "You built it, but they didn't come. Great product, but nobody knows about it.",
            trigger: "no_marketing",
            impact: { customers: -200, time: 1.5, growth: -25, cost: 10000 },
            category: "outcome",
            type: "challenge",
            svg: "svg/empty-animate.svg",
            followUp: "Competitors with inferior products are gaining market share.",
            solutions: ["Start content marketing", "Launch referral program", "Partner with influencers"]
        },
        { // need to make sure this gets added to the cards based on a trigger
            title: "Employee Quits",
            description: "One of your employees quits. What happens next?",
            trigger: "employee_quit",
            impact: { cost: -10000, time: 2, team: -1 },
            category: "outcome",
            type: "challenge",
            svg: "svg/quitting-a-job-animate.svg",
            followUp: "You'll need to find a replacement.",
            solutions: ["Hire a replacement", "Offer a equity package"]
        }
    ],

// OPPORTUNITY CARDS
    opportunities: [
        {
            title: "Acquisition Offer",
            description: "A larger company wants to buy your startup for $2M. Take the exit or keep building?",
            trigger: "strong_growth",
            impact: { decision: "exit_or_continue" },
            category: "outcome",
            type: "opportunity",
            svg: "svg/agreement-animate.svg",
            choices: [
                { text: "Accept Offer", impact: { success: "exit", value: 2000000 }},
                { text: "Keep Building", impact: { pressure: 20, potential: 50 }}
            ]
        },
        {
            title: "Investor Interest",
            description: "A VC firm wants to lead your Series A round. $5M for 25% equity.",
            trigger: "proven_model",
            impact: { decision: "funding_decision" },
            category: "outcome",
            type: "opportunity",
            svg: "svg/investor-pitch-animate.svg",
            choices: [
                { text: "Take Investment", impact: { cost: 5000000, pressure: 30, growth: 40 }},
                { text: "Bootstrap Longer", impact: { control: 25, growth: 10 }}
            ]
        },
        {
            title: "Enterprise Pivot",
            description: "Your B2C product is struggling, but enterprises love a modified version.",
            trigger: "b2c_struggles",
            impact: { decision: "pivot_decision" },
            category: "outcome",
            type: "opportunity",
            svg: "svg/business-analytics-animate.svg",
            choices: [
                { text: "Pivot to B2B", impact: { cost: 10000, customers: -50, complexity: 20 }},
                { text: "Stay B2C", impact: { engagement: -25, customers: -130 , competition: 30 }}
            ]
        }
    ],

    revenueMilestones: [
        {
            title: "First $1K MRR! 🎉",
            description: "You've hit your first major revenue milestone. The product-market fit is starting to show.",
            trigger: "revenue_1k",
            impact: { confidence: 25, credibility: 20 },
            category: "outcome",
            type: "positive",
            svg: "svg/make-it-rain-animate.svg",
            followUp: "Local startup community is taking notice. You got invited to speak at a meetup."
        },
        {
            title: "Ramen Profitability Achieved",
            description: "Your revenue now covers basic living expenses. You can focus full-time on growth!",
            trigger: "revenue_profitable",
            impact: { focus: 30, stress: -20 },
            category: "outcome", 
            type: "positive",
            svg: "svg/going-up-animate.svg",
            followUp: "You can finally quit your day job and go full-time on the startup."
        }
    ]
};