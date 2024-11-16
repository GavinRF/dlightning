// ux-mock-builder.js
//// COMPONENTS AND MAIN FUNCTIONALITY
class MobileUIEditor {
    modalAdded = false;
    fabAdded = false;

    constructor() {
        this.state = {
            canvasCount: 1,
            selectedCanvases: new Set(),
            navbarStates: new Map()
        };

        this.alignmentController = new AlignmentController('.canvas-content');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('Initializing editor...');
        this.initializeFirstCanvas();
        this.setupEventListeners();
        this.initializeCodeEditor();
        this.setupDownloadButton(); //html2canvas(pro)
        // this.loadSavedCanvases(); 
        this.updateTime();
        setInterval(this.updateTime, 60000);
        this.initOnboarding();
    }

    initializeFirstCanvas() {
        this.createNewCanvas();
        const firstCanvas = document.querySelector('.canvas');
        firstCanvas.classList = 'canvas selected';
        console.log('First canvas:', firstCanvas);
        if (firstCanvas) {
            this.state.selectedCanvases.add(firstCanvas);
            firstCanvas.addEventListener('click', (e) => this.handleCanvasSelection(e));
        }
        // Select elements for the code editor functionality
        this.codeEditorContainer = document.querySelector('.code-editor-container');
        this.codeEditorToggle = document.querySelector('.code-editor-toggle');
        this.codeEditor = document.querySelector('.code-editor');
        this.previewBtn = document.querySelector('.preview-btn');
        this.addBtn = document.querySelector('.add-btn');
        this.selectedCanvas = document.querySelector('.phoneScrollCon');
    }

    updateTime() {
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + 
                           now.getMinutes().toString().padStart(2, '0');
        document.querySelector('.time').textContent = timeString;
    }

    createCustomComponent(code) {
        var wrapper = document.createElement('div');
        wrapper.innerHTML = code.trim();
        return wrapper.firstChild || wrapper;
    }

    setupEventListeners() {
        // Component buttons
        document.querySelectorAll('.component-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleComponentAddition(btn);
            });
        });

        // Add canvas button
        const addCanvasBtn = document.querySelector('.add-canvas-btn');
        if (addCanvasBtn) {
            addCanvasBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.createNewCanvas();
            });
        }

        // Delete canvas buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-canvas-btn')) {
                this.handleCanvasDelete(e);
            }
        });

    }
    

