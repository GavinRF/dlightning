// extra-func.js
//DARK MODE
let darkMode = localStorage.getItem('darkMode') === 'true';

let darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.checked = darkMode;
if (darkMode) {
    document.body.classList.add('dark-mode');
}

 // Handle dark mode toggle
darkModeToggle.addEventListener('change', function() {
    darkMode = this.checked;
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

//Color Picker
    document.getElementById('color-picker').addEventListener('input', function(e) {
        document.documentElement.style.setProperty('--primary-color', e.target.value);
    });
//Font Picker
    document.getElementById('font-picker').addEventListener('change', function(e) {
        const selectedFont = e.target.value;
        document.documentElement.style.setProperty('--primary-font', selectedFont);
        const googleFontsLink = document.getElementById('google-fonts');
        googleFontsLink.href = `https://fonts.googleapis.com/css?family=${selectedFont.replace(' ', '+')}:400,700&display=swap`;
    });

// EXPAND THE CANVAS ////////////
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleCanvasBtn');
    const bounding = document.getElementById('bounding');
    let isExpanded = false;

    toggleBtn.addEventListener('click', function() {
        isExpanded = !isExpanded;
        //console.log('this was clicked');
        
        // Get all current canvas and related elements
        const canvases = document.querySelectorAll('.canvas');
        const contents = document.querySelectorAll('.content');
        const phoneScrollCons = document.querySelectorAll('.phoneScrollCon');
        const addCanvasBtn = document.getElementById('addCanvasBtn');
        
        // Toggle classes for expansion
        canvases.forEach(el => el.classList.toggle('canvas-expanded'));
        contents.forEach(el => el.classList.toggle('content-expanded'));
        bounding.classList.toggle('content-expanded');
        phoneScrollCons.forEach(el => el.classList.toggle('scroll-expanded'));
        addCanvasBtn.classList.toggle('hideAddCanvasBtn');
        
        // Update button text
        toggleBtn.innerHTML = isExpanded 
            ? '<i class="fa-solid fa-arrows-up-down"></i>' 
            : '<i class="fa-solid fa-mobile-screen-button"></i>';
            
        // If returning to normal view, scroll each phoneScrollCon to top
        if (!isExpanded) {
            phoneScrollCons.forEach(el => el.scrollTo(0, 0));
        }
    });
});

// TEXT ALIGNMENT CONTROLS (left, right, center) ////////////////////
class AlignmentController {
    constructor(containerSelector = '.canvas-content') {
        this.containerSelector = containerSelector;
        this.containers = new Set();
        this.currentElement = null;
        this.activeControls = null;
        
        // Bind methods
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleAlignment = this.handleAlignment.bind(this);
        this.initContainer = this.initContainer.bind(this);
        
        // Initialize
        this.init();
        this.setupMutationObserver();
    }

    init() {
        // Initialize all existing canvas-content containers
        document.querySelectorAll(this.containerSelector).forEach(container => {
            this.initContainer(container);
        });
    }

    initContainer(container) {
        if (this.containers.has(container)) return;
        
        this.containers.add(container);
        
        // Add event listeners to the container
        container.addEventListener('mouseover', (e) => {
            const element = e.target.closest('h1, h2, h3, h4, h5, h6, p, blockquote');
            if (element) {
                this.handleMouseEnter(element);
            }
        });

        container.addEventListener('mouseout', (e) => {
            const element = e.target.closest('h1, h2, h3, h4, h5, h6, p, blockquote');
            if (element) {
                this.handleMouseLeave(e, element);
            }
        });
    }

