// Component registry module — see docs/component-module-migration.md
// featureComparisonCard: a Features/Basic/Pro comparison grid — editable header
// cells, toggle ✓/✗ cells, add/delete feature rows (capped at 20), and
// add/delete plan columns (1–4 plan columns besides the Features column).
//
// The grid is a flat list of cells laid out row-major; the column count is
// stored on the grid as `data-columns` (and mirrored into an inline
// grid-template-columns) so it round-trips through save/load and live sync.
// Older saved cards without `data-columns` are detected from their structure.
window.Components = window.Components || {};

// Variants: 1 = the comparison grid (built from the same structure the old factory made),
// 2 = stacked pricing tiers, 3 = single plan with Monthly/Yearly tabs (one plan panel each). The generic
// variant switcher caches each variant's last HTML, so switching to a pricing layout and
// back brings the user's grid back as they left it (re-bound via afterVariantChange).
const FC_CLASSIC = (() => {
    const headerCell = (text, i) =>
        `<div class="usa" contenteditable="true" style="font-weight: bold; color: #777; padding: 8px 0;${i > 0 ? ' text-align: center;' : ''}">${text}</div>`;
    const check = '<div class="comparison-card-value" style="text-align: center; cursor: pointer;"><i class="fas fa-check" style="color: green;"></i></div>';
    const row = (name) => `<div class="comparison-card-row"><div style="display: flex; align-items: center; gap: 8px; width: 100%;"><span class="usa" contenteditable="true">${name}</span><button class="delete-fc-row"><i class="fas fa-trash"></i></button></div></div>${check}${check}`;
    return `<div class="feature-comparison-card" style="border: .12rem solid var(--color-primary);">`
        + `<div contenteditable="true" class="comparison-card-header usa" style="background-color: var(--color-primary);">Feature Comparison</div>`
        + `<div class="comparison-card-content"><div class="comparison-card-grid" data-columns="3">`
        + ['Features', 'Basic', 'Pro'].map(headerCell).join('')
        + ['Feature 1', 'Feature 2', 'Feature 3'].map(row).join('')
        + `</div></div>`
        + `<button class="comparison-add-row-btn"><i class="fas fa-plus"></i> Feature</button>`
        + `</div>`;
})();

const fcFeature = (text, on = true) =>
    `<li class="${on ? '' : 'fc-off'}"><div class="icon-container"><i class="fas ${on ? 'fa-check' : 'fa-xmark'}"></i></div><span class="usa" contenteditable="true">${text}</span></li>`;

