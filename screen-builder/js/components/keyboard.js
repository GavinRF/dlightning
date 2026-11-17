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

    return {
        // Re-measure (chatInput.place calls this when the chat input appears, goes or resizes)
        refresh: schedule,

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

            // Re-measured when it appears, resizes (variant switch) or goes (size → 0)
            if (observer && !container._kbSpaceObserved) {
                container._kbSpaceObserved = true;
                observer.observe(container);
            }
            schedule();

            return keyboardElement;
        }
    };
})();
