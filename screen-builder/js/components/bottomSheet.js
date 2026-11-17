// Component registry module — see docs/component-module-migration.md
// bottomSheet: a drag-handle sheet that collapses to its handle and expands to
// fit its content (height clamped to 80vh); accepts dropped components.
window.Components = window.Components || {};

// PRESETS (the bottom sheet's "variants"). The sheet is a container users drop
// components into, so a variant must not replace its contents. A preset is one
// .bottom-sheet-preset block at the top of .bottom-sheet-content; switching presets
// swaps only that block — dropped components below it are untouched. Preset 1 is the
// plain drop zone (no block). Arrows sit inside the handle bar (the sheet clips overflow).
const BOTTOM_SHEET_PRESETS = [
    { label: 'Empty', html: '' },

    { label: 'Share sheet', html: /*html*/`<div class="bottom-sheet-preset bs-share">
        <div class="bs-title usa" contenteditable="true">Share</div>
        <div class="bs-apps">
            <div class="bs-app"><div class="icon-container bs-app-icon" style="background-color: var(--color-primary);"><i class="fas fa-comment"></i></div><span class="usa" contenteditable="true">Messages</span></div>
            <div class="bs-app"><div class="icon-container bs-app-icon"><i class="fas fa-envelope"></i></div><span class="usa" contenteditable="true">Mail</span></div>
            <div class="bs-app"><div class="icon-container bs-app-icon"><i class="fas fa-link"></i></div><span class="usa" contenteditable="true">Copy</span></div>
            <div class="bs-app"><div class="icon-container bs-app-icon"><i class="fas fa-ellipsis"></i></div><span class="usa" contenteditable="true">More</span></div>
        </div>
        <div class="bs-row"><div class="icon-container"><i class="fas fa-star"></i></div><span class="usa" contenteditable="true">Add to favorites</span></div>
        <div class="bs-row"><div class="icon-container"><i class="fas fa-download"></i></div><span class="usa" contenteditable="true">Save to device</span></div>
    </div>` },

    { label: 'Action list', html: /*html*/`<div class="bottom-sheet-preset bs-actions">
        <div class="bs-title usa" contenteditable="true">Options</div>
        <div class="bs-row"><div class="icon-container"><i class="fas fa-pen"></i></div><span class="usa" contenteditable="true">Edit</span></div>
        <div class="bs-row"><div class="icon-container"><i class="fas fa-copy"></i></div><span class="usa" contenteditable="true">Duplicate</span></div>
        <div class="bs-row"><div class="icon-container"><i class="fas fa-box-archive"></i></div><span class="usa" contenteditable="true">Archive</span></div>
        <div class="bs-row bs-row-danger"><div class="icon-container"><i class="fas fa-trash"></i></div><span class="usa" contenteditable="true">Delete</span></div>
    </div>` },

    { label: 'Filters', html: /*html*/`<div class="bottom-sheet-preset bs-filters">
        <div class="bs-filter-head">
            <span class="bs-title usa" contenteditable="true">Filters</span>
            <span class="bs-reset usa" contenteditable="true">Reset</span>
        </div>
        <div class="bs-section usa" contenteditable="true">Sort by</div>
        <div class="bs-chips">
            <span class="bs-chip bs-chip-on usa" contenteditable="true" style="background-color: var(--color-primary);">Popular</span>
            <span class="bs-chip usa" contenteditable="true">Newest</span>
            <span class="bs-chip usa" contenteditable="true">Price</span>
        </div>
        <div class="bs-section usa" contenteditable="true">Category</div>
        <div class="bs-check"><div class="icon-container"><i class="fas fa-square-check"></i></div><span class="usa" contenteditable="true">Electronics</span></div>
        <div class="bs-check"><div class="icon-container"><i class="far fa-square"></i></div><span class="usa" contenteditable="true">Clothing</span></div>
        <div class="bs-check"><div class="icon-container"><i class="far fa-square"></i></div><span class="usa" contenteditable="true">Home</span></div>
        <div class="bs-apply usa" contenteditable="true" style="background-color: var(--color-primary);">Show results</div>
    </div>` }
];

