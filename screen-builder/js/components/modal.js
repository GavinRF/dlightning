// Component registry module — see docs/component-module-migration.md
// modal: overlay dialog; wires its close button, its variant arrows, and tracks the
// editor's modal-added state. Owns its variants (setupVariants falls through here).
//
// Structure: .modal-wrapper (overlay) > [close-button row] + .ui-modal (the dialog).
// Variants swap what's INSIDE .ui-modal — the overlay, close button and arrows stay.
// Variant roots that need different dialog chrome (no padding, bottom-aligned) are
// handled in CSS via :has(> .modal-v-…) on .ui-modal / .modal-wrapper.
window.Components = window.Components || {};

window.Components.modal = (() => {
    const VARIANTS = [
        // 1 — Classic (same content the factory used to build; saved modals without
        // the wrapper div are this variant too)
        /*html*/
        `<div class="modal-v-classic">
            <h2 class="usa" contenteditable="true" style="margin-top: 0; color: var(--basic-txt-color);">Modal Title</h2>
            <p class="usa" contenteditable="true" style="color: #7f8c8d;">This is the modal content. You can add any information here.</p>
            <div style="text-align: right;">
                <div contenteditable="true" class="modal-ok-btn usa" style="background-color: var(--color-primary);">OK</div>
            </div>
        </div>`,

        // 2 — Confirm (destructive action, two buttons)
        /*html*/
        `<div class="modal-v-confirm">
            <div class="icon-container modal-v-icon" style="background-color: var(--color-accent);">
                <i class="fas fa-triangle-exclamation"></i>
            </div>
            <h2 class="usa" contenteditable="true">Delete this item?</h2>
            <p class="usa" contenteditable="true">This can't be undone. The item will be removed permanently.</p>
            <div class="modal-v-actions">
                <div contenteditable="true" class="modal-v-btn modal-v-btn-ghost usa">Cancel</div>
                <div contenteditable="true" class="modal-v-btn usa" style="background-color: var(--color-primary);">Delete</div>
            </div>
        </div>`,

        // 3 — Success
        /*html*/
        `<div class="modal-v-success">
            <div class="icon-container modal-v-icon modal-v-icon-lg" style="background-color: var(--color-primary);">
                <i class="fas fa-check"></i>
            </div>
            <h2 class="usa" contenteditable="true">You're all set!</h2>
            <p class="usa" contenteditable="true">Your account has been created. Start exploring now.</p>
            <div contenteditable="true" class="modal-v-btn modal-v-btn-block usa" style="background-color: var(--color-primary);">Get Started</div>
        </div>`,

        // 4 — Image header
        /*html*/
        `<div class="modal-v-image">
            <div class="card-image modal-v-hero">
                <span class="non-editable">Click to add image</span>
                <i class="fa-solid fa-image image-ph non-editable"></i>
            </div>
            <div class="modal-v-body">
                <h2 class="usa" contenteditable="true">What's New</h2>
                <p class="usa" contenteditable="true">Discover the latest features we've added to make your experience even better.</p>
                <div contenteditable="true" class="modal-v-btn modal-v-btn-block usa" style="background-color: var(--color-primary);">Take a Look</div>
            </div>
        </div>`,

        // 5 — Action sheet (bottom-aligned list of actions)
        /*html*/
        `<div class="modal-v-sheet">
            <div class="modal-v-sheet-handle"></div>
            <div class="modal-v-row"><div class="icon-container"><i class="fas fa-share-nodes"></i></div><span class="usa" contenteditable="true">Share</span></div>
            <div class="modal-v-row"><div class="icon-container"><i class="fas fa-link"></i></div><span class="usa" contenteditable="true">Copy link</span></div>
            <div class="modal-v-row"><div class="icon-container"><i class="fas fa-pen"></i></div><span class="usa" contenteditable="true">Edit</span></div>
            <div class="modal-v-row modal-v-row-danger"><div class="icon-container"><i class="fas fa-trash"></i></div><span class="usa" contenteditable="true">Delete</span></div>
        </div>`
    ];

    return {
        variants() {
            return VARIANTS.slice();
        },

        // Build a fresh modal (variant 1) — used by the editor factory on insert.
        create() {
            const modalWrapper = document.createElement('div');
            modalWrapper.className = 'modal-wrapper';
            modalWrapper.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 991; height: 100%; flex-direction: column;';

            // NOTE: setup() finds the close button by this exact inline width — keep it.
            const closeBtnCon = document.createElement('div');
            closeBtnCon.style.cssText = 'width: calc(100% - 46px); max-width: 400px; display: flex; justify-content: flex-end; padding: 8px;';
            const closeBtn = document.createElement('div');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = 'font-size: 30px; color: white; cursor: pointer;';
            closeBtnCon.appendChild(closeBtn);

            const modal = document.createElement('div');
            modal.className = 'ui-modal';
            modal.innerHTML = VARIANTS[0];

            modalWrapper.appendChild(closeBtnCon);
            modalWrapper.appendChild(modal);

            this.setup(modalWrapper);
            return modalWrapper;
        },

        // Prototype player (js/prototype.js). `root` = the .modal-wrapper in the player's clone.
        // The × and a click on the dimmed backdrop close it (hide, never remove — a link
        // may open it again). Starts hidden when a prototype link targets it.
        play(root, { startOpen = true } = {}) {
            if (!root || root._playBound) return;
            root._playBound = true;
            this.playSetOpen(root, startOpen);
            const closeBtn = root.querySelector('div[style*="width: calc(100% - 46px)"] > div');
            closeBtn?.addEventListener('click', () => this.playSetOpen(root, false));
            root.addEventListener('click', (e) => { if (e.target === root) this.playSetOpen(root, false); });
        },

        playSetOpen(root, open) {
            root.style.display = open ? '' : 'none';
        },

        playIsOpen(root) {
            return root.style.display !== 'none';
        },

        setup(modalWrapper) {
            if (!modalWrapper) return;

            // Set up close button (once per element — setup runs again on load/sync)
            const closeBtnCon = modalWrapper.querySelector('div[style*="width: calc(100% - 46px)"]');
            const closeBtn = closeBtnCon?.querySelector('div');
            if (closeBtn && !closeBtn._modalCloseBound) {
                closeBtn._modalCloseBound = true;
                closeBtn.addEventListener('click', () => {
                    editor.modalAdded = false;
                    editor.specialComponents.modal.added = false;
                    const canvas = modalWrapper.closest('.canvas');
                    if (canvas) {
                        canvas.removeAttribute('data-has-modal');
                    }
                    modalWrapper.remove();
                });
            }

            // Variant arrows on the overlay; they swap the dialog's contents
            const dialog = modalWrapper.querySelector('.ui-modal');
            if (dialog) editor.setupVariantControls(modalWrapper, dialog, 'modal');

            // Set state flag
            editor.modalAdded = true;

            return modalWrapper;
        }
    };
})();
