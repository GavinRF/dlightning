// Component registry module — see js/components/progressBar.js for the convention.
// chipGroup: a row of selectable, editable, sortable "pill" chips with an add button.
// Note: the group's color swatch UI is created separately by createGroupColorSwatch()
// (in extra-func.js); callers invoke that alongside setup() where a swatch is wanted.
window.Components = window.Components || {};

// Select/deselect a chip; a reselected chip takes the group's current selected color.
function chipToggle(chip, chipContainer) {
    if (chip.getAttribute('data-selected') === 'true') {
        chip.style.backgroundColor = 'var(--neutral-gray)';
        chip.setAttribute('data-selected', 'false');
    } else {
        let groupColor = 'var(--color-primary)';
        const selectedChips = chipContainer.querySelectorAll('.chip[data-selected="true"]');
        if (selectedChips.length > 0) groupColor = window.getComputedStyle(selectedChips[0]).backgroundColor;
        chip.style.backgroundColor = groupColor;
        chip.setAttribute('data-selected', 'true');
    }
    requestAnimationFrame(() => window.TextContrastAdjuster?.updateElementContrast(chip));
}

window.Components.chipGroup = {
    // Prototype player (js/prototype.js): select/deselect chips; add/remove/reorder stay editor-only.
    play(root) {
        const chipContainer = root.querySelector('.chip-group-container');
        if (!chipContainer || chipContainer._playBound) return;
        chipContainer._playBound = true;
        chipContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.chip');
            if (chip && !e.target.closest('.remove-chip')) chipToggle(chip, chipContainer);
        });
    },

    setup(container) {
        if (!container) return;

        // Get container and button
        const chipContainer = container.querySelector('.chip-group-container');
        const addButton = container.querySelector('.add-chip-btn');
        if (!chipContainer || !addButton) return;

        // Clean up existing event listeners
        addButton.replaceWith(addButton.cloneNode(true));
        const freshAddButton = container.querySelector('.add-chip-btn');

        new Sortable(chipContainer, {
            animation: 150,
            ghostClass: 'chip-ghost',
            chosenClass: 'chip-chosen',
            dragClass: 'chip-drag',
            onEnd: function() {
                // Flash success indicator
                const chips = chipContainer.querySelectorAll('.chip');
                chips.forEach(chip => {
                    chip.classList.add('reorder-flash');
                    setTimeout(() => chip.classList.remove('reorder-flash'), 300);
                });
            }
        });

        // Function to setup a single chip
        const setupChip = (chip) => {
            // Clean up existing event listeners
            const freshChip = chip.cloneNode(true);
            chip.replaceWith(freshChip);

            const chipText = freshChip.querySelector('span');
            const closeButton = freshChip.querySelector('.remove-chip');

            // Make text editable
            if (chipText) {
                chipText.setAttribute('contentEditable', 'true');
                chipText.className = 'usa';
            }

            // Selection handler
            freshChip.addEventListener('click', (e) => {
                if (e.target !== closeButton && e.target !== chipText) chipToggle(freshChip, chipContainer);
            });

            // Remove chip handler
            if (closeButton) {
                closeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    freshChip.remove();
                });
            }

            freshChip.setAttribute('tabindex', '0');

            freshChip.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    // Toggle selection on Enter or Space
                    freshChip.click();
                    e.preventDefault();
                }
            });
        };

        // Setup add button
        freshAddButton.addEventListener('click', () => {
            if (chipContainer.children.length < 25) {
                // Find current color from existing chips to apply to new ones
                let currentColor = 'var(--neutral-gray)';
                const existingChips = chipContainer.querySelectorAll('.chip');
                if (existingChips.length > 0) {
                    const firstChip = existingChips[0];
                    const computedStyle = window.getComputedStyle(firstChip);

                    // Extract the CSS variable if used
                    const bgColor = computedStyle.backgroundColor;
                    if (bgColor.includes('rgb')) {
                        // Keep using primary color
                        currentColor = 'var(--neutral-gray)';
                    } else {
                        currentColor = bgColor;
                    }
                }

                const chip = document.createElement('div');
                chip.className = 'chip';

                // Apply the current group color
                chip.style.backgroundColor = currentColor;

                const chipText = document.createElement('span');
                chipText.textContent = 'New Pill';
                chipText.setAttribute('contentEditable', 'true');
                chip.setAttribute('data-selected', 'false');

                const closeButton = document.createElement('i');
                closeButton.className = 'fas fa-times remove-chip';

                chip.appendChild(chipText);
                chip.appendChild(closeButton);
                chipContainer.appendChild(chip);

                // Setup the new chip
                setupChip(chip);

                // Ensure contrast
                requestAnimationFrame(() => {
                    window.TextContrastAdjuster.updateElementContrast(chip);
                });
            }
        });

        // Setup existing chips
        chipContainer.querySelectorAll('.chip').forEach(setupChip);
    }
};
