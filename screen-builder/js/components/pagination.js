// Component registry module — see docs/component-module-migration.md
// pagination: page-number buttons with prev/next nav, single-selected state,
// and color swatches for the active button. (this.blur() inside the keydown
// handler is the button element's blur — intentionally left as `this`.)
window.Components = window.Components || {};

const PAGINATION_VARIANTS = [
    // 1 — Classic numbered buttons (matches the old factory's markup)
    /*html*/
    `<div class="pagination-container">
            <div class="pagination-wrapper">
                <button class="page-btn prev-page icon-container"><i style="color: var(--basic-txt-color);" class="fas fa-angle-left"></i></button>
                <button class="page-btn usa" contenteditable="true">1</button>
                <button class="page-btn usa" contenteditable="true">2</button>
                <button class="page-btn usa" contenteditable="true">3</button>
                <button class="page-btn usa" contenteditable="true">...</button>
                <button class="page-btn usa" contenteditable="true">45</button>
                <button class="page-btn next-page icon-container"><i style="color: var(--basic-txt-color);" class="fas fa-angle-right"></i></button>
            </div>
        </div>`,

    // 2 — Carousel dots (selected dot stretches into a pill)
    /*html*/
    `<div class="pagination-container pagination-dots">
            <div class="pagination-wrapper">
                <button class="page-btn page-dot non-editable"></button>
                <button class="page-btn page-dot non-editable"></button>
                <button class="page-btn page-dot non-editable"></button>
                <button class="page-btn page-dot non-editable"></button>
            </div>
        </div>`,

    // 3 — Previous / Next with a page count
    /*html*/
    `<div class="pagination-container pagination-prevnext">
            <div class="pagination-wrapper">
                <button class="page-btn prev-page icon-container"><i class="fas fa-arrow-left"></i><span class="usa" contenteditable="true">Previous</span></button>
                <span class="page-count usa" contenteditable="true">Page 2 of 10</span>
                <button class="page-btn next-page icon-container"><span class="usa" contenteditable="true">Next</span><i class="fas fa-arrow-right"></i></button>
            </div>
        </div>`,

    // 4 — Minimal circles with chevrons
    /*html*/
    `<div class="pagination-container pagination-circles">
            <div class="pagination-wrapper">
                <button class="page-btn prev-page icon-container"><i class="fas fa-chevron-left"></i></button>
                <button class="page-btn usa" contenteditable="true">1</button>
                <button class="page-btn usa" contenteditable="true">2</button>
                <button class="page-btn usa" contenteditable="true">3</button>
                <button class="page-btn usa" contenteditable="true">4</button>
                <button class="page-btn usa" contenteditable="true">5</button>
                <button class="page-btn next-page icon-container"><i class="fas fa-chevron-right"></i></button>
            </div>
        </div>`
];