    setupMutationObserver() {
        // Watch for changes in the entire document
        const observer = new MutationObserver((mutations) => {
            let hasNewCanvas = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // Check for moved nodes within canvas-content
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.closest(this.containerSelector)) {
                            // Node has been added (could be a sort-related addition)
                            this.initContainer(node.closest(this.containerSelector)); // Reinitialize controls for the container
                        }
                    });
    
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.closest(this.containerSelector)) {
                            // Node has been removed (could be a sort-related removal)
                            this.containers.delete(node.closest(this.containerSelector));
                        }
                    });
                }
            });
    
            // Clean up orphaned controls
            if (hasNewCanvas) {
                document.querySelectorAll('.alignment-controls').forEach(controls => {
                    if (!controls.parentElement) {
                        controls.remove();
                    }
                });
            }
        });
    
        // Observe the entire document for maximum flexibility
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    

    // ... rest of the methods remain the same ...
    createControls(element) {
        const controls = document.createElement('div');
        controls.className = 'alignment-controls';
        controls.innerHTML = `
            <button data-align="left"><i class="fas fa-align-left"></i></button>
            <button data-align="center"><i class="fas fa-align-center"></i></button>
            <button data-align="right"><i class="fas fa-align-right"></i></button>
        `;
        controls.addEventListener('click', this.handleAlignment);
        controls.addEventListener('mouseenter', () => {
            clearTimeout(this.hideTimeout);
        });
        controls.addEventListener('mouseleave', (e) => {
            if (!element.contains(e.relatedTarget)) {
                this.hideControls();
            }
        });
        return controls;
    }

    handleMouseEnter(element) {
        if (!element.alignmentControls) {
            const componentContent = element.closest('div');
            if (!componentContent) return;

            componentContent.style.position = 'relative';
            const controls = this.createControls(element);
            element.alignmentControls = controls;
            componentContent.appendChild(controls);
        }

        this.currentElement = element;
        this.activeControls = element.alignmentControls;
        const currentAlign = getComputedStyle(element).textAlign;
        this.activeControls.querySelectorAll('button').forEach(button => {
            button.classList.toggle('active', button.dataset.align === currentAlign);
        });

        this.activeControls.style.display = 'flex';
    }

    handleMouseLeave(e, element) {
        if (e.relatedTarget && (
            e.relatedTarget.closest('.alignment-controls') === element.alignmentControls || 
            element.alignmentControls.contains(e.relatedTarget)
        )) {
            return;
        }

        this.hideTimeout = setTimeout(() => {
            if (element.alignmentControls) {
                element.alignmentControls.style.display = 'none';
            }
        }, 100);
    }

    hideControls() {
        if (this.activeControls) {
            this.activeControls.style.display = 'none';
            this.currentElement = null;
            this.activeControls = null;
        }
    }

    handleAlignment(e) {
        const button = e.target.closest('button');
        if (!button || !this.currentElement) return;

        e.stopPropagation();
        const alignment = button.dataset.align;
        this.currentElement.style.textAlign = alignment;
        
        const controls = button.closest('.alignment-controls');
        controls.querySelectorAll('button').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.align === alignment);
        });
    }

    destroy() {
        // Clean up all controls
        document.querySelectorAll('.alignment-controls').forEach(controls => {
            controls.remove();
        });
        // Clear containers set
        this.containers.clear();
    }
}
  // Initialize
  const alignmentController = new AlignmentController('.canvas-content');

