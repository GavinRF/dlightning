// Component registry module — see docs/component-module-migration.md
// radio: single-select radio button with editable label.
window.Components = window.Components || {};

window.Components.radio = {
    // Prototype player (js/prototype.js): single-select across the radios on this screen;
    // the circle or its label text selects.
    play(root) {
        root.querySelectorAll('.custom-radio').forEach(radio => {
            if (radio._playBound) return;
            radio._playBound = true;
            const select = () => {
                const scope = radio.closest('.canvas') || document;
                scope.querySelectorAll('.custom-radio').forEach(other => {
                    const dot = other.querySelector('span');
                    if (dot) dot.style.display = other === radio ? 'block' : 'none';
                    other.style.borderColor = other === radio ? 'var(--color-primary)' : '#e0e0e0';
                });
            };
            radio.addEventListener('click', select);
            const row = radio.closest('.radio-wrapper');
            const label = row && [...row.children].find(c => c.tagName === 'SPAN');
            if (label) {
                label.style.cursor = 'pointer';
                label.addEventListener('click', select);
            }
        });
    },

    setup(radioWrapper) {
        let radioDiv = radioWrapper.querySelector('.custom-radio');
        let radioDot = radioDiv.querySelector('span');
        let radLabl = radioWrapper.querySelector('span:not(.radio-dot)'); // Ensure this targets the label span

        // Add click event for radio selection
        radioDiv.addEventListener('click', () => {
            const radios = document.querySelectorAll('.custom-radio');
            radios.forEach(dot => {
                dot.querySelector('span').style.display = 'none';
                dot.style.borderColor = '#e0e0e0';
            });
            radioDot.style.display = 'block';
            radioDiv.style.borderColor = 'var(--color-primary)';
        });

        // Make the label editable but prevent the click from propagating to the radio button
        if (radLabl) {
            editor.makeTextEditable(radLabl);

            // Prevent click on label from triggering radio button
            radLabl.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }
};