window.Components.bottomSheet = {
    presets: BOTTOM_SHEET_PRESETS.map(p => p.label),

    // Swap the preset block (index into presets). Expands the sheet so it's visible.
    setPreset(container, index) {
        const content = container?.querySelector('.bottom-sheet-content');
        if (!content) return;
        const n = BOTTOM_SHEET_PRESETS.length;
        const i = ((parseInt(index, 10) || 0) % n + n) % n;
        content.querySelectorAll(':scope > .bottom-sheet-preset').forEach(el => el.remove());
        if (BOTTOM_SHEET_PRESETS[i].html) {
            const temp = document.createElement('div');
            temp.innerHTML = BOTTOM_SHEET_PRESETS[i].html;
            const preset = temp.firstElementChild;
            content.insertBefore(preset, content.firstChild);
            editor.setupIconPicker(preset);
            // Text contrast on the colored chips/buttons once they're laid out
            requestAnimationFrame(() => preset.querySelectorAll('[style*="background-color"]')
                .forEach(el => window.TextContrastAdjuster?.updateElementContrast(el)));
        }
        container.dataset.preset = String(i);
        const number = container.querySelector(':scope > .bs-preset-controls .variant-number');
        if (number) number.textContent = `${i + 1}/${n}`;
        if (container.dataset.state !== 'expanded') {
            container.querySelector('.bottom-sheet-handle-container')?.click();
        }
        // Save change detection: flag the screen
        const canvasId = container.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        window.projectManager?.addCanvasToChanged(canvasId, 'Bottom sheet preset changed');
    },

    setupPresetControls(container) {
        container.querySelectorAll(':scope > .bs-preset-controls').forEach(el => el.remove());
        const n = BOTTOM_SHEET_PRESETS.length;
        const current = () => parseInt(container.dataset.preset, 10) || 0;

        const controls = document.createElement('div');
        controls.className = 'variant-controls bs-preset-controls';
        controls.title = 'Bottom sheet preset';
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

        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.setPreset(container, current() - 1); });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.setPreset(container, current() + 1); });
        container.setVariant = (index) => this.setPreset(container, index);

        container.insertBefore(controls, container.firstChild);
    },

    // Prototype player (js/prototype.js). `root` = the .bottomSheet-container in the clone.
    // The handle toggles expanded/collapsed; no drop zone, presets or delete. Starts
    // collapsed when a prototype link targets it, else as it was designed.
    play(root, { startOpen } = {}) {
        if (!root || root._playBound) return;
        root._playBound = true;
        root.querySelectorAll('.empty-placeholder').forEach(el => el.remove());
        this.playSetOpen(root, startOpen === undefined ? root.dataset.state === 'expanded' : startOpen);
        root.querySelector('.bottom-sheet-handle-container')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playSetOpen(root, !this.playIsOpen(root));
        });
    },

    playSetOpen(root, open) {
        root.dataset.state = open ? 'expanded' : 'collapsed';
        if (!open) { root.style.height = '30px'; return; }
        const content = root.querySelector('.bottom-sheet-content');
        const canvas = root.closest('.canvas');
        const max = (canvas ? canvas.clientHeight : window.innerHeight) * 0.8;
        root.style.height = `${Math.min(Math.max(86, (content?.scrollHeight || 0) + 38) + 38, max)}px`;
    },

    playIsOpen(root) {
        return root.dataset.state === 'expanded';
    },

    setup(container) {
    if (!container) return;
    window.Components.bottomSheet.setupPresetControls(container);
    
    // Set initial height if not already set
    if (!container.style.height) {
      container.style.height = '30px'; // Height of just the handle area
    }
    
    const content = container.querySelector('.bottom-sheet-content');
    const dragHandle = container.querySelector('.bottom-sheet-drag-handle');
    const handleContainer = container.querySelector('.bottom-sheet-handle-container');
    
    if (!content || !dragHandle) {
      console.error('Bottom sheet missing required elements');
      return;
    }
    
    // Add placeholder if it doesn't exist
    let placeholder = content.querySelector('.empty-placeholder');
    if (!placeholder) {
        placeholder = editor.createPlaceholder(content);
    }
    
    // Set up placeholder visibility based on content
    const updatePlaceholderVisibility = () => {
      const componentContainers = content.querySelectorAll('.component-container');
      const existingPlaceholder = content.querySelector('.empty-placeholder');
      
      if (componentContainers.length > 0 && existingPlaceholder) {
        existingPlaceholder.style.display = 'none';
      } else if (existingPlaceholder) {
        existingPlaceholder.style.display = 'block';
      }
    };
    // Check initial placeholder visibility
    updatePlaceholderVisibility();
    
    // Handle placeholder removal/addition based on content
    const observer = new MutationObserver((mutations) => {
      let shouldUpdateHeight = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          updatePlaceholderVisibility();
          shouldUpdateHeight = true;
        }
      });
      
      // Update height if sheet is expanded
      if (shouldUpdateHeight && container.dataset.state === 'expanded') {
        setTimeout(() => {
            updateSheetHeight();
          }, 160);
      }
    });
    
    observer.observe(content, { childList: true, subtree: false });
    
    // Initialize sortable for content
    editor.initializeSortable(content);
    
    // Get content height including children
    const getContentHeight = () => {
      // Clone the content to measure actual height when expanded
      const clone = content.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.visibility = 'hidden';
      clone.style.height = 'auto';
      clone.style.maxHeight = 'none';
      document.body.appendChild(clone);
      
      const height = clone.offsetHeight;
      document.body.removeChild(clone);
      
      // If no substantive content, use a minimum height
      return Math.max(86, height + 38); // 38 is the height of the handle
    };
    
    // Update the sheet height based on content
    const updateSheetHeight = () => {
      if (container.dataset.state === 'expanded') {
        const contentHeight = getContentHeight();
        // Get the minimum of content height or 80vh
        const maxHeight = Math.min(contentHeight + 38, window.innerHeight * 0.8);
        container.style.height = `${maxHeight}px`;
      }
    };
    
    // New sheets start collapsed; a loaded one keeps the state it was saved in
    if (!container.dataset.state) container.dataset.state = 'collapsed';
    
    // Toggle sheet state on handle click
    handleContainer.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (container.dataset.state === 'collapsed') {
        // Expand the sheet
        container.dataset.state = 'expanded';
        updateSheetHeight();
      } else {
        // Collapse the sheet
        container.dataset.state = 'collapsed';
        container.style.height = '30px'; // Just show the handle
      }
    });
    
    // Set up resize observer to handle content changes
    const resizeObserver = new ResizeObserver(() => {
      if (container.dataset.state === 'expanded') {
        setTimeout(() => {
            updateSheetHeight();
          }, 160);
      }
    });
    
    resizeObserver.observe(content);
    editor.setupDeleteHandler(container);
    
    return container;
    }
};
