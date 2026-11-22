// Component registry module — see docs/component-module-migration.md
// chatInput: message bar pinned to the bottom of the screen. A SPECIAL component (like
// keyboard / bottomNav): one per screen, lives on .canvas (outside .canvas-content), saved
// as hasChatInput / chatInputContent on the screen doc and synced through the special map.
//
//   <div class="chatInput-container">            ← position: absolute, bottom computed by place()
//       <div class="chatInput-content">variant</div>
//       <button class="delete-btn">×</button>   (+ variant controls / swatches, editor chrome)
//   </div>
//
// It sits on top of the keyboard (if the screen has one) or the bottom nav, else at the very
// bottom. The variants still come from setupVariants('chatInput') in variants.js.
//
// Screens saved before it was pinned have it as a regular component in .canvas-content —
// migrate(canvas) moves that one out on load.
window.Components = window.Components || {};

window.Components.chatInput = {
    // Build a fresh chat input from variant markup (default: variant 1)
    create(variantHTML) {
        const container = document.createElement('div');
        container.className = 'chatInput-container';
        const content = document.createElement('div');
        content.className = 'chatInput-content';
        content.innerHTML = variantHTML || setupVariants('chatInput')[0];
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        container.append(content, deleteBtn);
        return container;
    },

    setup(container) {
        if (!container) return null;
        const content = container.querySelector('.chatInput-content');
        if (!content) return container;

        // Rehydrated html (load, sync, undo) can carry dead copies of the editor chrome
        container.querySelectorAll('.color-swatch-container').forEach(s => s.remove());
        if (!container.querySelector(':scope > .delete-btn')) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '×';
            container.appendChild(deleteBtn);
        }

        editor.setupVariantControls(container, content, 'chatInput');
        // The delete button goes through the normal special-component toggle so the
        // screen's data-has-chatInput flag (what save / sync read) is cleared too.
        const del = container.querySelector(':scope > .delete-btn');
        if (del && !del._chatInputBound) {
            del._chatInputBound = true;
            del.addEventListener('click', (e) => {
                e.stopPropagation();
                const canvas = container.closest('.canvas');
                container.classList.add('delete-animation');
                setTimeout(() => {
                    if (canvas) {
                        editor.removeSpecialComponent('chatInput', [canvas]);
                        canvas.removeAttribute('data-has-chatInput');
                    } else {
                        container.remove();
                    }
                }, 200);
            });
        }
        editor.createColorSwatchesForVariant(container, content);
        window.updateComponentSwatches?.(container);
        // (icon picker / image upload are bound by editor.insertSpecialComponent)

        this.watch(container);
        return container;
    },

    // Re-run place() whenever the screen's keyboard / bottom nav appears, goes or resizes
    watch(container) {
        const canvas = container.closest('.canvas');
        if (!canvas) { requestAnimationFrame(() => container.isConnected && this.watch(container)); return; }
        if (canvas._chatInputWatch) { this.place(canvas); return; }
        const resize = new ResizeObserver(() => this.place(canvas));
        const observeBars = () => {
            resize.disconnect();
            canvas.querySelectorAll(':scope > .keyboard-container, :scope > .bottomNavContain, :scope > .chatInput-container')
                .forEach(el => resize.observe(el));
        };
        const children = new MutationObserver(() => {
            if (!canvas.querySelector(':scope > .chatInput-container')) {
                children.disconnect();
                resize.disconnect();
                canvas._chatInputWatch = null;
                window.Components.keyboard?.refresh?.(); // drop its height from the keyboard's scroll room
                return;
            }
            observeBars();
            this.place(canvas);
        });
        children.observe(canvas, { childList: true });
        canvas._chatInputWatch = { children, resize };
        observeBars();
        this.place(canvas);
    },

    // How far up the chat input sits: on top of the keyboard, else the bottom nav, else 0
    offsetFor(canvas, { keyboardOpen = true } = {}) {
        const kb = canvas.querySelector(':scope > .keyboard-container');
        const nav = canvas.querySelector(':scope > .bottomNavContain');
        // (a minimized keyboard is display: none in the editor — offsetHeight 0)
        if (kb && keyboardOpen && kb.offsetHeight) return kb.offsetHeight;
        return nav ? nav.offsetHeight : 0;
    },

    place(canvas) {
        // Its height counts toward the keyboard's scroll room (keyboard.js)
        window.Components.keyboard?.refresh?.();
        const input = canvas.querySelector(':scope > .chatInput-container');
        if (!input) return;
        const bottom = `${this.offsetFor(canvas)}px`;
        if (input.style.bottom !== bottom) input.style.bottom = bottom;
    },

    // Legacy screens: a chat input inside .canvas-content becomes the pinned one
    // (only the first; any extra copies are dropped — a screen has one message bar).
    migrate(canvas) {
        const legacy = Array.from(canvas.querySelectorAll('.canvas-content .component-container[data-component-type="chatInput"]'));
        if (!legacy.length) return false;
        if (!canvas.querySelector(':scope > .chatInput-container')) {
            // The variant's root (wrapper first — it contains a .chat-input-con), wherever the
            // old factory / wrapper nested it
            const variant = legacy[0].querySelector('.chat-input-wrapper') || legacy[0].querySelector('.chat-input-con');
            const component = this.create(variant ? variant.outerHTML : null);
            const currentVariant = legacy[0].querySelector('[data-current-variant]')?.dataset.currentVariant;
            if (currentVariant) component.querySelector('.chatInput-content').dataset.currentVariant = currentVariant;
            editor.insertSpecialComponent(canvas, component, 'chatInput');
            canvas.setAttribute('data-has-chatInput', 'true');
            this.setup(component);
        }
        legacy.forEach(el => el.remove());
        return true;
    }
};