// ADD COMPONENETS TO CANVAS //////////
handleComponentAddition(btn) {
    const componentType = btn.getAttribute('data-component');
    if (!componentType) {
        console.error('No component type specified');
        return;
    }

    // Get variation if available
    const getVariation = (type) => {
        const selector = `#${type}-type`;
        const select = document.querySelector(selector);
        return select ? select.value : null;
    };

    //const variation = getVariation(componentType);

    const canvases = this.state.selectedCanvases.size > 0 ?
        Array.from(this.state.selectedCanvases) :
        document.querySelectorAll('.canvas');

    // Check if special components already exist
    if (['navbar', 'bottomNav', 'modal', 'floatingActionButton'].includes(componentType)) {
        const hasComponent = Array.from(canvases).some(canvas => {
            return canvas.querySelector(
                componentType === 'navbar' ? '.navbar' :
                componentType === 'bottomNav' ? 'nav' :
                componentType === 'modal' ? '.modal':
                '.fab'
            );
        });

        if (hasComponent) {
            this.removeComponent(componentType, canvases);
            return;
        }
    }

    canvases.forEach((canvas) => {
        if (!canvas) {
            console.error('No canvas found');
            return;
        }

        let component, wrappedComponent, canvasContent; 

        console.log(`Processing component type: ${componentType}`);
        
        switch (componentType) {
            case 'navbar':
                component = this.components.navbar();
                this.insertNavbar(canvas, component, 'top');
                break;

            case 'bottomNav':
                component = this.components.bottomNav();
                this.insertNavbar(canvas, component, 'bottom');
                break;

            case 'modal':
                if (!this.modalAdded) {
                    component = this.components.modal();
                    canvas.appendChild(component);
                } else {
                    const existingModal = canvas.querySelector('.modal-wrapper');
                    if (existingModal) {
                        existingModal.remove();
                    }
                }
                break;

            case 'floatingActionButton':
                if (!this.fabAdded) {
                    component = this.components.floatingActionButton();
                    canvas.appendChild(component);
                    //this.insertNavbar(canvas, component, 'fab');
                } 
                break;


            case 'avatar':
                const avatarType = document.getElementById('avatar-type').value;
                component = this.components.avatar?.(avatarType);
                if (component) {
                    wrappedComponent = this.wrapComponentInContainer(component, `avatar-${avatarType}`);
                    canvasContent = canvas.querySelector('.canvas-content');
                    this.insertComponentWithFooterCheck(canvas, wrappedComponent);
                } else {
                    console.error(`Unsupported avatar type: ${avatarType}`);
                }
                break;

            case 'image':
                const layoutType = document.getElementById('image-type')?.value || 'single';
                component = this.components.image?.(layoutType);
                if (component) {
                    wrappedComponent = this.wrapComponentInContainer(component, `image-${layoutType}`);
                    canvasContent = canvas.querySelector('.canvas-content');
                    this.insertComponentWithFooterCheck(canvas, wrappedComponent);
                } else {
                    console.error(`Unsupported image layout type: ${layoutType}`);
                }
                break;
        
            case 'button':
                const buttonType = getVariation('button');
                component = this.components.button?.(buttonType);
                if (component) {
                    wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${buttonType}`);
                    this.insertComponentWithFooterCheck(canvas, wrappedComponent);
                }
                break;
        
            case 'heading':
                const headingLevel = getVariation('heading');
                component = this.components.heading?.(headingLevel);
                if (component) {
                    wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${headingLevel}`);
                    this.insertComponentWithFooterCheck(canvas, wrappedComponent);
                }
                break;
        
            case 'input':
                const inputType = getVariation('input');
                component = this.components.input?.(inputType);
                if (component) {
                    wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${inputType}`);
                    this.insertComponentWithFooterCheck(canvas, wrappedComponent);
                }
                break;

            case 'hero':
                component = this.components.hero();
                wrappedComponent = this.wrapComponentInContainer(component, 'hero');
                canvasContent = canvas.querySelector('.canvas-content');

                if (canvasContent) {
                    const firstChild = canvasContent.firstChild;
                    if (firstChild) {
                        canvasContent.insertBefore(wrappedComponent, firstChild);
                    } else {
                        canvasContent.appendChild(wrappedComponent);
                    }
                }
                break;

            case 'textarea':
                const textareaType = getVariation('textarea');
                component = this.components.textarea?.(textareaType);
                if (component) {
                    wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${textareaType}`);
                    this.insertComponentWithFooterCheck(canvas, wrappedComponent);
                }
                break;
        
            case 'tabs':
                const tabsCount = getVariation('tabs');
                component = this.components.tabs?.(parseInt(tabsCount, 10));
                if (component) {
                    wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${tabsCount}`);
                    this.insertComponentWithFooterCheck(canvas, wrappedComponent);
                }
                break;
        
            case 'alert':
                const alertColor = getVariation('alert');
                component = this.components.alert?.(alertColor);
                if (component) {
                    wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${alertColor}`);
                    this.insertComponentWithFooterCheck(canvas, wrappedComponent);
                }
                break;
            
            case 'graph':
                const graph = getVariation('graph');
                component = this.components.graph?.(graph);
                if (component) {
                    const wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${graph}`);
                    this.insertComponentWithFooterCheck(canvas, wrappedComponent);
                }
                break;

            case 'chatInput':
                const chatInput = getVariation('chatInput');
                component = this.components.chatInput?.(chatInput);
                if (component) {
                    wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${chatInput}`);
                    this.insertComponentWithFooterCheck(canvas, wrappedComponent);
                }
                break;

            default:
                    // Get variation for the component type, if any
                    const variation = getVariation(componentType);
                    component = this.components[componentType]?.(variation);
                    
                    if (!component) {
                        console.error(`Unsupported component type or variant: ${componentType} - ${variation}`);
                        return;
                    }
                    
                    wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${variation || ''}`);
                    canvasContent = canvas.querySelector('.canvas-content');
                
                    if (canvasContent) {
                        const footer = canvasContent.querySelector('footer')?.closest('.component-container');
                        
                        if (footer) {
                            canvasContent.insertBefore(wrappedComponent, footer);
                        } else {
                            canvasContent.appendChild(wrappedComponent);
                        }
                    }
                    break;
        }
        // scroll newly added component into view
        if (!['navbar', 'bottomNav', 'modal'].includes(componentType)) {
            const phoneScrollCon = canvas.querySelector('.phoneScrollCon');
            if (phoneScrollCon) {
                if (componentType === 'hero') {
                    phoneScrollCon.scrollTop = 0;
                } else {
                    phoneScrollCon.scrollTop = phoneScrollCon.scrollHeight;
                }
            }
        }

    });
}

insertComponentWithFooterCheck(canvas, component) {
    const canvasContent = canvas.querySelector('.canvas-content');
    if (canvasContent) {
        const footer = canvasContent.querySelector('footer')?.closest('.component-container');
        if (footer) {
            canvasContent.insertBefore(component, footer);
        } else {
            canvasContent.appendChild(component);
        }
    }
}

wrapComponentInContainer(component, componentType) {
    const container = document.createElement('div');
    container.className = 'component-container';
    container.innerHTML = `
        <div class="component-handle">⋮</div>
        <div class="component-content"></div>
        <button class="delete-btn">×</button>
        <button class="duplicate-btn"><i class="fa-solid fa-copy"></i></button>
    `;
    
    const content = container.querySelector('.component-content');
    
    // Handle both regular DOM elements and objects with setup functions
    if (component.container && typeof component.setup === 'function') {
        content.appendChild(component.container);
        component.setup();
    } else {
        content.appendChild(component);
    }
    
    // Store the component type data only if it includes a variant
    if (componentType && componentType.includes('-')) {
        container.setAttribute('data-component-variant', componentType);
    }
    
    container.querySelector('.delete-btn').addEventListener('click', () => container.remove());
    container.querySelector('.duplicate-btn').addEventListener('click', () => 
        this.duplicateComponent(container, componentType));
    
    return container;
}

duplicateComponent(container, componentType) {
    const originalComponent = container.querySelector('.component-content > *');
    
    // Check for stored variant data
    const storedVariant = container.getAttribute('data-component-variant');
    
    if (storedVariant) {
        // Handle components with variants
        const [baseType, variant] = storedVariant.split('-');
        if (this.components[baseType]) {
            const duplicate = variant 
                ? this.components[baseType](variant)
                : this.components[baseType](originalComponent);
            const wrappedDuplicate = this.wrapComponentInContainer(duplicate, storedVariant);
            
            // Copy any user modifications from the original component
            const duplicateContent = wrappedDuplicate.querySelector('.component-content > *');
            this.copyUserModifications(originalComponent, duplicateContent);
            
            container.parentNode.insertBefore(wrappedDuplicate, container.nextSibling);
        }
    } else {
        // Handle components without variants
        const [baseType] = componentType.split('-');
        if (this.components[baseType]) {
            const duplicate = this.components[baseType](originalComponent);
            const wrappedDuplicate = this.wrapComponentInContainer(duplicate, baseType);
            
            // Copy any user modifications from the original component
            const duplicateContent = wrappedDuplicate.querySelector('.component-content > *');
            this.copyUserModifications(originalComponent, duplicateContent);
            
            container.parentNode.insertBefore(wrappedDuplicate, container.nextSibling);
        }
    }
}

// Helper function to copy user modifications
copyUserModifications(original, duplicate) {
    // Copy text content if it's editable
    if (original.getAttribute('contentEditable') === 'true') {
        duplicate.textContent = original.textContent;
    }
    
    // Copy text content of all editable children
    const originalEditables = original.querySelectorAll('[contenteditable="true"]');
    const duplicateEditables = duplicate.querySelectorAll('[contenteditable="true"]');
    originalEditables.forEach((orig, index) => {
        if (duplicateEditables[index]) {
            duplicateEditables[index].textContent = orig.textContent;
        }
    });
    
    // Copy any custom states (like checkbox states)
    const originalChecks = original.querySelectorAll('.fa-square-check');
    const duplicateChecks = duplicate.querySelectorAll('.fa-square-check');
    originalChecks.forEach((orig, index) => {
        if (duplicateChecks[index]) {
            duplicateChecks[index].style.display = orig.style.display;
        }
    });
}

// CUSTOM CODE EDITOR ////////////////////
    // Method to create a custom component from provided HTML code
    initializeCodeEditor() {
        var self = this;

        // Toggle code editor visibility
        this.codeEditorToggle.addEventListener('click', function() {
            self.codeEditorContainer.classList.toggle('open');
        });

        this.previewBtn.addEventListener('click', function() {
            try {
                var code = self.codeEditor.value;
                var previewComponent = self.createCustomComponent(code);
                var wrappedComponent = self.wrapComponentInContainer(previewComponent, 'custom');
                self.selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
            } catch (error) {
                alert('Invalid HTML code. Please check your syntax.');
            }
        });

        this.addBtn.addEventListener('click', function() {
            try {
                var code = self.codeEditor.value;
                var customComponent = self.createCustomComponent(code);
                var wrappedComponent = self.wrapComponentInContainer(customComponent, 'custom');
                self.selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                self.codeEditor.value = ''; // Clear the editor
            } catch (error) {
                alert('Invalid HTML code. Please check your syntax.');
            }
        });
    }


/// Removing Special Items Navbar FAB Modal
    removeComponent(componentType, canvases) {
        canvases.forEach((canvas) => {
            const canvasContent = canvas.querySelector('.canvas-content');
            
            switch (componentType) {
                case 'navbar':
                    const topNavbar = canvas.querySelector('.navContain');
                    if (topNavbar) {
                        topNavbar.remove();
                        
                        let spacer = canvasContent.querySelector('.navbar-spacer');
                        
                        if (spacer) {
                            spacer.remove();
                        }
                        canvasContent.style.paddingTop = '32px';
                    }
                    break;
                    
                case 'bottomNav':
                    const bottomNavbar = canvas.querySelector('.bottomNavContain');
                    if (bottomNavbar) {
                        bottomNavbar.remove();
                    }
                    break;
                    
                case 'modal':
                    const modal = canvas.querySelector('.modal-wrapper');
                    if (modal) {
                        modal.remove();
                        this.modalAdded = false; 
                    }
                    break;

                case 'floatingActionButton':
                    const FAB = canvas.querySelector('.fab');
                    if (FAB) {
                        FAB.remove();
                        this.fabAdded = false; 
                    }
                    break;

            }
        });
    }

//////// ADD NEW CANVAS
createNewCanvas() {
    this.state.canvasCount++;
    const canvasWrapper = document.createElement('div');
    canvasWrapper.className = 'canvas-wrapper';
    const canvasId = `canvas-${this.state.canvasCount}`;

    // SAVE FUNCTIONALITY BTNS (leave for now)
    // <button class="save-canvas-btn">save</button>
    // <div class="canvas-timestamp"></div>
    
    canvasWrapper.innerHTML = `
        <div class="canvas-number-container">
            <div class="canvas-number">Canvas ${this.state.canvasCount}</div>
            <button class="delete-canvas-btn">×</button>
        </div>
        <div class="canvas" id="${canvasId}">
            <div class="status-bar">
                <span class="time">12:00</span>
                <div class="camera"></div>
                <div class="icons">
                    <i class="fa-solid fa-signal"></i>
                    <i class="fa-solid fa-wifi"></i>
                    <i style="font-size: 14px;" class="fa-solid fa-battery-full"></i>
                </div>
                <div style="width: 100%; height: 28px; background-color: rgba(51, 51, 51, 0.48); z-index: -1; position: absolute; top: 0; left: 0;"></div>
            </div>
            <div class="phoneScrollCon">
                <div class="canvas-content"></div>
            </div>
        </div>
    `;

   //uncomment this to add save functionality back in
    // const saveBtn = canvasWrapper.querySelector('.save-canvas-btn');
    // saveBtn.addEventListener('click', (e) => {
    //     e.stopPropagation(); 
    //     this.saveCanvas(canvasWrapper);
    // });

// Add Canvas Btn
    const addButton = document.querySelector('.add-canvas-btn');
    if (addButton && addButton.parentElement) {
        addButton.parentElement.insertBefore(canvasWrapper, addButton);
    } else {
        document.querySelector('.canvas-container').appendChild(canvasWrapper);
    }

    const newCanvas = canvasWrapper.querySelector('.canvas');
    newCanvas.addEventListener('click', (e) => this.handleCanvasSelection(e));

    const newContent = newCanvas.querySelector('.canvas-content');
    if (newContent) {
        new Sortable(newContent, {
            animation: 150,
            handle: '.component-handle',
            ghostClass: 'sortable-ghost',
            group: 'shared-components',
            filter: '.navbar-spacer',
            scroll: true,
            scrollSensitivity: 30,
            scrollSpeed: 10,
            // scroll: document.querySelector('.phoneScrollCon'),
            bubbleScroll: true,
            onMove: function(evt) {
                return !evt.related.classList.contains('navbar-spacer');
            }
        });
    }
    this.updateCanvasNumbers();
}

// Save Canvas (currently disabled) //////
saveCanvas(canvasWrapper) {
    // Fix 2: Remove the extra querySelector since we're passing the correct wrapper
    const canvasContent = canvasWrapper.querySelector('.canvas-content');
    const timestamp = canvasWrapper.querySelector('.canvas-timestamp');
    
    //Get canvas index more reliably
    const allCanvasWrappers = Array.from(document.querySelectorAll('.canvas-wrapper'));
    const canvasIndex = allCanvasWrappers.indexOf(canvasWrapper) + 1;

    const saveData = {
        content: canvasContent.innerHTML,
        timestamp: new Date().toLocaleString(),
        hasTopNav: this.topNavbarAdded, // Fix 4: Use this. to access class properties
        hasBottomNav: this.bottomNavbarAdded
    };

    localStorage.setItem(`canvas_${canvasIndex}`, JSON.stringify(saveData));
    timestamp.textContent = `Last saved: ${saveData.timestamp}`;
}

loadSavedCanvases() {
    const savedCanvasKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('canvas_'))
        .sort((a, b) => {
            //Sort keys numerically
            const indexA = parseInt(a.split('_')[1]);
            const indexB = parseInt(b.split('_')[1]);
            return indexA - indexB;
        });

    savedCanvasKeys.forEach(key => {
        const saveData = JSON.parse(localStorage.getItem(key));
        const canvasIndex = parseInt(key.split('_')[1]);
        
        if (isNaN(canvasIndex)) {
            console.warn('Invalid canvas index for key:', key);
            return;
        }

        // Create new canvases if needed
        while (document.querySelectorAll('.canvas-wrapper').length < canvasIndex) {
            this.createNewCanvas(); // Fix 6: Add this. to call class method
        }

        const canvasWrappers = document.querySelectorAll('.canvas-wrapper');
        const canvasWrapper = canvasWrappers[canvasIndex - 1];
        
        if (canvasWrapper) {
            const canvasContent = canvasWrapper.querySelector('.canvas-content');
            const timestamp = canvasWrapper.querySelector('.canvas-timestamp');

            if (canvasContent && saveData.content) {
                canvasContent.innerHTML = saveData.content;
                
                // Add event listeners to delete buttons for loaded components
                canvasContent.querySelectorAll('.delete-btn').forEach(deleteBtn => {
                    deleteBtn.onclick = function() {
                        this.closest('.component-container').remove();
                    };
                });
            }

            if (timestamp && saveData.timestamp) {
                timestamp.textContent = `Last saved: ${saveData.timestamp}`;
            }

            if (saveData.hasTopNav) {
                this.topNavbarAdded = true;
                const navbar = this.components['navbar']();
                this.insertNavbar(navbar, 'top');
            }

            if (saveData.hasBottomNav) {
                this.bottomNavbarAdded = true;
                const bottomNav = this.components['bottomNav']();
                this.insertNavbar(bottomNav, 'bottom');
            }

            if (canvasContent) {
                new Sortable(canvasContent, {
                    animation: 150,
                    handle: '.component-handle',
                    ghostClass: 'sortable-ghost',
                    group: 'shared-components',
                    filter: '.navbar-spacer',
                    scroll: true,
                    scrollSensitivity: 30,
                    scrollSpeed: 10,
                    // scroll: document.querySelector('.phoneScrollCon'),
                    bubbleScroll: true,
                    onMove: function(evt) {
                        return !evt.related.classList.contains('navbar-spacer');
                    }
                });
            }
        }
    });
}
//DELETE Canvas
handleCanvasDelete(e) {
    const wrapper = e.target.closest('.canvas-wrapper');
    if (!wrapper) return;

    const canvas = wrapper.querySelector('.canvas');    

    if (confirm('Are you sure you want to delete this canvas?')) {
        if (this.state.selectedCanvases.has(canvas)) {
            this.state.selectedCanvases.delete(canvas);
            // Select the previous canvas
            const prevCanvas = wrapper.previousElementSibling.querySelector('.canvas');
            if (prevCanvas) {
                this.handleSingleSelect(prevCanvas);
            }
        }
        wrapper.remove();
        this.updateCanvasNumbers();
    }
}

// Make TEXT EDITABLE ////////////////////
    makeTextEditable(element) {
        element.addEventListener('click', function() {
            if (element.querySelector('input')) return;
            
            const text = this.textContent;
            const input = document.createElement('input');
            input.value = text;
            input.style.width = '100%';
            input.style.boxSizing = 'border-box';
            input.style.font = window.getComputedStyle(this).font;
            // Store the original text in a data attribute
            element.dataset.originalText = text;
            // Only clear and append after input is ready
            this.textContent = '';
            this.appendChild(input);
            input.focus();
        
            input.addEventListener('blur', function() {
                const newText = this.value || element.dataset.originalText;
                // Remove the input first
                this.remove();
                // Then set the text content
                element.textContent = newText;
            });
        
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    this.blur();
                }
            });
        });
    }

//Add Navs
        insertNavbar(canvas, navbar, position) {
            const canvasContent = canvas.querySelector('.canvas-content');
            
            if (position === 'top') {
                canvas.insertBefore(navbar, canvas.firstChild);
                
                let spacer = canvasContent.querySelector('.navbar-spacer');
                if (!spacer) {
                    spacer = document.createElement('div');
                    spacer.className = 'navbar-spacer';
                    spacer.style.height = '54px';
                    spacer.style.width = '100%';
                    canvasContent.insertBefore(spacer, canvasContent.firstChild);
                }
                navbar.style.cssText = 'position: absolute; left: 0; right: 0; top: 24px;';
            } else if (position === 'bottom'){
                canvas.appendChild(navbar);
                navbar.style.cssText = 'position: absolute; left: 0; right: 0; bottom: 0;';
            } else {
                canvas.appendChild(navbar);
               // navbar.style.cssText = `this is useful if there is another navbar`;
            }
        }

// SELECT CANVAS
        handleCanvasSelection(e) {
            const clickedCanvas = e.currentTarget;
            
            if (e.shiftKey) {
                this.handleMultiSelect(clickedCanvas);
            } else {
                this.handleSingleSelect(clickedCanvas);
            }
            
            this.updateCanvasNumbers();
        }
    
        handleMultiSelect(canvas) {
            if (this.state.selectedCanvases.has(canvas)) {
                if (this.state.selectedCanvases.size > 1) {
                    this.state.selectedCanvases.delete(canvas);
                    canvas.classList.remove('selected');
                }
            } else {
                this.state.selectedCanvases.add(canvas);
                canvas.classList.add('selected');
            }
        }
    
        handleSingleSelect(canvas) {
            this.state.selectedCanvases.forEach(c => {
                c.classList.remove('selected');
            });
            this.state.selectedCanvases.clear();
            this.state.selectedCanvases.add(canvas);
            canvas.classList.add('selected');
        }
    
        updateCanvasNumbers() {
            document.querySelectorAll('.canvas-number').forEach((num, index) => {
                const canvas = num.closest('.canvas-wrapper').querySelector('.canvas');
                const isSelected = this.state.selectedCanvases.has(canvas);
                num.textContent = `Canvas ${index + 1}${isSelected ? ' (Selected)' : ''}`;
            });
        }

        
//REPLACE CANVAS ITEMS
// Function to replace range sliders with static versions for Screenshot
replaceRangeSliders(element) {
    const rangeSliders = element.querySelectorAll('.custom-range-slider');
    // console.log('Found range sliders:', rangeSliders.length);
    
    rangeSliders.forEach(slider => {
        // Create container to match the layout
        const staticSlider = document.createElement('div');
        staticSlider.style.cssText = `
            width: 100%;
            height: 8px;
            border-radius: 4px;
            background: var(--neutral-gray);
            position: relative;
            padding: 0 4px;
        `;

        // Create the filled part of the slider
        const fillTrack = document.createElement('div');
        const value = slider.value;
        const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;
        
        fillTrack.style.cssText = `
            position: absolute;
            left: 4px;
            top: 28%;
            height: 40%;
            width: ${percentage}%;
            background: var(--primary-color);
            border-radius: 4px;
        `;

        // Create the thumb
        const thumb = document.createElement('div');
        thumb.style.cssText = `
            position: absolute;
            left: calc(${percentage}% - 10px);
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: var(--primary-color);
        `;

        staticSlider.appendChild(fillTrack);
        staticSlider.appendChild(thumb);
        
        // Replace the original slider with our static version
        slider.parentNode.replaceChild(staticSlider, slider);
    });
}

// // DOWNLOAD MULTIPLE SELECTED SCREENS
// Create/update the button download button state
updateButtonState(isLoading) {
    const button = document.getElementById('download-btn');
    if (!button) return;
  
    if (isLoading) {
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Generating...`;
      button.disabled = true;
      button.classList.add('loading');
    } else {
      button.innerHTML = `<i class="fas fa-download"></i> Download PNG`;
      button.disabled = false;
      button.classList.remove('loading');
    }
  }

  async captureScreenshot() {
    this.updateButtonState(true);
    const originalScale = scale;
    setZoomScale(1);
    
    try {
      // Process canvases in parallel instead of sequentially
      const canvasPromises = Array.from(this.state.selectedCanvases).map(async (canvas, index) => {
        const scrollContainer = canvas.querySelector('.phoneScrollCon');
        if (!scrollContainer) {
          console.error('Phone scroll container not found');
          return;
        }
  
        const currentScrollTop = scrollContainer.scrollTop;
        const currentScrollLeft = scrollContainer.scrollLeft;
        
        const clone = canvas.cloneNode(true);
        const padding = 6;
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
          position: absolute;
          top: -9999px;
          left: -9999px;
          width: ${canvas.clientWidth + (padding * 2)}px;
          height: ${canvas.clientHeight + (padding * 2)}px;
          overflow: hidden;
          padding: ${padding}px;
        `;
        
        tempContainer.appendChild(clone);
        fragment.appendChild(tempContainer);
        document.body.appendChild(fragment);
  
        const clonedScrollContainer = clone.querySelector('.phoneScrollCon');
        if (clonedScrollContainer) {
          clonedScrollContainer.scrollTop = 0;
          clonedScrollContainer.scrollLeft = 0;
          
          const content = clonedScrollContainer.firstElementChild;
          if (content) {
            // Use transform instead of scroll for better performance
            content.style.transform = `translate(${-currentScrollLeft}px, ${-currentScrollTop}px)`;
          }
        }
  
        // Batch style updates
        Object.assign(clone.style, {
          height: `${canvas.clientHeight}px`,
          width: `${canvas.clientWidth}px`,
          overflow: 'hidden',
          margin: '0'
        });
  
        this.replaceRangeSliders(clone);
        
        // Use requestAnimationFrame for smoother rendering
        await new Promise(resolve => requestAnimationFrame(resolve));
  
        const renderedCanvas = await html2canvas(clone, {
          backgroundColor: null,
          logging: false, // Disable logging for performance
          useCORS: true,
          scale: window.devicePixelRatio, // Keep your existing scale setting
          width: canvas.clientWidth + (padding * 2),
          height: canvas.clientHeight + (padding * 2),
          scrollX: -padding,
          scrollY: -padding,
          windowWidth: canvas.clientWidth + (padding * 2),
          windowHeight: canvas.clientHeight + (padding * 2),
          imageTimeout: 60000,
          onclone: (clonedDoc) => {
            return new Promise(resolve => {
              requestAnimationFrame(() => {
                const clonedElement = clonedDoc.querySelector(clone.tagName);
                if (clonedElement) {
                  const phoneScroll = clonedElement.querySelector('.phoneScrollCon');
                  if (phoneScroll) {
                    phoneScroll.scrollTop = 0;
                    phoneScroll.scrollLeft = 0;
                    const content = phoneScroll.firstElementChild;
                    if (content) {
                      content.style.transform = `translate(${-currentScrollLeft}px, ${-currentScrollTop}px)`;
                    }
                  }
                }
                resolve();
              });
            });
          }
        });
  
        document.body.removeChild(tempContainer);
  
        if (renderedCanvas.width === 0 || renderedCanvas.height === 0) {
          console.error('Rendered canvas has zero dimensions');
          return;
        }
  
        const link = document.createElement('a');
        const filename = this.state.selectedCanvases.size > 1
          ? `Dlightning-mockup-${index + 1}.png`
          : 'Dlightning-mockup.png';
        link.download = filename;
        link.href = renderedCanvas.toDataURL('image/png', 1.0);
        link.click();
      });

        // Wait for all canvases to process
        await Promise.all(canvasPromises);
        
        } catch (error) {
        console.error('Screenshot error:', error);
        } finally {
        setZoomScale(originalScale);
        this.updateButtonState(false);
        }
    }

  setupDownloadButton() {
    document.getElementById('download-btn').addEventListener('click', () => this.captureScreenshot());
    }

// INIT ONBOARDING
initOnboarding() {
    // if onboarding is complete don't show again
    // if (localStorage.getItem('onboardingComplete')) {
    //     return;
    // }

    const overlay = document.createElement('div');
    overlay.className = 'onboarding-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'onboarding-modal';
    
    const steps = [
        {
            title: 'Welcome to the Mobile Screen Builder!',
            content: 'Create beautiful wireframes in minutes',
            highlight: null
        },
        {
            title: 'Add Components',
            content: 'Buttons in the menu-bar add components to the screen. <br><br>',
            highlight: '.component-btn'
        },
        {
            title: 'Versions',
            content: 'Some components have alternat versions, select one before adding it to the mock screen.',
            highlight: '#image-type'
        },
        {
            title: 'Basic Elements VS Components',
            content: 'Switch between common interface elements and more complex\&nbsp;components.',
            highlight: '.sidebar-tabs'
        },
        {
            title: 'View Content Full-Height',
            content: 'Toggle the mock screen height to show all of your components.',
            highlight: '#toggleCanvasBtn'
        },
        {
            title: 'Add A New Screen',
            content: 'Create multiple screens using the + button. <br> (Hold Shift to select multiple screens at once)',
            highlight: '.add-canvas-btn'
        },
        {
            title: 'Export Screens',
            content: 'When you\'re ready to share your work, export an image. <br><br>',
            highlight: '#download-btn'
        },
        {
            title: 'Choose A Starting Template',
            content: ' ',
            highlight: null,
            isTemplateStep: true
        }
    ];

    let currentStep = localStorage.getItem('onboardingComplete') ? steps.length - 1 : 0;

    function renderStep(step) {

        if (steps[step].isTemplateStep) {
            modal.innerHTML = `
                <h2 style="color: #2c3e50; margin-top: 0;">${steps[step].title}</h2>
                <p style="color: #475152; font-size: 16px;">${steps[step].content}</p>
                <div class="templates" style="display: flex; gap: 16px; margin: 20px 0;">
                    <button onclick="selectTemplate('template1')">
                        <h3 style="margin-top: 0;">Profile Template</h3>
                        <hr>
                        <p style="color: var(--basic-txt-color)">Image, Avatar, Pills, and Paragraph <br><br></p>
                    </button>
                    <button onclick="selectTemplate('template2')">
                        <h3 style="margin-top: 0;">Content Template</h3>
                        <hr>
                        <p style="color: var(--basic-txt-color)">Hero, Heading, Accordion, and Footer</p>
                    </button>
                    <button onclick="selectTemplate('template3')">
                        <h3 style="margin-top: 0;">Form Template</h3>
                        <hr>
                        <p style="color: var(--basic-txt-color)">Heading, Form Elements, Submit Button</p>
                    </button>
                    <button onclick="selectTemplate('blank')">
                        <h3 style="margin-top: 0;">Blank Canvas</h3>
                        <br><br><br><br><br><br><br>
                    </button>
                </div>
                <div class="onboarding-nav" >
                    <button onclick="prevStep()" style="padding: 10px 14px; background: #ecf0f1; border: none; border-radius: 5px; cursor: pointer; margin-right: 45px;"><i class="fas fa-arrow-left"></i></button>
                     <button onclick="${step === steps.length - 1 ? 'completeOnboarding()' : 'nextStep()'}" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            ${step === steps.length - 1 ? 'Skip' : 'Next'}
                        </button>
                </div>
            `;
        } else {
            modal.innerHTML = `
                <div style="display: flex; gap: 24px;">
                    <div>
                    <h2 style="color: #2c3e50; margin-top: 0;">${steps[step].title}</h2>
                    <p style="color: #7f8c8d; font-size: 16px;">${steps[step].content}</p>
                    </div>
                    ${step > 0 ? '' : ` 
                    <div>
                        <img width="150px" src='img/products/BHandH.png'>
                    </div>` }
                </div>
                <div class="onboarding-nav">
                    ${step > 0 ? `
                        <button onclick="prevStep()" style="padding: 10px 14px; background: #ecf0f1; border: none; border-radius: 5px; cursor: pointer;"><i class="fas fa-arrow-left"></i></button>
                    ` : '<button onclick="prevStep()" style="padding: 10px 14px; background: var(--neutral-gray); border: none; opacity: 0.46; border-radius: 5px; cursor: not-allowed;" disabled><i class="fas fa-arrow-left"></i></button>'}
                    <div style="display: flex; align-items: center;">
                        ${steps.map((_, i) => `
                            <div class="onboarding-dot ${i === step ? 'active' : ''}" onclick="goToStep(${i})"></div>
                        `).join('')}
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="completeOnboarding()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            Skip Tutorial
                        </button>
                        <button onclick="${step === steps.length - 1 ? 'completeOnboarding()' : 'nextStep()'}" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                            ${step === steps.length - 1 ? 'Get Started' : 'Next'}
                        </button>
                    </div>
                </div>
            `;
        }

        // Remove previous highlights
        document.querySelectorAll('.highlight-element').forEach(el => el.remove());

        // Add highlight if specified
        if (steps[step].highlight) {
            const element = document.querySelector(steps[step].highlight);
            if (element) {
                // Scroll to the element to ensure it is visible in the viewport
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                setTimeout(() => {
                    const rect = element.getBoundingClientRect();
                    const highlight = document.createElement('div');
                    highlight.className = 'highlight-element';
                    highlight.style.cssText = `
                        position: fixed;
                        top: ${rect.top - 6}px;
                        left: ${rect.left - 6}px;
                        width: ${rect.width + 8}px;
                        height: ${rect.height + 8}px;
                        border: 2px solid #3498db;
                        border-radius: 4px;
                        pointer-events: none;
                        z-index: 10000;
                        animation: pulse .8s 2;
                    `;
                    document.body.appendChild(highlight);
                }, 500); // Adjust the delay if needed
            }
        }}

    window.nextStep = function() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            renderStep(currentStep);
        }
    };

    window.prevStep = function() {
        if (currentStep > 0) {
            currentStep--;
            renderStep(currentStep);
        }
    };

    window.goToStep = function(step) {
        currentStep = step;
        renderStep(currentStep);
    };

    window.completeOnboarding = function() {
        localStorage.setItem('onboardingComplete', 'true');
        overlay.remove();
        document.querySelectorAll('.highlight-element').forEach(el => el.remove());
    };

    const instructionalText = 'This is a paragraph, click to edit it directly. For quick deletion, triple-click to highlight all.'; 
    const newInstruction = 'Hover over any element to reveal options for customization. Use the ⋮ handle on the left to drag elements into a new order or to another screen. The red \'x\' on the right deletes components, and the icon at the bottom duplicates them. Each element has unique features to explore!';


    window.selectTemplate = (template) => {
        const canvasContent = document.querySelector('.canvas-content');
        
        // Clear existing content
        canvasContent.innerHTML = '';
        
        if (template === 'template1') {
            [
                { component: this.components.adjustableSpace(), type: 'adjustableSpace' },
                { component: this.components.image(), type: 'image' },
                { component: this.components.avatar(), type: 'avatar' },
                { component: this.components.chipGroup(), type: 'chipGroup' },
                { component: this.components.paragraph(null, instructionalText), type: 'paragraph' },
                { component: this.components.paragraph(null, newInstruction), type: 'paragraph' },
            ].forEach(({ component, type }) => {
                canvasContent.appendChild(this.wrapComponentInContainer(component, type));
            });
        } else if (template === 'template2') {
            [
                // { component: this.components.navbar(), type: 'navbar' },
                { component: this.components.hero(), type: 'hero' },
                { component: this.components.heading('h2'), type: 'heading' },
                { component: this.components.paragraph(null, instructionalText), type: 'paragraph' },
                { component: this.components.paragraph(null, newInstruction), type: 'paragraph' },
                { component: this.components.icon(), type: 'icon' },
                { component: this.components.accordion(), type: 'accordion' },
                { component: this.components.adjustableSpace(), type: 'adjustableSpace' },
                { component: this.components.footer(), type: 'footer' }
            ].forEach(({ component, type }) => {
                canvasContent.appendChild(this.wrapComponentInContainer(component, type));
            });
        } else if (template === 'template3') {
            [
                { component: this.components.heading('h1'), type: 'heading' },
                { component: this.components.paragraph(null, instructionalText), type: 'paragraph' },
                { component: this.components.label(), type: 'label' },
                { component: this.components.input(), type: 'input' },
                { component: this.components.label(), type: 'label' },
                { component: this.components.textarea(), type: 'textarea' },
                { component: this.components.label(), type: 'label' },
                { component: this.components.dropdown(), type: 'dropdown' },
                { component: this.components.label(), type: 'label' },
                { component: this.components.checkbox(), type: 'checkbox' },
                { component: this.components.checkbox(), type: 'checkbox' },
                { component: this.components.checkbox(), type: 'checkbox' },
                { component: this.components.adjustableSpace(), type: 'adjustableSpace' },
                { component: this.components.button(), type: 'button' },

                // { component: this.components.paragraph(null, newInstruction), type: 'paragraph' },
            ].forEach(({ component, type }) => {
                canvasContent.appendChild(this.wrapComponentInContainer(component, type));
            });
        }
        
        // Complete onboarding
        localStorage.setItem('onboardingComplete', 'true');
        document.querySelector('.onboarding-overlay').remove();
        // incase sidebar is scrolled down
        const sideBar = document.querySelector('.sidebar');
        if (sideBar) {
            sideBar.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
    };

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Show overlay with animation
    setTimeout(() => {
        overlay.classList.add('visible');
        renderStep(currentStep);
    }, 100);
}

// ********
/////////////////////////
// Component Definitions ////////////////////////////
/////////////////////////
// ********
    components = {
// // HERO
hero: () => {
    const hero = document.createElement('div');
    hero.style.cssText = 'width: 100%; position: relative; margin-top: -10px; margin-bottom: 8px; padding: 40px 10px 2px 10px;';

    // Background image div with upload functionality
    const bgImageDiv = document.createElement('div');
    bgImageDiv.style.cssText = 'width: 100%; padding: 0 10px; position: absolute; top: -1; left: 0; right: 0; bottom: 0; background-size: cover; background-position: center; margin-left: -10px;';

    // Gradient overlay
    const gradientOverlay = document.createElement('div');
    gradientOverlay.style.cssText = 'position: absolute; width: 100%; padding: 0 10px; top: 0; left: 0; right: 0; bottom: -1; background: linear-gradient(transparent 28%, var(--primary-color) 78%, var(--primary-color) 92%); opacity: 0.94; margin-left: -10px;';

    // Main content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.style.cssText = 'position: relative; padding: 64px 10px 10px 10px; text-align: center; width: 100%; color: white; margin-left: -10px;';

    // Add Image button, hidden by default and shown on hover
    const addImageButton = document.createElement('button');
    addImageButton.textContent = 'Add Image';
    addImageButton.style.cssText = `
        position: absolute; top: 40px; left: 50%; transform: translateX(-50%);
        padding: 5px 10px; font-size: 14px; background-color: #333; color: white; 
        border: none; cursor: pointer; display: none; z-index: 9991;
    `;
    hero.appendChild(addImageButton);

    // Editable h1 element
    const h1Wrapper = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.contentEditable = 'true';
    h1.textContent = 'Welcome';
    h1.style.cssText = 'margin: 0; font-size: 28px; margin-bottom: 10px; color: white !important;';
    h1Wrapper.appendChild(h1);

    // Editable p element
    const pWrapper = document.createElement('div');
    const p = document.createElement('p');
    p.contentEditable = 'true';
    p.textContent = 'This is a hero section with a beautiful gradient background';
    p.style.cssText = 'margin: 0; font-size: 16px;';
    pWrapper.appendChild(p);

    // Append elements to content wrapper
    contentWrapper.appendChild(h1Wrapper);
    contentWrapper.appendChild(pWrapper);

    // Append all parts to the hero container
    hero.appendChild(bgImageDiv);
    hero.appendChild(gradientOverlay);
    hero.appendChild(contentWrapper);

    // Show Add Image button on hover
    hero.addEventListener('mouseenter', () => {
        addImageButton.style.display = 'block';
    });
    hero.addEventListener('mouseleave', () => {
        addImageButton.style.display = 'none';
    });

    // Image upload event for Add Image button
    addImageButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    bgImageDiv.style.backgroundImage = `url(${event.target.result})`;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });

    return hero;
},
// // BUTTON
        button: (type = 'default') => {
            const container = document.createElement('div');
            container.style.cssText = 'width: 100%; display: flex; justify-content: space-between; gap: 14px;';
            const createButton = (text, isGhost = false, isDisabled = false, isWithicon) => {
                const button = document.createElement('div');
                button.textContent = text;
                button.style.cssText = `
                    height: 48px;
                    background-color: ${isGhost ? 'transparent' : 'var(--primary-color)'};
                    color: ${isGhost ? 'var(--primary-color)' : 'var(--text-on-primary)'};
                    border: ${isGhost ? '2px solid var(--primary-color)' : 'none'};
                    border-radius: 24px;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s;
                    flex: 1;
                    align-content: center;
                    text-align: center;
                    margin: 0 4px;
                    border-bottom:${isGhost ? '2px solid var(--primary-color)' : '3px solid rgba(0,0,0,.12)'};
                `;
                if (isDisabled) {
                    button.style.opacity = '0.5';
                    // button.style.cursor = 'not-allowed';
                }
                button.setAttribute('role', 'button');
                button.setAttribute('contentEditable','true');
                // button.setAttribute('data-button-type', type);
                
                const icon = document.createElement('div');
                icon.style.cssText = 'display: inline; margin-right 16px;';
                icon.textContent = '';
                const iconElement = document.createElement('i');
                iconElement.className = 'fas fa-hand-point-right';
                iconElement.style.cssText = 'font-size: 20px; color: var(--text-on-primary); cursor: pointer;';
                icon.appendChild(iconElement);
                
                iconElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    showIconPicker(iconElement);
                });
                if (isWithicon){button.prepend(icon);}

                return button;
            };

            switch (type) {
                case 'withIcon':
                    container.appendChild(createButton('Button', false, false, true));
                    break;
                case 'ghost':
                    container.appendChild(createButton('Ghost Button', true));
                    break;
                case 'twobuttons':
                    container.appendChild(createButton('Button 1'));
                    container.appendChild(createButton('Button 2'));
                    break;
                case 'disabled':
                    container.appendChild(createButton('Disabled Button', false, true));
                    break;
                default:
                    container.appendChild(createButton('Button'));
            }
            return container;
        },
// INPUT ////////////////////
input: (type = 'default') => {
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%;';
  
    // Create base input div
    const inputDiv = document.createElement('div');
    inputDiv.setAttribute('contentEditable', 'true');
    inputDiv.setAttribute('spellcheck', 'false');
    
    // Set placeholder
    const placeholder = type === 'search' ? 'Search...' : 'Input Field';
    inputDiv.setAttribute('data-placeholder', placeholder);
    
    // Base styles for all input types
    inputDiv.style.cssText = `
      width: 100%;
      height: 42px;
      border: ${type === 'focused' ? '2px solid var(--neutral-gray)' : 'none'};
      border-bottom: 2px solid var(--primary-color);
      border-radius: ${type === 'search' ? '24px' : '0'};
      padding: ${type === 'search' ? '0 40px' : '0 8px'};
      font-size: 16px;
      transition: border-color 0.3s, background-color 0.3s;
      line-height: 40px;
      box-sizing: border-box;
      white-space: nowrap;
      overflow: hidden;
      background-color: ${type === 'error' ? 'rgba(255, 0, 0, 0.02)' : 'var(--input-bg-color)'};
    `;
  
    // Placeholder behavior
    inputDiv.addEventListener('input', function() {
      if (this.textContent.trim() === '') {
        this.classList.add('empty');
      } else {
        this.classList.remove('empty');
      }
    });
  
    // Placeholder styles
    const style = document.createElement('style');
    style.textContent = `
      [contenteditable=true].empty:before {
        content: attr(data-placeholder);
        color: #999;
        cursor: text;
      }
    `;
    document.head.appendChild(style);
    inputDiv.classList.add('empty');
  
    container.appendChild(inputDiv);
  
    if (type === 'search') {
      const searchContainer = document.createElement('div');
      searchContainer.style.cssText = 'position: relative; width: 100%;';
      const searchIcon = document.createElement('i');
      searchIcon.className = 'fas fa-search';
      searchIcon.style.cssText = `
        position: absolute;
        left: 15px;
        top: 46%;
        transform: translateY(-50%);
        color: var(--basic-txt-color);
        pointer-events: none;
      `;
      searchContainer.appendChild(searchIcon);
      searchContainer.appendChild(inputDiv);
      return searchContainer;
    }
  
    switch (type) {
      case 'focused':
        // Use an additional border element for focus state
        const focusBorder = document.createElement('div');
        focusBorder.style.cssText = `
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--primary-color);
        `;
        container.style.position = 'relative';
        container.appendChild(focusBorder);
        break;
  
      case 'password':
        inputDiv.style.borderColor = 'var(--secondary-color)';
        // Add password masking behavior
        let realValue = '';
        inputDiv.addEventListener('input', (e) => {
          const selection = window.getSelection();
          const range = selection.getRangeAt(0);
          const currentPos = range.startOffset;
          
          // Get the actual input value
          realValue = e.target.textContent;
          
          // Replace with bullet points
          const maskedValue = '•'.repeat(realValue.length);
          e.target.textContent = maskedValue;
          
          // Restore cursor position
          range.setStart(e.target.firstChild || e.target, currentPos);
          range.setEnd(e.target.firstChild || e.target, currentPos);
          selection.removeAllRanges();
          selection.addRange(range);
        });
        break;
  
      case 'error':
        inputDiv.style.borderColor = 'var(--error-danger-delete)';
        inputDiv.style.color = 'var(--error-danger-delete)';
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
          color: #e74c3c;
          font-size: 12px;
          margin-top: 4px;
          padding-right: 2px;
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        `;
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-triangle';
        icon.style.marginRight = '4px';
        errorMsg.appendChild(icon);
        errorMsg.appendChild(document.createTextNode('Please enter a valid value'));
        errorMsg.setAttribute('contentEditable', 'true');
        container.appendChild(errorMsg);
        break;
  
      case 'disabled':
        // Style as disabled but keep editable
        inputDiv.style.backgroundColor = 'var(--neutral-gray)';
        inputDiv.style.color = '#999';
        inputDiv.style.cursor = 'not-allowed';
        break;
    }
  
    // Prevent line breaks
    inputDiv.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    });
  
    // Handle paste to remove formatting
    inputDiv.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.originalEvent || e).clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    });
  
    return container;
  },