// ICON PICKER /////////
  function showIconPicker(targetIcon) {
    const backdrop = document.querySelector('.icon-picker-backdrop');
    const modal = document.querySelector('.icon-picker-modal');
    const grid = modal.querySelector('.icon-picker-grid');
    const search = modal.querySelector('.icon-picker-search');

    // Font Awesome icon classes (add more as needed)
    const icons = [
        'home', 'search', 'plus', 'heart', 'user', 'cog', 'bell', 'envelope', 
        'star', 'bookmark', 'calendar', 'camera', 'video', 'music', 'map', 
        'chart-bar', 'comments', 'folder', 'clock', 'image', 'shopping-cart',
        'chart-line', 'users', 'tachometer-alt', 'bolt', 'paper-plane',
        'cloud', 'location-dot', 'gear', 'message', 'share', 'edit',
        'trash', 'download', 'upload', 'refresh', 'check', 'times',
        'info-circle', 'question-circle', 'exclamation-circle', 'flag',
        'crown', 'gift', 'shield', 'globe', 'hashtag', 'film',
        'microphone', 'headphones', 'wifi', 'signal', 'battery-full', 'cloud-arrow-up',
        'person-running', 'hand', 'fire', 'brush', 'gamepad', 'feather', 'landmark', 
        'mug-saucer', 'wrench', 'shirt', 'bag-shopping', 'car-side', 'hand-holding-heart',
        'gauge', 'robot', 'passport', 'play', 'database', 'newspaper', 'store', 'school',
        'water', 'laptop', 'desktop', 'wind', 'brain', 'hotel', 'wallet', 'award',
        'ship', 'route', 'receipt', 'wine-bottle', 'dice', 'industry', 'otter', 'kiwi-bird',
        'umbrella-beach', 'cookie-bite', 'dumbbell', 'plane-departure', 'wine-glass', 'toolbox',
        'vault', 'van-shuttle', 'utensils', 'tooth', 'shoe-prints', 'stopwatch', 'spider', 'splotch',
        'smog', 'skull-crossbones', 'skull', 'shuttle-space', 'shapes', 'scissors', 'scale-balanced',
        'satellite', 'rainbow', 'sailboat', 'republican', 'democrat', 'piggy-bank', 'person-swimming',
        'pepper-hot', 'pen-clip', 'peace', 'paw', 'panorama', 'parachute-box', 'microscope', 'om',
        'mountain', 'mitten', 'mosque', 'mortar-pestle', 'monument', 'money-bill-wave', 'meteor',
        'martini-glass', 'map', 'lungs', 'hat-cowboy', 'location-arrow', 'infinity', 'id-badge',
        'icicles', 'ice-cream', 'hourglass-half', 'hotdog', 'horse-head', 'horse', 'hat-wizard',
        'highlighter', 'helicopter', 'heart-pulse', 'hand-peace', 'hand-fist', 'guitar', 'bacterium',
        'asterisk', 'gem', 'frog', 'fill-drip', 'dice-two', 'dice-three', 'dice-four',
        'face-smile-wink', 'face-laugh', 'face-grin-stars', 'face-grin', 'face-angry', 'eye-dropper',
        'earth-oceania', 'earth-europe', 'earth-africa', 'earth-asia', 'dungeon', 'drum', 'dove',
        'crow', 'couch', 'computer-mouse', 'at', 'compass-drafting', 'clover', 'archway',
        'cloud-showers-heavy', 'clapperboard', 'chess-rook', 'chess-knight', 'chess-queen', 'chess',
        'chess-king', 'cheese', 'chart-pie', 'cat', 'carrot', 'caret-right', 'caret-left', 'caravan',
        'cannabis', 'campground', 'cake-candles', 'arrow-pointer', 'bus', 'burger', 'bullhorn', 
        'angle-right', 'angle-left', 'angle-down', 'braille', 'bars', 'box-open', 'box-archive', 
        'box', 'bowling-ball', 'book-open', 'bone', 'bell-concierge', 'mug-hot', 'bomb', 
        'circle-user', 'film', 'book', 'key', 'lemon', 'thumbtack', 'folder-open', 'tree',
        'binoculars', 'sun', 'snowflake', 'palette', 'earth-americas', 'layer-group', 'link', 'fish',
        'bicycle','1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g',
        'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'circle', 'circle-play', 'circle-pause', 'circle-stop', 'circle-dot', 'circle-check', 
        'circle-radiation', 'spinner', 'circle-down', 'bugs'
    ];
    //reder icons
    function renderIcons(filter = '') {
        grid.innerHTML = '';
        icons.filter(icon => icon.includes(filter.toLowerCase()))
             .forEach(icon => {
                const i = document.createElement('i');
                i.className = `fas fa-${icon}`;
                i.addEventListener('click', () => {
                    targetIcon.className = `fas fa-${icon}`;
                    modal.style.display = 'none';
                    backdrop.style.display = 'none';
                });
                grid.appendChild(i);
             });
    }
    // search icons
    search.value = '';
    search.addEventListener('input', (e) => renderIcons(e.target.value));

    renderIcons();
    modal.style.display = 'block';
    backdrop.style.display = 'block';

    backdrop.onclick = () => {
        modal.style.display = 'none';
        backdrop.style.display = 'none';
    };
}

// SHOW GRAPH EDITOR
function showGraphDataEditor(graphContainer) {
    const chart = graphContainer.chart;
    const currentData = graphContainer.chartData;
    
    const modal = document.createElement('div');
    modal.className = 'graph-data-modal';
    modal.style.display = 'block';
    
    let html = '<h3>Edit Graph Data</h3>';
    
    currentData.labels.forEach((label, index) => {
        html += `
            <div class="graph-data-row">
                <input type="text" class="label-input" value="${label}" placeholder="Label">
                <input type="number" class="value-input" value="${currentData.values[index]}" placeholder="Value">
            </div>
        `;
    });
    
    html += `
        <div class="graph-data-actions">
            <button class="cancel">Cancel</button>
            <button class="save">Save Changes</button>
        </div>
    `;
    
    modal.innerHTML = html;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.cancel').onclick = () => {
        modal.remove();
    };
    
    modal.querySelector('.save').onclick = () => {
        const labels = [...modal.querySelectorAll('.label-input')].map(input => input.value);
        const values = [...modal.querySelectorAll('.value-input')].map(input => parseFloat(input.value));
        
        graphContainer.chartData.labels = labels;
        graphContainer.chartData.values = values;
        
        chart.data.labels = labels;
        chart.data.datasets[0].data = values;
        chart.update();
        
        modal.remove();
    };
}

// MAGNIFY!! //////////////
let scale = 1;

function updateZoomLevel() {
    const zoomLevel = Math.round(scale * 100);
    document.getElementById('zoom-level').textContent = `${zoomLevel}%`;
}

function setZoomScale(newScale) {
    scale = newScale;
    document.getElementById('bounding').style.transform = `scale(${scale})`;
    updateZoomLevel();
}

document.getElementById('zoom-in').addEventListener('click', () => {
    setZoomScale(scale + 0.05);
});

document.getElementById('zoom-out').addEventListener('click', () => {
    setZoomScale(Math.max(0.05, scale - 0.05));
});