const FC_VARIANTS = [
    FC_CLASSIC,

    // 2 — Pricing tiers (stacked plan cards, middle one highlighted)
    /*html*/
    `<div class="fc-pricing">
        <div class="fc-plan">
            <div class="fc-plan-top"><span class="fc-plan-name usa" contenteditable="true">Basic</span><span class="fc-price"><b class="usa" contenteditable="true">$0</b><small class="usa" contenteditable="true">/mo</small></span></div>
            <ul class="fc-features">${fcFeature('1 project')}${fcFeature('Community support')}${fcFeature('Custom domain', false)}</ul>
            <div class="fc-cta fc-cta-outline usa" contenteditable="true">Get started</div>
        </div>
        <div class="fc-plan fc-plan-featured" style="border-color: var(--color-primary);">
            <span class="fc-badge usa" contenteditable="true" style="background-color: var(--color-accent);">Most popular</span>
            <div class="fc-plan-top"><span class="fc-plan-name usa" contenteditable="true">Pro</span><span class="fc-price"><b class="usa" contenteditable="true">$12</b><small class="usa" contenteditable="true">/mo</small></span></div>
            <ul class="fc-features">${fcFeature('Unlimited projects')}${fcFeature('Priority support')}${fcFeature('Custom domain')}</ul>
            <div class="fc-cta usa" contenteditable="true" style="background-color: var(--color-primary);">Upgrade to Pro</div>
        </div>
        <div class="fc-plan">
            <div class="fc-plan-top"><span class="fc-plan-name usa" contenteditable="true">Team</span><span class="fc-price"><b class="usa" contenteditable="true">$29</b><small class="usa" contenteditable="true">/mo</small></span></div>
            <ul class="fc-features">${fcFeature('Everything in Pro')}${fcFeature('5 team seats')}${fcFeature('Admin controls')}</ul>
            <div class="fc-cta fc-cta-outline usa" contenteditable="true">Contact sales</div>
        </div>
    </div>`,

    // 3 — Single plan with a Monthly / Yearly switch. Each option is a tab: its own plan panel
    // (data-fc-option n ↔ data-fc-panel n), switched in the editor (to edit both) and in play.
    /*html*/
    `<div class="fc-pricing fc-single">
        <div class="fc-billing">
            <span class="fc-billing-opt usa" data-fc-option="0" contenteditable="true">Monthly</span>
            <span class="fc-billing-opt fc-billing-on usa" data-fc-option="1" contenteditable="true" style="background-color: var(--color-primary);">Yearly −20%</span>
        </div>
        <div class="fc-plan fc-plan-featured" data-fc-panel="0">
            <span class="fc-plan-name usa" contenteditable="true">Premium</span>
            <div class="fc-price fc-price-lg"><b class="usa" contenteditable="true">$10</b><small class="usa" contenteditable="true">/month</small></div>
            <div class="fc-note usa" contenteditable="true">Billed monthly, cancel anytime</div>
            <ul class="fc-features">${fcFeature('All premium features')}${fcFeature('Unlimited storage')}${fcFeature('Cancel anytime')}</ul>
            <div class="fc-cta usa" contenteditable="true" style="background-color: var(--color-primary);">Start free trial</div>
        </div>
        <div class="fc-plan fc-plan-featured fc-panel-on" data-fc-panel="1">
            <span class="fc-plan-name usa" contenteditable="true">Premium</span>
            <div class="fc-price fc-price-lg"><b class="usa" contenteditable="true">$96</b><small class="usa" contenteditable="true">/year</small></div>
            <div class="fc-note usa" contenteditable="true">That's just $8 a month, billed yearly</div>
            <ul class="fc-features">${fcFeature('All premium features')}${fcFeature('Unlimited storage')}${fcFeature('Cancel anytime')}</ul>
            <div class="fc-cta usa" contenteditable="true" style="background-color: var(--color-primary);">Start free trial</div>
        </div>
    </div>`
];

