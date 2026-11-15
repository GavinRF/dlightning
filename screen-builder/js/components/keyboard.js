// Component registry module — see docs/component-module-migration.md
// keyboard: on-screen keyboard; the container itself is the keyboard element.
window.Components = window.Components || {};

window.Components.keyboard = {
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

        return keyboardElement;
    }
};
