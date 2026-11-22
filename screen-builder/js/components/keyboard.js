// Component registry module — see docs/component-module-migration.md
// keyboard: on-screen keyboard; the container itself is the keyboard element.
//
// Room to scroll: a screen with a keyboard pads the bottom of its .canvas-content by the
// keyboard's height (plus a chat input pinned on top of it), so content can scroll clear
// of it. Heights differ per variant, so a ResizeObserver measures them (chatInput.place
// asks for a re-measure when the chat input appears, goes or resizes) and writes one
// generated stylesheet (#keyboard-space-rules) keyed by the screen's data-canvas-id —
// nothing on the screen itself changes, so it's not an edit (save / undo / live sync).
// A CSS fallback in componentVariants.css covers screens before measuring and the
// prototype player's clone.
//
// Minimize: the ⌄ button on the keyboard's top-right edge (.kb-min-btn, editor chrome) sets
// data-kb-min on the container (saved html — undo, live sync and save carry it). A minimized
// keyboard is hidden in the editor and PNG exports but still slides up in play when a field
// is tapped. Every screen with a text field (input, search bar, textarea, chat input, video
// comments) gets a keyboard: inserting a field adds a minimized one (ensure), and a
// "Keyboard" button under the screen (.kb-reveal-btn, on the wrapper, outside the design)
// opens a minimized one.
//
// Deleting it (its ×, or the sidebar's Keyboard button) is the designer saying no: the screen
// gets data-no-keyboard (saved as the screen doc's noKeyboard, carried by undo + live sync),
// new fields there add no keyboard and the button under the screen stays away — until a
// keyboard is added from the components again (insertComponent → ensureFor clears it).
window.Components = window.Components || {};