window.Components.featureComparisonCard = {
    // Owns its variants (setupVariants falls through here).
    variants() {
        return FC_VARIANTS.slice();
    },

    // Build a fresh comparison grid (variant 1) — used by the editor factory on insert.
    create() {
        const temp = document.createElement('div');
        temp.innerHTML = FC_VARIANTS[0];
        const card = temp.firstElementChild;
        this.setup(card);
        return card;
    },

    // Prototype player (js/prototype.js): pricing tiers — tap a plan to choose it (the
    // highlight border and the filled button move to it); single plan — the Monthly /
    // Yearly tabs switch plan panels. The comparison grid stays as designed. Linked CTAs keep their link.
    play(root) {
        const pricing = root.querySelector('.fc-pricing');
        if (!pricing || pricing._playBound) return;
        pricing._playBound = true;
        this.setupBilling(pricing, { play: true });

        pricing.addEventListener('click', (e) => {
            if (e.target.closest('[data-proto-action]')) return;

            if (pricing.classList.contains('fc-single')) return;
            const plan = e.target.closest('.fc-plan');
            const current = pricing.querySelector('.fc-plan-featured');
            if (!plan || plan === current) return;
            const border = current?.style.borderColor || 'var(--color-primary)';
            const filledCta = current?.querySelector('.fc-cta:not(.fc-cta-outline)');
            const ctaColor = filledCta?.style.backgroundColor || 'var(--color-primary)';
            if (current) {
                current.classList.remove('fc-plan-featured');
                current.style.removeProperty('border-color');
                if (filledCta) {
                    filledCta.classList.add('fc-cta-outline');
                    filledCta.style.removeProperty('background-color');
                    filledCta.style.removeProperty('color');
                }
            }
            plan.classList.add('fc-plan-featured');
            plan.style.borderColor = border;
            const cta = plan.querySelector('.fc-cta');
            if (cta) {
                cta.classList.remove('fc-cta-outline');
                cta.style.backgroundColor = ctaColor;
                window.TextContrastAdjuster?.updateElementContrast(cta);
            }
        });
        pricing.querySelectorAll(pricing.classList.contains('fc-single') ? '.fc-billing-opt' : '.fc-plan')
            .forEach(el => { el.style.cursor = 'pointer'; });
    },

    // Single plan (variant 3): the billing options are tabs, each showing its own plan panel.
    // Editor: clicking an option switches to it (the caret still lands, so it can be renamed)
    // and the swatches follow the shown panel. Play: same switch, nothing saved.
    selectBilling(pricing, index) {
        const opts = [...pricing.querySelectorAll('.fc-billing-opt')];
        const opt = opts[index];
        const on = opts.find(o => o.classList.contains('fc-billing-on'));
        if (!opt || on === opt) return false;
        const color = on?.style.backgroundColor || 'var(--color-primary)';
        opts.forEach(o => {
            o.classList.toggle('fc-billing-on', o === opt);
            if (o !== opt) { o.style.removeProperty('background-color'); o.style.removeProperty('color'); }
        });
        opt.style.backgroundColor = color;
        window.TextContrastAdjuster?.updateElementContrast(opt);
        const key = opt.dataset.fcOption ?? String(index);
        pricing.querySelectorAll(':scope > [data-fc-panel]').forEach(p => p.classList.toggle('fc-panel-on', p.dataset.fcPanel === key));
        return true;
    },

    setupBilling(pricing, { play = false } = {}) {
        if (!pricing?.classList.contains('fc-single') || pricing._billingBound) return;
        pricing._billingBound = true;
        const self = this;
        pricing.addEventListener('click', (e) => {
            if (e.target.closest('[data-proto-action]')) return;
            const opt = e.target.closest('.fc-billing-opt');
            if (!opt || !pricing.contains(opt)) return;
            const index = [...pricing.querySelectorAll('.fc-billing-opt')].indexOf(opt);
            if (!self.selectBilling(pricing, index) || play) return;
            // Editor: rebuild the swatches for the panel now shown, mark the screen changed
            const container = pricing.closest('.component-container');
            const content = container?.querySelector(':scope > .component-content');
            if (container && content && window.editor?.createColorSwatchesForVariant) {
                [...container.querySelectorAll('.color-swatch-container')]
                    .filter(sw => sw.closest('.component-container') === container)
                    .forEach(sw => sw.remove());
                window.editor.createColorSwatchesForVariant(container, content);
                window.updateComponentSwatches?.(container);
            }
            const id = pricing.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
            if (id) window.projectManager?.addCanvasToChanged?.(id, 'Billing option switched');
        });
    },

    // Grid: add/delete/toggle; single plan: billing tabs. Tiers are static in the editor.
    afterVariantChange(content) {
        this.setup(content);
    },

    MAX_ROWS: 20,
    MIN_COLUMNS: 2, // Features + at least one plan
    MAX_COLUMNS: 5, // Features + up to four plans (phone-frame width)

    CHECK_HTML: '<i class="fas fa-check" style="color: green;"></i>',
    TIMES_HTML: '<i class="fas fa-times" style="color: #999;"></i>',

    setup(container) {
    if (!container) return;
    const self = window.Components.featureComparisonCard;

    const card = container.classList.contains('feature-comparison-card')
      ? container
      : container.querySelector('.feature-comparison-card') || container;
    const header = card.querySelector('.comparison-card-header');
    const grid = card.querySelector('.comparison-card-grid');
    const addRowBtnOld = card.querySelector('.comparison-add-row-btn');

    // Pricing variants have no grid; the single plan's billing tabs switch panels
    if (!grid) {
      self.setupBilling(container.classList?.contains('fc-single') ? container : container.querySelector?.('.fc-single'));
      return;
    }

    // If the container doesn't have the necessary structure, stop
    if (!grid || !addRowBtnOld) {
      console.warn('Feature comparison card is missing required elements', { grid, addRowBtn: addRowBtnOld });
      return;
    }

    // ---- Column count -------------------------------------------------------
    const detectColumns = () => {
      const stored = parseInt(grid.dataset.columns, 10);
      if (stored >= self.MIN_COLUMNS) return stored;
      // Legacy cards: header cells come before the first feature-name cell
      const firstRow = Array.from(grid.children).findIndex(c => c.classList.contains('comparison-card-row'));
      if (firstRow >= self.MIN_COLUMNS) return firstRow;
      return 3;
    };
    let columns = detectColumns();

    let addRowBtn, addColBtn;

    const applyColumns = () => {
      grid.dataset.columns = String(columns);
      grid.style.gridTemplateColumns = `2fr repeat(${columns - 1}, 1fr)`;
    };

    const getRows = () => {
      const cells = Array.from(grid.children);
      const rows = [];
      for (let i = 0; i < cells.length; i += columns) rows.push(cells.slice(i, i + columns));
      return rows;
    };
    const featureRowCount = () => Math.max(0, getRows().length - 1); // minus header row

    // ---- Cell factories -----------------------------------------------------
    const makeValueCell = (checked) => {
      const cell = document.createElement('div');
      cell.className = 'comparison-card-value';
      cell.innerHTML = checked ? self.CHECK_HTML : self.TIMES_HTML;
      cell.style.cssText = 'text-align: center; cursor: pointer;';
      return cell;
    };

    // Turns a header cell into: [editable label span] + [delete-column button].
    // The cell itself is not contenteditable, so editing the label can't eat the button.
    const decorateColumnHeader = (cell) => {
      cell.classList.add('comparison-col-header');
      if (!cell.querySelector('.comparison-col-label')) {
        const label = document.createElement('span');
        label.className = 'comparison-col-label';
        label.textContent = cell.textContent.trim();
        cell.textContent = '';
        cell.appendChild(label);
      }
      cell.removeAttribute('contenteditable');
      const colLabel = cell.querySelector('.comparison-col-label');
      colLabel.setAttribute('contenteditable', 'true');
      colLabel.classList.add('usa');
      if (!cell.querySelector('.delete-fc-col')) {
        const del = document.createElement('button');
        del.className = 'delete-fc-col';
        del.title = 'Delete column';
        del.innerHTML = '<i class="fas fa-times"></i>';
        cell.appendChild(del);
      }
    };

    const makeColumnHeader = (text) => {
      const cell = document.createElement('div');
      cell.textContent = text;
      cell.style.cssText = 'font-weight: bold; color: #777; padding: 8px 0; text-align: center;';
      decorateColumnHeader(cell);
      return cell;
    };

    // ---- Rows ---------------------------------------------------------------
    const createFeatureRow = (featureName = 'New Feature', isNew = false) => {
      const nameCell = document.createElement('div');
      nameCell.className = 'comparison-card-row';

      const deleteFCRow = document.createElement('button');
      deleteFCRow.innerHTML = '<i class="fas fa-trash"></i>';
      deleteFCRow.className = 'delete-fc-row';

      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display: flex; align-items: center; gap: 8px; width: 100%;';

      const textSpan = document.createElement('span');
      textSpan.textContent = featureName;
      textSpan.setAttribute('contenteditable', 'true'); textSpan.classList.add('usa');

      wrapper.appendChild(textSpan);
      wrapper.appendChild(deleteFCRow);
      nameCell.appendChild(wrapper);

      // New rows: every plan ✗ except the top tier (last column) ✓
      const cells = [nameCell];
      for (let c = 1; c < columns; c++) {
        cells.push(makeValueCell(!isNew || c === columns - 1));
      }
      cells.forEach(cell => grid.appendChild(cell));
      return cells;
    };

    const deleteRow = (rowIndex) => {
      const rows = getRows();
      if (rowIndex < 1 || !rows[rowIndex]) return;
      rows[rowIndex].forEach(cell => cell.remove());
      updateButtonStates();
    };

    // ---- Columns ------------------------------------------------------------
    const addColumn = () => {
      if (columns >= self.MAX_COLUMNS) return;
      const rows = getRows();
      rows.forEach((row, r) => {
        const last = row[row.length - 1];
        const cell = r === 0 ? makeColumnHeader(`Plan ${columns}`) : makeValueCell(true);
        last.after(cell);
      });
      columns += 1;
      applyColumns();
      updateButtonStates();
    };

    const deleteColumn = (colIndex) => {
      if (colIndex < 1 || columns <= self.MIN_COLUMNS) return;
      getRows().forEach(row => row[colIndex] && row[colIndex].remove());
      columns -= 1;
      applyColumns();
      updateButtonStates();
    };

    // ---- Button state -------------------------------------------------------
    const setEnabled = (btn, enabled) => {
      btn.style.opacity = enabled ? '1' : '0.5';
      btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
    };

    const updateButtonStates = () => {
      setEnabled(addRowBtn, featureRowCount() < self.MAX_ROWS);
      setEnabled(addColBtn, columns < self.MAX_COLUMNS);
      card.classList.toggle('fc-min-columns', columns <= self.MIN_COLUMNS);
    };

    // ---- Normalize existing DOM (new, saved, legacy, cloned) ----------------
    applyColumns();

    // Header row: first cell is the "Features" label, the rest are plan headers
    const headerRow = getRows()[0] || [];
    headerRow.forEach((cell, c) => {
      if (c === 0) { cell.setAttribute('contenteditable', 'true'); cell.classList.add('usa'); }
      else decorateColumnHeader(cell);
    });
    // Mark value cells so delegation/styling can find them
    getRows().slice(1).forEach(row => row.slice(1).forEach(cell => {
      cell.classList.add('comparison-card-value');
      cell.style.cursor = 'pointer';
    }));

    // Hover visibility is CSS-driven; clear inline display saved by older versions
    card.querySelectorAll('.delete-fc-row, .delete-fc-col').forEach(b => b.style.removeProperty('display'));

    // Replace the add-row button to drop any stale listeners from clones
    addRowBtn = addRowBtnOld.cloneNode(true);
    addRowBtn.style.removeProperty('display');
    addRowBtn.innerHTML = '<i class="fas fa-plus"></i> Feature'; // normalizes older saved labels
    addRowBtnOld.replaceWith(addRowBtn);

    // Add-column button (created for cards saved before columns were addable)
    const addColBtnOld = card.querySelector('.comparison-add-col-btn');
    if (addColBtnOld) addColBtnOld.remove();
    addColBtn = document.createElement('button');
    addColBtn.className = 'comparison-add-col-btn';
    addColBtn.innerHTML = '<i class="fas fa-plus"></i> Column';

    // Both add buttons share a toolbar on the card's top edge, split left/right
    // (CSS) so the variant switcher fits between them, clear of every
    // row/column delete button regardless of the card's size.
    let actions = card.querySelector(':scope > .comparison-card-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'comparison-card-actions';
      card.appendChild(actions);
    }
    actions.appendChild(addRowBtn);
    actions.appendChild(addColBtn);

    // ---- Events -------------------------------------------------------------
    addRowBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (featureRowCount() < self.MAX_ROWS) {
        createFeatureRow('New Feature', true);
        updateButtonStates();
      }
    });

    addColBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addColumn();
    });

    // One delegated handler for toggles and deletes (property assignment, so
    // re-running setup on the same element doesn't stack handlers)
    grid.onclick = (e) => {
      const cell = e.target.closest('.comparison-card-grid > *');
      if (!cell || cell.parentElement !== grid) return;
      const index = Array.prototype.indexOf.call(grid.children, cell);
      const row = Math.floor(index / columns);
      const col = index % columns;

      if (e.target.closest('.delete-fc-row')) {
        e.stopPropagation();
        deleteRow(row);
        return;
      }
      if (e.target.closest('.delete-fc-col')) {
        e.stopPropagation();
        deleteColumn(col);
        return;
      }
      if (row > 0 && col > 0) {
        const isCheck = cell.querySelector('.fa-check') !== null;
        cell.innerHTML = isCheck ? self.TIMES_HTML : self.CHECK_HTML;
      }
    };

    // Make the header editable if it exists
    if (header) {
      header.setAttribute('contenteditable', 'true'); header.classList.add('usa');
    }

    updateButtonStates();

    return {
      createFeatureRow,
      addColumn,
      deleteColumn,
      updateAddButtonState: updateButtonStates
    };
    }
};