// TEXT AREA ////////////////////
textarea: (type = 'default') => {
    const container = document.createElement('div');
    container.style.cssText = 'width: 100%; position: relative;';
  
    // Create textarea div
    const textareaDiv = document.createElement('div');
    textareaDiv.setAttribute('contentEditable', 'true');
    textareaDiv.setAttribute('spellcheck', 'false');
    textareaDiv.setAttribute('data-placeholder', 'Enter your text here...');
    
    // Base styles for textarea
    textareaDiv.style.cssText = `
      width: 100%;
      min-height: 80px;
      border: ${type === 'focused' ? '2px solid var(--neutral-gray)' : 'none'};
      border-bottom: 2px solid var(--primary-color);
      border-radius: 0;
      padding: 10px;
      font-size: 16px;
      font-family: var(--primary-font), sans-serif;
      transition: border-color 0.3s, background-color 0.3s;
      box-sizing: border-box;
      overflow-y: auto;
      word-wrap: break-word;
      background-color: ${type === 'error' ? 'rgba(255, 0, 0, 0.02)' : 'var(--input-bg-color)'};
    `;
  
    // Create resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.style.cssText = `
      position: absolute;
      right: 2;
      bottom: 2;
      bottom: ${type === 'error' ? '22' : '2'};
      width: 26px;
      height: 26px;
      cursor: ns-resize;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      pointer-events: all;
      padding: 2px;
    `;
  
    // Create resize icon
    const resizeIcon = document.createElement('div');
    resizeIcon.style.cssText = `
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 0 10px 10px;
      border-color: transparent transparent #888 transparent;
    `;
    resizeHandle.appendChild(resizeIcon);
  
    // Add placeholder behavior
    const style = document.createElement('style');
    style.textContent = `
      [contenteditable=true].empty:before {
        content: attr(data-placeholder);
        color: #999;
        cursor: text;
      }
    `;
    document.head.appendChild(style);
    textareaDiv.classList.add('empty');
  
    // Resize functionality
    let startY, startHeight;
    
    resizeHandle.addEventListener('mousedown', (e) => {
      startY = e.clientY;
      startHeight = parseInt(window.getComputedStyle(textareaDiv).height);
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
      e.preventDefault(); // Prevent text selection while resizing
    });
  
    function resize(e) {
      const newHeight = startHeight + (e.clientY - startY);
      if (newHeight >= 80) { // Maintain minimum height
        textareaDiv.style.height = `${newHeight}px`;
      }
    }
  
    function stopResize() {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    }
  
    // Handle placeholder visibility
    textareaDiv.addEventListener('input', function() {
      if (this.textContent.trim() === '') {
        this.classList.add('empty');
      } else {
        this.classList.remove('empty');
      }
    });
  
    // Handle paste to remove formatting
    textareaDiv.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = (e.originalEvent || e).clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    });
  
    container.appendChild(textareaDiv);
    container.appendChild(resizeHandle);
  
    switch (type) {
      case 'focused':
        // Use additional border element for focus state
        const focusBorder = document.createElement('div');
        focusBorder.style.cssText = `
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--primary-color);
        `;
        container.appendChild(focusBorder);
        break;
  
      case 'error':
        textareaDiv.style.borderColor = 'var(--error-danger-delete)';
        textareaDiv.style.color = 'var(--error-danger-delete)';
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
          color: #e74c3c;
          font-size: 12px;
          margin-top: 4px;
          padding-right: 2px;
          text-align: right;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        `;
        const icon = document.createElement('i');
        icon.className = 'fas fa-exclamation-triangle';
        icon.style.marginRight = '4px';
        errorMsg.appendChild(icon);
        errorMsg.appendChild(document.createTextNode('Please enter a valid value'));
        errorMsg.setAttribute('contentEditable', 'true');
        container.appendChild(errorMsg);
        break;
  
      case 'disabled':
        // Style as disabled but keep editable
        textareaDiv.style.backgroundColor = 'var(--neutral-gray)';
        textareaDiv.style.color = '#999';
        textareaDiv.style.cursor = 'not-allowed';
        resizeHandle.style.display = 'none'; // Hide resize handle in disabled state
        break;
    }
  
    return container;
  },
