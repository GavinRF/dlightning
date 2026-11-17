// Component registry module — see docs/component-module-migration.md
// bulletedList: sortable bullet list with per-item indent/outdent/delete controls and an add button.
window.Components = window.Components || {};

window.Components.bulletedList = {
    setup(listContainer) {
        if (!listContainer) return;

        // Ensure bulleted-list-container exists
        let bulletListContainer = listContainer.querySelector('.bulleted-list-container');
        const addButton = listContainer.querySelector('.bullet-list-add-btn');
        if (!bulletListContainer) {
            bulletListContainer = document.createElement('div');
            bulletListContainer.className = 'bulleted-list-container';
            bulletListContainer.style.cssText = 'display: flex; flex-direction: column; gap: 5px; width: 100%;';

            // Move existing bullet list items to the new container
            const items = Array.from(listContainer.querySelectorAll('.bullet-list-item'));
            items.forEach(item => bulletListContainer.appendChild(item));

            // Insert before the add button
            if (addButton) {
                listContainer.insertBefore(bulletListContainer, addButton);
                // Add some styling for the sortable list
        const styleId = 'bullet-list-sortable-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .bullet-list-ghost {
                    opacity: 0.5;
                    background: var(--neutral-gray);
                }
                .bullet-list-chosen {
                    background: var(--neutral-gray);
                }
                .bullet-list-drag {
                    cursor: grabbing;
                }
                .success-drop {
                    animation: success-animation 0.3s ease-out;
                }
                @keyframes success-animation {
                    0% { background-color: rgba(52, 152, 219, 0.2); }
                    100% { background-color: transparent; }
                }
            `;
            document.head.appendChild(style);
        }
    } else {
                listContainer.appendChild(bulletListContainer);
            }
        }

        // Initialize Sortable for the bullet list container
        if (bulletListContainer._sortable) {
            bulletListContainer._sortable.destroy();
        }

        bulletListContainer._sortable = new Sortable(bulletListContainer, {
            animation: 150,
            handle: '.bullet-list-item',
            ghostClass: 'bullet-list-ghost',
            chosenClass: 'bullet-list-chosen',
            dragClass: 'bullet-list-drag',
            group: 'bulletList', // This ensures it's its own sortable group
            onStart: function(evt) {
                const item = evt.item;
                item.classList.add('pulse-drag');
                item.style.zIndex = '1000';

                // Hide controls during drag
                const controls = item.querySelector('.bullet-list-item-controls');
                if (controls) {
                    controls.style.display = 'none';
                }
            },
            onEnd: function(evt) {
                const item = evt.item;
                item.classList.remove('pulse-drag');
                item.style.zIndex = '';

                // Add success animation if dropped in a new location
                if (evt.oldIndex !== evt.newIndex) {
                    item.classList.add('success-drop');
                    setTimeout(() => {
                        item.classList.remove('success-drop');
                    }, 300);
                }

                // Reset margins based on indentation level
                const currentMargin = parseInt(item.style.marginLeft || '0');
                if (currentMargin > 0) {
                    item.style.marginLeft = `${currentMargin}px`;
                }
            }
        });

        const attachEventsToListItem = (itemContainer) => {
            // Check if controls already exist, if not create them
            let controls = itemContainer.querySelector('.bullet-list-item-controls');
            if (!controls) {
                controls = document.createElement('div');
                controls.className = 'bullet-list-item-controls';

                // Create indent button
                const indentBtn = document.createElement('i');
                indentBtn.className = 'fas fa-indent bullet-list-indent-btn';

                // Create unindent button
                const unindentBtn = document.createElement('i');
                unindentBtn.className = 'fas fa-outdent bullet-list-outdent-btn';

                // Create delete button
                const deleteBLRow = document.createElement('i');
                deleteBLRow.className = 'fas fa-times bullet-list-delete-btn';

                // Append all buttons to controls
                controls.appendChild(indentBtn);
                controls.appendChild(unindentBtn);
                controls.appendChild(deleteBLRow);

                // Append controls to the item container
                itemContainer.appendChild(controls);
            }

            // Get references to buttons (either existing or newly created)
            const indentBtn = controls.querySelector('.bullet-list-indent-btn');
            const unindentBtn = controls.querySelector('.bullet-list-outdent-btn');
            const deleteBLRow = controls.querySelector('.bullet-list-delete-btn');

            // Attach event listeners
            itemContainer.addEventListener('mouseenter', () => {
                controls.style.display = 'flex';
            });

            itemContainer.addEventListener('mouseleave', () => {
                controls.style.display = 'none';
            });

            if (indentBtn) {
                indentBtn.addEventListener('click', () => {
                    const currentMargin = parseInt(itemContainer.style.marginLeft || '0');
                    if (currentMargin < 160) {
                        itemContainer.style.marginLeft = `${currentMargin + 36}px`;
                    }
                });
            }

            if (unindentBtn) {
                unindentBtn.addEventListener('click', () => {
                    const currentMargin = parseInt(itemContainer.style.marginLeft || '0');
                    if (currentMargin >= 36) {
                        itemContainer.style.marginLeft = `${currentMargin - 36}px`;
                    }
                });
            }

            if (deleteBLRow) {
                deleteBLRow.addEventListener('click', () => {
                    itemContainer.remove();
                    if (bulletListContainer.children.length <= 20) {
                        if (addButton) {
                            addButton.style.opacity = '1';
                            addButton.style.pointerEvents = 'all';
                        }
                    }
                });
            }
        };

        // Cleanup existing event listeners
        const cleanup = () => {
            bulletListContainer.querySelectorAll('.bullet-list-item').forEach(item => {
                if (item._handlers) {
                    item.removeEventListener('mouseenter', item._handlers.mouseEnter);
                    item.removeEventListener('mouseleave', item._handlers.mouseLeave);

                    const controls = item.querySelector('.bullet-list-item-controls');
                    if (controls) {
                        const indentBtn = controls.querySelector('.bullet-list-indent-btn');
                        const unindentBtn = controls.querySelector('.bullet-list-outdent-btn');
                        const deleteBLRow = controls.querySelector('.bullet-list-delete-btn');

                        if (indentBtn && item._handlers.indent) {
                            indentBtn.removeEventListener('click', item._handlers.indent);
                        }

                        if (unindentBtn && item._handlers.unindent) {
                            unindentBtn.removeEventListener('click', item._handlers.unindent);
                        }

                        if (deleteBLRow && item._handlers.delete) {
                            deleteBLRow.removeEventListener('click', item._handlers.delete);
                        }
                    }

                    delete item._handlers;
                }
            });
        };

        cleanup();

        // Attach events to existing list items
        bulletListContainer.querySelectorAll('.bullet-list-item').forEach(attachEventsToListItem);

        // Restore the add button functionality
        if (addButton) {
            // Clean up old listeners first
            const newAddButton = addButton.cloneNode(true);
            if (addButton.parentNode) {
                addButton.parentNode.replaceChild(newAddButton, addButton);
            }

            newAddButton.addEventListener('click', () => {
                const newItem = document.createElement('div');
                newItem.className = 'bullet-list-item';
                newItem.innerHTML = `
                    <div class="bullet-icon icon-container">
                        <i class="fas fa-circle" style="margin-top: 1px;"></i>
                    </div>
                    <div class="bullet-list-item-text usa" contenteditable="true">New item</div>
                `;

                // Find icon-container and add click event to show icon picker
                const iconContainer = newItem.querySelector('.icon-container');
                const iconElement = iconContainer.querySelector('i');
                iconContainer.addEventListener('click', () => {
                    showIconPicker(iconElement);
                });

                attachEventsToListItem(newItem);
                bulletListContainer.appendChild(newItem);

                if (bulletListContainer.children.length > 20) {
                    newAddButton.style.opacity = '.45';
                    newAddButton.style.pointerEvents = 'none';
                }
            });
        }

        // Add some styling for the sortable list
        const styleId = 'bullet-list-sortable-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                .bullet-list-ghost {
                    opacity: 0.5;
                    background: var(--neutral-gray);
                }
                .bullet-list-chosen {
                    background: var(--neutral-gray);
                }
                .bullet-list-drag {
                    cursor: grabbing;
                }
                .success-drop {
                    animation: success-animation 0.3s ease-out;
                }
                @keyframes success-animation {
                    0% { background-color: rgba(52, 152, 219, 0.2); }
                    100% { background-color: transparent; }
                }
            `;
            document.head.appendChild(style);
        }
    }
};
