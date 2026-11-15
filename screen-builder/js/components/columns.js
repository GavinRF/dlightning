// Component registry module — see docs/component-module-migration.md
// columns: a multi-column (1–6) flex layout with add/remove controls, a gap
// slider, drag-resize handles between columns, and per-column SortableJS drop
// zones. Uses globals editor.initializeSortable + projectManager (autosave).
window.Components = window.Components || {};

window.Components.columns = {
    setup(columnContainer) {
    // Guard against null
    if (!columnContainer) {
        console.error('Attempted to setup columns with null container');
        return;
    }
    // Avoid duplicate initialization
    if (columnContainer._isSetup) return;
    columnContainer._isSetup = true;

    const controls = columnContainer.querySelector('.columns-controls');
    const gapRange = controls.querySelector('input[type="range"]');
    const decrementBtn = controls.querySelector('button:first-child');
    decrementBtn.setAttribute('title', 'remove column');
    const incrementBtn = controls.querySelector('button:nth-child(3)');
    incrementBtn.setAttribute('title', 'add column');
    const columnCount = controls.querySelector('span:nth-child(2)');
    columnCount.setAttribute('title', 'column count');
    const gapValue = controls.querySelector('span:last-child');

    const parentContainer = columnContainer.closest('.component-container');
    if (parentContainer) {
        parentContainer.querySelectorAll(':scope > .color-swatch-container').forEach(swatch => {
            swatch.remove();
        });
    }
  
    // Create column functionality
    const createColumn = () => {
        const column = document.createElement('div');
        column.className = 'column-container pulseAnim';

        const empty = document.createElement('div');
        empty.classList.add('empty-placeholder');
        empty.innerHTML = '<i class="fas fa-table-columns"></i>';
        column.appendChild(empty);

        // Initialize sortable on the new column
        editor.initializeSortable(column);
        return column;
    };

    // Function to create column resize handles
    const createResizeHandles = () => {
        // First remove any existing resize handles
        columnContainer.querySelectorAll('.column-resize-handle').forEach(handle => handle.remove());
        
        // Get all columns
        const columns = columnContainer.querySelectorAll('.column-container');
        if (columns.length <= 1) return; // No need for handles with just one column
        
        // Add a resize handle after each column except the last one
        Array.from(columns).slice(0, -1).forEach((column, index) => {
            const handle = document.createElement('div');
            handle.className = 'column-resize-handle';
            handle.style.cssText = `
                width: 8px;
                height: 100%;
                cursor: col-resize;
                z-index: 10;
                position: absolute;
                top: 0;
                right: -4px;
                background: transparent;
            `;
            
            // Add visual indicator for the handle
            const handleIndicator = document.createElement('div');
            handleIndicator.className = 'handle-indicator';
            handleIndicator.style.cssText = `
                position: absolute;
                top: 0;
                bottom: 0;
                left: 3px;
                width: 2px;
                background: transparent;
                border-radius: 1px;
                transition: background 0.2s ease;
            `;
            handle.appendChild(handleIndicator);
            
            // Add hover effect
            handle.addEventListener('mouseenter', () => {
                handleIndicator.style.background = 'rgba(52, 152, 219, 0.7)';
            });
            
            handle.addEventListener('mouseleave', () => {
                if (!handle.classList.contains('dragging')) {
                    handleIndicator.style.background = 'transparent';
                }
            });
            
            // Add resize functionality
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Visual feedback during drag
                handle.classList.add('dragging');
                handleIndicator.style.background = 'rgba(52, 152, 219, 0.9)';
                
                // Get the current column and next column
                const currentColumn = column;
                const nextColumn = columns[index + 1];
                
                if (!currentColumn || !nextColumn) return;
                
                // Store the initial flex values
                const currentFlex = parseFloat(currentColumn.style.flexGrow) || 1;
                const nextFlex = parseFloat(nextColumn.style.flexGrow) || 1;
                const totalFlex = currentFlex + nextFlex;
                
                // Get initial dimensions
                const startX = e.clientX;
                const containerWidth = columnContainer.getBoundingClientRect().width;
                const currentWidth = currentColumn.getBoundingClientRect().width;
                const nextWidth = nextColumn.getBoundingClientRect().width;
                const totalWidth = currentWidth + nextWidth;
                
                // Create overlay to capture mouse events
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                    cursor: col-resize;
                `;
                document.body.appendChild(overlay);
                
                // Create visual guide line
                const guideline = document.createElement('div');
                guideline.style.cssText = `
                    position: fixed;
                    top: ${currentColumn.getBoundingClientRect().top}px;
                    left: ${currentColumn.getBoundingClientRect().right}px;
                    width: 2px;
                    height: ${Math.max(currentColumn.getBoundingClientRect().height, nextColumn.getBoundingClientRect().height)}px;
                    background-color: var(--color-primary);
                    z-index: 1001;
                    pointer-events: none;
                `;
                document.body.appendChild(guideline);
                
                const mouseMoveHandler = (moveEvent) => {
                    // Calculate the delta movement
                    const deltaX = moveEvent.clientX - startX;
                    
                    // Calculate how the delta affects the distribution of flex
                    const deltaPercentage = deltaX / totalWidth;
                    
                    // Calculate new flex values
                    let newCurrentFlex = currentFlex + (deltaPercentage * totalFlex);
                    let newNextFlex = nextFlex - (deltaPercentage * totalFlex);
                    
                    // Enforce minimum size by setting a min flex value
                    const minFlex = 0.1; // This will enforce minimum width
                    
                    if (newCurrentFlex < minFlex) {
                        newCurrentFlex = minFlex;
                        newNextFlex = totalFlex - minFlex;
                    } else if (newNextFlex < minFlex) {
                        newNextFlex = minFlex;
                        newCurrentFlex = totalFlex - minFlex;
                    }
                    
                    // Apply new flex values
                    currentColumn.style.flex = `${newCurrentFlex} 1 min-content`;
                    nextColumn.style.flex = `${newNextFlex} 1 min-content`;
                    
                    // Store flex-grow values for later retrieval
                    currentColumn.style.flexGrow = newCurrentFlex;
                    nextColumn.style.flexGrow = newNextFlex;
                    
                    // Update guideline position
                    const newCurrentRight = currentColumn.getBoundingClientRect().right;
                    guideline.style.left = `${newCurrentRight}px`;
                };
                
                const mouseUpHandler = () => {
                    // Clean up
                    document.removeEventListener('mousemove', mouseMoveHandler);
                    document.removeEventListener('mouseup', mouseUpHandler);
                    handle.classList.remove('dragging');
                    handleIndicator.style.background = 'transparent';
                    overlay.remove();
                    guideline.remove();
                    
                    // Mark content as changed for autosave
                    if (projectManager && typeof projectManager.contentChanged !== 'undefined') {
                        projectManager.contentChanged = true;
                        
                        // Add to changedCanvases if that function exists
                        const canvasWrapper = columnContainer.closest('.canvas-wrapper');
                        if (canvasWrapper && projectManager.addCanvasToChanged) {
                            const canvasId = canvasWrapper.getAttribute('data-canvas-id');
                            if (canvasId) {
                                projectManager.addCanvasToChanged(canvasId, 'Column resize');
                            }
                        }
                    }
                };
                
                document.addEventListener('mousemove', mouseMoveHandler);
                document.addEventListener('mouseup', mouseUpHandler);
            });
            
            column.style.position = 'relative';
            column.appendChild(handle);
        });
    };

    // Update columns count
    const updateColumns = (newCount) => {
        const currentColumns = columnContainer.querySelectorAll('.column-container');
        const currentCount = currentColumns.length;

        if (newCount === currentCount) return;

        // Update to flex layout
        columnCount.textContent = newCount;

        if (newCount > currentCount) {
            // Get total flex of existing columns
            let totalFlex = 0;
            currentColumns.forEach(col => {
                const flex = parseFloat(col.style.flexGrow) || 1;
                totalFlex += flex;
            });
            
            // Add columns
            for (let i = currentCount; i < newCount; i++) {
                const newColumn = createColumn();
                // Give new columns an equal portion of the available flex
                newColumn.style.flex = '1 1 min-content';
                newColumn.style.flexGrow = 1;
                columnContainer.appendChild(newColumn);
            }
        } else {
            // Move content from columns being removed to the first column
            const firstColumn = currentColumns[0];
            
            // Calculate new flex distribution
            let totalFlexToRedistribute = 0;
            
            // Process columns to be removed
            for (let i = newCount; i < currentCount; i++) {
                const column = currentColumns[i];
                const flex = parseFloat(column.style.flexGrow) || 1;
                totalFlexToRedistribute += flex;
                
                // Move content to first column
                while (column.firstChild) {
                    firstColumn.appendChild(column.firstChild);
                }
                column.remove();
            }
            
            // Redistribute the flex values to remaining columns
            if (totalFlexToRedistribute > 0) {
                const remainingColumns = columnContainer.querySelectorAll('.column-container');
                const flexPerColumn = totalFlexToRedistribute / remainingColumns.length;
                
                remainingColumns.forEach(col => {
                    const currentFlex = parseFloat(col.style.flexGrow) || 1;
                    const newFlex = currentFlex + flexPerColumn;
                    col.style.flex = `${newFlex} 1 min-content`;
                    col.style.flexGrow = newFlex;
                });
            }
        }

        // Update button states
        decrementBtn.style.opacity = newCount <= 1 ? '0.5' : '1';
        decrementBtn.style.cursor = newCount <= 1 ? 'default' : 'pointer';
        incrementBtn.style.opacity = newCount >= 6 ? '0.5' : '1';
        incrementBtn.style.cursor = newCount >= 6 ? 'default' : 'pointer';
        
        // Create resize handles after updating columns
        createResizeHandles();
    };

    // Gap range control
    gapRange.addEventListener('input', (e) => {
        const newGap = e.target.value;
        gapValue.textContent = newGap;
        columnContainer.style.gap = `${newGap}px`;
    });

    decrementBtn.addEventListener('click', () => {
        const currentCount = parseInt(columnCount.textContent);
        if (currentCount > 1) {
            updateColumns(currentCount - 1);
        }
    });

    incrementBtn.addEventListener('click', () => {
        const currentCount = parseInt(columnCount.textContent);
        if (currentCount < 6) {
            updateColumns(currentCount + 1);
        }
    });

    // Add hover behavior for controls
    columnContainer.addEventListener('mouseenter', () => {
        controls.style.display = 'flex';
    });

    columnContainer.addEventListener('mouseleave', () => {
        controls.style.display = 'none';
    });

    const mutationObserver = new MutationObserver((mutations) => {
        const columns = columnContainer.querySelectorAll('.column-container');

        // Check if columns were added or removed
        const columnCountChanged = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node => 
                node.classList && node.classList.contains('column-container')
            ) || Array.from(mutation.removedNodes).some(node => 
                node.classList && node.classList.contains('column-container')
            );
        });
        
        // If columns changed, update resize handles
        if (columnCountChanged) {
            createResizeHandles();
        }

        // Update placeholder visibility
        columns.forEach(column => {
            const empty = column.querySelector(':scope > .empty-placeholder');
            const hasComponents = column.querySelector('.component-container');
            if (empty) {
                const hasDirectComponents = column.querySelector(':scope > .component-container');
                empty.style.display = hasComponents ? 'none' : 'block';
            }
        });
    });

    mutationObserver.observe(columnContainer, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
    });


    // Initialize with two columns or configure existing columns
    if (columnContainer.querySelectorAll('.column-container').length === 0) {
        updateColumns(2);
    } else {
        // If columns already exist, initialize flex values
        const existingColumns = columnContainer.querySelectorAll('.column-container');
        
        // Set equal flex for all columns
        existingColumns.forEach(column => {
            column.style.flex = '1 1 min-content';
            column.style.flexGrow = 1; // Store the flex-grow value explicitly for easy access
        });
        
        createResizeHandles();
    }

    // Initialize sortable for each column with nested column handling
    columnContainer.querySelectorAll('.column-container').forEach(column => {
        editor.initializeSortable(column, {
            group: {
                name: 'shared-components',
                pull: true,
                put: function(to, from, dragEl) {
                    if (dragEl.classList.contains('columns-wrapper')) {
                        return false;
                    }
                    return true;
                }
            },
            filter: '.columns-wrapper',
            onMove: function(evt) {
                if (evt.dragged.classList.contains('columns-wrapper') && 
                    evt.to.closest('.column-container')) {
                    return false;
                }
                return true;
            }
        });
    });
    }
};
