// Component registry module — see docs/component-module-migration.md
// accordion: collapsible section — header click toggles content height/chevron,
// keeps a drag-drop placeholder in sync, and accepts dropped components.
window.Components = window.Components || {};

// STYLES (the accordion's "variants"): Classic / FAQ (+ −) / Bordered card, as
// `data-accordion-style` on .accordion-container. The accordion holds dropped
// components, so a style never touches .accordion-content — only the header/border
// chrome changes. Classic's inline theme colors (header background, border) are parked
// in data attributes while another style is active and restored on the way back, so
// swatches only appear when they do something. Arrows sit on the component's
// wrapper, above the accordion, like other components' variant arrows.
const ACCORDION_STYLES = [
    { id: 'classic', label: 'Classic' },
    { id: 'faq', label: 'FAQ' },
    { id: 'card', label: 'Bordered card' }
];

function accordionApplyStyle(container, index) {
    const n = ACCORDION_STYLES.length;
    const style = ACCORDION_STYLES[((index % n) + n) % n];
    const header = container.querySelector(':scope > .accordion-header');

    if (style.id === 'classic') {
        delete container.dataset.accordionStyle;
        if (header) header.style.backgroundColor = header.dataset.classicBg || 'var(--color-primary)';
        container.style.border = container.dataset.classicBorder || '.12rem solid var(--color-primary)';
        delete container.dataset.classicBorder;
        if (header) delete header.dataset.classicBg;
        if (header) window.TextContrastAdjuster?.updateElementContrast(header);
    } else {
        // Park classic's colors the first time we leave it
        if (!container.dataset.accordionStyle) {
            if (container.style.border) container.dataset.classicBorder = container.style.border;
            if (header?.style.backgroundColor) header.dataset.classicBg = header.style.backgroundColor;
        }
        container.dataset.accordionStyle = style.id;
        container.style.removeProperty('border');
        header?.style.removeProperty('background-color');
        header?.style.removeProperty('color');
    }

    const number = container.closest('.component-container')
        ?.querySelector(':scope > .acc-style-controls .variant-number');
    if (number) number.textContent = `${ACCORDION_STYLES.indexOf(style) + 1}/${n}`;

    // Rebuild this component's swatches for whatever theme colors remain
    const cc = container.closest('.component-container');
    const ccContent = cc?.querySelector(':scope > .component-content');
    if (cc && ccContent) {
        cc.querySelectorAll(':scope > .color-swatch-container').forEach(el => el.remove());
        editor.createColorSwatchesForVariant(cc, ccContent);
        window.updateComponentSwatches?.(cc);
    }
    const canvasId = container.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
    window.projectManager?.addCanvasToChanged(canvasId, 'Accordion style changed');
}

// The arrows live on the surrounding .component-container (like every other component's
// variant arrows) — the accordion itself clips overflow, so inside it they'd have to sit
// over the header. On insert, setup runs before the accordion is wrapped, so wait a
// frame for the wrapper. Being outside .component-content, they're never saved.
function accordionSetupStyleControls(container, retried = false) {
    const host = container.closest('.component-container');
    if (!host) {
        if (!retried) requestAnimationFrame(() => accordionSetupStyleControls(container, true));
        return;
    }
    host.querySelectorAll(':scope > .acc-style-controls').forEach(el => el.remove());
    // Older saves may carry a copy of the arrows inside the accordion
    container.querySelectorAll(':scope > .acc-style-controls').forEach(el => el.remove());
    const n = ACCORDION_STYLES.length;
    const current = () => Math.max(0, ACCORDION_STYLES.findIndex(s => s.id === (container.dataset.accordionStyle || 'classic')));

    const controls = document.createElement('div');
    controls.className = 'variant-controls acc-style-controls';
    controls.title = 'Accordion style';
    const prevBtn = document.createElement('button');
    prevBtn.className = 'nav-control prev-nav';
    prevBtn.innerHTML = '<i class="fas fa-circle-left"></i>';
    const number = document.createElement('span');
    number.className = 'variant-number';
    number.textContent = `${current() + 1}/${n}`;
    const nextBtn = document.createElement('button');
    nextBtn.className = 'nav-control next-nav';
    nextBtn.innerHTML = '<i class="fas fa-circle-right"></i>';
    controls.append(prevBtn, number, nextBtn);
    controls.addEventListener('click', (e) => e.stopPropagation());
    prevBtn.addEventListener('click', () => accordionApplyStyle(container, current() - 1));
    nextBtn.addEventListener('click', () => accordionApplyStyle(container, current() + 1));
    host.appendChild(controls);
}

