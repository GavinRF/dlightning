// Component registry module — see docs/component-module-migration.md
// blankCard: an empty drop container — keeps an empty-placeholder in sync with
// its (possibly nested) contents and is a SortableJS drop target.
window.Components = window.Components || {};

window.Components.blankCard = {
    setup(container) {
    const content = container.querySelector('.blank-card-content');
    
    // Create placeholder if needed
    let placeholder = content.querySelector('.empty-placeholder');
    if (!placeholder) {
        placeholder = editor.createPlaceholder(content);
    }

    // Handle placeholder visibility based on content
    // (replace any observer from a previous setup call instead of stacking them)
    if (content._blankCardObserver) content._blankCardObserver.disconnect();
    const observer = new MutationObserver(() => {
        // Get all direct children that are component containers
        const directComponents = Array.from(content.children).filter(child => 
            child.classList && child.classList.contains('component-container')
        );
        
        // Update placeholder visibility based on direct components
        if (directComponents.length > 0) {
            // If we have components, hide the placeholder
            if (placeholder && placeholder.parentNode === content) {
                placeholder.style.display = 'none';
            }
        } else {
            // If we don't have components, show the placeholder
            if (placeholder && placeholder.parentNode === content) {
                placeholder.style.display = 'block';
            } else if (!content.querySelector('.empty-placeholder')) {
                // If placeholder was removed, recreate it
                placeholder = editor.createPlaceholder(content);
                placeholder.style.display = 'block';
            }
        }
        
        // Handle nested blank cards
        directComponents.forEach(component => {
            const nestedContent = component.querySelector('.blank-card-content');
            if (nestedContent) {
                // If this is a nested blank card, update its placeholder too
                const nestedComponents = Array.from(nestedContent.children).filter(child => 
                    child.classList && child.classList.contains('component-container')
                );
                
                const nestedPlaceholder = nestedContent.querySelector('.empty-placeholder');
                
                if (nestedComponents.length > 0 && nestedPlaceholder) {
                    nestedPlaceholder.style.display = 'none';
                } else if (nestedComponents.length === 0) {
                    if (nestedPlaceholder) {
                        nestedPlaceholder.style.display = 'block';
                    } else {
                        editor.createPlaceholder(nestedContent);
                    }
                }
            }
        });
    });
    
    content._blankCardObserver = observer;
    observer.observe(content, { 
        childList: true,
        subtree: true 
    });

    // Initialize sortable
    editor.initializeSortable(content);
    }
};
