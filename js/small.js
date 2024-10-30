// small JS
////// THE EDITOR  //////////////////////
    let topNavbarAdded = false;
    let bottomNavbarAdded = false;
    let modalAdded = false;
    //add new canvas
    let canvasCount = 1;
    let selectedCanvas = document.querySelector('.canvas');
    let selectedCanvases = new Set(); 

    selectedCanvases.add(selectedCanvas);

///// custom space
    document.querySelector('.component-btn[data-component="customSpace"]').addEventListener('click', function() {
    const component = htmlComponents.adjustableSpace();
    const wrappedComponent = wrapComponentInContainer(component, 'adjustableSpace');
    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
    });


// COMPONENTS ////////////////////
    const htmlComponents = {
// DROPDOWN ////////////////////
        dropdown: () => {
            const select = document.createElement('select');
            select.innerHTML = `
                <option>Dropdown</option>
                <option>Option 1</option>
                <option>Option 2</option>
            `;
            select.style.cssText = 'width: 100%; height: 42px; border: none; border-bottom: 2px solid var(--primary-color); border-radius: 0; background-color: white; font-size: 16px; color: #333;';
            return select;
        },
// REST OF THE COMPONENTS...
// NAVBAR ////////////////////
        navbar: () => {
            const navbar = document.createElement('nav');
            navbar.innerHTML = `
                <span style="font-size: 20px; font-weight: bold; color: --primary;">Brand</span>
                <div style="display: flex; align-items: center;">
                    <a href="#" style="margin-left: 20px; color: #2c3e50; text-decoration: none;">Home</a>
                    <a href="#" style="margin-left: 20px; color: #2c3e50; text-decoration: none;">About</a>
                    <a href="#" style="margin-left: 20px; color: #2c3e50; text-decoration: none;">Contact</a>
                </div>
            `;
            navbar.style.cssText = 'display: flex; justify-content: space-between; align-items: center; width: 100%; height: 60px; background-color: #ecf0f1; padding: 0 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); box-sizing: border-box; margin: 0; position: absolute; left: 0; right: 0; top: 24px;';
            navbar.className = 'navbar';

            // Make navbar text editable
            navbar.querySelectorAll('span, a').forEach(el => makeTextEditable(el));

            return navbar;
        },
        modal: () => {
            const modalWrapper = document.createElement('div');
            modalWrapper.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 1; height: 100%';
            
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <h2 style="margin-top: 0; color: #2c3e50;">Modal Title</h2>
                <p style="color: #7f8c8d;">This is the modal content. You can add any information here.</p>
                <div style="text-align: right;">
                    <button id="modal-ok-btn" style="padding: 10px 20px; background-color: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">OK</button>
                </div>
            `;
            
            modal.querySelectorAll('h2, p').forEach(el => makeTextEditable(el));
            
            modalWrapper.appendChild(modal);

            modal.querySelector('#modal-ok-btn').addEventListener('click', () => {
                modalWrapper.remove();
                modalAdded = false;
            });

            return modalWrapper;
        },
        toggleSwitch: () => {
            const container = document.createElement('div');
            container.style.cssText = 'display: flex; align-items: center; width: 100%;';
            
            const offLabel = document.createElement('span');
            offLabel.textContent = 'Off';
            offLabel.style.cssText = 'margin-right: 10px; cursor: pointer;';
            makeTextEditable(offLabel);

            const label = document.createElement('label');
            label.className = 'switch';
            label.innerHTML = `
                <input type="checkbox">
                <span class="slider round"></span>
            `;
            label.style.cssText = 'position: relative; display: inline-block; width: 60px; height: 34px;';

            const onLabel = document.createElement('span');
            onLabel.textContent = 'On';
            onLabel.style.cssText = 'margin-left: 10px; cursor: pointer;';
            makeTextEditable(onLabel);

            container.appendChild(offLabel);
            container.appendChild(label);
            container.appendChild(onLabel);

            return container;
        },
        bottomNav: () => {
            const bottomNav = document.createElement('nav');
            bottomNav.className = 'bottomNav max-items';
            bottomNav.innerHTML = `
                <div class="nav-item-container">
                    <button class="nav-delete-btn">×</button>
                    <a href="#" style="text-align: center; color: var(--primary-color); text-decoration: none; display: flex; flex-direction: column; align-items: center;">
                        <i class="fas fa-home" style="font-size: 20px; margin-bottom: 4px;"></i>
                        <span style="font-size: 12px;">Home</span>
                    </a>
                </div>
                <div class="nav-item-container">
                    <button class="nav-delete-btn">×</button>
                    <a href="#" style="text-align: center; color: var(--primary-color); text-decoration: none; display: flex; flex-direction: column; align-items: center;">
                        <i class="fas fa-search" style="font-size: 20px; margin-bottom: 4px;"></i>
                        <span style="font-size: 12px;">Search</span>
                    </a>
                </div>
                <div class="nav-item-container">
                    <button class="nav-delete-btn">×</button>
                    <a href="#" style="text-align: center; color: var(--primary-color); text-decoration: none; display: flex; flex-direction: column; align-items: center;">
                        <i class="fas fa-plus" style="font-size: 20px; margin-bottom: 4px;"></i>
                        <span style="font-size: 12px;">Add</span>
                    </a>
                </div>
                <button class="nav-add-btn"><i class="fas fa-plus"></i></button>
            `;
            bottomNav.style.cssText = 'display: flex; justify-content: space-around; align-items: center; width: 100%; height: 60px; background-color: #ecf0f1; position: fixed; bottom: 0; left: 0; right: 0; box-shadow: 0 -2px 4px rgba(0,0,0,0.1); z-index: 1000;';
            
            // Add event handlers for delete buttons
            bottomNav.querySelectorAll('.nav-delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (bottomNav.querySelectorAll('.nav-item-container').length > 1) {
                        this.closest('.nav-item-container').remove();
                        updateAddButtonVisibility(bottomNav);
                    }
                });
            });
            
            // Add event handler for add button
            const addButton = bottomNav.querySelector('.nav-add-btn');
            addButton.addEventListener('click', function() {
                if (bottomNav.querySelectorAll('.nav-item-container').length < 5) {
                    const newItem = document.createElement('div');
                    newItem.className = 'nav-item-container';
                    newItem.innerHTML = `
                        <button class="nav-delete-btn">×</button>
                        <a href="#" style="text-align: center; color: var(--primary-color); text-decoration: none; display: flex; flex-direction: column; align-items: center;">
                            <i class="fas fa-star" style="font-size: 20px; margin-bottom: 4px;"></i>
                            <span style="font-size: 12px;">New</span>
                        </a>
                    `;
                    
                    // Add delete handler to new item
                    newItem.querySelector('.nav-delete-btn').addEventListener('click', function() {
                        if (bottomNav.querySelectorAll('.nav-item-container').length > 1) {
                            this.closest('.nav-item-container').remove();
                            updateAddButtonVisibility(bottomNav);
                        }
                    });
                    
                    // Add icon click handler
                    newItem.querySelector('i').addEventListener('click', (e) => {
                        e.preventDefault();
                        showIconPicker(e.target);
                    });
                    
                    // Make label editable
                    makeTextEditable(newItem.querySelector('span'));
                    
                    bottomNav.insertBefore(newItem, addButton);
                    updateAddButtonVisibility(bottomNav);
                }
            });
            
            function updateAddButtonVisibility(nav) {
                const itemCount = nav.querySelectorAll('.nav-item-container').length;
                if (itemCount >= 5) {
                    nav.classList.add('max-items');
                } else {
                    nav.classList.remove('max-items');
                }
            }
            
            // Make labels editable
            bottomNav.querySelectorAll('span').forEach(span => makeTextEditable(span));
            
            // Add click handlers to icons
            bottomNav.querySelectorAll('.nav-item-container i').forEach(icon => {
                icon.style.cursor = 'pointer';
                icon.addEventListener('click', (e) => {
                    e.preventDefault();
                    showIconPicker(icon);
                });
            });
            
            return bottomNav;
        },
    };
// END OF COMPONENTS
// Add to sidebar data
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            
            // Update tab buttons
            document.querySelectorAll('.sidebar-tab').forEach(t => {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            
            document.querySelectorAll('.sidebar-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelector(`.sidebar-content[data-tab="${targetTab}"]`).classList.add('active');
        });
    });

// WRAP THE Components
    function wrapComponentInContainer(component, componentType) {
        if (componentType === 'modal') {
            return component; 
        }

        const componentContainer = document.createElement('div');
        componentContainer.className = 'component-container';
        
        const handle = document.createElement('div');
        handle.className = 'component-handle';
        handle.innerHTML = '⋮';
        
        const componentContent = document.createElement('div');
        componentContent.className = 'component-content';
        componentContent.appendChild(component);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = function() {
            componentContainer.remove();
        };

        // Add duplicate button
        const duplicateBtn = document.createElement('button');
        duplicateBtn.className = 'duplicate-btn';
        duplicateBtn.innerHTML = '+';
        duplicateBtn.onclick = function() {
            const duplicateComponent = htmlComponents[componentType]();
            const wrappedDuplicate = wrapComponentInContainer(duplicateComponent, componentType);
            componentContainer.parentNode.insertBefore(wrappedDuplicate, componentContainer.nextSibling);
        };
        
        componentContainer.appendChild(handle);
        componentContainer.appendChild(componentContent);
        componentContainer.appendChild(deleteBtn);
        componentContainer.appendChild(duplicateBtn);
        
        componentContent.querySelectorAll('*').forEach(el => {
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE && !el.classList.contains('non-editable')) {
                makeTextEditable(el);
            }
        });

        if (componentType === 'graph') {
            const controls = document.createElement('div');
            controls.className = 'graph-controls';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'graph-edit-btn';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.onclick = function(e) {
                e.stopPropagation();
                showGraphDataEditor(component);
            };
            
            controls.appendChild(editBtn);
            componentContainer.appendChild(controls);
        }
        
        return componentContainer;
    }

    function insertNavbar(navbar, position) {
        const canvases = Array.from(selectedCanvases);
        canvases.forEach((canvas) => {
            const canvasContent = canvas.querySelector('.canvas-content');

            if (position === 'top') {
                canvas.insertBefore(navbar.cloneNode(true), canvas.firstChild);
                canvasContent.style.paddingTop = '84px';
                navbar.style.position = 'absolute';
                navbar.style.left = '0';
                navbar.style.right = '0';
                navbar.style.top = '24px';
            } else if (position === 'bottom') {
                canvas.appendChild(navbar.cloneNode(true));
                navbar.style.position = 'absolute';
                navbar.style.left = '0';
                navbar.style.right = '0';
                navbar.style.bottom = '0';
            }
        });
    }

    function removeNavbar(position) {
        const canvases = Array.from(selectedCanvases);
        canvases.forEach((canvas) => {
            const canvasContent = canvas.querySelector('.canvas-content');

            if (position === 'top') {
                const topNavbar = canvas.querySelector('.navbar');
                if (topNavbar) {
                    topNavbar.remove();
                    canvasContent.style.paddingTop = '0';
                }
            } else if (position === 'bottom') {
                const bottomNavbar = canvas.querySelector('nav:not(.navbar)');
                if (bottomNavbar) {
                    bottomNavbar.remove();
                }
            }
        });
    }

    //// ADD NEW CANVAS
    function createNewCanvas() {
        canvasCount++;
        const canvasWrapper = document.createElement('div');
        canvasWrapper.className = 'canvas-wrapper';
        
        const canvasNumberContainer = document.createElement('div');
        canvasNumberContainer.className = 'canvas-number-container';
        
        const canvasNumber = document.createElement('div');
        canvasNumber.className = 'canvas-number';
        canvasNumber.textContent = `Canvas ${canvasCount}`;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-canvas-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = function(e) {
            e.stopPropagation();
            if (document.querySelectorAll('.canvas').length > 1) {
                const canvasIndex = Array.from(document.querySelectorAll('.canvas-wrapper')).indexOf(canvasWrapper);
                if (canvasIndex > 0) {
                    if (confirm('Are you sure you want to delete this canvas?')) {
                        const canvasToDelete = canvasWrapper;
                        const isSelected = canvasToDelete.querySelector('.canvas').classList.contains('selected');
                        
                        if (isSelected) {
                            const allCanvases = Array.from(document.querySelectorAll('.canvas'));
                            const currentIndex = allCanvases.indexOf(canvasToDelete.querySelector('.canvas'));
                            const newSelectedCanvas = allCanvases[currentIndex === 0 ? 1 : currentIndex - 1];
                            newSelectedCanvas.click();
                        }
                        
                        canvasToDelete.remove();
                        updateCanvasNumbers();
                    }
                } else {
                    alert('Cannot delete the first canvas');
                }
            } else {
                alert('Cannot delete the last canvas');
            }
        };
        
        canvasNumberContainer.appendChild(canvasNumber);
        canvasNumberContainer.appendChild(deleteBtn);
        
        const newCanvas = document.createElement('div');
        newCanvas.className = 'canvas';
        newCanvas.innerHTML = `
            <div class="status-bar">
                <span class="time">12:00</span>
                <div class="camera"></div>
                <div class="icons">
                    <i class="fa-solid fa-signal"></i>
                    <i class="fa-solid fa-wifi"></i>
                    <!-- <span>&emsp;85%</span> -->
                    <i class="fa-solid fa-battery-three-quarters"></i>
                </div>
                <div style="width: 100%; height: 28px; background-color: rgba(51, 51, 51, 0.48); z-index: -1; position: absolute; top: 0; left: 0;"></div>
            </div>
            <div class="phoneScrollCon">
                <div class="canvas-content"></div>
            </div>
        `;
        
        canvasWrapper.appendChild(canvasNumberContainer);
        canvasWrapper.appendChild(newCanvas);
        
        const addButton = document.querySelector('.add-canvas-btn');
        addButton.parentElement.insertBefore(canvasWrapper, addButton);
        
        newCanvas.addEventListener('click', selectCanvas);
        // Initialize Sortable on the new canvas content
            new Sortable(newCanvas.querySelector('.canvas-content'), {
            animation: 150,
            handle: '.component-handle',
            ghostClass: 'sortable-ghost'
        });
    }

    function updateCanvasNumbers() {
        document.querySelectorAll('.canvas-number').forEach((num, index) => {
            const canvas = num.closest('.canvas-wrapper').querySelector('.canvas');
            const isSelected = selectedCanvases.has(canvas);
            num.textContent = `Canvas ${index + 1}${isSelected ? ' (Selected)' : ''}`;
        });
    }

    function selectCanvas(e) {
        const clickedCanvas = e.currentTarget;
        if (e.shiftKey) {
            // Toggle selection
            if (selectedCanvases.has(clickedCanvas)) {
                if (selectedCanvases.size > 1) { // Don't allow deselecting if it's the only selected canvas
                    selectedCanvases.delete(clickedCanvas);
                    clickedCanvas.classList.remove('selected');
                }
            } else {
                selectedCanvases.add(clickedCanvas);
                clickedCanvas.classList.add('selected');
            }
        } else {
            // Single select - clear other selections
            selectedCanvases.forEach(canvas => {
                canvas.classList.remove('selected');
            });
            selectedCanvases.clear();
            selectedCanvases.add(clickedCanvas);
            clickedCanvas.classList.add('selected');
        }

        selectedCanvas = clickedCanvas; 
        
        updateCanvasNumbers();
    }

    document.querySelector('.add-canvas-btn').addEventListener('click', createNewCanvas);
    document.querySelector('.canvas').addEventListener('click', selectCanvas);


////// SWITCH LOGIC
    document.querySelectorAll('.component-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const componentType = btn.getAttribute('data-component');
            if (htmlComponents[componentType]) {
                if (componentType === 'button') {
                    const buttonType = document.getElementById('button-type').value;
                    const component = htmlComponents[componentType](buttonType);
                    const wrappedComponent = wrapComponentInContainer(component, componentType);
                    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                } else if (componentType === 'input') {
                    const inputType = document.getElementById('input-type').value;
                    const component = htmlComponents[componentType](inputType);
                    const wrappedComponent = wrapComponentInContainer(component, componentType);
                    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                } else if (componentType === 'textarea') {
                    const textareaType = document.getElementById('textarea-type').value;
                    const component = htmlComponents[componentType](textareaType);
                    const wrappedComponent = wrapComponentInContainer(component, componentType);
                    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                } else if (componentType === 'avatar') {
                    const avatarType = document.getElementById('avatar-type').value;
                    const component = htmlComponents[componentType](avatarType);
                    const wrappedComponent = wrapComponentInContainer(component, componentType);
                    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                } else if (componentType === 'navbar') {
                    if (!topNavbarAdded) {
                        const component = htmlComponents[componentType]();
                        insertNavbar(component, 'top');
                        topNavbarAdded = true;
                    } else {
                        removeNavbar('top');
                        topNavbarAdded = false;
                    }
                } else if (componentType === 'bottomNav') {
                    if (!bottomNavbarAdded) {
                        const component = htmlComponents[componentType]();
                        insertNavbar(component, 'bottom');
                        bottomNavbarAdded = true;
                        // Add click handlers to icons - modified selector
                        component.querySelectorAll('.nav-item-container i').forEach(icon => {
                            icon.style.cursor = 'pointer';
                            icon.addEventListener('click', (e) => {
                                e.preventDefault();
                                showIconPicker(icon);
                            });
                        });
                    } else {
                        removeNavbar('bottom');
                        bottomNavbarAdded = false;
                    }
                } else if (componentType === 'modal') {
                    if (!modalAdded) {
                        const component = htmlComponents[componentType]();
                        document.getElementById('canvas').appendChild(component);
                        modalAdded = true;
                    } else {
                        const existingModal = document.getElementById('canvas').querySelector('div[style*="background-color: rgba(0,0,0,0.6)"]');
                        if (existingModal) {
                            existingModal.remove();
                        }
                        modalAdded = false;
                    }
                } else if (componentType === 'alert') {
                    const colorSelect = document.getElementById('alert-color');
                    const selectedColor = colorSelect.value;
                    const component = htmlComponents.alert(selectedColor);
                    const wrappedComponent = wrapComponentInContainer(component, 'alert');
                    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                } else if (componentType === 'heading') {
                    const headingSelect = document.getElementById('heading-level');
                    const selectedLevel = headingSelect.value;
                    const component = htmlComponents.heading(selectedLevel);
                    const wrappedComponent = wrapComponentInContainer(component, 'heading');
                    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                }
                else if (componentType === 'image') {
                    const imageLayout = document.getElementById('image-layout').value;
                    const component = htmlComponents[componentType](imageLayout);
                    const wrappedComponent = wrapComponentInContainer(component, componentType);
                    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                } else if (componentType === 'tabs') {
                    const tabsCount = parseInt(document.getElementById('tabs-count').value);
                    const component = htmlComponents[componentType](tabsCount);
                    const wrappedComponent = wrapComponentInContainer(component, componentType);
                    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                } else if (componentType === 'chatInput') {
                    const chatInputType = document.getElementById('chat-input-type').value;
                    const component = htmlComponents.chatInput(chatInputType);
                    const wrappedComponent = wrapComponentInContainer(component, componentType);
                    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                } else if (componentType === 'graph') {
                    const graphType = document.getElementById('graph-type').value;
                    const component = htmlComponents[componentType](graphType);
                    const wrappedComponent = wrapComponentInContainer(component, componentType);
                    selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                } else {
                    const component = htmlComponents[componentType]();
                    const wrappedComponent = wrapComponentInContainer(component, componentType);
                    if (componentType === 'modal') {
                        document.getElementById('canvas').appendChild(wrappedComponent);
                    } else {
                        selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                    }
                }
            }
        });
    });

    // DRAG VERT HANDLE
    // Add initialization for the first canvas content as well
    document.addEventListener('DOMContentLoaded', function() {
        new Sortable(document.querySelector('.canvas-content'), {
            animation: 150,
            handle: '.component-handle',
            ghostClass: 'sortable-ghost'
        });
    });

    /// something about numbering the canvas??
    window.addEventListener('load', function() {
        const firstCanvasNumber = document.querySelector('.canvas-number');
        const container = document.createElement('div');
        container.className = 'canvas-number-container';
        
        firstCanvasNumber.parentNode.insertBefore(container, firstCanvasNumber);
        container.appendChild(firstCanvasNumber);
    });
