// Component registry module — see js/components/progressBar.js for the convention.
// chipGroup: a row of selectable, editable, sortable "pill" chips with an add button.
// Note: the group's color swatch UI is created separately by createGroupColorSwatch()
// (in extra-func.js); callers invoke that alongside setup() where a swatch is wanted.
window.Components = window.Components || {};

// The group's selected color (a --color-* name), kept on the group as data-chip-color (the
// swatch sets it, createGroupColorSwatch in extra-func.js), so it outlasts every chip being
// deselected. Groups saved before it: the color of a selected chip, else primary.
function chipGroupColor(chipContainer) {
    if (chipContainer.dataset.chipColor) return chipContainer.dataset.chipColor;
    const lit = Array.from(chipContainer.querySelectorAll('.chip[data-selected="true"]'))
        .map(c => c.style.backgroundColor.match(/var\((--color-[\w-]+)\)/)?.[1]).find(Boolean);
    return lit || '--color-primary';
}

// Select/deselect a chip; a selected chip takes the group's color.
function chipToggle(chip, chipContainer) {
    // Remembered before the last colored chip goes gray
    chipContainer.dataset.chipColor = chipGroupColor(chipContainer);
    if (chip.getAttribute('data-selected') === 'true') {
        chip.style.backgroundColor = 'var(--neutral-gray)';
        chip.setAttribute('data-selected', 'false');
        // The CSS's own text color for the gray (follows dark mode): drop the selected color's
        chip.style.removeProperty('color');
        chip.style.removeProperty('--basic-txt-color');
        return;
    }
    chip.style.backgroundColor = `var(${chipContainer.dataset.chipColor})`;
    chip.setAttribute('data-selected', 'true');
    requestAnimationFrame(() => window.TextContrastAdjuster?.updateElementContrast(chip));
}

// Locked: the pills are a display of data (tags, stats…), not controls — in Play a tap does
// nothing and Connect mode can't link or filter with them (prototype.js reads the same
// attribute). Saved as data-chip-locked on the group; the editor still selects them, so the
// designer picks which ones show highlighted.
const chipLocked = (chipContainer) => chipContainer.hasAttribute('data-chip-locked');

function renderChipLock(btn, chipContainer) {
    const on = chipLocked(chipContainer);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.innerHTML = `<i class="fas fa-${on ? 'lock' : 'lock-open'}"></i>`;
    btn.title = on ? 'Locked: these pills only display data, a tap does nothing in Play. Click to unlock.'
        : 'Lock: make these pills display-only, so a tap does nothing in Play';
}

window.Components.chipGroup = {
    // Prototype player (js/prototype.js): select/deselect chips; add/remove/reorder stay editor-only.
    play(root) {
        const chipContainer = root.querySelector('.chip-group-container');
        if (!chipContainer || chipContainer._playBound || chipLocked(chipContainer)) return;
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

        // Lock toggle (editor chrome, rebuilt here: never saved), right after "add pill"
        container.querySelectorAll('.chip-lock-btn').forEach(b => b.remove());
        const lockButton = document.createElement('button');
        lockButton.type = 'button';
        lockButton.className = 'chip-lock-btn';
        renderChipLock(lockButton, chipContainer);
        freshAddButton.after(lockButton);
        lockButton.addEventListener('click', (e) => {
            e.stopPropagation();
            chipContainer.toggleAttribute('data-chip-locked');
            renderChipLock(lockButton, chipContainer);
            const canvasId = container.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
            if (canvasId) window.projectManager?.addCanvasToChanged?.(canvasId, 'pill group lock');
        });

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
