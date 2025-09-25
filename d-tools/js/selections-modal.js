// NEW FUNCTIONS FOR SELECTIONS VIEW
function createSelectionsModal() {
    const modal = document.createElement('div');
    modal.className = 'selections-modal';
    modal.id = 'selectionsModal';
    
    modal.innerHTML = `
        <div class="selections-modal-content">
            <div class="selections-header">
                <h2>📋 Your Selections</h2>
                <button class="close-modal" onclick="closeSelectionsModal()">&times;</button>
            </div>
            <div class="selections-body" id="selectionsBody">
                <!-- Content will be populated by showSelections() -->
            </div>
            <div class="selections-footer">
                <button class="btn btn-clear" onclick="clearAllSelections()">Clear All</button>
                <button class="btn btn-export" onclick="exportSelections()">Export Plan</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function showSelectionsModal() {
    let modal = document.getElementById('selectionsModal');
    
    // Create modal if it doesn't exist
    if (!modal) {
        createSelectionsModal();
        modal = document.getElementById('selectionsModal');
    }
    
    // Populate with current selections
    populateSelections();
    
    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeSelectionsModal() {
    const modal = document.getElementById('selectionsModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

function populateSelections() {
    const selectionsBody = document.getElementById('selectionsBody');
    
    if (gameState.selectedCards.length === 0) {
        selectionsBody.innerHTML = `
            <div class="no-selections">
                <div class="no-selections-icon">🎯</div>
                <h3>No selections yet</h3>
                <p>Start building your startup by adding cards!</p>
            </div>
        `;
        return;
    }
    
    const categoryEmojis = {
        validation: "🎯",
        team: "🤜🤛",
        product: "⚡",
        marketing: "📈",
        business: "💼",
        revenue: "💰",
        outcome: "✨"  // Added for outcome cards
    };
    
    let html = `
        <div class="selections-summary">
            <div class="summary-stats">
                <div class="summary-stat">
                    <span class="summary-value">${gameState.selectedCards.length}</span>
                    <span class="summary-label">Total Selections</span>
                </div>
                <div class="summary-stat">
                    <span class="summary-value">${gameState.monthlyRevenue}</span>
                    <span class="summary-label">Revenue /mo</span>
                </div>
                <div class="summary-stat">
                    <span class="summary-value">${gameState.timeToMVP}mo</span>
                    <span class="summary-label">Time to MVP</span>
                </div>
            </div>
        </div>
    `;
    
    // Add each selection with a global index
    gameState.selectedCards.forEach((card, globalIndex) => {
        const category = card.category;
        const isRemovable = category !== 'outcome'; // Don't allow removing outcome/opportunity cards
        
        // Use the stored calendar date or fall back to relative time
        const timeDisplay = card.selectedAt || card.relativeTime || 'Time not recorded';
        const detailTime = card.relativeTime ? `(${card.relativeTime})` : '';
        
        html += `
            <div class="selection-item ${category}">
                <div class="selection-content">
                    <div class="timeline-item-info">
                        <div class="selection-title">${card.title}</div>
                        <a href="javascript:learnMore('${card.category}')">
                            <div class="card-type selection-timeline">${card.category}&nbsp; ${categoryEmojis[category]}</div>
                        </a>
                    </div>
                    <div class="selection-time">
                        <div class="selection-date">${timeDisplay}</div>&nbsp;
                        ${detailTime ? `<div class="selection-relative-time">${detailTime}</div>` : ''}
                    </div>
                </div>
                ${isRemovable ? `
                    <button class="remove-selection" onclick="removeSelection(${globalIndex})" title="Remove this selection">
                        &times;
                    </button>
                ` : `
                    <div class="remove-selection" style="background: #f1f5f9; color: #94a3b8; cursor: not-allowed;" title="Outcome cards cannot be removed">
                        🔒
                    </div>
                `}
            </div>
        `;
    });
    
    selectionsBody.innerHTML = html;
    // scroll to bottom
    selectionsBody.scrollTop = selectionsBody.scrollHeight;
}

// FIXED: Use global index instead of category-based index
function removeSelection(globalIndex) {
    // Validate index
    if (globalIndex < 0 || globalIndex >= gameState.selectedCards.length) {
        console.error('Invalid selection index:', globalIndex);
        return;
    }
    
    const card = gameState.selectedCards[globalIndex];
    
    // Don't allow removing outcome/opportunity cards
    if (card.category === 'outcome') {
        alert('Outcome cards cannot be removed as they represent permanent outcomes of your decisions.');
        return;
    }
    
    // Remove the card at the specific global index
    gameState.selectedCards.splice(globalIndex, 1);
    
    // Recalculate game stats
    recalculateGameStats();
    
    // Update the modal content
    populateSelections();
    
    // Update button text
    updateSelectionsButtonText();
}

function clearAllSelections() {
    if (confirm('Are you sure you want to clear all selections? This action cannot be undone.')) {
        // Only remove cards that aren't outcomes
        gameState.selectedCards = gameState.selectedCards.filter(card => card.category === 'outcome');
        
        if (gameState.selectedCards.length > 0) {
            alert('Note: Outcome cards (outcomes) cannot be removed and will remain in your timeline.');
        }
        
        recalculateGameStats();
        populateSelections();
        updateSelectionsButtonText();
    }
}

// REPLACE the recalculateGameStats function in selections-modal.js with this FIXED version:
function recalculateGameStats() {
    // Reset to base values
    gameState.teamSize = 1;
    gameState.timeToMVP = 1;
    gameState.cost = 50;
    gameState.monthlyBurn = 5000; // Reset to base burn rate
    gameState.monthlyRevenue = 0;
    gameState.currentMonth = 1;
    gameState.currentYear = 1;
    
    // Reset all the new metrics
    gameState.customers = 0;
    gameState.growth = 0;
    gameState.engagement = 0;
    gameState.confidence = 0;
    gameState.credibility = 0;
    gameState.reach = 0;
    gameState.totalRevenue = 0;
    
    // Recalculate based on remaining selections
    gameState.selectedCards.forEach(card => {
        if (card.category === 'team') {
            gameState.teamSize++;
            gameState.cost += card.salary;
            gameState.monthlyBurn += card.salary / 12;
        }
        
        if (card.impact && card.impact.time) {
            gameState.timeToMVP += card.impact.time;
            if (gameState.timeToMVP < 1) gameState.timeToMVP = 1;
        }
        
        if (card.impact && card.impact.cost) {
            gameState.cost += card.impact.cost;
        }
        
        if (card.impact && card.impact.monthlyRevenue) {
            gameState.monthlyRevenue += card.impact.monthlyRevenue;
        }
        
        // Apply all the new metric tracking
        if (card.impact) {
            if (card.impact.customers) gameState.customers += card.impact.customers;
            if (card.impact.growth) gameState.growth += card.impact.growth;
            if (card.impact.engagement) gameState.engagement += card.impact.engagement;
            if (card.impact.confidence) gameState.confidence += card.impact.confidence;
            if (card.impact.credibility) gameState.credibility += card.impact.credibility;
            if (card.impact.reach) gameState.reach += card.impact.reach;
            if (card.impact.retention) gameState.engagement += Math.floor(card.impact.retention * 0.5);
            if (card.impact.quality) gameState.confidence += Math.floor(card.impact.quality * 0.3);
            if (card.impact.scalability) gameState.reach += Math.floor(card.impact.scalability * 0.4);
        }
        
        // Category-specific impacts
        switch (card.category) {
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
            // Don't apply bonuses for outcome cards as they already have their impacts
        }
    });
    
    // Update months based on time impacts
    gameState.selectedCards.forEach(card => {
        if (card.impact && card.impact.time) {
            gameState.currentMonth += Math.abs(card.impact.time);
        }
    });
    
    // Update year tracking
    gameState.currentYear = Math.floor((gameState.currentMonth - 1) / 12) + 1;
    
    // Calculate total revenue from months passed
    if (gameState.currentMonth > 1 && gameState.monthlyRevenue > 0) {
        gameState.totalRevenue = gameState.monthlyRevenue * (gameState.currentMonth - 1);
    }
    
    // Estimate customers from revenue if needed
    if (gameState.customers < 10 && gameState.monthlyRevenue > 1000) {
        gameState.customers = Math.floor(gameState.monthlyRevenue / 100);
    }
    
    // Cap all percentage-based metrics at 100
    gameState.growth = Math.min(100, Math.max(0, gameState.growth));
    gameState.engagement = Math.min(100, Math.max(0, gameState.engagement));
    gameState.confidence = Math.min(100, Math.max(0, gameState.confidence));
    gameState.credibility = Math.min(100, Math.max(0, gameState.credibility));
    gameState.reach = Math.min(100, Math.max(0, gameState.reach));
    gameState.customers = Math.max(0, gameState.customers);
    
    // Update runway based on current burn and time passed
    const netBurn = Math.max(0, gameState.monthlyBurn - gameState.monthlyRevenue);
    const monthsPassed = gameState.currentMonth - 1;
    if (monthsPassed > 0 && netBurn > 0) {
        gameState.runway = Math.max(0, 100000 - (netBurn * monthsPassed)); // Start with 100k runway
    }
    
    // FIXED: Update UI using the correct element IDs and safe checks
    const teamSizeElement = document.getElementById('teamSize');
    const currentMonthElement = document.getElementById('currentMonth');  
    const runwayElement = document.getElementById('runway');
    const revenueElement = document.getElementById('revenue');
    
    if (teamSizeElement) {
        teamSizeElement.textContent = gameState.teamSize;
    }
    
    if (currentMonthElement) {
        // Update month display with year tracking (matching the format in updateUI)
        const displayMonth = ((gameState.currentMonth - 1) % 12) + 1;
        if (gameState.currentYear > 1) {
            currentMonthElement.textContent = `Y${gameState.currentYear} M${displayMonth}`;
        } else {
            currentMonthElement.textContent = `M${displayMonth}`;
        }
    }
    
    if (runwayElement) {
        // Format runway display (matching the format in updateUI)
        let runwayDisplay;
        if (gameState.runway >= 1000000) {
            runwayDisplay = '$' + (gameState.runway / 1000000).toFixed(1) + 'M';
        } else if (gameState.runway >= 1000) {
            runwayDisplay = '$' + (gameState.runway / 1000).toFixed(0) + 'K';
        } else if (gameState.runway >= 0) {
            runwayDisplay = '$' + gameState.runway.toFixed(0);
        } else {
            const absRunway = Math.abs(gameState.runway);
            if (absRunway >= 1000000) {
                runwayDisplay = '-$' + (absRunway / 1000000).toFixed(1) + 'M';
            } else if (absRunway >= 1000) {
                runwayDisplay = '-$' + (absRunway / 1000).toFixed(0) + 'K';
            } else {
                runwayDisplay = '-$' + absRunway.toFixed(0);
            }
        }
        runwayElement.textContent = runwayDisplay;
    }
    
    if (revenueElement) {
        revenueElement.textContent = '$' + (gameState.monthlyRevenue / 1000).toFixed(1) + 'k/mo';
    }
    
    // Also call the main updateUI function if it exists (this will handle any other UI updates)
    if (typeof updateUI === 'function') {
        updateUI();
    }
}

function exportSelections() {
    const exportData = {
        companyName: document.getElementById('companyName').textContent,
        stats: {
            teamSize: gameState.teamSize,
            timeToMVP: gameState.timeToMVP,
            cost: gameState.cost
        },
        selections: gameState.selectedCards,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${exportData.companyName.replace(/\s+/g, '_')}_business_plan.json`;
    link.click();
    
    // Also show a summary in console for debugging
    console.log('Startup Plan Export:', exportData);
}

function learnMore(category) {
    const links = {
        validation: 'project-validation-methods.html',
        team: 'careers-list.html',
        product: 'business-idea-generator.html',
        marketing: 'entrepreneur-decision-tree.html',
        business: 'decision-tools.html'
    };
    
    // In a real implementation, this would navigate to the Dlightning tool
    console.log(`Navigate to: ${links[category]}`);
    window.open(links[category], '_blank');
}