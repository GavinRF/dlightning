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
        this.setupDownloadButton(); //html2canvas(pro)
        // this.loadSavedCanvases(); 
        this.updateTime();
        setInterval(updateTime, 60000);
        // this.updateZoomLevel();
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

    const variation = getVariation(componentType);

    const canvases = this.state.selectedCanvases.size > 0 ?
        Array.from(this.state.selectedCanvases) :
        document.querySelectorAll('.canvas');

    // Check if special components already exist
    if (['navbar', 'bottomNav', 'modal'].includes(componentType)) {
        const hasComponent = Array.from(canvases).some(canvas => {
            return canvas.querySelector(
                componentType === 'navbar' ? '.navbar' :
                componentType === 'bottomNav' ? 'nav' :
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
    `;
    // <button class="duplicate-btn">+</button>

    container.querySelector('.component-content').appendChild(component);
    
    // Setup event listeners
    container.querySelector('.delete-btn').addEventListener('click', () => container.remove());
    // container.querySelector('.duplicate-btn').addEventListener('click', () => {
    //     const duplicate = component.cloneNode(true);
    //     const wrappedDuplicate = this.wrapComponentInContainer(duplicate, componentType);
    //     container.parentNode.insertBefore(wrappedDuplicate, container.nextSibling);
    // });
    
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
            group: 'shared-components'
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
                    ghostClass: 'sortable-ghost'
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
                    canvasContent.insertBefore(spacer, canvasContent.firstChild);
                }
                navbar.style.cssText = 'position: absolute; left: 0; right: 0; top: 24px;';
            } else {
                canvas.appendChild(navbar);
                navbar.style.cssText = 'position: absolute; left: 0; right: 0; bottom: 0;';
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
            background: #d5d9da;
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

// DOWNLOAD MULTIPLE SELECTED SCREENS
setupDownloadButton() {
    document.getElementById('download-btn').addEventListener('click', () => this.captureScreenshot());
}

async captureScreenshot() {
    const originalScale = scale;
    setZoomScale(1);
    await new Promise(resolve => setTimeout(resolve, 100));
    let counter = 1;
    
    try {
      for (const canvas of this.state.selectedCanvases) {
        const originalScrollTop = canvas.scrollTop;
        const originalScrollLeft = canvas.scrollLeft;
        // Reset scroll position before cloning
        canvas.scrollTop = 0;
        canvas.scrollLeft = 0;
        
        const clone = canvas.cloneNode(true);
        
        // Add padding to prevent clipping
        const padding = 6;
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
        document.body.appendChild(tempContainer);
  
        // Adjust clone dimensions to account for padding
        clone.style.height = `${canvas.clientHeight}px`;
        clone.style.width = `${canvas.clientWidth}px`;
        clone.style.overflow = 'hidden';
        clone.style.margin = '0';
        clone.scrollTop = 0;
        clone.scrollLeft = 0;
  
        console.log('Canvas dimensions:', {
          clientWidth: canvas.clientWidth,
          clientHeight: canvas.clientHeight,
          scrollWidth: canvas.scrollWidth,
          scrollHeight: canvas.scrollHeight,
          offsetWidth: canvas.offsetWidth,
          offsetHeight: canvas.offsetHeight
        });
  
        this.replaceRangeSliders(clone);
        await new Promise(resolve => setTimeout(resolve, 200));
  
        const renderedCanvas = await html2canvas(clone, {
          backgroundColor: null,
          logging: true,
          useCORS: true,
          scale: window.devicePixelRatio,
          width: canvas.clientWidth + (padding * 2), // Include padding in capture width
          height: canvas.clientHeight + (padding * 2), // Include padding in capture height
          scrollX: -padding, // Offset scroll to capture padding area
          scrollY: -padding,
          windowWidth: canvas.clientWidth + (padding * 2),
          windowHeight: canvas.clientHeight + (padding * 2),
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.querySelector(clone.tagName);
            if (clonedElement) {
              clonedElement.style.transform = 'none';
              clonedElement.style.height = `${canvas.clientHeight}px`;
              clonedElement.style.width = `${canvas.clientWidth}px`;
              clonedElement.style.overflow = 'hidden';
            }
          }
        });
  
        document.body.removeChild(tempContainer);
        canvas.scrollTop = originalScrollTop;
        canvas.scrollLeft = originalScrollLeft;
  
        if (renderedCanvas.width === 0 || renderedCanvas.height === 0) {
          console.error('Rendered canvas has zero dimensions');
          continue;
        }
  
        const link = document.createElement('a');
        const filename = this.state.selectedCanvases.size > 1
          ? `Dlightning-mockup-${counter}.png`
          : 'Dlightning-mockup.png';
        link.download = filename;
        link.href = renderedCanvas.toDataURL('image/png');
        link.click();
        counter++;
      }
    } catch (error) {
      console.error('Screenshot error:', error);
    } finally {
      setZoomScale(originalScale);
    }
  }

// ********
/////////////////////////
// Component Definitions ////////////////////////////
/////////////////////////
// ********
    components = {
        button: (type = 'default') => {
            const container = document.createElement('div');
            container.style.cssText = 'width: 100%; display: flex; justify-content: space-between;';
            const createButton = (text, isGhost = false, isDisabled = false) => {
                const button = document.createElement('div');
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
                //this.makeTextEditable(button);
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
      background-color: ${type === 'error' ? 'rgba(255, 0, 0, 0.02)' : '#fff'};
      ${type === 'search' ? 'background: #f9f9f9;' : ''}
    `;
  
    // Add placeholder behavior
    inputDiv.addEventListener('input', function() {
      if (this.textContent.trim() === '') {
        this.classList.add('empty');
      } else {
        this.classList.remove('empty');
      }
    });
  
    // Add placeholder styles
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
        color: #666;
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
        inputDiv.style.backgroundColor = '#f0f0f0';
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
      background-color: ${type === 'error' ? 'rgba(255, 0, 0, 0.02)' : '#fff'};
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
        textareaDiv.style.backgroundColor = '#f0f0f0';
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
        font-size: 16px; color: #333; width: 100%;
        justify-content: flex-start;
    `;

    // Simulated checkbox using a div
    const checkboxDiv = document.createElement('div');
    checkboxDiv.className = 'fa-regular fa-square';
    checkboxDiv.style.cssText = `
        margin: -1px 10px 0 10px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        font-size: 26px;
        color: var(--neutral-gray);
    `;

    // Checkmark icon
    const checkIcon = document.createElement('i');
    checkIcon.className = 'fa-solid fa-square-check';
    checkIcon.style.cssText = `
        font-size: 26px;
        color: var(--primary-color);
        display: none; 
        position: absolute;
        top: -1px;
        left: 0px;
        border: none;
    `;
    checkboxDiv.appendChild(checkIcon);
    // Toggle checkmark and border color on click
    checkboxDiv.addEventListener('click', () => {
        const isChecked = checkIcon.style.display === 'none';
        checkIcon.style.display = isChecked ? 'block' : 'none';
        // checkboxDiv.style.borderColor = isChecked ? 'none' : '#e0e0e0';
        // checkboxDiv.style.borderWidth = isChecked ? '0px' : '2px';
    });

    // Editable label text for the checkbox
    const chekLabl = document.createElement('span');
    chekLabl.textContent = "click to edit";
    chekLabl.style.cssText = 'font-size: 16px; color: #333;';
    this.makeTextEditable(chekLabl);

    // Append checkbox and label to the wrapper
    wrapper.appendChild(checkboxDiv);
    wrapper.appendChild(chekLabl);

    return wrapper;
},
// Radio ////////////////////
radio: () => {
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; align-items: center; width: 100%;';

    const label = document.createElement('label');
    label.style.cssText = 'display: flex; align-items: center; font-size: 16px; color: #333; justify-content: flex-start;';
    
    // Simulate radio button with a styled div
    const radioDiv = document.createElement('div');
    radioDiv.style.cssText = `
        width: 20px; height: 20px; 
        margin: 0 10px;
        border: 2px solid #e0e0e0;
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
        display: none; /* Hidden by default */
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
        color: #333;
      }
      
      .dropdown-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 42px;
        padding: 0 12px;
        background-color: white;
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
        background: white;
        border: 1px solid #ddd;
        border-top: none;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
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
        background-color: #f5f5f5;
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
        border: 2px dashed #ddd;
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
                z-index: 2445;
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
            card.style.cssText = 'width: 100%; border-radius: 10px; padding: 0; background-color: #fff; border: 0.12rem solid var(--neutral-gray); border-bottom: 3px solid rgba(0,0,0,.12); overflow: hidden;';
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
            shadowDiv.style.cssText = 'background-color: rgba(0,0,0,0.12); width: 100%; height: 59px; position: absolute; top:0; left: 0; z-index: 1'

            const navbar = document.createElement('div');
            navbar.className = 'navbar top-navbar';
           
            navbar.innerHTML = `
                <span style="font-size: 20px; font-weight: bold; color: --primary;">Brand</span>
                <div style="display: flex; align-items: center;">
                    <a style="margin-left: 20px; color: #2c3e50; text-decoration: none;">Home</a>
                    <a style="margin-left: 20px; color: #2c3e50; text-decoration: none;">About</a>
                    <a style="margin-left: 20px; color: #2c3e50; text-decoration: none;">Contact</a>
                </div>
            `;
            
            navbar.querySelectorAll('span, a').forEach(el => this.makeTextEditable(el));
            topNavbarContainer.appendChild(navbar);
            topNavbarContainer.appendChild(shadowDiv);
  
            return topNavbarContainer;
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
                background-color: #ccc;
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
                    slider.style.backgroundColor = '#ccc';
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
                    background-color: white;">
                    <div style="padding: 18px 0;">
                        <p contenteditable style="margin: 0; color: #666;">Content for section 1</p>
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
                group: 'shared-components'
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
                color: #333;
                background-color: #fff;
                position: relative;
            `;

            const dateText = document.createElement('span');
            dateText.textContent = 'DD/MM/YYYY'; 
            dateText.style.cssText = 'opacity: 0.7;';
            dateText.setAttribute('contenteditable', 'true');
            
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
                background-color: #fff;
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
            background-color: #f3f3f3;
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

            container.appendChild(fileInput);
            container.appendChild(label);

            return container;
        },
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
                            <i class="fas fa-star" style="font-size: 20px; margin-bottom: 4px;"></i>
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
            const heading = document.createElement(level);
            heading.textContent = `${level.toUpperCase()} Heading`;
            heading.style.cssText = 'color: #2c3e50; margin: 10px 0;';
            heading.setAttribute('contentEditable','true');
            // this.makeTextEditable(heading);
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
            p.setAttribute('contentEditable','true');
            // this.makeTextEditable(p);
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
            blockquote.setAttribute('contentEditable','true');
            // this.makeTextEditable(blockquote);
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
                margin-bottom: -8px;
                `
            ;
            label.setAttribute('contentEditable','true');
            // this.makeTextEditable(label);
            return label;
        },
        graph: (type = 'bar') => {
            const container = document.createElement('div');
            container.style.cssText = 'width: 100%; height: 300px; background: white; padding: 20px; border-radius: 8px; border: 0.12rem solid var(--neutral-gray); border-bottom: 3px solid rgba(0,0,0,.12); position: relative;';
            
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
            container.style.cssText = 'width: 100%; display: flex; align-items: flex-start; gap: 10px; margin-bottom: 16px; position: relative;';

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
            chatContent.innerHTML = 'Click to edit this message';
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
            placeholder.style.cssText = 'display: flex; align-items: center; justify-content: center; color: #666; padding: 8px; border: 2px dashed #ccc; border-radius: 8px;';
            
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
            bubble.style.cssText = 'background-color: var(--primary-color); color: white; padding: 12px 16px; border-radius: 18px; border-top-right-radius: 4px; max-width: 80%; display: inline-block; word-wrap: break-word;';
            
            const timestamp = document.createElement('div');
            timestamp.textContent = '1 minute ago';
            timestamp.style.cssText = 'font-size: 12px; color: #666; margin-top: 4px;';
            
            const bubbleTxt = bubble.querySelector('.chat-content');
            bubbleTxt.setAttribute('contentEditable','true');
            timestamp.setAttribute('contentEditable','true');

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
                emojiBtn.style.cssText = 'background: none; border: none; color: #666; padding: 8px 0 8px 8px; cursor: pointer; font-size: 20px;';
                container.appendChild(emojiBtn);
            }
            
            if (type === 'with-image' || type === 'full') {
                const imageBtn = document.createElement('button');
                imageBtn.innerHTML = '<i class="far fa-image"></i>';
                imageBtn.style.cssText = 'background: none; border: none; color: #666; padding: 8px 0 8px 8px; cursor: pointer; font-size: 20px;';
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
            // this.makeTextEditable(chipText);
    
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
            border: 1px dashed var(--neutral-gray);
            border-radius: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
        `;

        chipGroupContainer.addEventListener('mouseenter', () => {
            addButton.style.display = 'flex';
            //chipGroupContainer.style.cssText = `border: 1px dashed var(--neutral-gray);`;
        });

        chipGroupContainer.addEventListener('mouseleave', () => {
            addButton.style.display = 'none';
            //chipGroupContainer.style.cssText = `border: none;`;
        });
    
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
    
        return chipGroupContainer;
    },
// HZ Rule Divider line
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
        background-color: var(--neutral-gray);
        transition: all 0.3s ease;
    `;

    // Controls container
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: absolute;
        top: -26px;
        left: 50%;
        transform: translateX(-50%);
        display: none;
        gap: 8px;
        background: white;
        padding: 4px;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        z-index: 100;
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
        height: 6px;
        margin-left: 8px;
    `;

    // Style button click handlers
    styleButtons[0].addEventListener('click', () => { // Solid
        const currentThickness = thicknessControl.value;
        line.style.borderStyle = 'solid';
        line.style.background = 'var(--neutral-gray)';
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
        line.style.borderColor = 'var(--neutral-gray)';
        dividerContainer.style.flexDirection = 'row';
    });

    styleButtons[2].addEventListener('click', () => { // Double
        const currentThickness = thicknessControl.value;
        line.style.borderStyle = 'double';
        line.style.background = 'none';
        line.style.height = '0';
        line.style.borderWidth = `${currentThickness}px 0 0 0`;
        line.style.borderColor = 'var(--neutral-gray)';
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
    }
        };    
    }
// END COMPONENTS

    
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