window.Components.pagination = {
    // Owns its variants (setupVariants falls through here).
    variants() {
        return PAGINATION_VARIANTS.slice();
    },

    // Build a fresh pagination (variant 1) — used by the editor factory on insert.
    create() {
        const temp = document.createElement('div');
        temp.innerHTML = PAGINATION_VARIANTS[0];
        const container = temp.firstElementChild;
        this.setup(container);
        return container;
    },

    // Prototype player (js/prototype.js): select a page, prev/next step through them, and
    // a "Page 2 of 10" count steps its first number. Same colors as setup(), no swatches.
    play(root) {
        const container = root.querySelector('.pagination-container');
        if (!container || container._playBound) return;
        container._playBound = true;
        const pages = [...container.querySelectorAll('.page-btn:not(.prev-page):not(.next-page)')];
        const count = container.querySelector('.page-count');

        const select = (btn) => {
            // The selected color moves with the selection (keeps a swatch-picked color)
            const color = pages.find(b => b.classList.contains('selected'))?.style.backgroundColor || 'var(--color-primary)';
            pages.forEach(b => {
                if (b === btn || !b.classList.contains('selected')) return;
                b.classList.remove('selected');
                b.style.backgroundColor = 'var(--neutral-gray)';
                b.style.color = 'var(--basic-txt-color)';
            });
            btn.classList.add('selected');
            btn.style.backgroundColor = color;
            window.TextContrastAdjuster?.updateElementContrast(btn);
        };
        const step = (delta) => {
            if (count) {
                const m = count.textContent.match(/(\d+)(\D+)(\d+)/);
                if (!m) return;
                const next = Math.max(1, Math.min(+m[3], +m[1] + delta));
                count.textContent = count.textContent.replace(m[0], `${next}${m[2]}${m[3]}`);
                return;
            }
            // "..." is a gap, not a page
            const real = pages.filter(b => !/^\s*(\.\.\.|…)\s*$/.test(b.textContent));
            const i = real.findIndex(b => b.classList.contains('selected'));
            const next = real[Math.max(0, Math.min(real.length - 1, (i < 0 ? 0 : i) + delta))];
            if (next) select(next);
        };

        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.page-btn');
            if (!btn || btn.closest('[data-proto-action]')) return;
            e.preventDefault();
            if (btn.classList.contains('prev-page')) step(-1);
            else if (btn.classList.contains('next-page')) step(1);
            else if (!/^\s*(\.\.\.|…)\s*$/.test(btn.textContent)) select(btn);
        });
    },

    afterVariantChange(content) {
        const container = content.querySelector('.pagination-container');
        if (!container) return;
        container.querySelectorAll('.color-swatch-container').forEach(s => s.remove());
        this.setup(container);
    },

    setup(container) {
    if (!container) return null;
    
    // Find all page buttons and navigation controls
    const buttons = container.querySelectorAll('.page-btn:not(.prev-page):not(.next-page)');
    const prevButton = container.querySelector('.prev-page');
    const nextButton = container.querySelector('.next-page');
    
    // Global reference to the currently selected button
    let selectedButton = null;
    
    // Find initially selected button by class or select first button
    buttons.forEach(button => {
      if (button.classList.contains('selected')) {
        selectedButton = button;
      }
    });
    
    // If no button is selected, default to the first one
    if (!selectedButton && buttons.length > 0) {
      selectedButton = buttons[0];
      selectedButton.classList.add('selected');
      selectedButton.style.backgroundColor = 'var(--color-primary)';
      window.TextContrastAdjuster?.updateElementContrast(selectedButton);
    }
    
    // Create direct click handlers for each button
    buttons.forEach(button => {
      button.onclick = function(e) {
        // Deselect currently selected button
        if (selectedButton) {
          selectedButton.classList.remove('selected');
          selectedButton.style.backgroundColor = 'var(--neutral-gray)';
          selectedButton.style.color = 'var(--basic-txt-color)';
        }
        
        // Select clicked button
        button.classList.add('selected');
        button.style.backgroundColor = 'var(--color-primary)';
        window.TextContrastAdjuster?.updateElementContrast(button);
        selectedButton = button;
        
        // Update color swatches
        const swatches = container.querySelectorAll('.color-swatch-container');
        swatches.forEach(swatch => swatch.remove());
        
        const newSwatches = createColorSwatches(button);
        if (newSwatches) {
          if (Array.isArray(newSwatches)) {
            newSwatches.forEach(swatch => {
              if (swatch) container.insertBefore(swatch, container.firstChild);
            });
          } else {
            container.insertBefore(newSwatches, container.firstChild);
          }
        }
        
        e.preventDefault();
      };
      
      // Prevent editing conflicts
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.blur();
        }
      });
    });
    
    // Navigation button handlers
    if (prevButton) {
      prevButton.onclick = function(e) {
        if (!selectedButton) return;
        const allButtons = Array.from(buttons);
        const currentIndex = allButtons.indexOf(selectedButton);
        if (currentIndex > 0) {
          allButtons[currentIndex - 1].click();
        }
        e.preventDefault();
      };
    }
    
    if (nextButton) {
      nextButton.onclick = function(e) {
        if (!selectedButton) return;
        const allButtons = Array.from(buttons);
        const currentIndex = allButtons.indexOf(selectedButton);
        if (currentIndex < allButtons.length - 1) {
          allButtons[currentIndex + 1].click();
        }
        e.preventDefault();
      };
    }
    
    // Initial color swatches for selected button
    if (selectedButton) {
      const swatches = createColorSwatches(selectedButton);
      if (swatches) {
        if (Array.isArray(swatches)) {
          swatches.forEach(swatch => {
            if (swatch) container.insertBefore(swatch, container.firstChild);
          });
        } else {
          container.insertBefore(swatches, container.firstChild);
        }
      }
    }
    
    return {
      getSelectedButton: () => selectedButton
    };
    }
};
