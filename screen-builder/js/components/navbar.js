// Component registry module — see docs/component-module-migration.md
// navbar: top navigation bar; variant controls, editable text, and text-contrast adjustment.
window.Components = window.Components || {};

window.Components.navbar = {
    setup(navbar) {
        if (!navbar) return null;

        // Check if it's a wrapper or the direct navbar element
        const topNavbarContainer = navbar.classList.contains('navContain') ?
            navbar : navbar.querySelector('.navContain');

        if (!topNavbarContainer) return null;

        // Find the actual navbar element
        const navbarElement = topNavbarContainer.querySelector('.navbar');
        if (!navbarElement) return null;

        // Set the flag to track the component
        editor.topNavbarAdded = true;

        // Initial setup of interactive elements
        editor.setupVariantControls(topNavbarContainer, navbarElement, 'navbar');
        window.Components.navbar.setupInteractiveElements(navbarElement);

        // Add the delete button if it's not already there
        // const canvas = topNavbarContainer.closest('.canvas');
        // const existingButton = topNavbarContainer.querySelector('.special-component-delete');
        // if (!existingButton && canvas) {
        //     addDeleteButtonToSpecialComponent(topNavbarContainer, 'navbar', canvas);
        // }

        editor.setupDeleteHandler(topNavbarContainer);
        // update text contrast
        window.TextContrastAdjuster.updateElementContrast(navbarElement);

        return topNavbarContainer;
    },

    // Helper function to set up all interactive elements in the navbar
    setupInteractiveElements(navbarElement) {
        if (!navbarElement) return;

        // Make text elements editable
        navbarElement.querySelectorAll('span:not(.non-editable), a').forEach(el => {
            // el.contentEditable = true;

            // Prevent newlines in editable text
            el.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    el.blur();
                }
            });

            // Handle paste to remove formatting
            el.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text/plain');
                document.execCommand('insertText', false, text);
            });
        });

        // Apply text contrast adjustment to elements with background colors
        setTimeout(() => {
            const elementsWithBg = navbarElement.querySelectorAll('[style*="background-color"]');
            elementsWithBg.forEach(el => {
                if (window.TextContrastAdjuster) {
                    window.TextContrastAdjuster.updateElementContrast(el);
                }
            });
        }, 10);

        return navbarElement;
    }
};
