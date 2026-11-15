// Component registry module — see docs/component-module-migration.md
// floatingActionButton: FAB with hover-revealed alignment arrows (left/center/right).
window.Components = window.Components || {};

window.Components.floatingActionButton = {
    setup(fabContainer) {
        if (!fabContainer) return null;

        // Find the fab-nav element inside the container
        const fab = fabContainer.querySelector('.fab-nav');
        if (!fab) return null;


        // Create or reset alignment controls
        const existingArrows = fabContainer.querySelectorAll('.alignment-arrow');
        existingArrows.forEach(arrow => arrow.remove());

        const alignmentControls = createAlignmentControls(fabContainer);

        // Get current alignment from the container's style
        const currentAlignment = fabContainer.style.justifyContent || 'center';
        alignmentControls.setAlignment(currentAlignment);

        // Initially hide arrows
        alignmentControls.hideArrows();

        // Add hover behavior to enable pointer events
        // First remove any existing event listeners by cloning if needed
        const eventHandlers = fabContainer._eventHandlers || {};

        // Clear previous listeners if they exist
        if (eventHandlers.mouseenter) {
            fabContainer.removeEventListener('mouseenter', eventHandlers.mouseenter);
        }
        if (eventHandlers.mouseleave) {
            fabContainer.removeEventListener('mouseleave', eventHandlers.mouseleave);
        }

        // Create and store new event handlers
        eventHandlers.mouseenter = () => {
            fabContainer.style.pointerEvents = 'auto';
            // Show alignment arrows
            alignmentControls.updateArrowVisibility();
        };

        eventHandlers.mouseleave = () => {
            fabContainer.style.pointerEvents = 'none';
            // Hide alignment arrows
            alignmentControls.hideArrows();
        };

        // Attach the new event listeners
        fabContainer.addEventListener('mouseenter', eventHandlers.mouseenter);
        fabContainer.addEventListener('mouseleave', eventHandlers.mouseleave);

        // Store the event handlers for future cleanup
        fabContainer._eventHandlers = eventHandlers;

        return fabContainer;
    }
};
