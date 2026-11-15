// Component registry module — see docs/component-module-migration.md
// breadcrumb: a trail of page links; the last crumb is the current page. Separators are
// CSS (::before on each crumb after the first, per variant), so adding/removing crumbs
// needs no separator bookkeeping. Editor: hover a crumb for × (remove), "+" adds one
// before the current page. Play: an unlinked earlier crumb (or the back-link variant)
// acts as Back.
window.Components = window.Components || {};

const BC_ITEM = (label) =>
    `<span class="bc-item"><span class="bc-label" contenteditable="true">${label}</span></span>`;

const BREADCRUMB_VARIANTS = [
    // 1 — Chevrons
    /*html*/
    `<nav class="breadcrumb bc-chevron">
        <div class="bc-list">${BC_ITEM('Home')}${BC_ITEM('Shop')}${BC_ITEM('Running Shoes')}</div>
    </nav>`,

    // 2 — Home icon + slashes
    /*html*/
    `<nav class="breadcrumb bc-slash">
        <div class="bc-list"><span class="bc-item bc-home"><span class="icon-container"><i class="fas fa-house"></i></span></span>${BC_ITEM('Library')}${BC_ITEM('Albums')}${BC_ITEM('Favorites')}</div>
    </nav>`,

    // 3 — Pills, the current page filled
    /*html*/
    `<nav class="breadcrumb bc-pills">
        <div class="bc-list">${BC_ITEM('Settings')}${BC_ITEM('Account')}${BC_ITEM('Privacy')}</div>
    </nav>`,

    // 4 — Collapsed middle (mobile truncation)
    /*html*/
    `<nav class="breadcrumb bc-chevron bc-collapsed">
        <div class="bc-list">${BC_ITEM('Home')}<span class="bc-item bc-ellipsis"><span class="bc-label non-editable">…</span></span>${BC_ITEM('Jackets')}${BC_ITEM('Rain Shell')}</div>
    </nav>`,

    // 5 — Mobile back link to the parent page
    /*html*/
    `<nav class="breadcrumb bc-back">
        <div class="bc-list"><span class="bc-item"><span class="icon-container bc-back-icon"><i class="fas fa-chevron-left"></i></span><span class="bc-label" contenteditable="true">Back to Shoes</span></span></div>
    </nav>`
];

window.Components.breadcrumb = {
    // Owns its variants (setupVariants falls through here).
    variants() {
        return BREADCRUMB_VARIANTS.slice();
    },

    // Build a fresh breadcrumb (variant 1) — used by the editor factory on insert.
    create() {
        const temp = document.createElement('div');
        temp.innerHTML = BREADCRUMB_VARIANTS[0];
        const bc = temp.firstElementChild;
        this.setup(bc);
        return bc;
    },

    // Prototype player (js/prototype.js). Crumbs with a link of their own are handled by
    // the player; an unlinked crumb before the current one (or a back link) goes Back.
    play(root) {
        const bc = root.querySelector('.breadcrumb');
        if (!bc || bc._playBound) return;
        bc._playBound = true;
        const items = [...bc.querySelectorAll('.bc-item')];
        const isBackLink = bc.classList.contains('bc-back');
        items.forEach((item, i) => {
            if ((i === items.length - 1 && !isBackLink) || item.classList.contains('bc-ellipsis')) return;
            item.classList.add('bc-tappable');
            item.addEventListener('click', (e) => {
                if (item.closest('[data-proto-action]')) return;
                e.stopPropagation();
                window.prototypeMode?.goBack?.();
            });
        });
    },

    afterVariantChange(content) {
        const bc = content.querySelector('.breadcrumb');
        if (bc) this.setup(bc);
    },

    // Editor wiring. Accepts the .breadcrumb itself or anything containing one. Safe to
    // call repeatedly (load, live sync, undo, duplicate, variant switch).
    setup(container) {
        const bc = container?.classList?.contains('breadcrumb') ? container : container?.querySelector('.breadcrumb');
        const list = bc?.querySelector('.bc-list');
        if (!list) return null;

        list.querySelectorAll('.bc-item').forEach(item => {
            if (item.querySelector(':scope > .bc-del')) return;
            const del = document.createElement('button');
            del.type = 'button';
            del.className = 'bc-del non-editable';
            del.title = 'Remove';
            del.textContent = '×';
            item.appendChild(del);
        });

        if (!bc.querySelector(':scope > .bc-add-btn')) {
            const add = document.createElement('button');
            add.type = 'button';
            add.className = 'bc-add-btn non-editable';
            add.title = 'Add a level';
            add.textContent = '+';
            bc.appendChild(add);
        }

        if (!bc._bcBound) {
            bc._bcBound = true;
            bc.addEventListener('click', (e) => {
                const ctrl = e.target.closest('.bc-del, .bc-add-btn');
                if (!ctrl || !bc.contains(ctrl)) return;
                e.preventDefault();
                e.stopPropagation();
                const items = [...list.querySelectorAll('.bc-item')];
                if (ctrl.classList.contains('bc-del')) {
                    if (items.length <= 1) return;
                    ctrl.closest('.bc-item')?.remove();
                    return;
                }
                // Add a level just before the current page
                const item = document.createElement('span');
                item.innerHTML = BC_ITEM('Page');
                const crumb = item.firstElementChild;
                const current = items[items.length - 1];
                if (current && items.length > 1) list.insertBefore(crumb, current);
                else list.appendChild(crumb);
                this.setup(bc);
            });
        }
        return bc;
    }
};