// CHECKBOX ////////////////////
checkbox: () => {
    // Wrapper for the checkbox component
    const wrapper = document.createElement('div');
    wrapper.style.cssText = `
        display: flex; align-items: center;
        font-size: 16px; color: var(--basic-txt-color); width: 100%;
        justify-content: flex-start;
        margin: 4px 0 0 0;
    `;

    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'fa-regular fa-square';
    checkboxDiv.style.cssText = `
        margin: -2px 10px 0 10px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        font-size: 26px;
        color: #a0a0a0;
    `;

    // Checkmark icon
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fa-solid fa-square-check';
    checkIcon.style.cssText = `
        font-size: 26px;
        color: var(--primary-color);
        display: none; 
        position: absolute;
        top: 0px;
        left: 0px;
        border: none;
    `;
    checkboxDiv.appendChild(checkIcon);

    checkboxDiv.addEventListener('click', () => {
        const isChecked = checkIcon.style.display === 'none';
        checkIcon.style.display = isChecked ? 'block' : 'none';
    });

    // Editable label text for the checkbox
    const chekLabl = document.createElement('span');
    chekLabl.textContent = "click to edit";
    chekLabl.style.cssText = 'font-size: 16px; color: var(--basic-txt-color)';
    this.makeTextEditable(chekLabl);

    // Append checkbox and label to the wrapper
    wrapper.appendChild(checkboxDiv);
    wrapper.appendChild(chekLabl);

    return wrapper;
},
// Radio ////////////////////
radio: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; align-items: center; width: 100%; margin: 4px 0 0 0;';

    const label = document.createElement('label');
    label.style.cssText = 'display: flex; align-items: center; font-size: 16px; color: #333; justify-content: flex-start;';
    
    // Simulate radio button with a styled div
    const radioDiv = document.createElement('div');
    radioDiv.style.cssText = `
        width: 20px; height: 20px; 
        margin: 0 10px;
        border: 2px solid #a0a0a0;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
    `;
    radioDiv.classList.add('custom-radio');
    
    // Inner dot for selected radio state
    const radioDot = document.createElement('span');
    radioDot.style.cssText = `
        width: 12px; height: 12px;
        background-color: var(--primary-color);
        border-radius: 50%;
        display: none;
    `;
    radioDiv.appendChild(radioDot);

    // Toggle dot visibility on click and allow deselecting
    radioDiv.addEventListener('click', () => {
        const radios = document.querySelectorAll('.custom-radio');
        radios.forEach(dot => {
            dot.querySelector('span').style.display = 'none';
            dot.style.borderColor = '#e0e0e0';
        });
        radioDot.style.display = 'block';
        radioDiv.style.borderColor = 'var(--primary-color)';
    });

    const radLabl = document.createElement('span');
    radLabl.textContent = "click to edit";
    this.makeTextEditable(radLabl);

    wrapper.appendChild(label);
    label.appendChild(radioDiv);
    wrapper.appendChild(radLabl);

    return wrapper;
},
// DROPDOWN ////////////////////
dropdown: () => {
    const container = document.createElement('div');
    container.className = 'custom-dropdown-container';
    
    const header = document.createElement('div');
    header.className = 'dropdown-header';
    
    // Create selected text display
    const selectedText = document.createElement('div');
    selectedText.className = 'selected-text';
    selectedText.textContent = 'Dropdown';

    const chevron = document.createElement('i');
    chevron.className = 'fas fa-chevron-down';
    
    // Create options container (hidden by default)
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    // Add initial options
    const createOption = (optionText) => {
      const optionWrapper = document.createElement('div');
      optionWrapper.className = 'option-wrapper';
      
      const option = document.createElement('div');
      option.className = 'option';
      option.setAttribute('contenteditable', 'true');
      option.textContent = optionText;
      
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.innerHTML = '<i class="fas fa-times"></i>';
      
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        optionWrapper.remove();
      });
      
      optionWrapper.appendChild(option);
      optionWrapper.appendChild(deleteButton);
      return optionWrapper;
    };
    
    // Add Button at bottom of options
    const addOptionWrapper = document.createElement('div');
    addOptionWrapper.className = 'add-option-wrapper';
    
    const addButton = document.createElement('button');
    addButton.className = 'add-button';
    addButton.innerHTML = '<i class="fas fa-plus"></i> Add Option';
    
    addOptionWrapper.appendChild(addButton);
    
    // Add initial options
    ['Option 1', 'Option 2'].forEach(optionText => {
      optionsContainer.appendChild(createOption(optionText));
    });
    
    // Append elements
    header.appendChild(selectedText);
    header.appendChild(chevron);
    container.appendChild(header);
    container.appendChild(optionsContainer);
    optionsContainer.appendChild(addOptionWrapper);
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      .custom-dropdown-container {
        position: relative;
        width: 100%;
        font-size: 16px;
        color: var(--basic-txt-color);
      }
      
      .dropdown-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 42px;
        padding: 0 12px;
        background-color: var(--input-bg-color);
        border-bottom: 2px solid var(--primary-color);
        cursor: pointer;
      }
      
      .selected-text {
        flex-grow: 1;
      }
      
      .options-container {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--background-color);
        border: 1px solid var(--neutral-gray);
        border-top: none;
        max-height: 300px;
        overflow-y: auto;
        z-index: 900;
        opacity: 0.9;
      }
      
      .options-container.active {
        display: block;
      }
      
      .option-wrapper {
        display: flex;
        align-items: center;
        padding: 8px 12px;
        position: relative;
      }
      
      .option-wrapper:hover {
        background-color: var(--primary-color);
      }
      
      .option {
        flex-grow: 1;
        padding: 4px;
        min-height: 20px;
      }
      
      .option:focus {
        outline: none;
        background-color: #fff;
        box-shadow: 0 0 0 2px var(--primary-color);
        border-radius: 4px;
      }
      
      .delete-button {
        display: none;
        background: none;
        border: none;
        color: #ff4444;
        cursor: pointer;
        padding: 4px 8px;
        margin-left: 8px;
      }
      
      .option-wrapper:hover .delete-button {
        display: block;
      }
      
      .add-option-wrapper {
        padding: 8px 12px;
        border-top: 1px solid #ddd;
        display: none; /* Hide by default */
        }

        .options-container:hover .add-option-wrapper {
        display: block; /* Show on hover over options container */
        }
      
      .add-button {
        width: 100%;
        padding: 8px;
        background: none;
        border: 0.12rem dashed #ddd;
        color: #666;
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      
      .add-button:hover {
        border-color: var(--primary-color);
        color: var(--primary-color);
      }
      
      .add-button i {
        font-size: 12px;
      }
    `;
    document.head.appendChild(styles);
    
    // Add event listeners
    header.addEventListener('click', () => {
      optionsContainer.classList.toggle('active');
      chevron.classList.toggle('fa-chevron-up');
      chevron.classList.toggle('fa-chevron-down');
    });
    
    addButton.addEventListener('click', () => {
      const newOption = createOption('New Option');
      optionsContainer.insertBefore(newOption, addOptionWrapper);
      newOption.querySelector('.option').focus();
    });
    
    optionsContainer.addEventListener('click', (e) => {
      const option = e.target.closest('.option');
      if (option) {
        selectedText.textContent = option.textContent;
      }
    });
    
    return container;
  },
  icon(originalComponent) {
    let iconContainer;
    
    if (originalComponent) {
        // Clone the existing component
        iconContainer = originalComponent.cloneNode(true);
    } else {
        // Create a new icon container
        iconContainer = document.createElement('div');
        iconContainer.style.cssText = 'width: 100%; text-align: center; padding: 10px; position: relative;';

        // Add the icon element only when creating a new component
        const iconElement = document.createElement('i');
        iconElement.className = 'fa-solid fa-bolt-lightning';
        iconElement.style.cssText = 'font-size: 24px; color: var(--primary-color); cursor: pointer;';
        iconContainer.appendChild(iconElement);
    }

    // Common elements and event listeners for both new and cloned instances

    const iconElement = iconContainer.querySelector('i') || iconContainer.firstChild;

    const sizeControl = document.createElement('input');
    sizeControl.type = 'number';
    sizeControl.min = '12';
    sizeControl.max = '96';
    sizeControl.value = '24';
    sizeControl.style.cssText = `
        position: absolute;
        top: -16px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        padding: 3px 0;
        border: 1px solid #ddd;
        border-radius: 2px;
        display: none;
        font-size: 12px;
        text-align: center;
        z-index: 2445;
    `;
    iconContainer.appendChild(sizeControl);

    const leftArrow = document.createElement('i');
    leftArrow.className = 'fas fa-arrow-left';
    leftArrow.style.cssText = `
        position: absolute;
        left: 62px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: var(--secondary-color);
        display: none;
        font-size: 16px;
    `;
    iconContainer.appendChild(leftArrow);

    const rightArrow = document.createElement('i');
    rightArrow.className = 'fas fa-arrow-right';
    rightArrow.style.cssText = `
        position: absolute;
        right: 62px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        color: var(--secondary-color);
        display: none;
        font-size: 16px;
    `;
    iconContainer.appendChild(rightArrow);

    // Add event listeners
    leftArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        if (iconContainer.style.textAlign === 'center' || !iconContainer.style.textAlign) {
            iconContainer.style.textAlign = 'left';
            leftArrow.style.display = 'none';
            rightArrow.style.display = 'block';
        } else if (iconContainer.style.textAlign === 'right') {
            iconContainer.style.textAlign = 'center';
            leftArrow.style.display = 'block';
            rightArrow.style.display = 'block';
        }
    });

    rightArrow.addEventListener('click', (e) => {
        e.stopPropagation();
        if (iconContainer.style.textAlign === 'center' || !iconContainer.style.textAlign) {
            iconContainer.style.textAlign = 'right';
            rightArrow.style.display = 'none';
            leftArrow.style.display = 'block';
        } else if (iconContainer.style.textAlign === 'left') {
            iconContainer.style.textAlign = 'center';
            leftArrow.style.display = 'block';
            rightArrow.style.display = 'block';
        }
    });

    iconContainer.addEventListener('mouseenter', () => {
        sizeControl.style.display = 'block';
        if (iconContainer.style.textAlign === 'center' || !iconContainer.style.textAlign) {
            leftArrow.style.display = 'block';
            rightArrow.style.display = 'block';
        } else if (iconContainer.style.textAlign === 'left') {
            rightArrow.style.display = 'block';
        } else if (iconContainer.style.textAlign === 'right') {
            leftArrow.style.display = 'block';
        }
    });

    iconContainer.addEventListener('mouseleave', () => {
        sizeControl.style.display = 'none';
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
    });

    sizeControl.addEventListener('input', (e) => {
        iconElement.style.fontSize = `${e.target.value}px`;
    });

    iconElement.addEventListener('click', (e) => {
        e.preventDefault();
        showIconPicker(iconElement);
    });

    return iconContainer;
},
// CARD card:////////////////////
card(originalComponent) {
    let card;
    if (originalComponent) {
      card = originalComponent.cloneNode(true);
    } else {
      card = document.createElement('div');
      card.innerHTML = `
        <div class="card-image" style="width: 100%; height: 120px; background-color: var(--neutral-gray); border-radius: 10px 10px 0 0; display: flex; justify-content: center; align-items: center; cursor: pointer;">
          <span class="non-editable">Click to add image</span>
        </div>
        <div style="padding: 8px; border: 0.12rem solid var(--neutral-gray); border-radius: 0 0 10px 10px;">
          <div>
            <h3 style="margin: 8px 0; font-size: 18px; color: #2c3e50;">Card Title</h3>
          </div>
          <div>
            <p style="margin: 0 0 8px 0; color: #7f8c8d;">Card content goes here. This is a brief description.</p>
          </div>
        </div>
      `;
      card.style.cssText = 'width: 100%; border-radius: 10px; padding: 0; background-color: ${isDark ? "#1e1e1e" : "#ecf0f1"}; border-bottom: 3px solid rgba(0,0,0,.12); overflow: hidden;';
      card.querySelector('h3').setAttribute('contentEditable', 'true');
      card.querySelector('p').setAttribute('contentEditable', 'true');
    }

    const imageContainer = card.querySelector('.card-image');
    imageContainer.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            imageContainer.style.backgroundImage = `url(${event.target.result})`;
            imageContainer.style.backgroundSize = 'cover';
            imageContainer.style.backgroundPosition = 'center';
            imageContainer.innerHTML = '';
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    });

    return card;
  },
// ADJUSTABLE SPACE ////////////////////
adjustableSpace: (originalComponent) => {
    let spaceContainer;
    let heightSlider;
    let heightDisplay;

    if (originalComponent) {
        spaceContainer = originalComponent.cloneNode(true);
        heightSlider = spaceContainer.querySelector('.space-range');
        heightDisplay = spaceContainer.querySelector('.height-display');
    } else {
        spaceContainer = document.createElement('div');
        spaceContainer.className = 'blankSpace';
        spaceContainer.style.height = '50px'; // Initial height

        // Create a display to show the current height
        heightDisplay = document.createElement('input');
        heightDisplay.type = 'number';
        heightDisplay.className = 'height-display';
        heightDisplay.value = '50';
        heightDisplay.style.fontSize = '16px';
        spaceContainer.appendChild(heightDisplay);

        // Create the slider input for height adjustment
        heightSlider = document.createElement('input');
        heightSlider.className = 'space-range';
        heightSlider.type = 'range';
        heightSlider.min = '12'; 
        heightSlider.max = '300'; 
        heightSlider.value = '50';
        heightSlider.style.width = '100%';
        spaceContainer.appendChild(heightSlider);
    }

    heightSlider.addEventListener('input', () => {
        const newHeight = heightSlider.value;
        spaceContainer.style.height = `${newHeight}px`;
        heightDisplay.value = `${newHeight}`; // Update the display text
    });

    heightDisplay.addEventListener('change', () => {
        const newHeight2 = heightDisplay.value;
        console.log(newHeight2);
        spaceContainer.style.height = `${newHeight2}px`; 
        heightSlider.value = `${newHeight2}`; 
    });

    //return spaceContainer;
    return {
        container: spaceContainer,
        setup: () => {
            const compContainer = spaceContainer.closest('.component-container');
            if (compContainer) {
                compContainer.addEventListener('mouseenter', () => {
                    spaceContainer.style.outline = '1px dashed #808080';
                });

                compContainer.addEventListener('mouseleave', () => {
                    spaceContainer.style.outline = 'none';
                });
            }
        }
    };
},
// IMAGE //////////////////////
    image: (layout = 'single') => {
            const container = document.createElement('div');
            container.style.cssText = `
                width: 100%; 
                display: flex; 
                gap: 8px; 
                ${layout === 'triple' ? 'overflow: visible;' : 'overflow-x: auto;'}
            `;

            const createImageBox = () => {
                const box = document.createElement('div');
                box.style.cssText = `
                    ${layout === 'single' ? 'width: 100%;' : layout === 'triple' ? 'min-width: calc(42% - 4px);' : 'min-width: calc(50% - 4px);'}
                    ${layout === 'triple' ? 'height: 140px;' : 'height: 200px;'}
                    background-color: var(--neutral-gray); 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    cursor: pointer; 
                    border-radius: 10px; 
                    overflow: hidden;
                    position: relative;
                `;
                box.innerHTML = '<span class="non-editable">Click to add image</span>';

                const addCaptionBtn = document.createElement('button');
                addCaptionBtn.appendChild(document.createTextNode('Add Caption'));
                addCaptionBtn.style.cssText = `
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    padding: 5px 10px;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    z-index: 10;
                    pointer-events: initial;
                `;

                box.addEventListener('mouseover', () => {
                    if (box.style.backgroundImage) {
                        addCaptionBtn.style.opacity = '1';
                    }
                });

                box.addEventListener('mouseout', () => {
                    addCaptionBtn.style.opacity = '0';
                });

                addCaptionBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    if (box.parentElement.tagName !== 'FIGURE') {
                        const figure = document.createElement('figure');
                        figure.style.cssText = 'margin: 0; width: 100%;';
                        
                        box.parentElement.insertBefore(figure, box);
                        figure.appendChild(box);
                        
                        const figcaption = document.createElement('figcaption');
                        figcaption.textContent = 'Image caption';
                        figcaption.style.cssText = 'text-align: right; color: #666; margin-top: 4px; font-style: italic; font-size: 12px; padding-right: 4px;';
                        this.makeTextEditable(figcaption);
                        figure.appendChild(figcaption);
                        
                        addCaptionBtn.remove();
                    }
                });

                box.appendChild(addCaptionBtn);

                box.addEventListener('click', () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                box.style.backgroundImage = `url(${event.target.result})`;
                                box.style.backgroundSize = 'cover';
                                box.style.backgroundPosition = 'center';
                                box.innerHTML = '';
                                box.appendChild(addCaptionBtn);
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                    input.click();
                });

                return box;
            };

            switch(layout) {
                case 'double':
                    container.appendChild(createImageBox());
                    container.appendChild(createImageBox());
                    break;
                case 'triple':
                    container.appendChild(createImageBox());
                    container.appendChild(createImageBox());
                    container.appendChild(createImageBox());
                    break;
                default: // single
                    container.appendChild(createImageBox());
            }

            return container;
        },
//TOP NAVBAR ////////////////////
        navbar: () => {
            const topNavbarContainer = document.createElement('div');
            topNavbarContainer.className = 'navContain';
            topNavbarContainer.style.cssText = 'position: relative;'
            
            // Create the shadow div
            const shadowDiv = document.createElement('div');
            shadowDiv.style.cssText = 'background-color: rgba(0,0,0,0.12); width: 100%; height: 59px; position: absolute; top:0; left: 0; z-index: 1';

            const navbar = document.createElement('div');
            navbar.className = 'navbar top-navbar';

            const icon = document.createElement('div');
            icon.style.cssText = 'flex-shrink: 0;';
            
            const iconElement = document.createElement('i');
            iconElement.className = 'fas fa-bars';
            iconElement.style.cssText = 'font-size: 20px; color: var(--primary-color); cursor: pointer;';
            icon.appendChild(iconElement);
            
            iconElement.addEventListener('click', (e) => {
                e.preventDefault();
                showIconPicker(iconElement);
            });
           
            navbar.innerHTML = `
                <span style="font-size: 20px; font-weight: bold; color: --primary;">Brand</span>
                <div style="display: flex; align-items: center;">
                    <a style="margin-left: 20px; color: var(--basic-txt-color); text-decoration: none;">Home</a>
                    <a style="margin-left: 20px; color: var(--basic-txt-color); text-decoration: none;">About</a>
                    <a style="margin-left: 20px; color: var(--basic-txt-color); text-decoration: none;">Contact</a>
                </div>
            `;

            navbar.appendChild(icon);
            
            navbar.querySelectorAll('span, a').forEach(el => this.makeTextEditable(el));
            topNavbarContainer.appendChild(navbar);
            topNavbarContainer.appendChild(shadowDiv);
  
            return topNavbarContainer;
        },
// // Modal
        modal: () => {
            const modalWrapper = document.createElement('div');
            modalWrapper.className = 'modal-wrapper';
            modalWrapper.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 991; height: 100%';
            
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <h2 style="margin-top: 0; color: #2c3e50;">Modal Title</h2>
                <p style="color: #7f8c8d;">This is the modal content. You can add any information here.</p>
                <div style="text-align: right;">
                    <button id="modal-ok-btn" style="padding: 10px 20px; background-color: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">OK</button>
                </div>
            `;
            
            modal.querySelectorAll('h2, p').forEach(el => this.makeTextEditable(el));
            
            modalWrapper.appendChild(modal);

            modal.querySelector('#modal-ok-btn').addEventListener('click', () => {
                modalWrapper.remove();
                this.modalAdded = false;
            });

            return modalWrapper;
        },
// // Toggle Switch
        toggleSwitch: () => {
            const container = document.createElement('div');
            container.style.cssText = 'display: flex; align-items: center; min-width: 120px; width: 100%; padding: 0 10px;';
        
            const offLabel = document.createElement('span');
            offLabel.textContent = 'Off';
            offLabel.style.cssText = 'margin-right: 10px; cursor: pointer;';
            this.makeTextEditable(offLabel);
        
            // Create switch container
            const switchContainer = document.createElement('div');
            switchContainer.style.cssText = 'position: relative; display: inline-block; min-width: 60px; height: 34px;';
        
            // Create slider directly (no checkbox needed)
            const slider = document.createElement('div');
            slider.className = 'slider round';
            slider.style.cssText = `
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: var(--neutral-gray);
                transition: .4s;
                border-radius: 34px;
            `;
        
            // Create thumb
            const thumb = document.createElement('div');
            thumb.style.cssText = `
                position: absolute;
                content: "";
                height: 26px;
                width: 26px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            `;
            
            const onLabel = document.createElement('span');
            onLabel.textContent = 'On';
            onLabel.style.cssText = 'margin-left: 10px; cursor: pointer;';
            this.makeTextEditable(onLabel);
        
            // Add click handler for toggle functionality
            let isChecked = false;
            const toggleSwitch = () => {
                isChecked = !isChecked;
                if (isChecked) {
                    slider.style.backgroundColor = 'var(--primary-color)';
                    thumb.style.left = '30px';
                } else {
                    slider.style.backgroundColor = 'var(--neutral-gray)';
                    thumb.style.left = '4px';
                }
            };
        
            slider.appendChild(thumb);
            switchContainer.appendChild(slider);
            
            // Add click handlers
            switchContainer.addEventListener('click', toggleSwitch);
            offLabel.addEventListener('click', () => {
                isChecked = true;
                toggleSwitch();
            });
            onLabel.addEventListener('click', () => {
                isChecked = false;
                toggleSwitch();
            });
        
            container.appendChild(offLabel);
            container.appendChild(switchContainer);
            container.appendChild(onLabel);
        
            return container;
        },
// // PROGRESS BAR
        progressBar: () => {
            const container = document.createElement('div');
            container.style.cssText = 'width: 100%; text-align: center;';

            const progress = document.createElement('div');
            progress.style.cssText = 'width: 100%; height: 10px; background-color: #e0e0e0; border-radius: 5px; overflow: hidden;';
            progress.className = 'progress-bar';

            const bar = document.createElement('div');
            bar.style.cssText = 'width: 76%; height: 100%; background-color: var(--primary-color); transition: width 0.3s ease;';

            const percentage = document.createElement('div');
            percentage.textContent = '76%';
            percentage.style.cssText = 'margin-top: 5px; font-weight: bold; color: var(--basic-txt-color);';

            progress.appendChild(bar);
            container.appendChild(progress);
            container.appendChild(percentage);

            return container;
        },
