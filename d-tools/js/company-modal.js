// COMPANY METRICS MODAL FUNCTIONS
function createCompanyMetricsModal() {
    const modal = document.createElement('div');
    modal.className = 'company-metrics-modal';
    modal.id = 'companyMetricsModal';
    
    modal.innerHTML = `
        <div class="company-metrics-modal-content">
            <div class="company-metrics-header">
                <div class="company-info">
                    <h2 id="companyNameTitle">Loading...</h2>
                    <span id="companyFoundedInfo">Founded: Loading...</span>
                </div>
                <button class="close-modal" onclick="closeCompanyMetricsModal()">&times;</button>
            </div>
            <div class="company-metrics-body" id="companyMetricsBody">
                <!-- Content will be populated by populateCompanyMetrics() -->
            </div>
            <div class="company-metrics-footer">
                <button class="btn btn-export" onclick="exportCompanyReport()">Export Report</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showCompanyMetricsModal() {
    let modal = document.getElementById('companyMetricsModal');
    
    // Create modal if it doesn't exist
    if (!modal) {
        createCompanyMetricsModal();
        modal = document.getElementById('companyMetricsModal');
    }
    
    // Populate with current metrics
    populateCompanyMetrics();
    
    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeCompanyMetricsModal() {
    const modal = document.getElementById('companyMetricsModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function populateCompanyMetrics() {
    const metricsBody = document.getElementById('companyMetricsBody');
    const companyName = document.getElementById('companyNameTitle');
    const foundedInfo = document.getElementById('companyFoundedInfo');
    
    // Calculate additional metrics
    const burnRate = gameState.monthlyBurn;
    const netIncome = gameState.monthlyRevenue - burnRate;
    const runwayMonths = gameState.runway > 0 ? Math.floor(gameState.runway / Math.max(burnRate - gameState.monthlyRevenue, 1)) : 0;
    const averageRevenuePerCustomer = gameState.customers > 0 ? (gameState.monthlyRevenue / gameState.customers) : 0;
    
    // Update founded info with proper date
    const currentGameDate = getCurrentGameDate();
    foundedInfo.textContent = `Founded: ${gameState.foundedDisplay} • Current: ${formatGameDate(currentGameDate)}`;
    companyName.textContent = `${gameState.companyName}`;
    
    const metricsHTML = `
        <div class="metrics-grid">
            <!-- Financial Metrics -->
            <div class="metric-category">
                <h3 class="category-title">💰 Financial Health</h3>
                <div class="metric-items">
                    <div class="metric-card">
                        <div class="metric-value">${formatCurrency(gameState.totalRevenue)}</div>
                        <div class="metric-label">Total Revenue</div>
                        <div class="metric-change ${gameState.totalRevenue > 0 ? 'positive' : 'neutral'}">
                            All-time earnings
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${formatCurrency(burnRate)}/mo</div>
                        <div class="metric-label">Monthly Burn Rate</div>
                        <div class="metric-change ${burnRate < 10000 ? 'positive' : 'negative'}">
                            Operating expenses
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${formatCurrency(netIncome)}/mo</div>
                        <div class="metric-label">Net Income</div>
                        <div class="metric-change ${netIncome > 0 ? 'positive' : 'negative'}">
                            ${netIncome > 0 ? 'Profitable!' : 'Burning cash'}
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${runwayMonths}mo</div>
                        <div class="metric-label">Runway Remaining</div>
                        <div class="metric-change ${runwayMonths > 12 ? 'positive' : runwayMonths > 6 ? 'warning' : 'negative'}">
                            ${runwayMonths > 12 ? 'Healthy runway' : runwayMonths > 6 ? 'Monitor closely' : 'Critical!'}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customer Metrics -->
            <div class="metric-category">
                <h3 class="category-title">👥 Customer Growth</h3>
                <div class="metric-items">
                    <div class="metric-card">
                        <div class="metric-value">${gameState.customers.toLocaleString()}</div>
                        <div class="metric-label">Total Customers</div>
                        <div class="metric-change ${gameState.customers > 100 ? 'positive' : gameState.customers > 10 ? 'warning' : 'neutral'}">
                            ${gameState.customers > 100 ? 'Strong base' : gameState.customers > 10 ? 'Building up' : 'Early stage'}
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${formatCurrency(averageRevenuePerCustomer)}</div>
                        <div class="metric-label">Avg Revenue/Customer</div>
                        <div class="metric-change ${averageRevenuePerCustomer > 50 ? 'positive' : averageRevenuePerCustomer > 20 ? 'warning' : 'neutral'}">
                            ${averageRevenuePerCustomer > 50 ? 'High value' : averageRevenuePerCustomer > 20 ? 'Decent ARPC' : 'Focus on pricing'}
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${gameState.growth}%</div>
                        <div class="metric-label">Growth Score</div>
                        <div class="metric-change ${gameState.growth > 30 ? 'positive' : gameState.growth > 10 ? 'warning' : 'neutral'}">
                            ${gameState.growth > 30 ? 'Rapid growth' : gameState.growth > 10 ? 'Steady progress' : 'Room to improve'}
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${gameState.engagement}%</div>
                        <div class="metric-label">User Engagement</div>
                        <div class="metric-change ${gameState.engagement > 40 ? 'positive' : gameState.engagement > 20 ? 'warning' : 'neutral'}">
                            ${gameState.engagement > 40 ? 'Highly engaged' : gameState.engagement > 20 ? 'Moderate engagement' : 'Needs attention'}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Business Development Metrics -->
            <div class="metric-category">
                <h3 class="category-title">🚀 Business Development</h3>
                <div class="metric-items">
                    <div class="metric-card">
                        <div class="metric-value">${gameState.confidence}%</div>
                        <div class="metric-label">Market Confidence</div>
                        <div class="metric-change ${gameState.confidence > 50 ? 'positive' : gameState.confidence > 25 ? 'warning' : 'neutral'}">
                            ${gameState.confidence > 50 ? 'High confidence' : gameState.confidence > 25 ? 'Building trust' : 'Prove your value'}
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${gameState.credibility}%</div>
                        <div class="metric-label">Industry Credibility</div>
                        <div class="metric-change ${gameState.credibility > 40 ? 'positive' : gameState.credibility > 20 ? 'warning' : 'neutral'}">
                            ${gameState.credibility > 40 ? 'Well established' : gameState.credibility > 20 ? 'Growing reputation' : 'Build your brand'}
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${gameState.reach}%</div>
                        <div class="metric-label">Market Reach</div>
                        <div class="metric-change ${gameState.reach > 35 ? 'positive' : gameState.reach > 15 ? 'warning' : 'neutral'}">
                            ${gameState.reach > 35 ? 'Wide reach' : gameState.reach > 15 ? 'Expanding presence' : 'Limited visibility'}
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${gameState.selectedCards.length}</div>
                        <div class="metric-label">Business Decisions</div>
                        <div class="metric-change ${gameState.selectedCards.length > 20 ? 'positive' : gameState.selectedCards.length > 10 ? 'warning' : 'neutral'}">
                            ${gameState.selectedCards.length > 20 ? 'Experienced founder' : gameState.selectedCards.length > 10 ? 'Learning fast' : 'Just getting started'}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Time & Team Metrics -->
            <div class="metric-category">
                <h3 class="category-title">⏱️ Operations</h3>
                <div class="metric-items">
                    <div class="metric-card">
                        <div class="metric-value">Y${gameState.currentYear} M${((gameState.currentMonth - 1) % 12) + 1}</div>
                        <div class="metric-label">Current Period</div>
                        <div class="metric-change ${gameState.currentMonth < 12 ? 'positive' : gameState.currentMonth < 24 ? 'warning' : 'negative'}">
                            ${gameState.currentMonth < 12 ? 'Early stage' : gameState.currentMonth < 24 ? 'Scaling phase' : 'Mature startup'}
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${gameState.teamSize}</div>
                        <div class="metric-label">Team Members</div>
                        <div class="metric-change ${gameState.teamSize > 5 ? 'positive' : gameState.teamSize > 2 ? 'warning' : 'neutral'}">
                            ${gameState.teamSize > 5 ? 'Strong team' : gameState.teamSize > 2 ? 'Small team' : 'Solo founder'}
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${gameState.cardsGenerated}</div>
                        <div class="metric-label">Decisions Faced</div>
                        <div class="metric-change neutral">
                            Business opportunities seen
                        </div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value">${Math.round((gameState.selectedCards.length / gameState.cardsGenerated) * 100) || 0}%</div>
                        <div class="metric-label">Decision Rate</div>
                        <div class="metric-change ${(gameState.selectedCards.length / gameState.cardsGenerated) > 0.3 ? 'warning' : 'positive'}">
                            ${(gameState.selectedCards.length / gameState.cardsGenerated) > 0.3 ? 'Taking many risks' : 'Selective approach'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    metricsBody.innerHTML = metricsHTML;
}

function formatCurrency(amount) {
    const absAmount = Math.abs(amount);
    const isNegative = amount < 0;
    const prefix = isNegative ? '-$' : '$';
    
    if (absAmount >= 1000000) {
        return prefix + (absAmount / 1000000).toFixed(1) + 'M';
    } else if (absAmount >= 1000) {
        return prefix + (absAmount / 1000).toFixed(1) + 'K';
    } else {
        return prefix + absAmount.toFixed(0);
    }
}

function exportCompanyReport() {
    const reportData = {
        companyName: document.getElementById('companyName').textContent,
        reportDate: new Date().toISOString(),
        timeInBusiness: `${gameState.currentYear} years, ${((gameState.currentMonth - 1) % 12) + 1} months`,
        
        // Financial metrics
        financial: {
            totalRevenue: gameState.totalRevenue,
            monthlyRevenue: gameState.monthlyRevenue,
            monthlyBurn: gameState.monthlyBurn,
            netIncome: gameState.monthlyRevenue - gameState.monthlyBurn,
            currentRunway: gameState.runway,
            runwayMonths: gameState.runway > 0 ? Math.floor(gameState.runway / Math.max(gameState.monthlyBurn - gameState.monthlyRevenue, 1)) : 0
        },
        
        // Customer metrics
        customer: {
            totalCustomers: gameState.customers,
            averageRevenuePerCustomer: gameState.customers > 0 ? (gameState.monthlyRevenue / gameState.customers) : 0,
            engagement: gameState.engagement,
            growth: gameState.growth
        },
        
        // Business metrics
        business: {
            teamSize: gameState.teamSize,
            confidence: gameState.confidence,
            credibility: gameState.credibility,
            reach: gameState.reach,
            decisionsCount: gameState.selectedCards.length,
            decisionRate: (gameState.selectedCards.length / gameState.cardsGenerated) * 100
        },
        
        // Full selections for context
        businessDecisions: gameState.selectedCards,
        
        // Generated at
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${reportData.companyName.replace(/\s+/g, '_')}_company_metrics_report.json`;
    link.click();
    
    // Also log to console for debugging
    console.log('Company Metrics Report:', reportData);
    
    // Show a brief success message
    const originalText = event.target.textContent;
    event.target.textContent = 'Exported! ✓';
    event.target.style.background = '#10b981';
    
    setTimeout(() => {
        event.target.textContent = originalText;
        event.target.style.background = '';
    }, 2000);
}

// Initialize company metrics modal functionality
function initializeCompanyMetricsModal() {
    const companyNameDiv = document.getElementById('companyName');
    
    if (companyNameDiv) {
        // Make it look clickable
        companyNameDiv.style.cursor = 'pointer';
        companyNameDiv.style.transition = 'all 0.2s ease';
        
        // Add hover effect
        companyNameDiv.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.3)';
        });
        
        companyNameDiv.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
        
        // Add click event
        companyNameDiv.addEventListener('click', showCompanyMetricsModal);
    }
    
    // Modal event listeners for clicking outside to close
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('companyMetricsModal');
        if (modal && e.target === modal) {
            closeCompanyMetricsModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCompanyMetricsModal();
        }
    });
}