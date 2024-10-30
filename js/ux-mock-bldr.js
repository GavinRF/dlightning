//ux-mock-builder.js
///COMPONENTS AND MAIN FUNCTIONALITY

////// THE EDITOR  //////////////////////
class MobileUIEditor {
    modalAdded = false;

    constructor() {
        this.state = {
            canvasCount: 1,
            selectedCanvases: new Set(),
            navbarStates: new Map()
        };
        
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
        this.setupDownloadButton(); //html2canvas
    }

    initializeFirstCanvas() {
        const firstCanvas = document.querySelector('.canvas');
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

    const variation = getVariation(componentType);

    const canvases = this.state.selectedCanvases.size > 0 ?
        Array.from(this.state.selectedCanvases) :
        document.querySelectorAll('.canvas');

    // Check if special components already exist
    if (['navbar', 'bottomNav', 'modal'].includes(componentType)) {
        const hasComponent = Array.from(canvases).some(canvas => {
            return canvas.querySelector(
                componentType === 'navbar' ? '.navbar' :
                componentType === 'bottomNav' ? 'nav:not(.navbar)' :
                '.modal'
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
                    this.modalAdded = true;
                } else {
                    const existingModal = canvas.querySelector('.modal-wrapper');
                    if (existingModal) {
                        existingModal.remove();
                        this.modalAdded = false;
                    }
                }
                break;

            case 'avatar':
                const avatarType = document.getElementById('avatar-type').value;
                component = this.components.avatar?.(avatarType);
                if (component) {
                    wrappedComponent = this.wrapComponentInContainer(component, `avatar-${avatarType}`);
                    canvasContent = canvas.querySelector('.canvas-content');
                    if (canvasContent) canvasContent.appendChild(wrappedComponent);
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
                    if (canvasContent) canvasContent.appendChild(wrappedComponent);
                } else {
                    console.error(`Unsupported image layout type: ${layoutType}`);
                }
                break;
        
            case 'button':
                const buttonType = getVariation('button');
                component = this.components.button?.(buttonType);
                if (!component) {
                    console.error(`Unsupported button type: ${buttonType}`);
                    return;
                }
                wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${buttonType}`);
                canvasContent = canvas.querySelector('.canvas-content');
                if (canvasContent) {
                    canvasContent.appendChild(wrappedComponent);
                }
                break;
        
            case 'heading':
                const headingLevel = getVariation('heading');
                component = this.components.heading?.(headingLevel);
                if (!component) {
                    console.error(`Unsupported heading level: ${headingLevel}`);
                    return;
                }
                wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${headingLevel}`);
                canvasContent = canvas.querySelector('.canvas-content');
                if (canvasContent) {
                    canvasContent.appendChild(wrappedComponent);
                }
                break;
        
            case 'input':
                const inputType = getVariation('input');
                component = this.components.input?.(inputType);
                if (!component) {
                    console.error(`Unsupported input type: ${inputType}`);
                    return;
                }
                wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${inputType}`);
                canvasContent = canvas.querySelector('.canvas-content');
                if (canvasContent) {
                    canvasContent.appendChild(wrappedComponent);
                }
                break;
        
            case 'textarea':
                const textareaType = getVariation('textarea');
                component = this.components.textarea?.(textareaType);
                if (!component) {
                    console.error(`Unsupported textarea type: ${textareaType}`);
                    return;
                }
                wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${textareaType}`);
                canvasContent = canvas.querySelector('.canvas-content');
                if (canvasContent) {
                    canvasContent.appendChild(wrappedComponent);
                }
                break;
        
            case 'tabs':
                const tabsCount = getVariation('tabs');
                component = this.components.tabs?.(parseInt(tabsCount, 10));
                if (!component) {
                    console.error(`Unsupported tabs count: ${tabsCount}`);
                    return;
                }
                wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${tabsCount}`);
                canvasContent = canvas.querySelector('.canvas-content');
                if (canvasContent) {
                    canvasContent.appendChild(wrappedComponent);
                }
                break;
        
            case 'alert':
                const alertColor = getVariation('alert');
                component = this.components.alert?.(alertColor);
                if (!component) {
                    console.error(`Unsupported alert color: ${alertColor}`);
                    return;
                }
                wrappedComponent = this.wrapComponentInContainer(component, `${componentType}-${alertColor}`);
                canvasContent = canvas.querySelector('.canvas-content');
                if (canvasContent) {
                    canvasContent.appendChild(wrappedComponent);
                }
                break;
            
            case 'graph':
                component = this.components.graph?.(variation);
                if (!component) {
                    console.error(`Unsupported graph type: ${variation}`);
                    return;
                }
                const wrappedGraph = this.wrapComponentInContainer(component, `${componentType}-${variation}`);
                const graphContent = canvas.querySelector('.canvas-content');
                if (graphContent) {
                    graphContent.appendChild(wrappedGraph);
                }
                break;

            case 'chatInput':
                component = this.components.chatInput?.(variation);
                if (!component) {
                    console.error(`Unsupported chat input type: ${variation}`);
                    return;
                }
                wrappedComponent = this.wrapComponentInContainer(component, `chatInput-${variation}`);
                canvasContent = canvas.querySelector('.canvas-content');
                if (canvasContent) {
                    canvasContent.appendChild(wrappedComponent);
                }
                break;


            default:
                component = this.components[componentType]?.();
                if (!component) {
                    console.error(`Unsupported component type: ${componentType}`);
                    return;
                }
                wrappedComponent = this.wrapComponentInContainer(component, componentType); // Removed const here
                canvasContent = canvas.querySelector('.canvas-content');
                if (canvasContent) {
                    canvasContent.appendChild(wrappedComponent);
                }
                break;
        }
        // scroll newly added component into view
        if (!['navbar', 'bottomNav', 'modal'].includes(componentType)) {
            const phoneScrollCon = canvas.querySelector('.phoneScrollCon');
            if (phoneScrollCon) {
                phoneScrollCon.scrollTop = phoneScrollCon.scrollHeight;
            }
        }

    });
}


wrapComponentInContainer(component, componentType) {
        
    const container = document.createElement('div');
    container.className = 'component-container';
    
    container.innerHTML = `
        <div class="component-handle">⋮</div>
        <div class="component-content"></div>
        <button class="delete-btn">×</button>
        <button class="duplicate-btn">+</button>
    `;
    
    container.querySelector('.component-content').appendChild(component);
    
    // Setup event listeners
    container.querySelector('.delete-btn').addEventListener('click', () => container.remove());
    container.querySelector('.duplicate-btn').addEventListener('click', () => {
        const duplicate = component.cloneNode(true);
        const wrappedDuplicate = this.wrapComponentInContainer(duplicate, componentType);
        container.parentNode.insertBefore(wrappedDuplicate, container.nextSibling);
    });
    
    return container;
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


/// Inserting and Removing Navbar
    insertNavbar(canvas, navbar, position) {
        const canvasContent = canvas.querySelector('.canvas-content');
        
        if (position === 'top') {
            canvas.insertBefore(navbar.cloneNode(true), canvas.firstChild);
            canvasContent.style.paddingTop = '88px';
            navbar.style.position = 'absolute';
            navbar.style.left = '0';
            navbar.style.top = '24px';
        } else if (position === 'bottom') {
            canvas.appendChild(navbar.cloneNode(true));
            navbar.style.position = 'absolute';
            navbar.style.left = '0';
            navbar.style.bottom = '0';
        }
    }

    removeComponent(componentType, canvases) {
        canvases.forEach((canvas) => {
            const canvasContent = canvas.querySelector('.canvas-content');
            
            switch (componentType) {
                case 'navbar':
                    const topNavbar = canvas.querySelector('.navbar');
                    if (topNavbar) {
                        topNavbar.remove();
                        canvasContent.style.paddingTop = '32px';
                    }
                    break;
                    
                case 'bottomNav':
                    const bottomNavbar = canvas.querySelector('nav:not(.navbar)');
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
            }
        });
    }

//////// ADD NEW CANVAS
    createNewCanvas() {
        this.state.canvasCount++;
        
        const canvasWrapper = document.createElement('div');
        canvasWrapper.className = 'canvas-wrapper';
        
        // Create a unique ID for the new canvas
        const canvasId = `canvas-${this.state.canvasCount}`;
        
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
                        <i style="font-size: 14px;" class="fa-solid fa-battery-three-quarters"></i>
                    </div>
                    <div style="width: 100%; height: 28px; background-color: rgba(51, 51, 51, 0.48); z-index: -1; position: absolute; top: 0; left: 0;"></div>
                </div>
                <div class="phoneScrollCon">
                    <div class="canvas-content"></div>
                </div>
            </div>
        `;
        
        // Insert before the add button
        const addButton = document.querySelector('.add-canvas-btn');
        if (addButton && addButton.parentElement) {
            addButton.parentElement.insertBefore(canvasWrapper, addButton);
        } else {
            document.querySelector('.canvas-container').appendChild(canvasWrapper);
        }
        
        const newCanvas = canvasWrapper.querySelector('.canvas');
        newCanvas.addEventListener('click', (e) => this.handleCanvasSelection(e));
        
        // Initialize sortable on the new canvas content
        const newContent = newCanvas.querySelector('.canvas-content');
        if (newContent) {
                new Sortable(newContent, {
                    animation: 150,
                    handle: '.component-handle',
                    ghostClass: 'sortable-ghost',
                    group: 'shared-components'
                });
            
        }
        
        this.updateCanvasNumbers();
    }

    handleCanvasDelete(e) {
        const wrapper = e.target.closest('.canvas-wrapper');
        if (!wrapper) return;

        const canvas = wrapper.querySelector('.canvas');
        const isFirstCanvas = !wrapper.previousElementSibling?.classList.contains('canvas-wrapper');
        
        if (isFirstCanvas) {
            alert('Cannot delete the first canvas');
            return;
        }

        if (document.querySelectorAll('.canvas-wrapper').length <= 1) {
            alert('Cannot delete the last canvas');
            return;
        }

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
// Toggle Nav on/off canvas
        toggleNavbar(canvas, position) {
            const key = `${canvas.id}-${position}`;
            const hasNavbar = this.state.navbarStates.get(key);
    
            if (hasNavbar) {
                this.removeNavbar(canvas, position);
                this.state.navbarStates.set(key, false);
            } else {
                const navbar = this.components[position === 'top' ? 'navbar' : 'bottomNav']();
                this.insertNavbar(canvas, navbar, position);
                this.state.navbarStates.set(key, true);
            }
        }
    
        insertNavbar(canvas, navbar, position) {
            const canvasContent = canvas.querySelector('.canvas-content');
            
            if (position === 'top') {
                canvas.insertBefore(navbar, canvas.firstChild);
                canvasContent.style.paddingTop = '84px';
                navbar.style.cssText = 'position: absolute; left: 0; right: 0; top: 24px;';
            } else {
                canvas.appendChild(navbar);
                navbar.style.cssText = 'position: absolute; left: 0; right: 0; bottom: 0;';
            }
        }
    
        removeNavbar(canvas, position) {
            const selector = position === 'top' ? '.navbar' : 'nav:not(.navbar)';
            const navbar = canvas.querySelector(selector);
            if (navbar) {
                navbar.remove();
                if (position === 'top') {
                    canvas.querySelector('.canvas-content').style.paddingTop = '0';
                }
            }
        }
    
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

// DOWNLOAD MULTIPLE SELECTED SCREENS
setupDownloadButton() {
    document.getElementById('download-btn').addEventListener('click', () => this.captureScreenshot());
}
captureScreenshot() {
    let counter = 1;

    this.state.selectedCanvases.forEach((canvas) => {
        html2canvas(canvas).then((renderedCanvas) => {
            const link = document.createElement('a');
            const filename = this.state.selectedCanvases.size > 1 
                ? `android-mockup-${counter}.png` 
                : 'android-mockup.png';

            link.download = filename;
            link.href = renderedCanvas.toDataURL();
            link.click();
            counter++;
        });
    });
}

// captureScreenshot() {
//         // var self = this;
//         document.getElementById('download-btn').addEventListener('click', function() {
//             let counter = 1;
//             const isSelected = this.state.selectedCanvases.has(canvas);
//             isSelected.forEach((canvas) => {
//                 html2canvas(canvas).then(function(renderedCanvas) {
//                     const link = document.createElement('a');
//                     const filename = isSelected.selectedCanvases.length > 1 ? 
//                         `android-mockup-${counter}.png` : 
//                         'android-mockup.png';
//                     link.download = filename;
//                     link.href = renderedCanvas.toDataURL();
//                     link.click();
//                     counter++;
//                 });
//             });
//         });
//     }

/////////////////////////
// Component definitions ////////////////////////////
/////////////////////////
        components = {
            button: (type = 'default') => {
                const container = document.createElement('div');
                container.style.cssText = 'width: 100%; display: flex; justify-content: space-between;';
                const createButton = (text, isGhost = false, isDisabled = false) => {
                    const button = document.createElement('button');
                    button.textContent = text;
                    button.style.cssText = `
                        height: 48px;
                        background-color: ${isGhost ? 'transparent' : 'var(--primary-color)'};
                        color: ${isGhost ? 'var(--primary-color)' : 'white'};
                        border: ${isGhost ? '2px solid var(--primary-color)' : 'none'};
                        border-radius: 24px;
                        font-weight: bold;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                        box-shadow: ${isGhost ? 'none' : '0 2px 5px rgba(0,0,0,0.1)'};
                        transition: all 0.3s;
                        flex: 1;
                        margin: 0 5px;
                    `;
                    if (isDisabled) {
                        button.style.opacity = '0.5';
                        // button.style.cursor = 'not-allowed';
                    }

                    this.makeTextEditable(button);
                    return button;
                };
                
                switch (type) {
                    case 'ghost':
                        container.appendChild(createButton('Ghost Button', true));
                        break;
                    case 'two-buttons':
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
    
                const input = document.createElement('input');
                input.placeholder = type === 'search' ? 'Search...' : 'Input Field';
                input.style.cssText = `
                    width: 100%;
                    height: 42px;
                    border: none;
                    border-bottom: 2px solid var(--primary-color);
                    border-radius: ${type === 'search' ? '24px' : '0'};
                    padding: ${type === 'search' ? '0 45px' : '0 10px'};
                    font-size: 16px;
                    transition: border-color 0.3s, background-color 0.3s;
                    outline: none;
                    ${type === 'search' ? 'background: #f5f5f5;' : ''}
                `;
    
                container.appendChild(input);
    
                if (type === 'search') {
                    const container = document.createElement('div');
                    container.style.cssText = 'position: relative; width: 100%;';
                    
                    const searchIcon = document.createElement('i');
                    searchIcon.className = 'fas fa-search';
                    searchIcon.style.cssText = `
                        position: absolute;
                        left: 15px;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #666;
                    `;
                    
                    container.appendChild(searchIcon);
                    container.appendChild(input);
                    return container;
                }
    
                switch (type) {
                    case 'focused':
                        input.style.borderColor = 'var(--primary-color)';
                        input.style.boxShadow = '0 1px 0 0 var(--primary-color)';
                        break;
                    case 'password':
                        input.style.borderColor = 'var(--secondary-color)';
                        input.style.boxShadow = '0 1px 0 0 var(--primary-color)';
                        checkbox.type = 'password';
                        break;
                    case 'error':
                        input.style.borderColor = 'var(--error-danger-delete)';
                        input.style.color = 'var(--error-danger-delete)';
                        
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
                        this.makeTextEditable(errorMsg);
                        container.appendChild(errorMsg);
                        break;
                    case 'disabled':
                        input.disabled = true;
                        input.style.backgroundColor = '#f0f0f0';
                        input.style.color = '#999';
                        break;
                }
                return container;
            },
    // TEXT AREA ////////////////////
            textarea: (type = 'default') => {
                const container = document.createElement('div');
                container.style.cssText = 'width: 100%;';
    
                const textarea = document.createElement('textarea');
                textarea.placeholder = 'Enter your text here...';
                textarea.style.cssText = `
                    width: 100%;
                    min-height: 80px;
                    border: none;
                    border-bottom: 2px solid var(--primary-color);
                    border-radius: 0;
                    padding: 10px;
                    font-size: 16px;
                    font-family: var(--primary-font), sans-serif;
                    transition: border-color 0.3s, background-color 0.3s;
                    outline: none;
                    resize: vertical;
                `;
    
                container.appendChild(textarea);
    
                switch (type) {
                    case 'focused':
                        textarea.style.borderColor = 'var(--primary-color)';
                        textarea.style.boxShadow = '0 1px 0 0 var(--primary-color)';
                        break;
                    case 'error':
                        textarea.style.borderColor = 'var(--error-danger-delete)';
                        textarea.style.color = 'var(--error-danger-delete)';
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
                        this.makeTextEditable(errorMsg);
                        container.appendChild(errorMsg);
                        break;
                    case 'disabled':
                        textarea.disabled = true;
                        textarea.style.backgroundColor = '#f0f0f0';
                        textarea.style.color = '#999';
                        break;
                }
    
                return container;
            },
    // CHECKBOX ////////////////////
            checkbox: () => {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                const chekLabl = document.createElement('span');
                chekLabl.textContent = "double click to edit";
                checkbox.type = 'checkbox';
                label.appendChild(checkbox);
                label.appendChild(chekLabl);
                this.makeTextEditable(chekLabl);
                label.style.cssText = 'display: flex; align-items: center; font-size: 16px; color: #333; width: 100%; justify-content: flex-start;';
                label.className = 'checkbox';
                checkbox.style.cssText = 'margin-right: 10px; width: 20px; height: 20px; accent-color: var(--primary-color);';
                return label;
            },
    // RADIO ////////////////////
            radio: () => {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'display: flex; align-items: center; width: 100%;';
            
                const label = document.createElement('label');
                const radio = document.createElement('input');
                radio.type = 'radio';
                label.appendChild(radio);
                label.style.cssText = 'display: flex; align-items: center; font-size: 16px; color: #333; justify-content: flex-start;';
            
                radio.style.cssText = 'margin-right: 10px; width: 20px; height: 20px; accent-color: var(--primary-color);';
            
                const radLabl = document.createElement('span');
                radLabl.textContent = "click to edit";
                radLabl.style.cssText = 'font-size: 16px; color: #333;';
                this.makeTextEditable(radLabl);
            
                wrapper.appendChild(label);  
                wrapper.appendChild(radLabl); // Append editable text outside of the label
            
                return wrapper;
            },
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
    // ICON ////////////////////
            icon: () => {
                const iconContainer = document.createElement('div');
                iconContainer.style.cssText = 'width: 100%; text-align: center; padding: 10px; position: relative;';
                
                const iconElement = document.createElement('i');
                iconElement.className = 'fas fa-star';
                iconElement.style.cssText = 'font-size: 24px; color: var(--primary-color); cursor: pointer;';
                
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
                    padding: 3px 0 3px 0;
                    border: 1px solid #ddd;
                    border-radius: 2px;
                    display: none;
                    font-size: 12px;
                    text-align: center;
                    z-index: 445;
                `;
    
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
                
                iconContainer.appendChild(sizeControl);
                iconContainer.appendChild(leftArrow);
                iconContainer.appendChild(iconElement);
                iconContainer.appendChild(rightArrow);
                
                return iconContainer;
            },
    // CARD ////////////////////
            card: () => {
                const card = document.createElement('div');
                card.innerHTML = `
                    <div class="card-image" style="width: 100%; height: 120px; background-color: var(--neutral-gray); border-radius: 10px 10px 0 0; display: flex; justify-content: center; align-items: center; cursor: pointer;">
                        <span class="non-editable">Click to add image</span>
                    </div>
                    <div style="padding: 8px;">
                        <div>
                        <h3 style="margin: 8px 0; font-size: 18px; color: #2c3e50;">Card Title</h3>
                        </div>
                        <div>
                        <p style="margin: 0 0 8px 0; color: #7f8c8d;">Card content goes here. This is a brief description.</p>
                        </div>
                    </div>
                `;
                card.style.cssText = 'width: 100%; border-radius: 10px; padding: 0; background-color: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;';

                this.makeTextEditable(card.querySelector('h3'));
                this.makeTextEditable(card.querySelector('p'));
                
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
            adjustableSpace: () => {
            // Create the main space container
            const spaceContainer = document.createElement('div');
            spaceContainer.className = 'blankSpace';
            spaceContainer.style.height = '50px'; // Initial height
    
            // Create a display to show the current height
            const heightDisplay = document.createElement('input');
            heightDisplay.type = 'number';
            heightDisplay.className = 'height-display';
            heightDisplay.value = '50'; // Default display
            heightDisplay.style.fontSize = '16px';
            spaceContainer.appendChild(heightDisplay);
    
            // Create the slider input for height adjustment
            const heightSlider = document.createElement('input');
            heightSlider.className = 'space-range';
            heightSlider.type = 'range';
            heightSlider.min = '12'; // Minimum height of 12px
            heightSlider.max = '300'; // Maximum height of 300px
            heightSlider.value = '50'; // Initial value
            heightSlider.style.width = '100%';
            spaceContainer.appendChild(heightSlider);
    
            // Update the height of the space based on the slider value
            heightSlider.addEventListener('input', () => {
                const newHeight = heightSlider.value;
                spaceContainer.style.height = `${newHeight}px`; // Update the height of the container
                heightDisplay.value = `${newHeight}`; // Update the display text
            });
    
            // Update the height of the space based on the input text value
            heightDisplay.addEventListener('change', () => {
                const newHeight2 = heightDisplay.value;
                console.log(newHeight2);
                spaceContainer.style.height = `${newHeight2}px`; // Update the height of the container
                heightSlider.value = `${newHeight2}`;
            });
    
            return spaceContainer; // Return the built component
        },
    // IMAGE ////////////////////
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
    // NAVBAR ////////////////////
            navbar: () => {
                const navbar = document.createElement('nav');
                navbar.className = 'navbar top-navbar';
                navbar.innerHTML = `
                    <span style="font-size: 20px; font-weight: bold; color: --primary;">Brand</span>
                    <div style="display: flex; align-items: center;">
                        <a href="#" style="margin-left: 20px; color: #2c3e50; text-decoration: none;">Home</a>
                        <a href="#" style="margin-left: 20px; color: #2c3e50; text-decoration: none;">About</a>
                        <a href="#" style="margin-left: 20px; color: #2c3e50; text-decoration: none;">Contact</a>
                    </div>
                `;
                
                navbar.querySelectorAll('span, a').forEach(el => this.makeTextEditable(el));
                return navbar;
            },
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
            toggleSwitch: () => {
                const container = document.createElement('div');
                container.style.cssText = 'display: flex; align-items: center; width: 100%;';
                
                const offLabel = document.createElement('span');
                offLabel.textContent = 'Off';
                offLabel.style.cssText = 'margin-right: 10px; cursor: pointer;';
                this.makeTextEditable(offLabel);
    
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
                this.makeTextEditable(onLabel);
    
                container.appendChild(offLabel);
                container.appendChild(label);
                container.appendChild(onLabel);
    
                return container;
            },
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
                percentage.style.cssText = 'margin-top: 5px; font-weight: bold; color: #2c3e50;';
    
                progress.appendChild(bar);
                container.appendChild(progress);
                container.appendChild(percentage);
    
                return container;
            },
            avatar: (type = 'default') => {
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
    
                switch(type) {
                    case 'small-text':
                        const smallAvatar = document.createElement('div');
                        smallAvatar.innerHTML = 'A';
                        smallAvatar.style.cssText = 'width: 32px; height: 32px; background-color: var(--primary-color); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; font-size: 14px;';
                        makeTextEditable(smallAvatar);
                        
                        const username = document.createElement('span');
                        username.textContent = 'Displayname';
                        username.style.cssText = 'color: #333; font-weight: 500;';
                        makeTextEditable(username);
                        
                        avatarContainer.appendChild(smallAvatar);
                        avatarContainer.appendChild(username);
                        // this.makeTextEditable(smallAvatar);
                        break;
    
                    case 'upload':
                        const imageAvatar = document.createElement('div');
                        imageAvatar.style.cssText = 'width: 50px; height: 50px; background-color: #ecf0f1; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; overflow: hidden; position: relative;';
                        imageAvatar.innerHTML = '<i class="fas fa-camera"></i>';
                        
                        const uploadInput = document.createElement('input');
                        uploadInput.type = 'file';
                        uploadInput.accept = 'image/*';
                        uploadInput.style.cssText = 'position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer;';
                        
                        const uploadUsername = document.createElement('span');
                        uploadUsername.textContent = 'Displayname';
                        uploadUsername.style.cssText = 'color: #333; font-weight: 500; margin-left: 10px;';
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
            tabs: (count = 3) => {
                const tabs = document.createElement('div');
                tabs.style.cssText = 'display: flex; width: 100%;';
                
                for (let i = 1; i <= count; i++) {
                    const tab = document.createElement('button');
                    tab.textContent = `Tab ${i}`;
                    tab.style.cssText = `
                        background-color: ${i === 1 ? 'var(--primary-color)' : '#ecf0f1'};
                        color: ${i === 1 ? 'white' : 'black'};
                        border: none;
                        margin-right: 1px;
                        padding: 10px 20px;
                        cursor: pointer;
                        flex: 1;
                    `;
                    this.makeTextEditable(tab);
                    tabs.appendChild(tab);
                }
                
                return tabs;
            },
            accordion: () => {
                const accordion = document.createElement('div');
                accordion.style.cssText = 'width: 100%; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
                
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
                        <span>Section 1</span>
                        <i class="fas fa-chevron-down" style="transition: transform 0.3s ease;"></i>
                    </button>
                    <div class="accordion-content" style="
                        padding: 0 18px;
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.3s ease-out;
                        background-color: white;">
                        <div style="padding: 18px 0;">
                            <p style="margin: 0; color: #666;">Content for section 1</p>
                        </div>
                    </div>
                `;
    
                const button = accordion.querySelector('.accordion-header');
                const content = accordion.querySelector('.accordion-content');
                const chevron = accordion.querySelector('.fa-chevron-down');
                
                button.addEventListener('click', () => {
                    const isExpanded = content.style.maxHeight !== '0px' && content.style.maxHeight !== '';
                    
                    if (!isExpanded) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        chevron.style.transform = 'rotate(180deg)';
                    } else {
                        content.style.maxHeight = '0';
                        chevron.style.transform = 'rotate(0)';
                    }
                });
    
                return accordion;
            },
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
                this.makeTextEditable(aText);
                const closeIcon = document.createElement('i');
                closeIcon.className = 'fas fa-close';
                alert.appendChild(closeIcon);
                alert.style.cssText = `padding: 18px; background-color: ${alertColors[color]}; color: white; margin-bottom: 8px; width: 100%; display: flex; justify-content: space-between`;
                return alert;
            },
            slider: () => {
                const container = document.createElement('div');
                container.style.cssText = 'width: 100%; padding: 10px 0; display: flex; align-items: center;';
    
                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '0';
                slider.max = '100';
                slider.value = '50';
                slider.className = 'custom-slider';
                slider.style.flex = '1';
    
                const valueDisplay = document.createElement('span');
                valueDisplay.style.cssText = 'margin-left: 10px; font-weight: bold; min-width: 30px; text-align: right;';
                valueDisplay.textContent = '50';
    
                container.appendChild(slider);
                container.appendChild(valueDisplay);
    
                slider.addEventListener('input', () => {
                    valueDisplay.textContent = slider.value;
                });
    
                return container;
            },
            datePicker: () => {
                const datePicker = document.createElement('input');
                datePicker.type = 'date';
                datePicker.style.cssText = 'width: 100%; padding: 10px; border: 1px solid var(--primary-color); border-radius: 5px;';
                return datePicker;
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
    
                container.appendChild(fileInput);
                container.appendChild(label);
    
                return container;
            },
            bottomNav: () => {
                const bottomNav = document.createElement('nav');
                bottomNav.className = 'bottomNav bottom-navbar max-items';
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
            
                // Add event handlers for delete buttons
                bottomNav.querySelectorAll('.nav-delete-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        if (bottomNav.querySelectorAll('.nav-item-container').length > 1) {
                            this.closest('.nav-item-container').remove();
                            updateAddButtonVisibility(bottomNav);
                        }
                    });
                });
            
                // First get the reference to addButton from bottomNav
                const addButton = bottomNav.querySelector('.nav-add-btn');
                
                // Then add the event listener using arrow function
                addButton.addEventListener('click', () => {
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
                        this.makeTextEditable(newItem.querySelector('span'));
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
                bottomNav.querySelectorAll('span').forEach(span => this.makeTextEditable(span));
            
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
            heading: (level = 'h1') => {
                const wrapper = document.createElement('div');
                wrapper.className = 'component-wrapper';
                wrapper.style.cssText = 'width: 100%;';
                
                const alignCon = document.createElement('div');
                const heading = document.createElement(level);
                heading.textContent = `${level.toUpperCase()} Heading`;
                heading.style.cssText = 'color: #2c3e50; margin: 10px 0;';
                this.makeTextEditable(heading);
                alignCon.appendChild(heading);
                wrapper.appendChild(alignCon);
                
                return wrapper;
            },
            paragraph: () => {
                const wrapper = document.createElement('div');
                wrapper.className = 'component-wrapper';
                wrapper.style.cssText = 'width: 100%;';
            
                const alignCon = document.createElement('div');
                const p = document.createElement('p');
                p.textContent = 'This is a paragraph. Click to edit.';
                p.style.cssText = 'color: #333; line-height: 1.6; margin-bottom: 15px;';
                this.makeTextEditable(p);
                alignCon.appendChild(p)
                wrapper.appendChild(alignCon);
            
                return wrapper;
            },
            
            blockquote: () => {
                const wrapper = document.createElement('div');
                wrapper.className = 'component-wrapper';
                wrapper.style.cssText = 'width: 100%;';
            
                const alignCon = document.createElement('div');
                const blockquote = document.createElement('blockquote');
                blockquote.textContent = 'This is a block-quote. Click to edit.';
                blockquote.style.cssText = 'color: #555; font-style: italic; border-left: 5px solid var(--primary-color); padding-left: 18px; margin: 12px 0;';
                this.makeTextEditable(blockquote);
                alignCon.appendChild(blockquote)
                wrapper.appendChild(alignCon);
                
                return wrapper;
            },
            label: () => {
                const label = document.createElement('label');
                label.textContent = 'Label Text';
                label.style.cssText = `
                    display: block;
                    color: #2c3e50;
                    font-weight: 500;
                    margin-top: 8px;
                    font-size: 14px;
                    width: 100%;
                    `
                ;
                this.makeTextEditable(label);
                return label;
            },
            graph: (type = 'bar') => {
                const container = document.createElement('div');
                container.style.cssText = 'width: 100%; height: 300px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); position: relative;';
                
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
                const container = document.createElement('div');
                container.style.cssText = 'width: 100%; display: flex; align-items: flex-start; gap: 10px; margin-bottom: 16px;';
                
                const avatar = document.createElement('div');
                avatar.innerHTML = 'AV';
                avatar.style.cssText = 'width: 40px; height: 40px; background-color: var(--primary-color); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; flex-shrink: 0;';
                this.makeTextEditable(avatar);
                
                const contentWrapper = document.createElement('div');
                contentWrapper.style.cssText = 'flex-grow: 1;';
                
                const bubble = document.createElement('div');
                bubble.innerHTML = `
                    <div class="chat-content">Click to edit this message</div>
                    <div class="chat-image-container" style="display: none; cursor: pointer;">
                        <img style="max-width: 200px; max-height: 200px; border-radius: 12px; display: none;" alt="Chat image">
                        <div class="image-placeholder" style="display: none; align-items: center; justify-content: center; color: #666; padding: 8px;">
                            <i class="fas fa-image" style="margin-right: 8px;"></i> Add Image
                        </div>
                    </div>
                `;
                bubble.style.cssText = 'background-color: var(--neutral-gray); padding: 12px; border-radius: 18px; border-top-left-radius: 4px; max-width: 80%; display: inline-block; word-wrap: break-word;';
                
                const timestamp = document.createElement('div');
                timestamp.textContent = '1 minute ago';
                timestamp.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
                
                this.makeTextEditable(bubble.querySelector('.chat-content'));
                this.makeTextEditable(timestamp);
                
                const showImage = bubble.querySelector('.chat-image-container');
                container.addEventListener('mouseenter', () => showImage.style.display = 'flex');
    
                // Add click handler for image container
                const imageContainer = bubble.querySelector('.chat-image-container');
                const img = imageContainer.querySelector('img');
                const placeholder = imageContainer.querySelector('.image-placeholder');
                
                imageContainer.style.display = 'block';
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
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                    input.click();
                });
                
                contentWrapper.appendChild(bubble);
                contentWrapper.appendChild(timestamp);
                container.appendChild(avatar);
                container.appendChild(contentWrapper);
                
                return container;
            },
            rightChat: () => {
                const container = document.createElement('div');
                container.style.cssText = 'width: 100%; display: flex; flex-direction: row-reverse; align-items: flex-start; gap: 10px; margin-bottom: 16px;';
                
                const avatar = document.createElement('div');
                avatar.innerHTML = 'ME';
                avatar.style.cssText = 'width: 40px; height: 40px; background-color: var(--primary-color); color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; flex-shrink: 0;';
                this.makeTextEditable(avatar);
                
                const contentWrapper = document.createElement('div');
                contentWrapper.style.cssText = 'flex-grow: 1; display: flex; flex-direction: column; align-items: flex-end;';
                
                const bubble = document.createElement('div');
                bubble.innerHTML = `
                    <div class="chat-content">Click to edit this message</div>
                    <div class="chat-image-container" style="display: none; cursor: pointer;">
                        <img style="max-width: 240px; max-height: 180px; border-radius: 12px; display: none;" alt="Chat image">
                        <div class="image-placeholder" style="display: none; align-items: center; justify-content: center; color: #fff; padding: 8px;">
                            <i class="fas fa-image" style="margin-right: 8px;"></i> Add Image
                        </div>
                    </div>
                `;
                bubble.style.cssText = 'background-color: var(--primary-color); color: white; padding: 12px; border-radius: 18px; border-top-right-radius: 4px; max-width: 80%; display: inline-block; word-wrap: break-word;';
                
                const timestamp = document.createElement('div');
                timestamp.textContent = '1 minute ago';
                timestamp.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
                
                this.makeTextEditable(bubble.querySelector('.chat-content'));
                this.makeTextEditable(timestamp);
    
                // Add click handler for image container
                const imageContainer = bubble.querySelector('.chat-image-container');
                const img = imageContainer.querySelector('img');
                const placeholder = imageContainer.querySelector('.image-placeholder');
                
                imageContainer.style.display = 'block';
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
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                    input.click();
                });
                
                contentWrapper.appendChild(bubble);
                contentWrapper.appendChild(timestamp);
                container.appendChild(avatar);
                container.appendChild(contentWrapper);
                
                return container;
            },
            chatInput: (type = 'basic') => {
                const container = document.createElement('div');
                container.style.cssText = 'width: 100%; display: flex; gap: 8px; padding: 8px; background-color: var(--neutral-gray); border-radius: 24px; align-items: center;';
                
                if (type === 'with-emoji' || type === 'full') {
                    const emojiBtn = document.createElement('button');
                    emojiBtn.innerHTML = '<i class="far fa-smile"></i>';
                    emojiBtn.style.cssText = 'background: none; border: none; color: #666; padding: 8px; cursor: pointer; font-size: 20px;';
                    container.appendChild(emojiBtn);
                }
                
                if (type === 'with-image' || type === 'full') {
                    const imageBtn = document.createElement('button');
                    imageBtn.innerHTML = '<i class="far fa-image"></i>';
                    imageBtn.style.cssText = 'background: none; border: none; color: #666; padding: 8px; cursor: pointer; font-size: 20px;';
                    container.appendChild(imageBtn);
                }
                
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = 'Type a message...';
                input.style.cssText = 'flex: 1; border: none; background: none; padding: 8px; font-size: 14px; outline: none;';
                container.appendChild(input);
                
                const sendBtn = document.createElement('button');
                sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
                sendBtn.style.cssText = 'background-color: var(--primary-color); border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;';
                container.appendChild(sendBtn);
                
                return container;
            },
