// Component registry — see js/components/README or CLAUDE.md.
// Each component module registers itself on window.Components[type] with the
// behavior hooks the core (ux-mock-bldr.js) calls after insert/duplicate/load:
//   setup(container, ...args)  — wire up interactivity on a freshly inserted,
//                                duplicated, or restored component.
//
// Modules are plain non-module scripts loaded before ux-mock-bldr.js. They may
// reach into the global `editor` singleton and shared helpers, same as
// imgGallerySetup.js. Keep shared infrastructure in the core, not here.
window.Components = window.Components || {};

window.Components.progressBar = {
    // value: omit to keep the value the markup already shows (a loaded or duplicated bar);
    // falls back to 76 for markup that shows none.
    setup(container, value) {
        // Find elements in any variant structure
        const progressBar = container.querySelector('.progress-bar');
        if (!progressBar) return;
        const isSVG = progressBar.querySelector('svg');
        const pieSlice = progressBar.querySelector('svg path[fill="var(--color-primary)"]');
        const circularPaths = progressBar.querySelectorAll('path[stroke-dasharray]');
        const linearProgress = progressBar.querySelector('div > div');  // For standard progress bars
        const percentageText = container.querySelector('[contenteditable="true"]');

        if ((!pieSlice && !circularPaths.length && !linearProgress) || !percentageText) return;

        if (value === undefined) {
            // Same precedence as updateProgress (SVG variants also contain a div > div)
            const shown = pieSlice ? parseFloat(percentageText.textContent)
                : circularPaths.length ? parseFloat(circularPaths[0].getAttribute('stroke-dasharray'))
                : parseFloat(linearProgress.style.width);
            value = Number.isFinite(shown) ? shown : 76;
        }
        // Ensure value is between 0 and 100
        value = Math.min(100, Math.max(0, Math.round(value)));

        function updateProgress(value) {
            if (pieSlice) {
                // Handle pie slice progress
                const radians = (value / 100) * 2 * Math.PI;
                const endX = Math.cos(radians);
                const endY = Math.sin(radians);
                const largeArcFlag = value > 50 ? 1 : 0;
                const d = `M 0 0 L 1 0 A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
                pieSlice.setAttribute('d', d);
            } else if (circularPaths.length) {
                // Handle circular progress
                circularPaths.forEach(path => {
                    path.setAttribute('stroke-dasharray', `${value}, 100`);
                });
            } else if (linearProgress) {
                // Handle linear progress bars
                linearProgress.style.width = value + '%';
            }
            percentageText.textContent = value + '%';
        }

        // Initial update
        updateProgress(value);

        // Handle clicks on the progress bar
        progressBar.addEventListener('click', (e) => {
            // Ignore clicks on the editable text
            if (e.target === percentageText || percentageText.contains(e.target)) {
                return;
            }

            const rect = progressBar.getBoundingClientRect();

            if (isSVG) {
                // For circular and pie progress
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                // Calculate angle from center to click point
                let angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

                // Adjust angle based on SVG rotation
                angle = angle + (Math.PI / 2); // Adjust for SVG rotation
                if (angle < 0) angle += 2 * Math.PI;

                // Convert to percentage
                let percentage = (angle / (2 * Math.PI)) * 100;
                updateProgress(Math.round(percentage));
            } else {
                // For linear progress bars
                const x = e.clientX - rect.left;
                const width = rect.width;
                const percentage = Math.round((x / width) * 100);
                updateProgress(percentage);
            }
        });

        // Handle direct editing of the percentage text
        percentageText.addEventListener('input', () => {
            let text = percentageText.textContent;
            // Remove any non-numeric characters except for the % symbol
            text = text.replace(/[^\d%]/g, '');
            // Remove any % symbols except for the last one
            text = text.replace(/%/g, '') + '%';

            let value = parseInt(text);
            if (!isNaN(value)) {
                value = Math.min(100, Math.max(0, value));
                updateProgress(value);
            }
        });

        // Handle blur to ensure proper formatting
        percentageText.addEventListener('blur', () => {
            let value = parseInt(percentageText.textContent);
            if (isNaN(value)) {
                value = 0;
            }
            value = Math.min(100, Math.max(0, value));
            updateProgress(value);
        });

        // Prevent line breaks in the editable content
        percentageText.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                percentageText.blur();
            }
        });
    }
};
