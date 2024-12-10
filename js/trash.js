//trash

//GLOBALS
    let topNavbarAdded = false;
    let bottomNavbarAdded = false;
    let modalAdded = false;
    // add new canvas
    let canvasCount = 1;
    let selectedCanvas = document.querySelector('.canvas');
    let selectedCanvases = new Set();
    selectedCanvases.add(selectedCanvas); 


/// something about numbering the canvas
    window.addEventListener('load', function() {
        const firstCanvasNumber = document.querySelector('.canvas-number');
        const container = document.createElement('div');
        container.className = 'canvas-number-container';
        
        firstCanvasNumber.parentNode.insertBefore(container, firstCanvasNumber);
        container.appendChild(firstCanvasNumber);
    });

// // OLD HTML2CANVAS
    document.getElementById('download-btn').addEventListener('click', function() {
        html2canvas(document.getElementById('canvas')).then(function(canvas) {
            const link = document.createElement('a');
            link.download = 'android-mockup.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });

//Update Canvas Numbers
        function updateCanvasNumbers() {
        document.querySelectorAll('.canvas-number').forEach((num, index) => {
            const canvas = num.closest('.canvas-wrapper').querySelector('.canvas');
            const isSelected = selectedCanvases.has(canvas);
            num.textContent = `Canvas ${index + 1}${isSelected ? ' (Selected)' : ''}`;
        });
    }

// SELECT CANVASES
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

// //// ADD NEW CANVAS
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
                    <i style="font-size: 14px;" class="fa-solid fa-battery-full"></i>
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
    };

// // Add duplicate button
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


// Function to inject content into the mockup
        function setMockupContent(content) {
            const contentContainer = document.getElementById('canvasContent');
            contentContainer.innerHTML = content;
        }

// WRAP THE COMPONENTS
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

// // INSERT NAVBAR
    function insertNavbar(navbar, position) {
        const canvases = Array.from(selectedCanvases);
        canvases.forEach((canvas) => {
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
        });
    }

// //REMOVE NAV BAR
    function removeNavbar(position) {
        const canvases = Array.from(selectedCanvases);
        canvases.forEach((canvas) => {
            const canvasContent = canvas.querySelector('.canvas-content');

            if (position === 'top') {
                const topNavbar = canvas.querySelector('.navbar');
                if (topNavbar) {
                    topNavbar.remove();
                    canvasContent.style.paddingTop = '32px';
                }
            } else if (position === 'bottom') {
                const bottomNavbar = canvas.querySelector('nav:not(.navbar)');
                if (bottomNavbar) {
                    bottomNavbar.remove();
                }
            }
        });
    }


///// custom space
        document.querySelector('.component-btn[data-component="customSpace"]').addEventListener('click', function() {
            const component = components.adjustableSpace();
            const wrappedComponent = wrapComponentInContainer(component, 'adjustableSpace');
            selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
        });


        /////// COMPONENTS ///

// COMPONENTS ////////////////////
    const htmlComponents = {
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
                    button.disabled = true;
                    button.style.opacity = '0.5';
                    button.style.cursor = 'not-allowed';
                }
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
                    makeTextEditable(errorMsg);
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
                    makeTextEditable(errorMsg);
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
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            label.appendChild(radio);
            label.appendChild(document.createTextNode('Radio Button'));
            label.style.cssText = 'display: flex; align-items: center; font-size: 16px; color: #333; width: 100%; justify-content: flex-start;';
            label.className = 'radio';
            radio.style.cssText = 'margin-right: 10px; width: 20px; height: 20px; accent-color: var(--primary-color);';
            return label;
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
                    <h3 style="margin: 8px 0; font-size: 18px; color: #2c3e50;">Card Title</h3>
                    <p style="margin: 0 0 8px 0; color: #7f8c8d;">Card content goes here. This is a brief description.</p>
                </div>
            `;
            card.style.cssText = 'width: 100%; border-radius: 10px; padding: 0; background-color: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;';
            
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
                        makeTextEditable(figcaption);
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
            navbar.className = 'navbar top-navbar';  // Added class for identification
            navbar.innerHTML = `
                <span style="font-size: 20px; font-weight: bold; color: --primary;">Brand</span>
                <div style="display: flex; align-items: center;">
                    <a href="#" style="margin-left: 20px; color: #2c3e50; text-decoration: none;">Home</a>
                    <a href="#" style="margin-left: 20px; color: #2c3e50; text-decoration: none;">About</a>
                    <a href="#" style="margin-left: 20px; color: #2c3e50; text-decoration: none;">Contact</a>
                </div>
            `;
            navbar.style.cssText = 'display: flex; justify-content: space-between; align-items: center; width: 100%; height: 60px; background-color: #ecf0f1; padding: 0 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); box-sizing: border-box; margin: 0; position: absolute; left: 0; right: 0; top: 28px;';
            
            navbar.querySelectorAll('span, a').forEach(el => makeTextEditable(el));
            return navbar;
        },
        modal: () => {
            const modalWrapper = document.createElement('div');
            modalWrapper.className = 'modal-wrapper';
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
                    
                    const username = document.createElement('span');
                    username.textContent = 'Username';
                    username.style.cssText = 'color: #333; font-weight: 500;';
                    
                    avatarContainer.appendChild(smallAvatar);
                    avatarContainer.appendChild(username);
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
                    uploadUsername.textContent = 'Username';
                    uploadUsername.style.cssText = 'color: #333; font-weight: 500; margin-left: 10px;';
                    
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
                success: '#2ecc71',
                warning: '#f39c12',
                danger: 'var(--error-danger-delete)',
                dark: '#34495e'
            };
            const alert = document.createElement('div');
            const aText = document.createElement('span');
            aText.textContent = 'This is an alert message!';
            //alert.textContent = 'This is an alert message!';
            alert.appendChild(aText);
            makeTextEditable(aText);
            const closeIcon = document.createElement('i');
            closeIcon.className = 'fas fa-close';
            alert.appendChild(closeIcon);
            alert.style.cssText = `padding: 18px; background-color: ${alertColors[color]}; color: white; margin-bottom: 8px; width: 100%; display: flex; justify-content: space-between`;
            return alert;
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
            `;
            return label;
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
        heading: (level = 'h1') => {
            const heading = document.createElement(level);
            heading.textContent = `${level.toUpperCase()} Heading`;
            heading.style.cssText = 'width: 100%; color: #2c3e50; margin: 10px 0;';
            return heading;
        },
        paragraph: () => {
            const p = document.createElement('p');
            p.textContent = 'This is a paragraph. Click to edit.';
            p.style.cssText = 'width: 100%; color: #333; line-height: 1.6; margin-bottom: 15px;';
            return p;
        },
        blockquote: () => {
            const blockquote = document.createElement('blockquote');
            blockquote.textContent = 'This is a block-quote. Click to edit.';
            blockquote.style.cssText = 'width: 100%; color: #555; font-family: var(--primary-font); font-style: italic; border-left: 5px solid var(--primary-color); padding-left: 18px; margin-left: 0; margin-right: 0;margin-top: 12px';
            return blockquote;
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
            
            makeTextEditable(bubble.querySelector('.chat-content'));
            makeTextEditable(timestamp);
            
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
            
            makeTextEditable(bubble.querySelector('.chat-content'));
            makeTextEditable(timestamp);

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
            makeTextEditable(message);
            
            const subtext = document.createElement('div');
            subtext.textContent = 'Additional details or instructions can go here';
            subtext.style.cssText = 'font-size: 14px; color: #666;';
            makeTextEditable(subtext);
            
            const button = document.createElement('button');
            button.textContent = 'Action';
            button.style.cssText = 'background-color: var(--primary-color); color: white; border: none; padding: 8px 8px; border-radius: 4px; cursor: pointer; flex-shrink: 0; font-weight: 500;';
            makeTextEditable(button);
            
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
    container.style.cssText = 'width: 100%; padding: 24px 0; display: flex; justify-content: space-around; align-items: center; gap: 8px; position: relative;';
    
    // Control buttons container
    const controls = document.createElement('div');
    controls.style.cssText = `
        position: absolute;
        top: -18px;
        right: calc(50% - 28px);
        display: none;
        gap: 8px;
        z-index: 223;
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
        addButton.style.opacity = steps.length === 4 ? '0.5' : '1';
        addButton.style.cursor = steps.length === 4 ? 'default' : 'pointer';
    }
    
    function createConnectingLine() {
        const line = document.createElement('div');
        line.style.cssText = 'height: 2px; background-color: #E0E0E0; flex: 1; margin: -22px 6px 0 6px; align-self: center; border-radius: 2px';
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
            width: 32px;
            height: 32px;
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
        if (steps.length < 4) {
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
        
        const title = document.createElement('h3');
        title.textContent = 'Feature Comparison';
        title.style.cssText = 'margin: 0; font-size: 18px; font-weight: bold;';
        makeTextEditable(title);
        
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
        background-color: var(--primary-color);
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
        makeTextEditable(headerCell);
        return headerCell;
        });
        
        headers.forEach(header => grid.appendChild(header));
        
        function createFeatureRow(featureName = 'New Feature', isNew = false) {
        const nameCell = document.createElement('div');
        // nameCell.textContent = featureName;
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
        makeTextEditable(textSpan);
        
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
        }
        
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
        header.appendChild(title);
        content.appendChild(grid);
        container.appendChild(header);
        container.appendChild(content);
        container.appendChild(addRowContainer);
        
        return container;
    }
};
// END OF COMPONENTS //////////////

// ////// SWITCH LOGIC
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


///////

// // ROTATE COLOR
function rotateColor(hexColor, degrees) {
    // Convert hex color to RGB
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);
  
    // Convert RGB to HSL
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
  
    if (max == min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    // Apply hue rotation
    h = (h + degrees / 360) % 1;
  
    // Convert HSL back to RGB
    let r1 = 255 * (h < 1/6 ? 6*h : h < 1/2 ? 1 : h < 2/3 ? 6*(2/3-h) : 0);
    let g1 = 255 * (h < 1/2 ? 2*h : h < 2/3 ? 1 : h < 5/6 ? 6*(5/6-h) : 0);
    let b1 = 255 * (h >= 5/6 ? 6*(h-5/6) : h >= 1/2 ? 1 : h < 1/3 ? 6*h : 0);
  
    // Convert RGB back to hex
    r1 = Math.round(r1).toString(16).padStart(2, '0');
    g1 = Math.round(g1).toString(16).padStart(2, '0');
    b1 = Math.round(b1).toString(16).padStart(2, '0');
  
    return `#${r1}${g1}${b1}`;
  }
  
  Example usage:
  const primaryColor = '#3498db';
  const rotatedColor = rotateColor(primaryColor, 64);
  console.log(rotatedColor); // Output: #0088ff
  

  const colorPickerInput = document.getElementById('color-picker');
  colorPickerInput.addEventListener('input', () => {
    const primaryColor = colorPickerInput.value;
    const rotatedColor = rotateColor(primaryColor, 64);
    document.documentElement.style.setProperty('--primary-color-rotated', rotatedColor);
  });