// Notification Banner with Icon and Action Button
    notificationBanner: () => {
        const container = document.createElement('div');
        container.style.cssText = 'width: 100%; background-color: var(--neutral-gray); border-left: 4px solid var(--primary-color); padding: 12px 8px; margin: 16px 0; display: flex; align-items: center; gap: 12px; border-radius: 4px;';
        
        const icon = document.createElement('div');
        icon.style.cssText = 'flex-shrink: 0;';
        const iconElement = document.createElement('i');
        iconElement.className = 'fas fa-bell';
        iconElement.style.cssText = 'font-size: 20px; color: var(--primary-color); cursor: pointer;';
        icon.appendChild(iconElement);
    
        iconElement.addEventListener('click', (e) => {
            e.preventDefault();
            showIconPicker(iconElement);
        });
        
        const content = document.createElement('div');
        content.style.cssText = 'flex-grow: 1;';
        
        const message = document.createElement('div');
        message.textContent = 'Click to edit this important notification message';
        message.style.cssText = 'margin-bottom: 4px; font-weight: 500;';
        this.makeTextEditable(message);
        
        const subtext = document.createElement('div');
        subtext.textContent = 'Additional details or instructions can go here';
        subtext.style.cssText = 'font-size: 14px; color: #666;';
        this.makeTextEditable(subtext);
        
        const button = document.createElement('button');
        button.textContent = 'Action';
        button.style.cssText = 'background-color: var(--primary-color); color: white; border: none; padding: 8px 8px; border-radius: 4px; cursor: pointer; flex-shrink: 0; font-weight: 500;';
        this.makeTextEditable(button);
        
        content.appendChild(message);
        content.appendChild(subtext);
        container.appendChild(icon);
        container.appendChild(content);
        container.appendChild(button);
        return container;
    },
    // Progress Tracker  /////////
    progressTracker: () => {
        const container = document.createElement('div');
        container.style.cssText = 'width: 100%; padding: 16px 0; display: flex; justify-content: space-around; align-items: center; gap: 4px; position: relative;';
        
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
            line.style.cssText = 'height: 2px; background-color: #E0E0E0; flex: 1; margin: -22px 4px 0 4px; align-self: center; border-radius: 2px';
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
                ${index === 0 ? 'background-color: var(--primary-color); color: white;' : 'background-color: #E0E0E0; color: #666;'}
            `;
            circle.textContent = (index + 1).toString();
            makeTextEditable(circle);
            
            const label = document.createElement('div');
            label.textContent = `Step ${index + 1}`;
            label.style.cssText = 'font-size: 14px; color: #666; font-weight: 500;';
            makeTextEditable(label);
            
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
// Feature Comparison Card
    featureComparisonCard: () => {
        const container = document.createElement('div');
        container.style.cssText = 'width: 100%; border: 1px solid #E0E0E0; border-radius: 8px; overflow: visible; position: relative;';
    
        const header = document.createElement('div');
        header.style.cssText = 'padding: 14px; background-color: var(--primary-color); color: white; border-radius: 8px 8px 0 0';
        
        const titleWrapper = document.createElement('div');
        const title = document.createElement('h3');
        title.textContent = 'Feature Comparison';
        title.style.cssText = 'margin: 0; font-size: 18px; font-weight: bold;';
        this.makeTextEditable(title);
        titleWrapper.appendChild(title);
    
        const content = document.createElement('div');
        content.style.cssText = 'padding: 16px;';
    
        const grid = document.createElement('div');
        grid.style.cssText = 'display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px; align-items: center;';
    
        // Add row button (hidden by default)
        const addRowContainer = document.createElement('div');
        addRowContainer.style.cssText = 'padding: 12px 16px; border-top: 1px solid #E0E0E0; display: none;';
    
        const addRowBtn = document.createElement('button');
        addRowBtn.innerHTML = '<i class="fas fa-plus"></i> Add Feature';
        addRowBtn.style.cssText = `
            background-color: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 6px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 14px;
        `;
    
        // Headers
        const headers = ['Features', 'Basic', 'Pro'].map((text, index) => {
            const headerCell = document.createElement('div');
            headerCell.textContent = text;
            headerCell.style.cssText = `font-weight: bold; color: #666; padding: 8px 0; ${index > 0 ? 'text-align: center;' : ''}`;
            this.makeTextEditable(headerCell);
            return headerCell;
        });
    
        headers.forEach(header => grid.appendChild(header));
    
        // Convert createFeatureRow to an arrow function to keep 'this' context
        const createFeatureRow = (featureName = 'New Feature', isNew = false) => {
            const nameCell = document.createElement('div');
            nameCell.style.cssText = 'color: #333; display: flex; align-items: center; gap: 8px;';
    
            // Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                color: #ff4444;
                cursor: pointer;
                padding: 4px;
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
    
        // Show/hide add button on hover
        container.addEventListener('mouseenter', () => addRowContainer.style.display = 'block');
        container.addEventListener('mouseleave', () => addRowContainer.style.display = 'none');
    
        addRowContainer.appendChild(addRowBtn);
        header.appendChild(titleWrapper);
        content.appendChild(grid);
        container.appendChild(header);
        container.appendChild(content);
        container.appendChild(addRowContainer);
    
        return container;
    }
        };    
    }
    