// Avatar avatar:
        avatar(originalComponent, type = 'default') {
            const avatarContainer = document.createElement('div');
                avatarContainer.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%; 
                    position: relative; 
                    padding: 10px; 
                    box-sizing: border-box;
                    text-align: center;
                    justify-content: center;
                `;

            const leftArrow = document.createElement('i');
            leftArrow.className = 'fas fa-arrow-left';
            leftArrow.style.cssText = `
                position: absolute;
                left: 40px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: var(--secondary-color);
                display: none;
                font-size: 16px;
            `;

            const rightArrow = document.createElement('i');
            rightArrow.className = 'fas fa-arrow-right';
            rightArrow.style.cssText = `
                position: absolute;
                right: 40px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: var(--secondary-color);
                display: none;
                font-size: 16px;
            `;

            avatarContainer.addEventListener('mouseenter', () => {
                if (avatarContainer.style.justifyContent === 'center' || !avatarContainer.style.justifyContent) {
                    leftArrow.style.display = 'block';
                    rightArrow.style.display = 'block';
                } else if (avatarContainer.style.justifyContent === 'flex-start') {
                    // When at the left, only show right arrow
                    leftArrow.style.display = 'none';
                    rightArrow.style.display = 'block';
                } else if (avatarContainer.style.justifyContent === 'flex-end') {
                    // When at the right, only show left arrow
                    leftArrow.style.display = 'block';
                    rightArrow.style.display = 'none';
                }
            });
            
            avatarContainer.addEventListener('mouseleave', () => {
                leftArrow.style.display = 'none';
                rightArrow.style.display = 'none';
            });

            leftArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                if (avatarContainer.style.justifyContent === 'center') {
                    avatarContainer.style.justifyContent = 'flex-start';
                    leftArrow.style.display = 'none';
                    rightArrow.style.display = 'block';
                } else if (avatarContainer.style.justifyContent === 'flex-end') {
                    avatarContainer.style.justifyContent = 'center';
                    leftArrow.style.display = 'block';
                    rightArrow.style.display = 'block';
                }
            });

            rightArrow.addEventListener('click', (e) => {
                e.stopPropagation();
                if (avatarContainer.style.justifyContent === 'center') {
                    avatarContainer.style.justifyContent = 'flex-end';
                    rightArrow.style.display = 'none';
                    leftArrow.style.display = 'block';
                } else if (avatarContainer.style.justifyContent === 'flex-start') {
                    avatarContainer.style.justifyContent = 'center';
                    leftArrow.style.display = 'block';
                    rightArrow.style.display = 'block';
                }
            });

            avatarContainer.appendChild(leftArrow);
            avatarContainer.appendChild(rightArrow);

            if (typeof originalComponent === 'string') {
                type = originalComponent;
            }
            
            switch(type) {
                case 'smalltext':
                    const smallAvatar = document.createElement('div');
                    smallAvatar.innerHTML = 'A';
                    smallAvatar.style.cssText = 'width: 32px; height: 32px; background-color: var(--primary-color); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 14px;';
                    makeTextEditable(smallAvatar);
                    
                    const username = document.createElement('span');
                    username.textContent = 'Displayname';
                    username.style.cssText = 'color: ${isDark ? "#ecf0f1" : "#333"}; font-weight: 500;';
                    makeTextEditable(username);
                    
                    avatarContainer.appendChild(smallAvatar);
                    avatarContainer.appendChild(username);
                    // this.makeTextEditable(smallAvatar);
                    break;

                case 'upload':
                    const imageAvatar = document.createElement('div');
                    imageAvatar.style.cssText = 'width: 50px; height: 50px; background-color: var(--neutral-gray); border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; overflow: hidden; position: relative;';
                    imageAvatar.innerHTML = '<i class="fas fa-camera"></i>';
                    
                    const uploadInput = document.createElement('input');
                    uploadInput.type = 'file';
                    uploadInput.accept = 'image/*';
                    uploadInput.style.cssText = 'position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer;';
                    
                    const uploadUsername = document.createElement('span');
                    uploadUsername.textContent = 'Displayname';
                    uploadUsername.style.cssText = 'color: ${isDark ? "#ecf0f1" : "#333"}; font-weight: 500; margin-left: 10px;';
                    makeTextEditable(uploadUsername);
                    
                    imageAvatar.appendChild(uploadInput);
                    avatarContainer.appendChild(imageAvatar);
                    avatarContainer.appendChild(uploadUsername);
                    
                    uploadInput.addEventListener('change', (e) => {
                        if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                                imageAvatar.innerHTML = '';
                                imageAvatar.style.backgroundImage = `url(${event.target.result})`;
                                imageAvatar.style.backgroundSize = 'cover';
                                imageAvatar.style.backgroundPosition = 'center';
                            };
                            reader.readAsDataURL(e.target.files[0]);
                        }
                    });
                    break;

                default:
                    const defaultAvatar = document.createElement('div');
                    defaultAvatar.innerHTML = 'AV';
                    defaultAvatar.style.cssText = 'width: 50px; height: 50px; background-color: var(--primary-color); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold;';
                    avatarContainer.appendChild(defaultAvatar);
                    makeTextEditable(defaultAvatar);
            }
            function makeTextEditable(element) {
                element.contentEditable = 'true';
                element.spellcheck = false;
                element.style.cursor = 'text';
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        element.blur();
                    }
                });
            }

            return avatarContainer;
        },
// // tabs TABS
    tabs: (count = 3) => {
        const tabs = document.createElement('div');
        tabs.style.cssText = 'display: flex; width: 100%;';

        const selectTab = (selectedTab) => {
            Array.from(tabs.children).forEach(tab => {
                tab.style.backgroundColor = 'var(--neutral-gray)';
                tab.style.color = 'black';
            });
            selectedTab.style.backgroundColor = 'var(--primary-color)';
            selectedTab.style.color = 'white';
        };

        for (let i = 1; i <= count; i++) {
            const tab = document.createElement('button');
            tab.textContent = `Tab ${i}`;
            tab.style.cssText = `
                background-color: ${i === 1 ? 'var(--primary-color)' : 'var(--neutral-gray)'};
                color: ${i === 1 ? 'white' : 'black'};
                border: none;
                margin-right: 1px;
                padding: 10px 20px;
                cursor: pointer;
                flex: 1;
            `;
            //needs this version of texteditable
            this.makeTextEditable(tab);

            // Event listener for selecting the tab
            tab.addEventListener('click', (e) => {
                if (e.target !== document.activeElement) {
                    selectTab(tab);
                }
            });

            tabs.appendChild(tab);
        }

        return tabs;
    },
// accordion
        accordion: () => {
            const accordion = document.createElement('div');
            accordion.style.cssText = 'width: 100%; border-radius: 8px; overflow: hidden; border: .12rem solid var(--primary-color)';
            
            accordion.innerHTML = `
                <button class="accordion-header" style="
                    background-color: var(--primary-color);
                    color: white;
                    cursor: pointer;
                    padding: 12px;
                    width: 100%;
                    border: none;
                    text-align: left;
                    outline: none;
                    transition: 0.4s;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 500;
                    font-size: 16px;">
                    <span contenteditable>Section Title</span>
                    <i class="fas fa-chevron-down" style="transition: transform 0.3s ease;"></i>
                </button>
                <div class="accordion-content" style="
                    padding: 0 18px;
                    height: 0;
                    overflow: hidden;
                    transition: height 0.3s ease-out;
                    background-color: var(--neutral-gray);">
                    <div style="padding: 18px 0;">
                        <p contenteditable style="margin: 0; color: #666;">Content for section</p>
                    </div>
                </div>
            `;

            const button = accordion.querySelector('.accordion-header');
            const content = accordion.querySelector('.accordion-content');
            const chevron = accordion.querySelector('.fa-chevron-down');

            new Sortable(content, {
                animation: 150,
                handle: '.component-handle',
                ghostClass: 'sortable-ghost',
                group: 'shared-components',
                filter: '.navbar-spacer',
                scroll: true,
                scrollSensitivity: 30,
                scrollSpeed: 10,
                // scroll: document.querySelector('.phoneScrollCon'),
                bubbleScroll: true,
                onMove: function(evt) {
                    return !evt.related.classList.contains('navbar-spacer');
                }
            });
            
            button.addEventListener('click', () => {
                const isExpanded = content.style.height !== '0px' && content.style.height !== '';
                
                if (!isExpanded) {
                    content.style.height = content.scrollHeight + 'px';
                    chevron.style.transform = 'rotate(180deg)';
                } else {
                    content.style.height = '0';
                    chevron.style.transform = 'rotate(0)';
                }
            });

            return accordion;
        },
// Alert + colors
        alert: (color = 'danger') => {
            const alertColors = {
                info: '#3498db',
                success: '#27ae60',
                warning: '#f39c12',
                danger: 'var(--error-danger-delete)',
                dark: '#34495e'
            };
            const alert = document.createElement('div');
            const aText = document.createElement('span');
            aText.textContent = 'This is an alert message!';
            //alert.textContent = 'This is an alert message!';
            alert.appendChild(aText);
            aText.setAttribute('contentEditable','true');
            aText.style.cssText = `padding-right: 12px;`;
            //this.makeTextEditable(aText);
            const closeIcon = document.createElement('i');
            closeIcon.className = 'fas fa-close';
            alert.appendChild(closeIcon);
            alert.style.cssText = `padding: 18px; background-color: ${alertColors[color]}; color: white; margin-bottom: 8px; width: 100%; display: flex; justify-content: space-between`;
            return alert;
        },
// // range slider
        slider: () => {
            const container = document.createElement('div');
            container.style.cssText = 'width: 100%; padding: 10px 0; display: flex; align-items: center;';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '100';
            slider.value = '50';
            slider.className = 'custom-range-slider';
            slider.style.flex = '1';

            const valueDisplay = document.createElement('span');
            valueDisplay.style.cssText = 'margin: 0 6px 0 4px; font-weight: bold; min-width: 30px; text-align: right;';
            valueDisplay.textContent = '50';

            container.appendChild(slider);
            container.appendChild(valueDisplay);

            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value;
            });

            return container;
        },
// // Date Picker
        datePicker: () => {
            const datePickerWrapper = document.createElement('div');
            datePickerWrapper.style.cssText = `
                width: 100%;
                padding: 10px 18px 10px 10px;
                border: 1px solid var(--primary-color);
                border-radius: 5px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: var(--basic-txt-color);
                background-color: var(--input-bg-color);
                position: relative;
            `;

            const dateText = document.createElement('span');
            dateText.textContent = 'DD/MM/YYYY'; 
            dateText.style.cssText = 'opacity: 0.7;';
            dateText.setAttribute('contenteditable', 'true');
            dateText.setAttribute('spellcheck', 'false');
            
            dateText.addEventListener('input', () => {
                dateText.style.opacity = '1';
            });

            const calendarIcon = document.createElement('i');
            calendarIcon.className = 'fas fa-calendar-alt';
            calendarIcon.style.cssText = `
                color: var(--primary-color);
                font-size: 18px;
                cursor: pointer;
            `;

            // Calendar component creation
            const calendarComponent = document.createElement('div');
            calendarComponent.style.cssText = `
                position: absolute;
                top: 101%;
                right: 0;
                width: 200px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: var(--input-bg-color);
                display: none; /* Initially hidden */
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                z-index: 9;
            `;

            // Editable month and grid for days
            const monthText = document.createElement('div');
            monthText.textContent = 'January';
            monthText.setAttribute('contenteditable', 'true');
            monthText.style.cssText = `
                text-align: center;
                font-weight: bold;
                margin-bottom: 6px;
            `;

            // Add this below monthText
            const yearText = document.createElement('div');
            yearText.textContent = '2025'; 
            yearText.setAttribute('contenteditable', 'true');
            yearText.style.cssText = `
                text-align: center;
                font-weight: bold;
                margin-bottom: 8px;
            `;

            const daysGrid = document.createElement('div');
            daysGrid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 4px;
                text-align: center;
                font-size: 12px;
            `;

    // Initialize the days with placeholders (can be updated)
    const maxDays = 31;
    for (let day = 1; day <= maxDays; day++) {
        const dayCell = document.createElement('span');
        dayCell.textContent = day;
        dayCell.style.cssText = `
            padding: 5px;
            border-radius: 3px;
            cursor: pointer;
            background-color: var(--neutral-gray);
        `;
        
        dayCell.addEventListener('click', () => {
            dateText.textContent = `${monthText.textContent} ${day}, ${yearText.textContent}`;
            calendarComponent.style.display = 'none';
            dateText.style.opacity = '1';
        });

        daysGrid.appendChild(dayCell);
        }

        // Calendar component content
        calendarComponent.appendChild(monthText);
        calendarComponent.appendChild(yearText);
        calendarComponent.appendChild(daysGrid);

        calendarIcon.addEventListener('click', () => {
            calendarComponent.style.display = calendarComponent.style.display === 'none' ? 'block' : 'none';
        });

        datePickerWrapper.appendChild(dateText);
        datePickerWrapper.appendChild(calendarIcon);
        datePickerWrapper.appendChild(calendarComponent);

        return datePickerWrapper;
        },
        fileUpload: () => {
            const container = document.createElement('div');
            container.style.cssText = 'width: 100%; position: relative;';

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.id = 'file-upload';
            fileInput.style.cssText = 'width: 100%; height: 100%; opacity: 0; position: absolute; cursor: pointer;';

            const label = document.createElement('label');
            label.htmlFor = 'file-upload';
            label.className = 'file-upload-label';
            label.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Choose a file';

            // iconElement.addEventListener('click', (e) => {
            //     e.preventDefault();
            //     showIconPicker(iconElement);
            // });

            container.appendChild(fileInput);
            container.appendChild(label);

            return container;
        },
