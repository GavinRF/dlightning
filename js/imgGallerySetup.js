function setupImageGallery(container) {
    if (!container) return;
    
    // First, determine what type of gallery we have
    const isStandardGallery = container.querySelector('.ig-left-column-con') !== null;
    const isSliderGallery = container.querySelector('.img-gallery-slider') !== null;
    const isGridGallery = container.querySelector('.img-gallery-grid') !== null;
    const isStripGallery = container.querySelector('.img-gallery-strip') !== null;

    console.log("isStandardGallery:", isStandardGallery);
    
    // Setup standard two-column gallery
    if (isStandardGallery) {
        setupStandardGallery(container);
    }
    // Setup slider gallery
    else if (isSliderGallery) {
        setupSliderGallery(container);
    }
    // Setup grid gallery
    else if (isGridGallery) {
        setupGridGallery(container);
    }
    // Setup strip gallery
    else if (isStripGallery) {
        setupStripGallery(container);
    }
}

// STANDARD GALLERY ////
//// Setup functions for each gallery type // / / / / / / /
function setupStandardGallery(container) {
    const leftColumn = container.querySelector('.ig-left-column-con');
    const rightColumn = container.querySelector('.ig-right-column-con');
    const addButton = container.querySelector('.ig-add-btn');
    
    if (!leftColumn || !rightColumn) return;
    
    // Add event listeners for image boxes
    setupImageBoxes(container);
    
    // Setup add button functionality
    if (addButton) {
        // Remove existing event listeners to prevent duplicates
        const newAddButton = addButton.cloneNode(true);
        if (addButton.parentNode) {
            addButton.parentNode.replaceChild(newAddButton, addButton);
        }
        
        // Add fresh event listener
        newAddButton.addEventListener('click', () => {
            const newBox = createImageBox();
            // Add to the column with fewer children
            if (leftColumn.children.length <= rightColumn.children.length) {
                leftColumn.appendChild(newBox);
                editor.setupImageUpload(newBox);
            } else {
                rightColumn.appendChild(newBox);
                editor.setupImageUpload(newBox);
            }
            
        });
    }

    const imgWrap = container.querySelectorAll('.ig-image-wrapper');
    if (imgWrap) {
        imgWrap.forEach(wrapper => deleteBtnHoverEffect(wrapper));
    } else {    
        deleteBtnHoverEffect(imgWrap);
    }
    
    // Setup sortable for both columns
    if (typeof Sortable !== 'undefined') {
        const sortableOptions = {
            animation: 150,
            group: 'imgGal',
            onEnd: function() {
                // Ensure the add button is properly hidden/shown based on current state
                if (addButton) {
                    const totalImages = leftColumn.children.length + rightColumn.children.length;
                    addButton.style.display = totalImages >= 8 ? 'none' : 'block';
                }
            }
        };
        
        new Sortable(leftColumn, sortableOptions);
        new Sortable(rightColumn, sortableOptions);
    }
}

function setupSliderGallery(container) {
    const slider = container.querySelector('.img-gallery-slider');
    const leftNav = container.querySelector('.img-gallery-nav-left');
    const rightNav = container.querySelector('.img-gallery-nav-right');
    const dots = container.querySelectorAll('.img-gallery-dot');
    const images = container.querySelectorAll('.img-gallery-side-image, .img-gallery-center-image');
    
    if (!slider) return;
    
    // Set up image uploads for all images
    images.forEach(img => editor.setupImageUpload(img));
    
    // Create variables to track the current state
    let currentIndex = 2; // Assume center image is at index 2 initially
    const totalImages = 5; // Assume 5 images total (including off-screen ones)
    
    // Set up navigation
    if (leftNav) {
        leftNav.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalImages) % totalImages;
            updateSlider();
        });
    }
    
    if (rightNav) {
        rightNav.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalImages;
            updateSlider();
        });
    }
    
    // Set up dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSlider();
        });
    });
    
    function updateSlider() {
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
}

function setupGridGallery(container) {
    const gridItems = container.querySelectorAll('.img-gallery-grid-item');
    // Set up image uploads for all grid items
    gridItems.forEach(item => editor.setupImageUpload(item));
    //make sortable
    new Sortable(container, {
        animation: 150,             
    });

}

function setupStripGallery(container) {
    const stripItems = container.querySelectorAll('.img-gallery-strip-thumb');
    // Set up image uploads for all strip items
    stripItems.forEach(item => editor.setupImageUpload(item));
    new Sortable(container, {
        animation: 150,             
    });
}

// Helper function to create a new image box
function createImageBox() {
    const wrapper = document.createElement('div');
    wrapper.className = 'ig-image-wrapper';

    const box = document.createElement('div');
    box.classList = 'card-image resizeable ig-img-box';
    box.innerHTML = `
        <i style="color: var(--placeholder-color)" class="fa-solid fa-image non-editable"></i>
        <span style="color: var(--basic-txt-color)" class="imgMsg non-editable">Click to add image</span>
    `;
    
    // Make it resizable if resizer is available
    if (typeof resizer !== 'undefined' && resizer.makeResizable) {
        resizer.makeResizable(box);
    }
    
    // Add image upload functionality
    editor.setupImageUpload(box);
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '×';
    deleteBtn.className = 'gallery-image-delete-btn';
    
    // Add delete functionality
    deleteBtn.addEventListener('click', () => wrapper.remove());
    deleteBtn.addEventListener('click', e => e.stopPropagation());
    
    wrapper.appendChild(deleteBtn);
    wrapper.appendChild(box);

    deleteBtnHoverEffect(wrapper);
    
    return wrapper;
}

// function for adding outline when delete button is hovered
function deleteBtnHoverEffect(wrapper) {
    const deleteBtn = wrapper.querySelector('.gallery-image-delete-btn');
    deleteBtn.addEventListener('mouseenter', () => wrapper.style.outline = '1px solid var(--error-danger-delete)');
    deleteBtn.addEventListener('mouseleave', () => wrapper.style.outline = 'none');
}

// Setup image boxes in the container
function setupImageBoxes(container) {
    const imageBoxes = container.querySelectorAll('.ig-img-box');
    imageBoxes.forEach(editor.setupImageUpload);
    
    // Set up delete buttons
    const deleteButtons = container.querySelectorAll('.gallery-image-delete-btn');

    deleteButtons.forEach(btn => {
        // Clone to remove existing event listeners
        const newBtn = btn.cloneNode(true);
        if (btn.parentNode) {
            btn.parentNode.replaceChild(newBtn, btn);
        }
        btn.addEventListener('click', e => e.stopPropagation());
        // Add fresh event listener
        newBtn.addEventListener('click', (e) => {
            // prevent propagation
            e.stopPropagation();
            
            // Remove the image box
            const wrapper = newBtn.closest('.ig-image-wrapper');
            if (wrapper) {
                wrapper.remove();
            }
        });
    });
}