// Initialize the editor
    document.addEventListener('DOMContentLoaded', () => {
        window.editor = new MobileUIEditor();
    });

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


// NEW SCREENSHOT Update HTML2CANVAS
    // async function captureScreenshot() {
    //         const mockup = selectedCanvas;
    //         // Clone the mockup for modification
    //         // const clone = mockup.cloneNode(true);
    //         // Replace form elements with custom versions
    //         // replaceFormElements(clone);
            
    //         try {
    //             const canvas = await html2canvas(mockup, {
    //                 scale: 2, // Higher quality
    //                 useCORS: true, // Handle cross-origin images
    //                 backgroundColor: null, // Maintain transparency
    //                 logging: false,
    //                 allowTaint: true,
    //                 onclone: (clonedDoc) => {
    //                     // Any pre-capture modifications can go here
    //                 }
    //             });

    //             // Convert to image and trigger download
    //             const image = canvas.toDataURL('image/png', 1.0);
    //             const link = document.createElement('a');
    //             link.download = `mockup-${new Date().toISOString().split('T')[0]}.png`;
    //             link.href = image;
    //             link.click();
    //         } catch (error) {
    //             console.error('Screenshot failed:', error);
    //             alert('Failed to capture screenshot. Please try again.');
    //         }
    //     }
