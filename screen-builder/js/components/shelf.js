// Component registry module — see docs/component-module-migration.md
// shelf: a horizontally scrolling row of nav links / categories (news-app section strip,
// store category shelf, story circles). One item is `.active`. Editor: hover an item for
// ✓ (set active) / × (remove), "+" adds one, drag to reorder. Play: tap selects (and
// scrolls it into view), mouse-drag scrolls the row.
window.Components = window.Components || {};

const SHELF_ITEM = (label, active = false) =>
    `<div class="shelf-item${active ? ' active' : ''}"><span class="shelf-label" contenteditable="true">${label}</span></div>`;
const SHELF_ICON_ITEM = (icon, label, active = false) =>
    `<div class="shelf-item${active ? ' active' : ''}"><div class="icon-container shelf-icon"><i class="fas fa-${icon}"></i></div><span class="shelf-label" contenteditable="true">${label}</span></div>`;
const SHELF_THUMB_ITEM = (label, active = false) =>
    `<div class="shelf-item${active ? ' active' : ''}"><div class="card-image shelf-thumb"><i class="fa-solid fa-image image-ph non-editable"></i></div><span class="shelf-label" contenteditable="true">${label}</span></div>`;

const SHELF_VARIANTS = [
    // 1 — Category tiles (default insert): icon + label
    /*html*/
    `<div class="shelf shelf-tiles">
        <div class="shelf-row">
            ${SHELF_ICON_ITEM('utensils', 'All', true)}${SHELF_ICON_ITEM('burger', 'Burgers')}${SHELF_ICON_ITEM('pizza-slice', 'Pizza')}${SHELF_ICON_ITEM('fish', 'Sushi')}${SHELF_ICON_ITEM('leaf', 'Healthy')}${SHELF_ICON_ITEM('mug-hot', 'Coffee')}${SHELF_ICON_ITEM('ice-cream', 'Dessert')}
        </div>
    </div>`,

    // 2 — Section links with an underline on the active one
    /*html*/
    `<div class="shelf shelf-underline">
        <div class="shelf-row">
            ${SHELF_ITEM('Top Stories', true)}${SHELF_ITEM('World')}${SHELF_ITEM('Business')}${SHELF_ITEM('Tech')}${SHELF_ITEM('Sports')}${SHELF_ITEM('Culture')}${SHELF_ITEM('Travel')}
        </div>
    </div>`,

    // 3 — Image circles (stories / collections)
    /*html*/
    `<div class="shelf shelf-circles">
        <div class="shelf-row">
            ${SHELF_THUMB_ITEM('New In', true)}${SHELF_THUMB_ITEM('Women')}${SHELF_THUMB_ITEM('Men')}${SHELF_THUMB_ITEM('Shoes')}${SHELF_THUMB_ITEM('Bags')}${SHELF_THUMB_ITEM('Sale')}
        </div>
    </div>`,

    // 4 — Outlined pills, the active one filled
    /*html*/
    `<div class="shelf shelf-pills">
        <div class="shelf-row">
            ${SHELF_ITEM('For You', true)}${SHELF_ITEM('Following')}${SHELF_ITEM('Trending')}${SHELF_ITEM('Music')}${SHELF_ITEM('Gaming')}${SHELF_ITEM('Food')}${SHELF_ITEM('Fashion')}
        </div>
    </div>`
];