// // BOTTOM NAVIGATION
        bottomNav: () => {
            const bottomNavContainer = document.createElement('nav');
            bottomNavContainer.className = 'bottomNavContain max-items';
            
            // Create the shadow div
            const shadowDiv = document.createElement('div');
            shadowDiv.style.cssText = 'background-color: rgba(0,0,0,0.12); width: 100%; height: 3px; position: absolute; top:-3px; left: 0;';

            const bottomNav = document.createElement('div');
            bottomNav.className = 'bottomNav bottom-navbar';
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
                <div class="nav-item-container">
                    <button class="nav-delete-btn">×</button>
                    <a href="#" style="text-align: center; color: var(--primary-color); text-decoration: none; display: flex; flex-direction: column; align-items: center;">
                        <i class="fas fa-heart" style="font-size: 20px; margin-bottom: 4px;"></i>
                        <span style="font-size: 12px;">Like</span>
                    </a>
                </div>
                <div class="nav-item-container">
                    <button class="nav-delete-btn">×</button>
                    <a href="#" style="text-align: center; color: var(--primary-color); text-decoration: none; display: flex; flex-direction: column; align-items: center;">
                        <i class="fas fa-user" style="font-size: 20px; margin-bottom: 4px;"></i>
                        <span style="font-size: 12px;">Profile</span>
                    </a>
                </div>
                <button class="nav-add-btn"><i class="fas fa-plus"></i></button>
            `;
        
            // Delete buttons
            bottomNav.querySelectorAll('.nav-delete-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (bottomNav.querySelectorAll('.nav-item-container').length > 1) {
                        this.closest('.nav-item-container').remove();
                        updateAddButtonVisibility(bottomNavContainer);
                    }
                });
            });
        
            const addButton = bottomNav.querySelector('.nav-add-btn');
            
            addButton.addEventListener('click', () => {
                if (bottomNav.querySelectorAll('.nav-item-container').length < 5) {
                    const newItem = document.createElement('div');
                    newItem.className = 'nav-item-container';
                    newItem.innerHTML = `
                        <button class="nav-delete-btn">×</button>
                        <a href="#" style="text-align: center; color: var(--primary-color); text-decoration: none; display: flex; flex-direction: column; align-items: center;">
                            <i class="fa-solid fa-bolt-lightning" style="font-size: 20px; margin-bottom: 4px;"></i>
                            <span style="font-size: 12px;">New</span>
                        </a>
                    `;
        
                    // Add delete handler to new item
                    newItem.querySelector('.nav-delete-btn').addEventListener('click', function() {
                        if (bottomNav.querySelectorAll('.nav-item-container').length > 1) {
                            this.closest('.nav-item-container').remove();
                            updateAddButtonVisibility(bottomNavContainer);
                        }
                    });
        
                    // Add icon click handler
                    newItem.querySelector('i').addEventListener('click', (e) => {
                        e.preventDefault();
                        showIconPicker(e.target);
                    });
        
                    // Make label editable
                    this.makeTextEditable(newItem.querySelector('span'));
                    bottomNav.insertBefore(newItem, addButton);
                    updateAddButtonVisibility(bottomNavContainer);
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
            bottomNav.querySelectorAll('span').forEach(span => this.makeTextEditable(span));
        
            // Add click handlers to icons
            bottomNav.querySelectorAll('.nav-item-container i').forEach(icon => {
                icon.style.cursor = 'pointer';
                icon.addEventListener('click', (e) => {
                    e.preventDefault();
                    showIconPicker(icon);
                });
            });
        
            bottomNavContainer.appendChild(shadowDiv);
            bottomNavContainer.appendChild(bottomNav);
            return bottomNavContainer;
        },
        heading: (level = 'h1') => {
            const wrapper = document.createElement('div');
            wrapper.className = 'component-wrapper';
            wrapper.style.cssText = 'width: 100%;';
            
            const alignCon = document.createElement('div');
            // Ensure level is a valid heading tag
            const validLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            const safeLevel = validLevels.includes(level) ? level : 'h1';
            const heading = document.createElement(safeLevel);
            heading.textContent = `${safeLevel.toUpperCase()} Heading`;
            heading.style.cssText = 'color: #2c3e50; margin: 10px 0;';
            heading.setAttribute('contentEditable','true');
            // this.makeTextEditable(heading);
            alignCon.appendChild(heading);
            wrapper.appendChild(alignCon);
            
            return wrapper;
        },
        paragraph(originalComponent, text = "This is a paragraph. Click to edit.") {
            const wrapper = document.createElement('div');
            wrapper.className = 'component-wrapper';
            wrapper.style.cssText = 'width: 100%;';
          
            const alignCon = document.createElement('div');
          
            let paragraphElement;
            if (originalComponent) {
              paragraphElement = originalComponent.cloneNode(true);
            } else {
              paragraphElement = document.createElement('p');
              paragraphElement.textContent = text;
              paragraphElement.style.cssText = 'color: var(--basic-txt-color); line-height: 1.6; margin-bottom: 15px;';
              paragraphElement.setAttribute('contentEditable', 'true');
          
              paragraphElement.addEventListener('input', () => {
                // Store the edited text in the component's dataset
                wrapper.dataset.paragraphText = paragraphElement.textContent;
              });
            }
          
            alignCon.appendChild(paragraphElement);
            wrapper.appendChild(alignCon);
          
            return wrapper;
          },
// // BLOCKQUOTE
          blockquote(originalComponent) {
            const wrapper = document.createElement('div');
            wrapper.className = 'component-wrapper';
            wrapper.style.cssText = 'width: 100%;';
          
            const alignCon = document.createElement('div');
          
            let blockquoteElement;
            if (originalComponent) {
              // If an original component is provided, clone it
              blockquoteElement = originalComponent.cloneNode(true);
            } else {
              // Create a new blockquote element
              blockquoteElement = document.createElement('blockquote');
              blockquoteElement.textContent = 'This is a block-quote. Click to edit.';
              blockquoteElement.style.cssText = 'color: #555; font-style: italic; border-left: 5px solid var(--primary-color); padding-left: 18px; margin: 12px 0;';
              blockquoteElement.setAttribute('contentEditable', 'true');
          
              // Add event listener to track edits
              blockquoteElement.addEventListener('input', () => {
                // Store the edited text in the component's dataset
                wrapper.dataset.blockquoteText = blockquoteElement.textContent;
              });
            }
          
            alignCon.appendChild(blockquoteElement);
            wrapper.appendChild(alignCon);
          
            return wrapper;
          },
// // LABEL fieldlabel
         label(originalComponent) {
            let labelElement;
            if (originalComponent) {
              // If an original component is provided, clone it
              labelElement = originalComponent.cloneNode(true);
            } else {
              // Create a new label element
              labelElement = document.createElement('label');
              labelElement.textContent = 'Label Text';
              labelElement.style.cssText = `
                display: block;
                color: #2c3e50;
                font-weight: 500;
                margin: 10px 0 -4px 4px;
                font-size: 14px;
                width: 100%;
              `;
              labelElement.setAttribute('contentEditable', 'true');
          
              // Add event listener to track edits
              labelElement.addEventListener('input', () => {
                // Store the edited text in the component's dataset
                labelElement.dataset.labelText = labelElement.textContent;
              });
            }
          
            return labelElement;
          },
        graph: (type = 'bar') => {
            const container = document.createElement('div');
            container.style.cssText = 'width: 100%; height: 300px; background: var(--background-color); padding: 20px; border-radius: 8px; border: 0.12rem solid var(--neutral-gray); border-bottom: 3px solid rgba(0,0,0,.12); position: relative;';
            
            const canvas = document.createElement('canvas');
            container.appendChild(canvas);
            
            const initialData = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                values: [6, 8, 11, 10, 12]
            };
            
            const data = {
                labels: initialData.labels,
                datasets: [{
                    label: 'Sample Data',
                    data: initialData.values,
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.5)',
                        'rgba(46, 204, 113, 0.5)',
                        'rgba(155, 89, 182, 0.5)',
                        'rgba(52, 73, 94, 0.5)',
                        'rgba(241, 196, 15, 0.5)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(155, 89, 182, 1)',
                        'rgba(52, 73, 94, 1)',
                        'rgba(241, 196, 15, 1)'
                    ],
                    borderWidth: 1
                }]
            };

            const options = {
                responsive: true,
                maintainAspectRatio: false,
            };

            if (type === 'doughnut') {
                options.circumference = 180;
                options.rotation = -90;
            }

            if (type === 'area') {
                type = 'line';
                data.datasets[0].fill = true;
            }

            const chart = new Chart(canvas, {
                type: type,
                data: data,
                options: options
            });

            container.chart = chart;
            container.chartData = initialData;
            container.chartType = type;

            return container;
        },
        leftChat: () => {
              // Create main container
            const container = document.createElement('div');
            container.style.cssText = 'width: 100%; display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; position: relative;';

            // Create avatar
            const avatar = document.createElement('div');
            avatar.innerHTML = 'AV';
            avatar.style.cssText = 'width: 40px; height: 40px; background-color: var(--primary-color); color: #ffffff; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; flex-shrink: 0;';
            avatar.setAttribute('contentEditable', 'true');

            // Create content wrapper
            const contentWrapper = document.createElement('div');
            contentWrapper.style.cssText = 'flex-grow: 1; max-width: 80%;';

            // Create chat bubble
            const bubble = document.createElement('div');
            bubble.style.cssText = 'background-color: var(--neutral-gray); padding: 12px 16px; border-radius: 18px; border-top-left-radius: 4px; width: fit-content; word-wrap: break-word;';
            
            // Create content div
            const chatContent = document.createElement('div');
            chatContent.className = 'chat-content';
            chatContent.innerHTML = 'Click to edit this message.';
            chatContent.setAttribute('contentEditable', 'true');
            
            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'chat-image-container';
            imageContainer.style.cssText = 'margin-top: 8px; cursor: pointer; display: none;';

            // Add hover behavior to the content wrapper
            contentWrapper.addEventListener('mouseenter', () => {
                imageContainer.style.display = 'block';
            });
            
            contentWrapper.addEventListener('mouseleave', () => {
                // Only hide if no image is displayed
                const img = imageContainer.querySelector('img');
                if (!img || img.style.display === 'none') {
                imageContainer.style.display = 'none';
                }
            });
            
            // Create image element
            const img = document.createElement('img');
            img.style.cssText = 'max-width: 200px; max-height: 200px; border-radius: 12px; display: none;';
            img.alt = 'Chat image';
            
            // Create image placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; color: #666; padding: 8px; border: 0.12rem dashed #ccc; border-radius: 8px;';
            
            // Add icon and text to placeholder
            const icon = document.createElement('i');
            icon.className = 'fas fa-image';
            icon.style.marginRight = '8px';
            placeholder.appendChild(icon);
            placeholder.appendChild(document.createTextNode('Add Image'));
            
            // Create timestamp
            const timestamp = document.createElement('div');
            timestamp.textContent = '1 minute ago';
            timestamp.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
            timestamp.setAttribute('contentEditable', 'true');

            // Add image upload functionality
            imageContainer.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                
                input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                    img.src = event.target.result;
                    img.style.display = 'block';
                    placeholder.style.display = 'none';
                    imageContainer.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
                };
                
                input.click();
            });

            // Assemble the components
            imageContainer.appendChild(img);
            imageContainer.appendChild(placeholder);
            bubble.appendChild(chatContent);
            bubble.appendChild(imageContainer);
            contentWrapper.appendChild(bubble);
            contentWrapper.appendChild(timestamp);
            container.appendChild(avatar);
            container.appendChild(contentWrapper);

            return container;
        },
        rightChat: () => {
            const container = document.createElement('div');
            container.style.cssText = 'width: 100%; display: flex; flex-direction: row-reverse; align-items: flex-start; gap: 10px; margin-bottom: 12px;';
            
            const avatar = document.createElement('div');
            avatar.innerHTML = 'ME';
            avatar.style.cssText = 'width: 40px; height: 40px; background-color: var(--primary-color); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; flex-shrink: 0;';
            avatar.setAttribute('contentEditable', 'true');
            
            const contentWrapper = document.createElement('div');
            contentWrapper.style.cssText = 'flex-grow: 1; display: flex; flex-direction: column; align-items: flex-end;';
            
            const bubble = document.createElement('div');
            
            bubble.style.cssText = 'background-color: var(--primary-color); color: white; padding: 12px 16px; border-radius: 18px; border-top-right-radius: 4px; max-width: 82%; display: inline-block; word-wrap: break-word;';

            // Create content div
            const chatContent = document.createElement('div');
            chatContent.className = 'chat-content';
            chatContent.innerHTML = 'Click to edit this message.';
            chatContent.setAttribute('contentEditable', 'true');
            
            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.className = 'chat-image-container';
            imageContainer.style.cssText = 'margin-top: 8px; cursor: pointer; display: none;';

            // Add hover behavior to the content wrapper
            contentWrapper.addEventListener('mouseenter', () => {
                imageContainer.style.display = 'block';
            });
            
            contentWrapper.addEventListener('mouseleave', () => {
                // Only hide if no image is displayed
                const img = imageContainer.querySelector('img');
                if (!img || img.style.display === 'none') {
                imageContainer.style.display = 'none';
                }
            });
            
            // Create image element
            const img = document.createElement('img');
            img.style.cssText = 'max-width: 200px; max-height: 200px; border-radius: 12px; display: none;';
            img.alt = 'Chat image';
            
            // Create image placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; color: #eee; padding: 8px; border: 0.12rem dashed #ccc; border-radius: 8px;';
            
            // Add icon and text to placeholder
            const icon = document.createElement('i');
            icon.className = 'fas fa-image';
            icon.style.marginRight = '8px';
            placeholder.appendChild(icon);
            placeholder.appendChild(document.createTextNode('Add Image'));
            
            
            const timestamp = document.createElement('div');
            timestamp.textContent = '1 minute ago';
            timestamp.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
            
            const bubbleTxt = bubble.querySelector('.chat-content');
            //bubbleTxt.setAttribute('contentEditable','true');
            timestamp.setAttribute('contentEditable','true');


            // Add click handler for image container
            // const imageContainer = bubble.querySelector('.chat-image-container');
            // const img = imageContainer.querySelector('img');
            // const placeholder = imageContainer.querySelector('.image-placeholder');
            
            // imageContainer.style.display = 'block';
            imageContainer.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            img.src = event.target.result;
                            img.style.display = 'block';
                            placeholder.style.display = 'none';
                            imageContainer.style.display = 'block';
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            });
            
            imageContainer.appendChild(img);
            imageContainer.appendChild(placeholder);
            bubble.appendChild(chatContent);
            bubble.appendChild(imageContainer);
            contentWrapper.appendChild(bubble);
            contentWrapper.appendChild(timestamp);
            container.appendChild(avatar);
            container.appendChild(contentWrapper);
            
            return container;
        },
        chatInput: (type = 'basic') => {
            const container = document.createElement('div');
            container.style.cssText = 'width: 100%; display: flex; gap: 8px; padding: 8px; background-color: var(--neutral-gray); border-radius: 24px; align-items: center;';
            
            if (type === 'withemoji' || type === 'full') {
                const emojiBtn = document.createElement('button');
                emojiBtn.innerHTML = '<i class="far fa-smile"></i>';
                emojiBtn.style.cssText = 'background: none; border: none; color: #666; padding: 8px 0 8px 8px; cursor: pointer; font-size: 16px;';
                container.appendChild(emojiBtn);
            }
            
            if (type === 'withimage' || type === 'full') {
                const imageBtn = document.createElement('button');
                imageBtn.innerHTML = '<i class="far fa-image"></i>';
                imageBtn.style.cssText = 'background: none; border: none; color: #666; padding: 8px 0 8px 8px; cursor: pointer; font-size: 16px;';
                container.appendChild(imageBtn);
            }
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Type a message...';
            input.style.cssText = 'flex: 1; border: none; background: none; padding: 8px; font-size: 14px; outline: none;';
            container.appendChild(input);
            
            const sendBtn = document.createElement('button');
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            sendBtn.style.cssText = 'background-color: var(--primary-color); border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-top: -2px;';
            container.appendChild(sendBtn);
            const sendIcon = sendBtn.querySelector('.fas')
            sendIcon.addEventListener('click', (e) => {
                e.preventDefault();
                showIconPicker(sendIcon);
            });
            
            return container;
        },
// Notification Banner with Icon and Action Button
notificationBanner: (originalComponent) => {
    let container, icon, iconElement, content, message, subtext, actionButton, toggleButton;
    
    if (originalComponent) {
      // Clone the existing component
      container = originalComponent.cloneNode(true);
      
      // Get references to the elements in the cloned component
      icon = container.querySelector('div:first-child');
      iconElement = icon.querySelector('i');
      content = container.querySelector('div:nth-child(2)');
      message = content.querySelector('div:nth-child(1)');
      subtext = content.querySelector('div:nth-child(2)');
      actionButton = content.querySelector('.notification-action');
      toggleButton = container.querySelector('.visibility-toggle');
      
      // Reattach event listeners
      iconElement.addEventListener('click', (e) => {
        e.preventDefault();
        showIconPicker(iconElement);
      });
      
      // Reattach hover events for toggle button
      container.addEventListener('mouseenter', () => {
        toggleButton.style.opacity = '1';
      });
      
      container.addEventListener('mouseleave', () => {
        toggleButton.style.opacity = '0';
      });
      
      // Reattach toggle button click handler
      toggleButton.addEventListener('click', () => {
        const isVisible = actionButton.dataset.alwaysVisible === 'true';
        actionButton.dataset.alwaysVisible = (!isVisible).toString();
        actionButton.style.display = !isVisible ? 'block' : 'none';
        toggleButton.innerHTML = !isVisible ? 
          '<i class="fas fa-eye"></i>' : 
          '<i class="fas fa-eye-slash"></i>';
      });
      
    } else {
      // Create new component
      container = document.createElement('div');
      container.style.cssText = 'width: 100%; background-color: var(--neutral-gray); border-left: 4px solid var(--primary-color); padding: 12px 8px; margin: 6px 0; display: flex; align-items: flex-start; gap: 12px; border-radius: 4px; position: relative;';
      
      icon = document.createElement('div');
      icon.style.cssText = 'flex-shrink: 0;';
      
      iconElement = document.createElement('i');
      iconElement.className = 'fas fa-bell';
      iconElement.style.cssText = 'font-size: 20px; color: var(--primary-color); cursor: pointer;';
      icon.appendChild(iconElement);
      
      iconElement.addEventListener('click', (e) => {
        e.preventDefault();
        showIconPicker(iconElement);
      });
      
      content = document.createElement('div');
      content.style.cssText = 'flex-grow: 1; display: flex; flex-direction: column; gap: 4px;';
      
      message = document.createElement('div');
      message.textContent = 'Click to edit this important notification message.';
      message.style.cssText = 'font-weight: 500;';
      message.setAttribute('contentEditable', 'true');
      
      subtext = document.createElement('div');
      subtext.textContent = 'Additional details or instructions can go here.';
      subtext.style.cssText = 'font-size: 14px; color: #666;';
      subtext.setAttribute('contentEditable', 'true');
      
      // Action button (visible by default)
      actionButton = document.createElement('div');
      actionButton.className = 'notification-action';
      actionButton.textContent = 'Action';
      actionButton.style.cssText = `
        background-color: var(--primary-color);
        color: white;
        padding: 6px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        user-select: none;
        display: block;
        margin-top: 6px;
        width: fit-content;
        font-size: small;
      `;
      actionButton.setAttribute('contentEditable', 'true');
      actionButton.dataset.alwaysVisible = 'true';
      
      // Toggle visibility button
      toggleButton = document.createElement('div');
      toggleButton.className = 'visibility-toggle';
      toggleButton.innerHTML = '<i class="fas fa-eye"></i>';
      toggleButton.style.cssText = `
        position: absolute;
        bottom: 16px;
        left: 6px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
        background-color: rgba(0, 0, 0, 0.1);
        padding: 4px;
        border-radius: 4px;
        font-size: 14px;
      `;
      
      // Add hover functionality for toggle button
      container.addEventListener('mouseenter', () => {
        toggleButton.style.opacity = '1';
      });
      
      container.addEventListener('mouseleave', () => {
        toggleButton.style.opacity = '0';
      });
      
    // Add toggle functionality
    toggleButton.addEventListener('click', () => {
        const isVisible = actionButton.dataset.alwaysVisible === 'true';
        actionButton.dataset.alwaysVisible = (!isVisible).toString();
        actionButton.style.display = !isVisible ? 'block' : 'none';
        toggleButton.innerHTML = !isVisible ? 
        '<i class="fas fa-eye"></i>' : 
        '<i class="fas fa-eye-slash"></i>';
        toggleButton.style.opacity = '0';
    });
      
      content.appendChild(message);
      content.appendChild(subtext);
      content.appendChild(actionButton);
      container.appendChild(icon);
      container.appendChild(content);
      container.appendChild(toggleButton);
    }
    
    return container;
  },
// // Progress Tracker  /////////
    progressTracker: () => {
        const container = document.createElement('div');
        container.style.cssText = 'width: 100%; padding: 16px 0; display: flex; justify-content: space-around; align-items: center; position: relative;';
        
        // Control buttons container
        const controls = document.createElement('div');
        controls.style.cssText = `
            position: absolute;
            top: -10px;
            right: calc(50% - 28px);
            display: none;
            gap: 6px;
            z-index: 2223;
        `;
        
        const addButton = document.createElement('button');
        addButton.innerHTML = '<i class="fas fa-plus"></i>';
        addButton.style.cssText = `
            background-color: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 4px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const removeButton = document.createElement('button');
        removeButton.innerHTML = '<i class="fas fa-minus"></i>';
        removeButton.style.cssText = addButton.style.cssText;
        removeButton.style.opacity = '0.5';
        
        controls.appendChild(removeButton);
        controls.appendChild(addButton);
    
        function updateButtonStates() {
            const steps = container.querySelectorAll('[data-step]');
            removeButton.style.opacity = steps.length === 1 ? '0.5' : '1';
            removeButton.style.cursor = steps.length === 1 ? 'default' : 'pointer';
            addButton.style.opacity = steps.length === 5 ? '0.5' : '1';
            addButton.style.cursor = steps.length === 5 ? 'default' : 'pointer';
        }
        
        function createConnectingLine() {
            const line = document.createElement('div');
            line.style.cssText = 'height: 2px; background-color: #E0E0E0; flex: 1; margin: -22px 0 0 0; align-self: center; border-radius: 2px';
            line.classList.add('connecting-line');
            return line;
        }
    
        function makeTextEditable(element) {
            element.contentEditable = 'true';
            element.spellcheck = false;
            element.style.cursor = 'text';
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    element.blur();
                }
            });
        }

        function setSelectedStep(stepContainer) {
            // Remove primary color from all circles
            container.querySelectorAll('[data-step] div:first-child').forEach(circle => {
                circle.style.backgroundColor = 'var(--neutral-gray)';
                circle.style.color = '#666';
            });
            
            // Add primary color to selected circle
            const circle = stepContainer.querySelector('div:first-child');
            circle.style.backgroundColor = 'var(--primary-color)';
            circle.style.color = 'white';
        }
        
        function createStep(index, total) {
            const stepContainer = document.createElement('div');
            stepContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2; flex: 0 1 auto; text-align: center;';
            
            const circle = document.createElement('div');
            circle.style.cssText = `
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-weight: bold;
                margin: 0 6px;
                ${index === 0 ? 'background-color: var(--primary-color); color: white;' : 'background-color: var(--neutral-gray); color: #666;'}
            `;
            circle.textContent = (index + 1).toString();
            makeTextEditable(circle);
            
            const label = document.createElement('div');
            label.textContent = `Step ${index + 1}`;
            label.style.cssText = 'font-size: 14px; color: #666; font-weight: 500;';
            makeTextEditable(label);

            // Add click handler to the step container instead of the circle
            stepContainer.style.cursor = 'pointer';
            stepContainer.addEventListener('click', (e) => {
                setSelectedStep(stepContainer);
            });
                
            stepContainer.appendChild(circle);
            stepContainer.appendChild(label);
            return stepContainer;
        }
        
        function updateConnectingLines() {
            // Remove all existing connecting lines
            container.querySelectorAll('.connecting-line').forEach(line => line.remove());
            
            // Add connecting lines between steps (except after the last step)
            const steps = container.querySelectorAll('[data-step]');
            steps.forEach((step, index) => {
                if (index < steps.length - 1) {
                    container.insertBefore(createConnectingLine(), steps[index + 1]);
                }
            });
        }
        
        function updateSteps() {
            const steps = container.querySelectorAll('[data-step]');
            steps.forEach((step, i) => {
                step.querySelector('div:first-child').textContent = (i + 1).toString();
            });
            updateConnectingLines();
            updateButtonStates();
        }
        
        // Initial step
        const initialStep = createStep(0, 1);
        initialStep.setAttribute('data-step', '');
        
        // Add event listeners
        addButton.onclick = () => {
            const steps = container.querySelectorAll('[data-step]');
            if (steps.length < 5) {
                const newStep = createStep(steps.length, steps.length + 1);
                newStep.setAttribute('data-step', '');
                container.appendChild(newStep);
                updateSteps();
            }
        };
        
        removeButton.onclick = () => {
            const steps = container.querySelectorAll('[data-step]');
            if (steps.length > 1) {
                steps[steps.length - 1].remove();
                updateSteps();
            }
        };
        
        // Hover handlers
        container.addEventListener('mouseenter', () => controls.style.display = 'flex');
        container.addEventListener('mouseleave', () => controls.style.display = 'none');
        
        container.appendChild(initialStep);
        container.appendChild(controls);
        return container;
    },
