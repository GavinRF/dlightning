// Component registry module — see docs/component-module-migration.md
// adjustableSpace: blank spacer; shows a dashed outline on hover so it's visible while editing.
window.Components = window.Components || {};

window.Components.adjustableSpace = {
    setup(container) {
        const compContainer = container.closest('.component-container');
        if (compContainer) {
            compContainer.addEventListener('mouseenter', () => {
                container.style.outline = '1px dashed var(--neutral-gray)';
            });

            compContainer.addEventListener('mouseleave', () => {
                container.style.outline = 'none';
            });
        }
    }
};