window.Components.shelf = {
    // Owns its variants (setupVariants falls through here).
    variants() {
        return SHELF_VARIANTS.slice();
    },

    // Build a fresh shelf (variant 1) — used by the editor factory on insert.
    create() {
        const temp = document.createElement('div');
        temp.innerHTML = SHELF_VARIANTS[0];
        const shelf = temp.firstElementChild;
        this.setup(shelf);
        return shelf;
    },

    setActive(shelf, item) {
        shelf.querySelectorAll('.shelf-item.active').forEach(el => { if (el !== item) el.classList.remove('active'); });
        item.classList.add('active');
    },

    // Scroll the row (only the row — scrollIntoView would also scroll the screen) so the
    // item is centered
    scrollToItem(row, item) {
        const left = item.offsetLeft - (row.clientWidth - item.offsetWidth) / 2;
        row.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    },

    // Prototype player (js/prototype.js). `root` = the .component-container in the clone.
    play(root) {
        const shelf = root.querySelector('.shelf');
        const row = shelf?.querySelector('.shelf-row');
        if (!row || shelf._playBound) return;
        shelf._playBound = true;

        row.addEventListener('click', (e) => {
            const item = e.target.closest('.shelf-item');
            if (!item || row._protoDragged) return;
            this.setActive(shelf, item);
            this.scrollToItem(row, item);
        });

        // Mouse drag scrolls the row (touch/trackpad scroll natively). A drag isn't a tap:
        // _protoDragged makes the player ignore the click that ends it.
        let startX = 0, startLeft = 0, dragging = false, down = false;
        row.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            down = true; dragging = false;
            startX = e.clientX; startLeft = row.scrollLeft;
        });
        row.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = e.clientX - startX;
            if (!dragging && Math.abs(dx) > 4) {
                dragging = true;
                row.setPointerCapture(e.pointerId);
                row.classList.add('shelf-dragging');
            }
            if (dragging) row.scrollLeft = startLeft - dx;
        });
        const end = () => {
            if (!down) return;
            down = false;
            row.classList.remove('shelf-dragging');
            if (dragging) {
                row._protoDragged = true;
                setTimeout(() => { row._protoDragged = false; }, 0);
            }
        };
        row.addEventListener('pointerup', end);
        row.addEventListener('pointercancel', end);
    },

    afterVariantChange(content) {
        const shelf = content.querySelector('.shelf');
        if (shelf) this.setup(shelf);
    },

    // Editor wiring. Accepts the .shelf itself or anything containing one. Safe to call
    // repeatedly (load, live sync, undo, duplicate, variant switch).
    setup(container) {
        const shelf = container?.classList?.contains('shelf') ? container : container?.querySelector('.shelf');
        const row = shelf?.querySelector('.shelf-row');
        if (!row) return null;

        const ensureControls = (item) => {
            if (item.querySelector(':scope > .shelf-item-ctrls')) return;
            const ctrls = document.createElement('div');
            ctrls.className = 'shelf-item-ctrls non-editable';
            ctrls.innerHTML = '<button type="button" class="shelf-ctrl shelf-ctrl-active non-editable" title="Set as active">✓</button>' +
                '<button type="button" class="shelf-ctrl shelf-ctrl-del non-editable" title="Remove">×</button>';
            item.appendChild(ctrls);
        };
        row.querySelectorAll('.shelf-item').forEach(ensureControls);

        if (!shelf.querySelector(':scope > .shelf-add-btn')) {
            const add = document.createElement('button');
            add.type = 'button';
            add.className = 'shelf-add-btn non-editable';
            add.title = 'Add item';
            add.textContent = '+';
            shelf.appendChild(add);
        }

        const changed = (why) => {
            const canvasId = shelf.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
            if (canvasId) window.projectManager?.addCanvasToChanged?.(canvasId, why);
        };

        // One delegated listener per element (expando props don't survive cloneNode, so a
        // duplicate gets its own)
        if (!shelf._shelfBound) {
            shelf._shelfBound = true;
            shelf.addEventListener('click', (e) => {
                const ctrl = e.target.closest('.shelf-ctrl, .shelf-add-btn');
                if (!ctrl || !shelf.contains(ctrl)) return;
                e.preventDefault();
                e.stopPropagation();
                const item = ctrl.closest('.shelf-item');
                if (ctrl.classList.contains('shelf-ctrl-active') && item) {
                    this.setActive(shelf, item);
                    changed('Shelf active item changed');
                } else if (ctrl.classList.contains('shelf-ctrl-del') && item) {
                    if (row.querySelectorAll('.shelf-item').length <= 1) return;
                    const wasActive = item.classList.contains('active');
                    item.remove();
                    if (wasActive) row.querySelector('.shelf-item')?.classList.add('active');
                } else if (ctrl.classList.contains('shelf-add-btn')) {
                    const last = row.querySelector('.shelf-item:last-of-type');
                    if (!last) return;
                    const item = last.cloneNode(true);
                    item.classList.remove('active');
                    const label = item.querySelector('.shelf-label');
                    if (label) label.textContent = 'New';
                    // A fresh image placeholder, not a copy of the last item's photo
                    item.querySelectorAll('.card-image').forEach(img => {
                        img.classList.remove('with-image');
                        img.style.backgroundImage = '';
                        img.style.backgroundColor = '';
                        img.innerHTML = '<i class="fa-solid fa-image image-ph non-editable"></i>';
                    });
                    row.appendChild(item);
                    editor.setupIconPicker(item);
                    editor.setupImageUpload(item);
                    this.scrollToItem(row, item);
                }
            });
        }

        // Drag to reorder
        if (typeof Sortable !== 'undefined') {
            Sortable.get(row)?.destroy();
            new Sortable(row, {
                animation: 150,
                draggable: '.shelf-item',
                filter: '.shelf-ctrl',
                preventOnFilter: false,
                direction: 'horizontal',
                ghostClass: 'chip-ghost'
            });
        }
        return shelf;
    }
};