// // Feature Comparison Card
    featureComparisonCard: () => {
        const container = document.createElement('div');
        container.style.cssText = 'width: 100%; border: 1px solid var(--neutral-gray); border-radius: 8px; overflow: visible; position: relative;';
    
        const header = document.createElement('div');
        header.style.cssText = 'padding: 14px; background-color: var(--primary-color); color: white; border-radius: 8px 8px 0 0';
        
        const titleWrapper = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = 'Feature Comparison';
        title.style.cssText = 'margin: 0; font-size: 18px; font-weight: bold; color: var(--text-on-primary) !important';
        this.makeTextEditable(title);
        titleWrapper.appendChild(title);
    
        const content = document.createElement('div');
        content.style.cssText = 'padding: 16px;';
    
        const grid = document.createElement('div');
        grid.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; align-items: center;';
            
        const addRowBtn = document.createElement('button');
        addRowBtn.innerHTML = '<i class="fas fa-plus"></i> Add Feature';
        addRowBtn.style.cssText = `
            background-color: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            display: none;
            align-items: center;
            gap: 4px;
            font-size: 14px;
            margin: 2px 0 12px 12px;
        `;
    
        // Headers
        const headers = ['Features', 'Basic', 'Pro'].map((text, index) => {
            const headerCell = document.createElement('div');
            headerCell.textContent = text;
            headerCell.style.cssText = `font-weight: bold; color: #777; padding: 8px 0; ${index > 0 ? 'text-align: center;' : ''}`;
            this.makeTextEditable(headerCell);
            return headerCell;
        });
    
        headers.forEach(header => grid.appendChild(header));
    
        // Convert createFeatureRow to an arrow function to keep 'this' context
        const createFeatureRow = (featureName = 'New Feature', isNew = false) => {
            const nameCell = document.createElement('div');
            nameCell.style.cssText = 'color: var(--basic-txt-color); display: flex; align-items: center; gap: 8px;';
    
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                color: #ff4444;
                cursor: pointer;
                padding: 0px 4px;
                display: none;
                font-size: 12px;
            `;
    
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display: flex; align-items: center; gap: 8px; width: 100%;';
    
            const textSpan = document.createElement('span');
            textSpan.textContent = featureName;
            this.makeTextEditable(textSpan); // Now 'this' should work correctly
    
            wrapper.appendChild(textSpan);
            wrapper.appendChild(deleteBtn);
            nameCell.appendChild(wrapper);
            
            nameCell.addEventListener('mouseenter', () => deleteBtn.style.display = 'block');
            nameCell.addEventListener('mouseleave', () => deleteBtn.style.display = 'none');
    
            const basicCell = document.createElement('div');
            basicCell.innerHTML = isNew ? '<i class="fas fa-times" style="color: #999;"></i>' : '<i class="fas fa-check" style="color: green;"></i>';
            basicCell.style.cssText = 'text-align: center; cursor: pointer;';
    
            const proCell = document.createElement('div');
            proCell.innerHTML = '<i class="fas fa-check" style="color: green;"></i>';
            proCell.style.cssText = 'text-align: center; cursor: pointer;';
    
            [basicCell, proCell].forEach(cell => {
                cell.onclick = () => {
                    const isCheck = cell.querySelector('.fa-check') !== null;
                    cell.innerHTML = isCheck 
                        ? '<i class="fas fa-times" style="color: #999;"></i>'
                        : '<i class="fas fa-check" style="color: green;"></i>';
                };
            });
    
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                [nameCell, basicCell, proCell].forEach(cell => cell.remove());
            };
    
            grid.appendChild(nameCell);
            grid.appendChild(basicCell);
            grid.appendChild(proCell);
        };
    
        // Initial features
        ['Feature 1', 'Feature 2', 'Feature 3'].forEach(feature => {
            createFeatureRow(feature);
        });
    
        // Add row handler
        addRowBtn.onclick = () => {
            createFeatureRow('New Feature', true);
        };
    
        //addRowContainer.appendChild(addRowBtn);
        header.appendChild(titleWrapper);
        content.appendChild(grid);
        container.appendChild(header);
        container.appendChild(content);
        container.appendChild(addRowBtn);
    
        return {
            container: container,
            setup: () => {
                const compContainer = container.closest('.component-container');
                if (compContainer) {
                    compContainer.addEventListener('mouseenter', () => {
                        addRowBtn.style.display = 'block';
                    });
    
                    compContainer.addEventListener('mouseleave', () => {
                        addRowBtn.style.display = 'none';
                    });
                }
            }
        };
    },
// // Pills
chipGroup: () => {
    // Create container for all chips
    const chipGroupContainer = document.createElement('div');
    chipGroupContainer.style.cssText = `
        display: flex;
        flex-flow: row wrap;
        gap: 6px;
        padding: 6px 0;
        width: 100%;
        min-height: 48px;
        border-radius: 8px;
    `;

    // Add chip function
    const addChip = (text = 'New Chip') => {
        const chip = document.createElement('div');
        chip.style.cssText = `
            display: inline-flex;
            align-items: center;
            height: 32px;
            padding: 0 12px;
            background-color: var(--neutral-gray);
            border-radius: 16px;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s ease;
        `;

        const chipText = document.createElement('span');
        chipText.textContent = text;
        chipText.style.cssText = `
            font-size: 14px;
            color: var(--text-color);
        `;
        chipText.setAttribute('contentEditable','true');

        const closeButton = document.createElement('i');
        closeButton.className = 'fas fa-times';
        closeButton.style.cssText = `
            font-size: 12px;
            color: var(--secondary-color);
            margin-left: 8px;
            padding: 2px;
            cursor: pointer;
            display: none;
        `;

        chip.addEventListener('mouseenter', () => {
            closeButton.style.display = 'inline-block';
        });

        chip.addEventListener('mouseleave', () => {
            closeButton.style.display = 'none';
        });

        chip.addEventListener('click', (e) => {
            if (e.target !== closeButton && e.target !== chipText) {
                const isSelected = chip.getAttribute('data-selected') === 'true';
                if (isSelected) {
                    chip.style.backgroundColor = 'var(--neutral-gray)';
                    chipText.style.color = '#333';
                    closeButton.style.color = '#333';
                    chip.setAttribute('data-selected', 'false');
                } else {
                    chip.style.backgroundColor = 'var(--primary-color)';
                    chipText.style.color = '#fff';
                    closeButton.style.color = '#fff';
                    chip.setAttribute('data-selected', 'true');
                }
            }
        });

        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            chip.remove();
            if (chipGroupContainer.children.length === 1) {
                addButton.style.display = 'flex';
            }
        });

        chip.appendChild(chipText);
        chip.appendChild(closeButton);
        chipGroupContainer.insertBefore(chip, addButton);
    };

    // Add button
    const addButton = document.createElement('div');
    addButton.style.cssText = `
        display: none;
        align-items: center;
        justify-content: center;
        height: 32px;
        padding: 0 12px;
        background-color: transparent;
        border: 0.12rem dashed var(--neutral-gray);
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
    `;

    const plusIcon = document.createElement('i');
    plusIcon.className = 'fas fa-plus';
    plusIcon.style.cssText = `
        font-size: 12px;
        color: var(--secondary-color);
        margin-right: 4px;
    `;

    const addText = document.createElement('span');
    addText.textContent = 'Add Chip';
    addText.style.cssText = `
        font-size: 14px;
        color: var(--secondary-color);
    `;

    addButton.appendChild(plusIcon);
    addButton.appendChild(addText);

    addButton.addEventListener('mouseenter', () => {
        addButton.style.borderColor = 'var(--primary-color)';
        plusIcon.style.color = 'var(--primary-color)';
        addText.style.color = 'var(--primary-color)';
    });

    addButton.addEventListener('mouseleave', () => {
        addButton.style.borderColor = 'var(--neutral-gray)';
        plusIcon.style.color = 'var(--secondary-color)';
        addText.style.color = 'var(--secondary-color)';
    });

    addButton.addEventListener('click', () => {
        addChip();
        if (chipGroupContainer.children.length > 15) {
            addButton.style.display = 'none';
        }
    });

    // Add initial chips
    chipGroupContainer.appendChild(addButton);
    addChip('Design');
    addChip('Development');
    addChip('Marketing');

    // Return an object with the container and a setup function
    return {
        container: chipGroupContainer,
        setup: () => {
            const compContainer = chipGroupContainer.closest('.component-container');
            if (compContainer) {
                compContainer.addEventListener('mouseenter', () => {
                    addButton.style.display = 'flex';
                });

                compContainer.addEventListener('mouseleave', () => {
                    addButton.style.display = 'none';
                });
            }
        }
    };
},
// Floating Action Button
floatingActionButton: () => {
    const fab = document.createElement('div');
    fab.classList.add('fab');
    fab.style.cssText = `
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      background-color: var(--primary-color);
      border-radius: 50%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: all 0.2s ease;
      bottom: 30px;
      right: 20px;
      z-index: 3847;
    `;

    const plusIcon = document.createElement('i');
    plusIcon.className = 'fas fa-plus';
    plusIcon.style.cssText = `
      font-size: 18px;
      color: #fff;
    `;

    fab.appendChild(plusIcon);
    fab.addEventListener('click', (e) => {
        e.preventDefault();
        showIconPicker(plusIcon);
    });

    fab.addEventListener('mouseenter', () => {
      fab.style.transform = 'scale(1.1)';
      fab.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
    });

    fab.addEventListener('mouseleave', () => {
      fab.style.transform = 'scale(1)';
      fab.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
    });

    fab.addEventListener('click', () => {
      // Add your desired functionality here
      console.log('Floating action button clicked!');
    });

    return fab;
  },
// Bullet List
bulletedList: () => {
    // Create container for the list
    const listContainer = document.createElement('div');
    listContainer.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 12px;
        width: 100%;
        min-height: 48px;
    `;

    // Function to create a new list item
    const createListItem = (text = 'New item') => {
        const itemContainer = document.createElement('div');
        itemContainer.style.cssText = `
            display: flex;
            align-items: flex-start;
            margin-left: 0px;
            transition: margin-left 0.2s ease;
        `;

        // Create icon container
        const icon = document.createElement('div');
        icon.style.cssText = `
            display: flex;
            align-items: center;
            padding: 4px 8px;
            cursor: pointer;
        `;

        const iconElement = document.createElement('i');
        iconElement.className = 'fas fa-circle';
        iconElement.style.cssText = `
            font-size: 12px;
            margin-top: 1px;
            color: var(--text-color);
        `;

        icon.appendChild(iconElement);
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            showIconPicker(iconElement);
        });

        // Create text content
        const content = document.createElement('div');
        content.style.cssText = `
            flex-grow: 1;
            color: var(--text-color);
            min-height: 24px;
            padding: 2px 0;
        `;
        content.setAttribute('contenteditable', 'true');
        content.textContent = text;

        // Create controls container
        const controls = document.createElement('div');
        controls.style.cssText = `
            display: none;
            gap: 8px;
            padding: 0 4px;
        `;

        // Indent button
        const indentBtn = document.createElement('i');
        indentBtn.className = 'fas fa-indent';
        indentBtn.style.cssText = `
            font-size: 14px;
            color: var(--secondary-color);
            cursor: pointer;
            padding: 4px;
        `;

        // Unindent button
        const unindentBtn = document.createElement('i');
        unindentBtn.className = 'fas fa-outdent';
        unindentBtn.style.cssText = `
            font-size: 14px;
            color: var(--secondary-color);
            cursor: pointer;
            padding: 4px;
        `;

        // Delete button
        const deleteBtn = document.createElement('i');
        deleteBtn.className = 'fas fa-times';
        deleteBtn.style.cssText = `
            font-size: 14px;
            color: var(--secondary-color);
            cursor: pointer;
            padding: 4px;
        `;

        // Add controls
        controls.appendChild(indentBtn);
        controls.appendChild(unindentBtn);
        controls.appendChild(deleteBtn);

        // Add all elements to item container
        itemContainer.appendChild(icon);
        itemContainer.appendChild(content);
        itemContainer.appendChild(controls);

        // Event listeners
        itemContainer.addEventListener('mouseenter', () => {
            controls.style.display = 'flex';
        });

        itemContainer.addEventListener('mouseleave', () => {
            controls.style.display = 'none';
        });

        // Indentation logic
        indentBtn.addEventListener('click', () => {
            const currentMargin = parseInt(itemContainer.style.marginLeft || '0');
            if (currentMargin < 160) { // Max indent level
                itemContainer.style.marginLeft = `${currentMargin + 40}px`;
            }
        });

        unindentBtn.addEventListener('click', () => {
            const currentMargin = parseInt(itemContainer.style.marginLeft || '0');
            if (currentMargin >= 40) {
                itemContainer.style.marginLeft = `${currentMargin - 40}px`;
            }
        });

        // Delete item
        deleteBtn.addEventListener('click', () => {
            itemContainer.remove();
            if (listContainer.children.length === 1) {
                addButton.style.display = 'flex';
            }
        });

        return itemContainer;
    };

    // Create add button
    const addButton = document.createElement('div');
    addButton.style.cssText = `
        display: flex;
        align-items: center;
        padding: 8px;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    `;

    const addIcon = document.createElement('i');
    addIcon.className = 'fas fa-plus';
    addIcon.style.cssText = `
        font-size: 12px;
        color: var(--secondary-color);
        margin-right: 8px;
    `;

    const addText = document.createElement('span');
    addText.textContent = 'Add item';
    addText.style.cssText = `
        font-size: 14px;
        color: var(--secondary-color);
    `;

    addButton.appendChild(addIcon);
    addButton.appendChild(addText);

    // Add button event listeners
    addButton.addEventListener('mouseenter', () => {
        addButton.style.backgroundColor = 'var(--neutral-gray)';
    });

    addButton.addEventListener('mouseleave', () => {
        addButton.style.backgroundColor = 'transparent';
    });

    addButton.addEventListener('click', () => {
        const newItem = createListItem();
        listContainer.insertBefore(newItem, addButton);
        if (listContainer.children.length > 20) {
            addButton.style.display = 'none';
        }
    });

    // Add initial items
    listContainer.appendChild(addButton);
    listContainer.insertBefore(createListItem('First item'), addButton);
    listContainer.insertBefore(createListItem('Second item'), addButton);

    // Return container and setup function
    return {
        container: listContainer,
        setup: () => {
            const compContainer = listContainer.closest('.component-container');
            if (compContainer) {
                compContainer.addEventListener('mouseenter', () => {
                    addButton.style.display = 'flex';
                });

                compContainer.addEventListener('mouseleave', () => {
                    if (listContainer.children.length > 1) {
                        addButton.style.display = 'none';
                    }
                });
            }
        }
    };
},
// // Table /// / /// / /// /// // /
table: () => {
    // Create main container
    const tableContainer = document.createElement('div');
    tableContainer.style.cssText = `
        width: 100%;
        margin-top: 6px;
        overflow-x: auto;
    `;

    // Create table element
    const table = document.createElement('table');
    table.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
        table-layout: fixed;
    `;

    // Column types enum
    const ColumnTypes = {
        CHECKBOX: 'checkbox',
        TEXT: 'text',
        LINK: 'link',
        ACTION: 'action'
    };

    // Track table state
    const state = {
        hasCheckboxColumn: false,
        columns: [],
        rows: [],
        activeControls: null,
        isResizing: false,
        currentResizer: null,
        startX: 0,
        startWidth: 0,
        initialRightEdge: 0
    };

    // Create header row
    const createHeaderCell = (text = 'New Column', type = ColumnTypes.TEXT) => {
        const th = document.createElement('th');
        th.style.cssText = `
            padding: 12px 0;
            text-align: left;
            font-weight: 600;
            color: var(--text-on-primary);
            border-bottom: 1px solid var(--neutral-gray);
            background: var(--primary-color);
            position: relative;
            min-width: 36px;
            width: 120px;
            border-right: 1px solid var(--neutral-gray);
        `;

        // Header content wrapper
        const headerContent = document.createElement('div');
        headerContent.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            pointer-events: none;
            margin-left: 16px;
        `;

        // Header text (editable)
        const headerText = document.createElement('span');
        headerText.textContent = text;
        headerText.setAttribute('contenteditable', 'true');
        headerText.style.pointerEvents = 'all';
        headerContent.appendChild(headerText);

        // Sort icon
        const sortIcon = document.createElement('i');
        sortIcon.className = 'fas fa-sort';
        sortIcon.style.cssText = `
            font-size: 12px;
            color: var(--text-on-primary);
            cursor: pointer;
            pointer-events: all;
            margin-right: 16px;
        `;
        sortIcon.addEventListener('click', (e) => {
            e.preventDefault();
            showIconPicker(sortIcon);
        });
        headerContent.appendChild(sortIcon);

        // Column resizer
        const resizer = document.createElement('div');
        resizer.className = 'column-resizer';
        resizer.style.cssText = `
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: transparent;
            cursor: col-resize;
            z-index: 550;
            pointer-events: all;
        `;
    
        const startResize = (e) => {
            state.isResizing = true;
            state.currentResizer = resizer;
            state.startX = e.pageX;
            state.startWidth = th.offsetWidth;
            
            // Store both the th and its current right edge position
            const thRect = th.getBoundingClientRect();
            state.initialRightEdge = thRect.right;
            
            // Add temporary overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                cursor: col-resize;
            `;
            overlay.id = 'resize-overlay';
            document.body.appendChild(overlay);
            
            // Position resize line at the th's right edge
            const resizeLine = document.createElement('div');
            resizeLine.style.cssText = `
                position: fixed;
                top: 0;
                bottom: 0;
                width: 2px;
                background: var(--primary-color);
                opacity: 0.5;
                left: ${thRect.right}px;
                pointer-events: none;
                z-index: 1001;
            `;
            resizeLine.id = 'resize-line';
            document.body.appendChild(resizeLine);
        };       

        resizer.addEventListener('mousedown', startResize);

        // Add hover effect for resizer
        resizer.addEventListener('mouseenter', () => {
            if (!state.isResizing) {
                resizer.style.background = 'var(--primary-color)';
            }
        });

        resizer.addEventListener('mouseleave', () => {
            if (!state.isResizing) {
                resizer.style.background = 'transparent';
            }
        });

        // Column controls
        const controls = document.createElement('div');
        controls.className = 'column-controls';
        controls.style.cssText = `
            display: none;
            position: absolute;
            left: -2px;
            top: 136%;
            border: 1px solid var(--neutral-gray);
            transform: translateY(-50%);
            background: var(--background-color);
            color: var(--basic-txt-color);
            padding: 4px;
            border-radius: 4px;
            gap: 4px;
            z-index: 108;
            pointer-events: all;
        `;

        // Column type selector
        const typeSelector = document.createElement('select');
        typeSelector.style.cssText = `
            padding: 2px 4px;
            border: 1px solid var(--neutral-gray);
            border-radius: 4px;
            background: var(--background-color);
            color: var(--text-color);
            font-size: 12px;
        `;

        Object.values(ColumnTypes).forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            typeSelector.appendChild(option);
        });
        typeSelector.value = type;

        typeSelector.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            controls.style.display = 'flex';
            state.activeControls = controls;
        });

        typeSelector.addEventListener('change', (e) => {
            e.stopPropagation();
            updateColumnType(th, typeSelector.value);
            setTimeout(() => {
                if (state.activeControls === controls) {
                    controls.style.display = 'none';
                    state.activeControls = null;
                }
            }, 200);
        });

        typeSelector.addEventListener('blur', () => {
            setTimeout(() => {
                if (state.activeControls === controls) {
                    controls.style.display = 'none';
                    state.activeControls = null;
                }
            }, 200);
        });

        controls.appendChild(typeSelector);

        // Delete column button
        const deleteBtn = document.createElement('i');
        deleteBtn.className = 'fas fa-times';
        deleteBtn.style.cssText = `
            font-size: 12px;
            color: var(--error-danger-delete);
            cursor: pointer;
            padding: 4px;
        `;
        deleteBtn.addEventListener('click', () => {
            const colIndex = Array.from(th.parentElement.children).indexOf(th);
            deleteColumn(colIndex);
        });
        controls.appendChild(deleteBtn);

        th.appendChild(headerContent);
        th.appendChild(controls);
        th.appendChild(resizer);

        // Improved hover behavior
        th.addEventListener('mouseenter', () => {
            if (!state.activeControls && !state.isResizing) {
                controls.style.display = 'flex';
            }
        });

        th.addEventListener('mouseleave', (e) => {
            if (!controls.contains(e.relatedTarget) && state.activeControls !== controls) {
                controls.style.display = 'none';
            }
        });

        return th;
    };

    // Create table cell based on column type
    const createCell = (type = ColumnTypes.TEXT) => {
        const td = document.createElement('td');
        td.style.cssText = `
            padding: 12px 16px;
            border-bottom: 1px solid var(--neutral-gray);
            color: var(--basic-txt-color);
        `;

        switch (type) {
            case ColumnTypes.CHECKBOX:
                const checkboxDiv = document.createElement('div');
                checkboxDiv.className = 'fa-regular fa-square';
                checkboxDiv.style.cssText = `
                    margin: -2px 10px 0 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    position: relative;
                    font-size: 18px;
                    color: #a0a0a0;
                `;
            
                // Checkmark icon
                const checkIcon = document.createElement('i');
                checkIcon.className = 'fa-solid fa-square-check';
                checkIcon.style.cssText = `
                    font-size: 18px;
                    color: var(--primary-color);
                    display: none; 
                    position: absolute;
                    top: 0px;
                    left: 0px;
                    border: none;
                `;
                checkboxDiv.appendChild(checkIcon);
            
                checkboxDiv.addEventListener('click', () => {
                    const isChecked = checkIcon.style.display === 'none';
                    checkIcon.style.display = isChecked ? 'block' : 'none';
                });
                
                td.appendChild(checkboxDiv);
                break;

            case ColumnTypes.LINK:
                const link = document.createElement('span');
                link.textContent = 'Link Text';
                link.style.cssText = `
                    color: #0d87d8;
                    cursor: pointer;
                `;
                link.setAttribute('contenteditable', 'true');
                td.appendChild(link);
                break;

            case ColumnTypes.ACTION:
                const actionIcon = document.createElement('i');
                actionIcon.className = 'fas fa-bolt';
                actionIcon.style.cssText = `
                    font-size: 14px;
                    color: var(--basic-txt-color);
                    cursor: pointer;
                `;
                actionIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    showIconPicker(actionIcon);
                });
                td.appendChild(actionIcon);
                break;

            default: // TEXT
                td.setAttribute('contenteditable', 'true');
                td.textContent = 'Cell Text';
        }

        return td;
    };

    // Create new row
    const createRow = (headerRow) => {
        const tr = document.createElement('tr');
        tr.style.cssText = `
            transition: background-color 0.2s ease;
        `;

        // Add hover effect
        tr.addEventListener('mouseenter', () => {
            tr.style.backgroundColor = 'var(--neutral-gray-light)';
            tr.querySelector('.row-controls').style.display = 'flex';
        });

        tr.addEventListener('mouseleave', () => {
            tr.style.backgroundColor = 'transparent';
            tr.querySelector('.row-controls').style.display = 'none';
        });

        // Add cells based on header row
        const headerCells = headerRow.children;
        Array.from(headerCells).forEach(header => {
            const type = header.querySelector('select').value;
            tr.appendChild(createCell(type));
        });

        // Add row controls
        const controlsCell = document.createElement('td');
        controlsCell.style.cssText = `
            padding: 12px 16px;
            border-bottom: 1px solid var(--neutral-gray);
        `;

        const controls = document.createElement('div');
        controls.className = 'row-controls';
        controls.style.cssText = `
            display: none;
            gap: 8px;
            justify-content: flex-start;
            margin-right: 44px;
            width: 44px;
        `;

        const deleteBtn = document.createElement('i');
        deleteBtn.className = 'fas fa-trash';
        deleteBtn.style.cssText = `
            font-size: 12px;
            color: var(--error-danger-delete);
            cursor: pointer;
        `;
        deleteBtn.addEventListener('click', () => {
            tr.remove();
            updateAddButtonVisibility();
        });

        controls.appendChild(deleteBtn);
        controlsCell.appendChild(controls);
        tr.appendChild(controlsCell);

        return tr;
    };

    // Update column type
    const updateColumnType = (headerCell, newType) => {
        const colIndex = Array.from(headerCell.parentElement.children).indexOf(headerCell);
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const cell = row.children[colIndex];
            const newCell = createCell(newType);
            row.replaceChild(newCell, cell);
        });
    };

    // Delete column
    const deleteColumn = (colIndex) => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            row.deleteCell(colIndex);
        });
    };

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 8px;
        margin-top: 8px;
    `;

    // Add column button
    const addColumnBtn = document.createElement('button');
    addColumnBtn.style.cssText = `
        padding: 8px 16px;
        margin: 8px 0;
        background: transparent;
        border: 1px solid var(--neutral-gray);
        border-radius: 4px;
        color: var(--secondary-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.2s ease;
    `;

    const addColumnIcon = document.createElement('i');
    addColumnIcon.className = 'fas fa-plus';
    addColumnBtn.appendChild(addColumnIcon);

    const addColumnText = document.createElement('span');
    addColumnText.textContent = 'Add Column';
    addColumnBtn.appendChild(addColumnText);

    // Add row button
    const addRowBtn = document.createElement('button');
    addRowBtn.style.cssText = addColumnBtn.style.cssText;

    const addRowIcon = document.createElement('i');
    addRowIcon.className = 'fas fa-plus';
    addRowBtn.appendChild(addRowIcon);

    const addRowText = document.createElement('span');
    addRowText.textContent = 'Add Row';
    addRowBtn.appendChild(addRowText);

    buttonContainer.appendChild(addColumnBtn);
    buttonContainer.appendChild(addRowBtn);

    // Create initial table structure
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.appendChild(createHeaderCell('ID', ColumnTypes.TEXT));
    headerRow.appendChild(createHeaderCell('Name', ColumnTypes.TEXT));
    headerRow.appendChild(createHeaderCell('Action', ColumnTypes.ACTION));
    thead.appendChild(headerRow);

    const tbody = document.createElement('tbody');
    // Now we can safely pass the headerRow when creating new rows
    tbody.appendChild(createRow(headerRow));
    tbody.appendChild(createRow(headerRow));

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    tableContainer.appendChild(buttonContainer);

    // Add event listeners for buttons
    addColumnBtn.addEventListener('click', () => {
        const headerRow = table.querySelector('thead tr');
        headerRow.insertBefore(createHeaderCell(), headerRow.lastElementChild);
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.insertBefore(createCell(), row.lastElementChild);
        });
    });

    addRowBtn.addEventListener('click', () => {
        const headerRow = table.querySelector('thead tr');
        tbody.appendChild(createRow(headerRow));
        updateAddButtonVisibility();
    });

    // Update add button visibility
    const updateAddButtonVisibility = () => {
        const rowCount = tbody.children.length;
        addRowBtn.style.display = rowCount >= 20 ? 'none' : 'flex';
    };

    // Hover effects for buttons
    [addColumnBtn, addRowBtn].forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.backgroundColor = 'var(--neutral-gray)';
            btn.style.borderColor = 'var(--primary-color)';
            btn.style.color = 'var(--primary-color)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.backgroundColor = 'transparent';
            btn.style.borderColor = 'var(--neutral-gray)';
            btn.style.color = 'var(--secondary-color)';
        });
    });

    return {
        container: tableContainer,
        setup: () => {
            const compContainer = tableContainer.closest('.component-container');
            if (compContainer) {
                compContainer.addEventListener('mouseenter', () => {
                    buttonContainer.style.display = 'flex';
                });

                compContainer.addEventListener('mouseleave', () => {
                    buttonContainer.style.display = 'none';
                });
            }

            // Add global handlers for column resizing
            document.addEventListener('mousemove', (e) => {
                if (state.isResizing) {
                    const delta = e.pageX - state.startX;
                    const newWidth = Math.max(60, state.startWidth + delta);
                    const th = state.currentResizer.parentElement;
                    th.style.width = `${newWidth}px`;
            
                    // Update resize line position relative to the initial right edge
                    const resizeLine = document.getElementById('resize-line');
                    if (resizeLine) {
                        const newPosition = state.initialRightEdge + delta;
                        resizeLine.style.transform = `translateX(${delta}px)`;
                    }
                }
            });

            document.addEventListener('mouseup', () => {
                if (state.isResizing) {
                    state.isResizing = false;
                    state.currentResizer = null;
                    state.startX = 0;
                    state.startWidth = 0;

                    // Remove overlay and resize line
                    const overlay = document.getElementById('resize-overlay');
                    const resizeLine = document.getElementById('resize-line');
                    if (overlay) overlay.remove();
                    if (resizeLine) resizeLine.remove();
                }
            });

            // Add global click handler to close active controls
            document.addEventListener('click', (e) => {
                if (state.activeControls && !state.activeControls.contains(e.target)) {
                    state.activeControls.style.display = 'none';
                    state.activeControls = null;
                }
            });
        }
    };
},
// // HZ Rule Divider line horizontal
    hzDivider: () => {
    const dividerWrapper = document.createElement('div');
    dividerWrapper.style.cssText = `
        width: 100%;
        padding: 6px 0;
        position: relative;
    `;

    const dividerContainer = document.createElement('div');
    dividerContainer.style.cssText = `
        width: 100%;
        min-height: 24px;
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
    `;

    // The actual divider line
    const line = document.createElement('div');
    line.style.cssText = `
        flex: 1;
        height: 2px;
        background-color: var(--transparent-blk);
        transition: all 0.3s ease;
    `;

    // Controls container
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: absolute;
        top: -32px;
        left: 50%;
        transform: translateX(-50%);
        display: none;
        gap: 8px;
        background: #f0f0f0;
        padding: 2px 4px;
        border-radius: 4px;
        border: 1px solid rgba(225,225,225,.6);
        z-index: 56100;
    `;

    // Style buttons
    const styleButtons = [
        { icon: 'minus', title: 'Solid' },
        { icon: 'ellipsis-h', title: 'Dotted' },
        { icon: 'grip-lines', title: 'Double' },
    ].map(({ icon, title }) => {
        const button = document.createElement('i');
        button.className = `fas fa-${icon}`;
        button.title = title;
        button.style.cssText = `
            padding: 6px;
            cursor: pointer;
            color: var(--secondary-color);
            transition: color 0.2s ease;
        `;
        button.addEventListener('mouseenter', () => {
            button.style.color = 'var(--primary-color)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.color = 'var(--secondary-color)';
        });
        return button;
    });

    // Thickness control
    const thicknessControl = document.createElement('input');
    thicknessControl.type = 'range';
    thicknessControl.min = '1';
    thicknessControl.max = '8';
    thicknessControl.value = '2';
    thicknessControl.style.cssText = `
        width: 160px;
        height: 14px;
        margin-left: 8px;
    `;

    // Style button click handlers
    styleButtons[0].addEventListener('click', () => { // Solid
        const currentThickness = thicknessControl.value;
        line.style.borderStyle = 'solid';
        line.style.background = 'var(--transparent-blk)';
        line.style.height = `${currentThickness}px`;
        line.style.border = 'none';
        dividerContainer.style.flexDirection = 'row';
    });

    styleButtons[1].addEventListener('click', () => { // Dotted
        const currentThickness = thicknessControl.value;
        line.style.borderStyle = 'dotted';
        line.style.background = 'none';
        line.style.height = '0';
        line.style.borderWidth = `${currentThickness}px 0 0 0`;
        line.style.borderColor = 'var(--transparent-blk)';
        dividerContainer.style.flexDirection = 'row';
    });

    styleButtons[2].addEventListener('click', () => { // Double
        const currentThickness = thicknessControl.value;
        line.style.borderStyle = 'double';
        line.style.background = 'none';
        line.style.height = '0';
        line.style.borderWidth = `${currentThickness}px 0 0 0`;
        line.style.borderColor = 'var(--transparent-blk)';
        dividerContainer.style.flexDirection = 'row';
    });

    thicknessControl.addEventListener('input', (e) => {
        const currentStyle = line.style.borderStyle;
        if (currentStyle === 'dotted' || currentStyle === 'double') {
            line.style.borderWidth = `${e.target.value}px 0 0 0`;
        } else {
            line.style.height = `${e.target.value}px`;
        }
    });

    // Add controls to a flex container
    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
    `;
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
        display: flex;
        gap: 8px;
    `;
    
    styleButtons.forEach(button => buttonsContainer.appendChild(button));
    controlsContainer.appendChild(buttonsContainer);
    controlsContainer.appendChild(thicknessControl);
    controls.appendChild(controlsContainer);

    // Show/hide controls on hover
    dividerWrapper.addEventListener('mouseenter', () => {
        controls.style.display = 'flex';
    });

    dividerWrapper.addEventListener('mouseleave', () => {
        controls.style.display = 'none';
    });

    // Assemble the component
    dividerContainer.appendChild(line);
    dividerWrapper.appendChild(controls);
    dividerWrapper.appendChild(dividerContainer);

    return dividerWrapper;
    },        
// // FOOTER
    footer: () => {
        const footer = document.createElement('footer');
        footer.innerHTML = `
            <div style="width: 100%; background-color: var(--primary-color); position: absolute; top: 0; right: 0; left: -10; bottom: -10; z-index: 1; padding: 0 10px; "></div>
            <div style="display: flex; justify-content: space-between; width: 100%; padding: 20px 0; z-index: 2; position: relative;">
                <div style="text-align: left;">
                    <div class="footer-image-container" style="margin-bottom: 10px;">
                        <div onclick="this.querySelector('input').click()" 
                            style="width: 60px; height: 60px; background: #f0f0f0; display: flex; justify-content: center; align-items: center; cursor: pointer; margin-bottom: 10px;">
                            <span style="color: #333;">Logo</span>
                            <input type="file" accept="image/*" onchange="handleFooterImageUpload(this)" style="display: none;">
                            <img style="display: none; max-width: 60px; height: auto;" class="footer-logo">
                        </div>
                    </div>
                    <div>
                    <h3 contenteditable style="margin: 0;">Brand</h3>
                    </div>
                </div>
                <div style="display: flex; gap: 22px; font-size: 14px; padding: 2px 8px;">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: inherit; text-decoration: none;">About Us</a></li>
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: inherit; text-decoration: none;">Contact</a></li>
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: inherit; text-decoration: none;">Careers</a></li>
                    </ul>
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: inherit; text-decoration: none;">Support</a></li>
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: inherit; text-decoration: none;">Privacy Policy</a></li>
                        <li contenteditable style="margin-bottom: 8px;"><a href="#" style="color: inherit; text-decoration: none;">Terms of Use</a></li>
                    </ul>
                </div>
            </div>
        `;

        const container = document.createElement('div');
        container.classList.add('socialFooter')
        container.style.cssText = 'display: flex; justify-content: center; gap: 40px; padding: 24px 0 68px 0; border-top: 1px solid var(--neutral-gray); z-index: 2; position: relative; z-index: 3; color: #333;';

        const icons = ['fab fa-yelp', 'fab fa-patreon', 'fas fa-envelope']; // Customize classes as needed

        icons.forEach(iconClass => {
            const iconWrapper = document.createElement('div');
            iconWrapper.style.cssText = 'flex-shrink: 0;';
            
            const iconElement = document.createElement('i');
            iconElement.className = iconClass;
            iconElement.style.cssText = 'font-size: 20px; cursor: pointer;';
            iconWrapper.appendChild(iconElement);
            
            iconElement.addEventListener('click', (e) => {
                e.preventDefault();
                showIconPicker(iconElement);
            });
            
            container.appendChild(iconWrapper);
        });
        footer.append(container);
        footer.style.cssText = 'width: 100%; color: var(--text-on-primary); padding: 20px 0; margin-bottom: -68px; position: relative;';
        return footer;
    },
        };    
    }
////////////////////////////////////////////
// // END COMPONENTS
//footer IMG
function handleFooterImageUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        const container = input.parentElement;
        const imgElement = container.querySelector('.footer-logo');
        const logoText = container.querySelector('span');
        
        reader.onload = function(e) {
            imgElement.src = e.target.result;
            imgElement.style.display = 'block';
            logoText.style.display = 'none';
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}
    
// Initialize the editor
    document.addEventListener('DOMContentLoaded', () => {
        window.editor = new MobileUIEditor();
    });

// Add TAB to sidebar data
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


