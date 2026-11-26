// Component registry module — see docs/component-module-migration.md
// modal: overlay dialog; wires its close button, its variant arrows, and tracks the
// editor's modal-added state. Owns its variants (setupVariants falls through here).
//
// Structure: .modal-wrapper (overlay) > [close-button row] + .ui-modal (the dialog).
// Variants swap what's INSIDE .ui-modal — the overlay, close button and arrows stay.
// Variant roots that need different dialog chrome (no padding, bottom-aligned) are
// handled in CSS via :has(> .modal-v-…) on .ui-modal / .modal-wrapper.
//
// Closing it in the editor: the dialog's own × (part of the design) and the round minimize
// button on the overlay's top-right (.modal-min-btn, editor chrome) set data-modal-min on
// the wrapper (saved html — undo, live sync and save carry it). A minimized modal is hidden
// in the editor and PNG exports, so the screen behind it can be edited; the player still
// shows it (and its × closes it there). A "Modal" button under the screen (.modal-reveal-btn,
// on the wrapper, outside the design) shows and hides it; the sidebar's Modal button brings it back too. The red
// .delete-btn, as on every other component, is what removes it.
window.Components = window.Components || {};

window.Components.modal = (() => {
    const MIN_ATTR = 'data-modal-min';

    const markChanged = (canvas, why) => {
        const id = canvas?.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        if (id) window.projectManager?.addCanvasToChanged?.(id, why);
    };

    // The "Modal" button under each screen with a modal: shows / minimizes it. Not part of the design
    // (it's on the wrapper, outside .canvas), so history / save never see it.
    const COMPACT_BELOW = 260; // px of the screen's on-page width (same as the Keyboard button)
    let revealQueued = false;
    const updateRevealButtons = () => {
        revealQueued = false;
        document.querySelectorAll('#mockZone > .canvas-wrapper').forEach(wrapper => {
            const canvas = wrapper.querySelector(':scope > .canvas');
            const modal = canvas?.querySelector(':scope > .modal-wrapper');
            let btn = wrapper.querySelector(':scope > .modal-reveal-btn');
            if (!modal) { btn?.remove(); return; }
            if (!btn) {
                btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'modal-reveal-btn';
                btn.setAttribute('aria-label', 'Modal');
                btn.innerHTML = '<i class="fa-regular fa-window-restore"></i><span>Modal</span>';
                wrapper.appendChild(btn);
            }
            // Just minimized: a pop draws the eye to where the modal went
            if (wrapper._modalRevealPop) {
                btn.classList.remove('reveal-pop');
                void btn.offsetWidth;   // restart the animation
                btn.classList.add('reveal-pop');
                btn.addEventListener('animationend', () => btn.classList.remove('reveal-pop'), { once: true });
            }
            wrapper._modalRevealPop = false;
            const open = !modal.hasAttribute(MIN_ATTR);
            btn.classList.toggle('reveal-open', open);
            btn.setAttribute('aria-pressed', String(open));
            btn.title = open
                ? 'Hide the modal (to edit the screen behind it; it still shows in play)'
                : 'Show the modal (to edit it, or to have it in PNG exports)';
            btn.classList.toggle('reveal-compact', canvas.getBoundingClientRect().width < COMPACT_BELOW);
        });
    };
    const scheduleReveal = () => {
        if (revealQueued) return;
        revealQueued = true;
        requestAnimationFrame(updateRevealButtons);
    };

    const startWatching = () => {
        if (window.PUBLIC_PROTO_TOKEN || window.TEMPLATE_GALLERY) return; // no editor there
        const zone = document.getElementById('mockZone');
        if (!zone) { setTimeout(startWatching, 200); return; }
        new MutationObserver(scheduleReveal).observe(zone, {
            childList: true, subtree: true, attributes: true, attributeFilter: [MIN_ATTR]
        });
        // Delegated: a duplicated screen's wrapper can carry a copy of the button
        document.addEventListener('click', (e) => {
            const btn = e.target.closest?.('#mockZone > .canvas-wrapper > .modal-reveal-btn');
            if (!btn) return;
            e.stopPropagation();
            const modal = btn.parentElement.querySelector(':scope > .canvas > .modal-wrapper');
            if (modal) api.setMinimized(modal, !modal.hasAttribute(MIN_ATTR));
            scheduleReveal();
        });
        document.addEventListener('editorzoomchange', scheduleReveal);
        scheduleReveal();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startWatching);
    else startWatching();

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
        </div>`,

        // 6 — Blank: an empty drop area, like a blank card — drag any components in. Its
        // .blank-card-content class is what makes it a drop target (Sortable onAdd), keeps
        // nested components through save / live sync (rewrapComponents) and gives it the
        // blank card's placeholder; .modal-blank-content restyles it for the dialog.
        /*html*/
        `<div class="modal-v-blank">
            <div class="blank-card-content modal-blank-content"></div>
        </div>`
    ];

    // The blank variant's drop area: placeholder + Sortable (blankCard.setup), and the
    // components in it rebuilt from html (load, undo, live sync, a variant switch back from
    // the cache) get their handlers again (projectManager.rehydrateDropZone, once per element).
    const setupBlank = (dialog) => {
        const inner = dialog?.querySelector(':scope > .modal-v-blank > .modal-blank-content');
        if (!inner) return;
        window.Components.blankCard?.setup(dialog);
        window.projectManager?.rehydrateDropZone?.(inner);
    };

    const api = {
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

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';

            modalWrapper.appendChild(closeBtnCon);
            modalWrapper.appendChild(modal);
            modalWrapper.appendChild(deleteBtn);

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
            // 'flex', not '': clearing it drops the overlay's own inline display: flex (set in
            // create()), which is what centers the dialog — no stylesheet rule puts it back
            root.style.display = open ? 'flex' : 'none';
        },

        playIsOpen(root) {
            return root.style.display !== 'none';
        },

        // Variant arrows swapped the dialog's markup (editor.setupVariantControls)
        afterVariantChange(dialog) {
            setupBlank(dialog);
        },

        // Editor only: hide (on) / show (off) the modal without removing it
        isMinimized: (root) => !!root?.hasAttribute(MIN_ATTR),

        setMinimized(root, on) {
            if (!root || !!on === root.hasAttribute(MIN_ATTR)) return;
            if (root.classList.contains('modal-minimizing')) return;   // already on its way down
            const apply = () => {
                root.classList.remove('modal-minimizing');
                root.toggleAttribute(MIN_ATTR, !!on);
                const wrapper = root.closest('.canvas-wrapper');
                if (wrapper && on) wrapper._modalRevealPop = true;
                markChanged(root.closest('.canvas'), on ? 'Modal minimized' : 'Modal shown');
                scheduleReveal();
            };
            if (!on || !root.isConnected || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
                typeof root.animate !== 'function') { apply(); return; }
            // Minimizing: the dialog drops and shrinks toward the bottom edge — where the "Modal"
            // button under the screen appears — while the dim fades. Web Animations, so nothing
            // is written into the saved html; the class (session-only, editor-chrome.js) hides the
            // chrome and blocks clicks meanwhile.
            root.classList.add('modal-minimizing');
            const MS = 320, EASE = 'cubic-bezier(.5, 0, .75, 0)';
            const dialog = root.querySelector(':scope > .ui-modal');
            const anims = [root.animate(
                [{ backgroundColor: getComputedStyle(root).backgroundColor }, { backgroundColor: 'rgba(0, 0, 0, 0)' }],
                { duration: MS, easing: 'ease-in' })];
            Array.from(root.children).forEach(el => {
                if (el !== dialog && !el.matches('div[style*="width: calc(100% - 46px)"]')) return;
                // To the bottom edge (layout px, so the editor's zoom doesn't matter), shrinking
                const dy = root.clientHeight - (el.offsetTop + el.offsetHeight / 2);
                anims.push(el.animate(
                    [{ transform: 'none', opacity: 1 }, { transform: `translateY(${dy}px) scale(.3)`, opacity: 0 }],
                    { duration: MS, easing: EASE }));
            });
            Promise.all(anims.map(a => a.finished)).catch(() => {}).then(apply);
        },

        setup(modalWrapper) {
            if (!modalWrapper) return;

            // The dialog's × closes it: in the editor that's minimizing (the player binds its own,
            // on its clone). Once per element — setup runs again on load/sync.
            const closeBtnCon = modalWrapper.querySelector('div[style*="width: calc(100% - 46px)"]');
            const closeBtn = closeBtnCon?.querySelector('div');
            if (closeBtn && !closeBtn._modalCloseBound) {
                closeBtn._modalCloseBound = true;
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    api.setMinimized(modalWrapper, true);
                });
            }

            // Minimize button (editor chrome, rebuilt here so it comes back on load / sync / undo)
            let minBtn = modalWrapper.querySelector(':scope > .modal-min-btn');
            if (!minBtn) {
                minBtn = document.createElement('button');
                minBtn.type = 'button';
                minBtn.className = 'modal-min-btn non-editable';
                minBtn.title = 'Minimize the modal to edit the screen behind it (it still shows in play; the Modal button under the screen brings it back)';
                minBtn.setAttribute('aria-label', 'Minimize modal');
                minBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
                modalWrapper.appendChild(minBtn);
            }
            if (!minBtn._modalBound) {
                minBtn._modalBound = true;
                minBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    api.setMinimized(modalWrapper, true);
                });
            }

            // Delete (×), as on every other component: removes it (editor.deleteComponent).
            // Saved modals from before it existed get one here.
            let deleteBtn = modalWrapper.querySelector(':scope > .delete-btn');
            if (!deleteBtn) {
                deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = '×';
                modalWrapper.appendChild(deleteBtn);
            }
            if (!deleteBtn._modalDeleteBound) {
                deleteBtn._modalDeleteBound = true;
                deleteBtn.addEventListener('click', () => {
                    editor.modalAdded = false;
                    editor.specialComponents.modal.added = false;
                });
            }
            editor.setupDeleteHandler(modalWrapper);

            // Variant arrows on the overlay; they swap the dialog's contents
            const dialog = modalWrapper.querySelector('.ui-modal');
            if (dialog) editor.setupVariantControls(modalWrapper, dialog, 'modal');
            setupBlank(dialog);

            // Set state flag
            editor.modalAdded = true;
            scheduleReveal();

            return modalWrapper;
        }
    };
    return api;
})();
