// Component registry module — see docs/component-module-migration.md
// checkbox: a square toggle icon with an editable label.
// Note: this method uses the editor singleton — `this.` in the original method
// became `editor.` here (e.g. the dedupe handle
// editor._checkboxClickHandler, whose shared-property semantics are preserved as-is).
window.Components = window.Components || {};

window.Components.checkbox = {
    // Prototype player (js/prototype.js): the box or its label text toggles the check.
    play(root) {
        root.querySelectorAll('.checkbox-square-icon').forEach(box => {
            const row = box.parentElement;
            if (!row || row._playBound) return;
            row._playBound = true;
            const label = [...row.children].find(c => c.tagName === 'SPAN');
            if (label) label.style.cursor = 'pointer';
            row.addEventListener('click', (e) => {
                if (!box.contains(e.target) && !label?.contains(e.target)) return;
                box.querySelector('.checkbox-check-icon')?.classList.toggle('checked');
            });
        });
    },

    setup(checkboxWrapper) {
        const checkboxDiv = checkboxWrapper.querySelector('.checkbox-square-icon');
        const checkIcon = checkboxDiv?.querySelector('.checkbox-check-icon');
        const checkLabel = checkboxWrapper.querySelector('span');

        if (checkboxDiv) {
            // Remove existing listeners to prevent multiple bindings
            checkboxDiv.removeEventListener('click', editor._checkboxClickHandler);
            // Define a named function for the event listener
            editor._checkboxClickHandler = () => {
                if (checkIcon) {
                    checkIcon.classList.toggle('checked');
                }
            };
            checkboxDiv.addEventListener('click', editor._checkboxClickHandler);
        }

        if (checkLabel) {
            // Older saved labels have no contenteditable (they used a click-to-input editor)
            checkLabel.setAttribute('contenteditable', 'true');
        }
    }
};
