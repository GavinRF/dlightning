// Component registry module — see docs/component-module-migration.md
// icon: a single Font Awesome icon with a numeric size control (12–96px),
// click-to-open icon picker, and alignment controls. Returns the alignment
// controls element. Uses globals showIconPicker + createAlignmentControls.
window.Components = window.Components || {};

window.Components.icon = {
    setup(container) {
    const iconContainer = container.querySelector('.iconContainerClass');
    const iconElement = iconContainer?.querySelector('i');
    
    if (!iconElement) return;
    
    // Check for existing size control, create one if it doesn't exist
    let sizeControl = container.querySelector('input.iconControls');
    if (!sizeControl) {
        sizeControl = document.createElement('input');
        sizeControl.classList.add('iconControls');
        sizeControl.type = 'number';
        sizeControl.min = '12';
        sizeControl.max = '96';
        sizeControl.value = '24';
        iconContainer.appendChild(sizeControl);
    }
    
    // Clean up existing listeners to avoid duplicates
    const oldListener = sizeControl._resizeListener;
    if (oldListener) {
        sizeControl.removeEventListener('input', oldListener);
    }
    
    // Create and store new listener
    const newListener = (e) => {
        iconElement.style.fontSize = `${e.target.value}px`;
    };
    sizeControl._resizeListener = newListener;
    sizeControl.addEventListener('input', newListener);
    
    // Set initial font size
    let fontSize = getComputedStyle(iconElement).fontSize || iconElement.style.fontSize;
    const initialSize = parseInt(fontSize, 10) || 24;
    sizeControl.value = initialSize;
    iconElement.style.fontSize = `${initialSize}px`;
    
    // Add icon picker functionality if not already set up
    // Guard with a JS property, not an attribute: attributes survive cloneNode,
    // so a duplicated icon looked "already bound" while having no listener.
    if (!iconElement._iconPickerBound) {
        iconElement.addEventListener('click', (e) => {
            e.preventDefault();
            showIconPicker(iconElement);
        });
        iconElement._iconPickerBound = true;
    }
    
    // Set up alignment controls
    const iconAlignment = createAlignmentControls(iconContainer);
    return iconAlignment;
    }
};