window.Components.accordion = {
    styles: ACCORDION_STYLES.map(s => s.id),

    // Switch style by index or id (e.g. from templates). `root` = the accordion or inside it.
    setStyle(root, style) {
        const container = root?.closest?.('.accordion-container') || root?.querySelector?.('.accordion-container');
        if (!container) return;
        const index = typeof style === 'number' ? style : ACCORDION_STYLES.findIndex(s => s.id === style);
        if (index >= 0) accordionApplyStyle(container, index);
    },

    // Prototype player (js/prototype.js): expand/collapse only — no drop zone, no style arrows.
    // `root` is this component's container in the player's clone of the screen.
    play(root) {
        const acc = root.querySelector('.accordion-container');
        const header = acc?.querySelector(':scope > .accordion-header');
        const content = acc?.querySelector(':scope > .accordion-content');
        if (!header || !content || header._playBound) return;
        header._playBound = true;
        content.querySelectorAll(':scope > .placeholder').forEach(p => p.remove());
        const chevron = header.querySelector('.fa-chevron-down');
        header.addEventListener('click', () => {
            const isExpanded = content.style.height !== '0px' && content.style.height !== '';
            content.style.padding = isExpanded ? '0 12px' : '8px 12px 0 12px';
            content.style.height = isExpanded ? '0' : content.scrollHeight + 'px';
            if (chevron) chevron.style.transform = isExpanded ? 'rotate(0)' : 'rotate(180deg)';
        });
    },

    setup(content) {
    if (!content) return;
    const accordionContainer = content.closest('.accordion-container');
    if (accordionContainer) accordionSetupStyleControls(accordionContainer);
  
    // Remove any existing event listeners first
    const button = content.parentElement?.querySelector('.accordion-header');
    if (button) {
      // Clone and replace the button to remove old listeners
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);
    }
  
    // Now set up fresh event listeners
    const placeholderHTML = `
      <div class="placeholder" style="padding: 18px 0;">
        <div>
          <p class="non-editable" style="margin: 0 24px; color: #666;">drag & drop components here.</p>
        </div>
      </div>
    `;
  
    const observer = new MutationObserver(() => {
      if (content.style.height !== '0px' && content.style.height !== '') {
        content.style.padding = "8px 12px 0 12px";
        content.style.height = content.scrollHeight - 8 + 'px';
      } else {
        content.style.padding = "0 12px";
      }
      
      // Own children only: a nested accordion's placeholder isn't ours — removing it made that
      // accordion put it back, and the two observers looped forever (page froze).
      const hasComponents = content.querySelector(':scope > .component-container');
      const hasPlaceholder = content.querySelector(':scope > .placeholder');
      if (hasComponents && hasPlaceholder) {
        hasPlaceholder.remove();
      } else if (!hasComponents && !hasPlaceholder) {
        content.innerHTML = placeholderHTML;
      }
    });
  
    observer.observe(content, {
      childList: true,
      subtree: true,
      attributes: true
    });
  
    // Add fresh click handler
    const newButton = content.parentElement?.querySelector('.accordion-header');
    const chevron = newButton?.querySelector('.fa-chevron-down');
    if (newButton && chevron) {
      newButton.addEventListener('click', () => {
        const isExpanded = content.style.height !== '0px' && content.style.height !== '';
        if (!isExpanded) {
          content.style.height = content.scrollHeight + 'px';
          chevron.style.transform = 'rotate(180deg)';
        } else {
          content.style.height = '0';
          chevron.style.transform = 'rotate(0)';
        }
      });
    }
  
    editor.initializeSortable(content);
    }
};
