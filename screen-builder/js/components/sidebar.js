// Component registry module — see docs/component-module-migration.md
// sidebar: collapsible side nav; re-wires nav-item hover/delete, add-item, and the collapse toggle.
window.Components = window.Components || {};

window.Components.sidebar = {
    // Styles (the sidebar's "variants"): data-sidebar-style on .sidebar-container, read by
    // CSS (componentVariants.css), so switching keeps the items, header and footer the user
    // built. No attribute = the classic left drawer. container.setVariant(i) also works, so
    // insertComponent({ variant }) and templates can pick one.
    STYLES: [
        { id: 'drawer', label: 'Drawer' },
        { id: 'right', label: 'Right drawer' },
        { id: 'full', label: 'Full-screen menu' }
    ],

    styleOf(root) {
        return root?.dataset.sidebarStyle || 'drawer';
    },

    // Open/closed is data-sidebar-closed on the root (CSS does the sliding). Sidebars saved
    // before that kept it as inline styles (8px-wide root), so those still read as closed
    // and are converted on the next toggle / setup.
    isOpen(root) {
        return !!root && !root.hasAttribute('data-sidebar-closed') && root.style.width !== '8px';
    },

    setOpen(root, open) {
        if (!root) return;
        const panel = root.querySelector('.sidebar-panel');
        const toggle = root.querySelector('.sidebar-toggle');
        if (panel) panel.style.transform = '';
        if (toggle) toggle.style.transform = '';
        root.style.width = '';
        root.toggleAttribute('data-sidebar-closed', !open);
    },

    // Prototype player (js/prototype.js). `root` = the .sidebar-container in the clone.
    // The toggle collapses/expands it; no add/delete. Starts collapsed when a prototype
    // link targets it — and a full-screen menu also starts closed when the screen's navbar
    // has a hamburger to open it. Tapping an item in a full-screen menu closes it.
    play(root, { startOpen = true } = {}) {
        if (!root || root._playBound) return;
        root._playBound = true;
        const full = this.styleOf(root) === 'full';
        if (full && root.closest('.canvas')?.querySelector('.navContain .fa-bars')) startOpen = false;
        this.playSetOpen(root, startOpen);
        root.querySelector('.sidebar-toggle')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playSetOpen(root, !this.playIsOpen(root));
        });
        if (full) {
            root.querySelector('.sidebar-nav')?.addEventListener('click', (e) => {
                if (e.target.closest('.sidebar-nav-item')) this.playSetOpen(root, false);
            });
        }
    },

    playSetOpen(root, open) {
        this.setOpen(root, open);
    },

    playIsOpen(root) {
        return this.isOpen(root);
    },

    // ◀ n/3 ▶ arrows, top-center of the sidebar (same look as other variant arrows).
    // Safe to call repeatedly: saved/synced HTML can carry a dead copy, which is replaced.
    setupStyleControls(container) {
        if (!container) return;
        const STYLES = this.STYLES;
        container.querySelectorAll(':scope > .sidebar-style-controls').forEach(el => el.remove());
        const currentIndex = () => Math.max(0, STYLES.findIndex(s => s.id === this.styleOf(container)));

        const controls = document.createElement('div');
        controls.className = 'variant-controls sidebar-style-controls';
        const prevBtn = document.createElement('button');
        prevBtn.className = 'nav-control prev-nav';
        prevBtn.innerHTML = '<i class="fas fa-circle-left"></i>';
        const number = document.createElement('span');
        number.className = 'variant-number';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'nav-control next-nav';
        nextBtn.innerHTML = '<i class="fas fa-circle-right"></i>';
        controls.append(prevBtn, number, nextBtn);

        const render = () => {
            const i = currentIndex();
            number.textContent = `${i + 1}/${STYLES.length}`;
            controls.title = STYLES[i].label;
        };

        const apply = (index) => {
            const style = STYLES[((index % STYLES.length) + STYLES.length) % STYLES.length];
            if (style.id === 'drawer') delete container.dataset.sidebarStyle;
            else container.dataset.sidebarStyle = style.id;
            this.setOpen(container, true);   // show the new style
            render();
            // Save change detection ignores data-attribute changes — flag the screen
            const canvasId = container.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
            if (canvasId) window.projectManager?.addCanvasToChanged?.(canvasId, 'Sidebar style changed');
        };

        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); apply(currentIndex() - 1); });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); apply(currentIndex() + 1); });
        container.setVariant = (index) => apply(parseInt(index, 10) || 0);

        render();
        container.appendChild(controls);
    },

    setup(container) {
        if (!container) return null;

        // Find key elements
        const sidebar = container.querySelector('.sidebar-panel');
        const toggleButton = sidebar?.querySelector('.sidebar-toggle');
        const nav = sidebar?.querySelector('.sidebar-nav');
        const addButton = sidebar?.querySelector('.sidebar-add-btn');

        if (!sidebar || !nav) return null;

        // Function to create a new nav item
        const createNavItem = (icon = 'bolt-lightning', text = 'New Item') => {
            const itemCon = document.createElement('div');
            itemCon.className = 'icon-container';
        const navItem = document.createElement('div');
        navItem.className = 'sidebar-nav-item';

        const iconElement = document.createElement('i');
        iconElement.className = `fas fa-${icon}`;
        iconElement.style.cssText = `
            width: 20px;
            text-align: center;
            color: var(--color-primary);
        `;

        const textElement = document.createElement('span');
        textElement.textContent = text;
        textElement.setAttribute('contenteditable', 'true');
        textElement.style.flex = '1';

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'nav-item-delete';
        deleteButton.innerHTML = '×';

        // Add event listeners for hover states
        navItem.addEventListener('mouseenter', () => {
            navItem.style.outline = '2px solid var(--neutral-gray)';
            deleteButton.style.display = 'block';
            setTimeout(() => deleteButton.style.opacity = '1', 0);
        });

        navItem.addEventListener('mouseleave', () => {
            navItem.style.outline = 'none';
            deleteButton.style.opacity = '0';
        });

        // Add delete functionality
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navItem.classList.add('delete-animation');
            setTimeout(() => navItem.remove(), 200);
        });

        navItem.appendChild(iconElement);
        navItem.appendChild(textElement);
        navItem.appendChild(deleteButton);
        itemCon.appendChild(navItem);

        editor.setupIconPicker(itemCon);
        return itemCon;
        };


        // Setup existing nav items
        nav.querySelectorAll('.sidebar-nav-item').forEach(item => {
        const deleteButton = item.querySelector('.nav-item-delete');

        // Reattach delete button functionality
        if (deleteButton) {
            // Remove any existing event listeners
            const newDeleteButton = deleteButton.cloneNode(true);
            deleteButton.parentNode.replaceChild(newDeleteButton, deleteButton);

            // Add fresh event listener
            newDeleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            item.classList.add('delete-animation');
            setTimeout(() => item.remove(), 200);
            });
        }

        // Reattach hover behaviors
        item.addEventListener('mouseenter', () => {
            item.style.outline = '2px solid var(--neutral-gray)';
            const deleteBtn = item.querySelector('.nav-item-delete');
            if (deleteBtn) {
            deleteBtn.style.display = 'block';
            setTimeout(() => deleteBtn.style.opacity = '1', 0);
            }
        });

        item.addEventListener('mouseleave', () => {
            item.style.outline = 'none';
            const deleteBtn = item.querySelector('.nav-item-delete');
            if (deleteBtn) deleteBtn.style.opacity = '0';
        });
        });

        // Reattach "Add Item" functionality
        if (addButton) {
        // Remove any existing event listeners
        const newAddButton = addButton.cloneNode(true);
        if (addButton.parentNode) {
            addButton.parentNode.replaceChild(newAddButton, addButton);
        }

        // Add fresh event listener
        newAddButton.addEventListener('click', () => {
            const newItem = createNavItem();
            nav.appendChild(newItem);
        });

        // Reattach hover visibility
        container.addEventListener('mouseenter', () => {
            newAddButton.style.display = 'flex';
        });

        container.addEventListener('mouseleave', () => {
            newAddButton.style.display = 'none';
        });
        }

        // Reattach toggle functionality
        if (toggleButton) {
        // Remove any existing event listeners
        const newToggleButton = toggleButton.cloneNode(true);
        toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);
        newToggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.setOpen(container, !this.isOpen(container));
            const canvasId = container.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
            if (canvasId) window.projectManager?.addCanvasToChanged?.(canvasId, 'Sidebar toggled');
        });
        }

        // Older saves kept open/closed as inline styles — convert to the attribute
        this.setOpen(container, this.isOpen(container));
        this.setupStyleControls(container);

        return container;
    }
};