window.Components.keyboard = (() => {
    const EXTRA = 24; // breathing room above the keyboard
    let queued = false;

    const writeRules = () => {
        queued = false;
        let style = document.getElementById('keyboard-space-rules');
        if (!style) {
            style = document.createElement('style');
            style.id = 'keyboard-space-rules';
            document.head.appendChild(style);
        }
        const rules = [];
        document.querySelectorAll('.canvas-wrapper[data-canvas-id] .canvas > .keyboard-container').forEach(kb => {
            const id = kb.closest('.canvas-wrapper').getAttribute('data-canvas-id');
            if (!/^[\w-]+$/.test(id || '') || !kb.offsetHeight) return;
            const chat = kb.parentElement.querySelector(':scope > .chatInput-container');
            const space = kb.offsetHeight + (chat ? chat.offsetHeight : 0) + EXTRA;
            rules.push(`.canvas-wrapper[data-canvas-id="${id}"] .canvas:has(> .keyboard-container) .canvas-content { padding-bottom: ${space}px; }`);
        });
        style.textContent = rules.join('\n');
    };
    const schedule = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(writeRules);
    };
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;

    // ---- Minimize + the button under the screen ------------------------------------------
    const MIN_ATTR = 'data-kb-min';
    const DECLINED_ATTR = 'data-no-keyboard'; // on .canvas
    // Insertions of these types give the screen a (minimized) keyboard
    const FIELD_TYPES = ['input', 'searchBar', 'textarea', 'chatInput'];
    // Read from a screen's .canvas
    const FIELD_SEL = [
        ...['input', 'searchBar', 'textarea'].map(t => `.canvas-content .component-container[data-component-type="${t}"]`),
        '.canvas-content .video-comments .video-comment-field',
        ':scope > .chatInput-container'
    ].join(', ');

    const keyboardOf = (canvas) => canvas?.querySelector(':scope > .keyboard-container') || null;

    const markChanged = (canvas, why) => {
        const id = canvas?.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        if (id) window.projectManager?.addCanvasToChanged?.(id, why);
    };

    const setupMinButton = (kb) => {
        let btn = kb.querySelector(':scope > .kb-min-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'kb-min-btn non-editable';
            btn.title = 'Minimize the keyboard (it still opens in play; the Keyboard button under the screen brings it back)';
            btn.setAttribute('aria-label', 'Minimize keyboard');
            btn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            kb.appendChild(btn);
        }
        if (!btn._kbBound) {
            btn._kbBound = true;
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                api.setMinimized(kb, true);
            });
        }
        // The × (editor.setupDeleteHandler removes it): the designer doesn't want one here
        const del = kb.querySelector(':scope > .delete-btn');
        if (del && !del._kbDeclineBound) {
            del._kbDeclineBound = true;
            del.addEventListener('click', () => api.setDeclined(kb.closest('.canvas'), true));
        }
    };

    // The "Keyboard" button under each screen: there while the screen's keyboard is
    // minimized, or it has a text field and no keyboard. Not part of the design (it's on the
    // wrapper, outside .canvas), so history / save never see it.
    const COMPACT_BELOW = 260; // px of the screen's on-page width (prototype.js COUNT_COMPACT_BELOW)
    let revealQueued = false;
    const updateRevealButtons = () => {
        revealQueued = false;
        document.querySelectorAll('#mockZone > .canvas-wrapper').forEach(wrapper => {
            const canvas = wrapper.querySelector(':scope > .canvas');
            if (!canvas) return;
            const kb = keyboardOf(canvas);
            const show = kb ? kb.hasAttribute(MIN_ATTR)
                : !canvas.hasAttribute(DECLINED_ATTR) && !!canvas.querySelector(FIELD_SEL);
            let btn = wrapper.querySelector(':scope > .kb-reveal-btn');
            if (!show) { btn?.remove(); return; }
            if (!btn) {
                btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'kb-reveal-btn';
                btn.setAttribute('aria-label', 'Keyboard');
                btn.innerHTML = '<i class="fa-regular fa-keyboard"></i><span>Keyboard</span>';
                wrapper.appendChild(btn);
            }
            // Zoomed out far enough that the label would crowd the row under the screen (in
            // Connect mode: after the count + Solo chips, which drop their words at the same width)
            btn.classList.toggle('kb-reveal-compact', canvas.getBoundingClientRect().width < COMPACT_BELOW);
            btn.title = kb
                ? 'Show the keyboard (to edit it, or to have it in PNG exports)'
                : 'Add a keyboard: it slides up in play when a text field is tapped';
        });
    };
    const scheduleReveal = () => {
        if (revealQueued) return;
        revealQueued = true;
        requestAnimationFrame(updateRevealButtons);
    };

    const startWatching = () => {
        if (window.PUBLIC_PROTO_TOKEN) return; // share-link viewer: no editor
        const zone = document.getElementById('mockZone');
        if (!zone) { setTimeout(startWatching, 200); return; }
        new MutationObserver(scheduleReveal).observe(zone, {
            childList: true, subtree: true, attributes: true, attributeFilter: [MIN_ATTR, DECLINED_ATTR]
        });
        // Delegated: a duplicated screen's wrapper can carry a copy of the button
        document.addEventListener('click', (e) => {
            const btn = e.target.closest?.('#mockZone > .canvas-wrapper > .kb-reveal-btn');
            if (!btn) return;
            e.stopPropagation();
            const canvas = btn.parentElement.querySelector(':scope > .canvas');
            const kb = keyboardOf(canvas);
            if (kb) api.setMinimized(kb, false);
            else if (canvas && typeof editor !== 'undefined') {
                editor.insertComponent(canvas, 'keyboard', { scroll: false });
                markChanged(canvas, 'Keyboard added');
            }
            scheduleReveal();
        });
        document.addEventListener('editorzoomchange', scheduleReveal);
        scheduleReveal();
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startWatching);
    else startWatching();

    const api = {
        // Re-measure (chatInput.place calls this when the chat input appears, goes or resizes)
        refresh: schedule,

        isMinimized: (kb) => !!kb?.hasAttribute(MIN_ATTR),

        setMinimized(kb, on) {
            if (!kb || !!on === kb.hasAttribute(MIN_ATTR)) return;
            kb.toggleAttribute(MIN_ATTR, !!on);
            markChanged(kb.closest('.canvas'), on ? 'Keyboard minimized' : 'Keyboard shown');
            schedule();
            scheduleReveal();
        },

        // The designer deleted the screen's keyboard (on) / added one again (off)
        setDeclined(canvas, on) {
            if (!canvas || !!on === canvas.hasAttribute(DECLINED_ATTR)) return;
            canvas.toggleAttribute(DECLINED_ATTR, !!on);
            markChanged(canvas, on ? 'Keyboard deleted' : 'Keyboard added');
            scheduleReveal();
        },

        // `type` was just inserted on `canvas` (editor.insertComponent). A keyboard: the
        // designer wants one again. A text field: give the screen a minimized keyboard if it
        // has none (and the designer hasn't deleted one there), so it opens in play.
        ensureFor(canvas, type) {
            if (type === 'keyboard') { this.setDeclined(canvas, false); return; }
            if (!FIELD_TYPES.includes(type) || !canvas || keyboardOf(canvas)) return;
            if (canvas.hasAttribute(DECLINED_ATTR)) return;
            if (typeof editor === 'undefined') return;
            const kb = editor.insertComponent(canvas, 'keyboard', { scroll: false });
            if (kb) kb.setAttribute(MIN_ATTR, '');
            scheduleReveal();
        },

        setup(container) {
            if (!container) return null;

            // The container IS the keyboard element in this case
            const keyboardElement = container;

            // Set the flag to track the component
            editor.keyboardAdded = true;

            // Initial setup of interactive elements
            const controls = editor.setupVariantControls(container, keyboardElement, 'keyboard');

            // Store a reference to the original controls in the container
            if (controls) {
                container._variantControls = controls;
            }

            editor.setupDeleteHandler(keyboardElement);
            setupMinButton(keyboardElement);

            // Re-measured when it appears, resizes (variant switch) or goes (size → 0)
            if (observer && !container._kbSpaceObserved) {
                container._kbSpaceObserved = true;
                observer.observe(container);
            }
            schedule();

            scheduleReveal();

            return keyboardElement;
        }
    };
    return api;
})();
