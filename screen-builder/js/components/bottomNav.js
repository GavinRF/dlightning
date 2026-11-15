// Component registry module — see docs/component-module-migration.md
// bottomNav: bottom tab bar; editable labels, icon pickers, and add/delete of up to 5 nav items.
window.Components = window.Components || {};

window.Components.bottomNav = {
    // Prototype player (js/prototype.js): tapping an item makes it the active tab. On entry,
    // the item that links to the screen being shown becomes active, so one nav copied
    // across screens highlights the right tab on each without setting it per screen.
    play(bottomNavContainer, { screenId } = {}) {
        const nav = bottomNavContainer?.querySelector('.bottomNav');
        if (!nav || nav._playBound) return;
        nav._playBound = true;
        const items = [...nav.querySelectorAll('.nav-item-container')];
        const setActive = (item) => items.forEach(i => i.classList.toggle('active', i === item));
        if (screenId) {
            const sel = `[data-proto-target="${CSS.escape(screenId)}"]`;
            const here = items.find(i => i.matches(sel) || i.querySelector(sel));
            if (here) setActive(here);
        }
        nav.addEventListener('click', (e) => {
            const item = e.target.closest('.nav-item-container');
            if (item) setActive(item);
        });
    },

    setup(bottomNavContainer) {
        if (!bottomNavContainer) return null;

        // Get the main bottom nav element
        const bottomNav = bottomNavContainer.querySelector('.bottomNav');
        if (!bottomNav) return null;

        // Set the flag to track the component
        editor.bottomNavbarAdded = true;

        // Find all nav items
        const navItems = bottomNav.querySelectorAll('.nav-item-container');

        // Active-state toggle (also called directly by the fresh-insert path,
        // which doesn't run this full setup — see insertComponent in ux-mock-bldr.js)
        window.Components.bottomNav.setupActiveToggle(bottomNavContainer);
        window.Components.bottomNav.setupBadgeToggle(bottomNavContainer);
        window.Components.bottomNav.setupStyleControls(bottomNavContainer);

        // Setup delete buttons for nav items
        navItems.forEach(item => {
            // Delete-hover outline is CSS now; strip inline outlines left in saved HTML
            // by the old JS hover handlers (inline styles would override the CSS).
            item.style.removeProperty('outline');

            const deleteBtn = item.querySelector('.nav-delete-btn');
            if (deleteBtn) {
                // Remove any existing event listeners by cloning
                const newDeleteBtn = deleteBtn.cloneNode(true);
                deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);

                // Add fresh event listener
                newDeleteBtn.addEventListener('click', function() {
                    if (bottomNav.querySelectorAll('.nav-item-container').length > 1) {
                        this.closest('.nav-item-container').remove();
                        updateAddButtonVisibility(bottomNavContainer);
                    }
                });
            }

            // Setup icon click handlers
            const icon = item.querySelector('i');
            if (icon) {
                icon.style.cursor = 'pointer';
                icon.addEventListener('click', (e) => {
                    e.preventDefault();
                    showIconPicker(icon);
                });
            }

            // Make labels editable
            const label = item.querySelector('span');
            if (label) {
                editor.makeTextEditable(label);
            }
        });

        // Setup add button
        const addButton = bottomNav.querySelector('.nav-add-btn');
        if (addButton) {
            // Remove any existing event listeners by cloning
            const newAddButton = addButton.cloneNode(true);

            // Make sure we're only replacing if the parent still exists and contains the original button
            if (addButton.parentNode && addButton.parentNode.contains(addButton)) {
                addButton.parentNode.replaceChild(newAddButton, addButton);

                // Add fresh event listener
                newAddButton.addEventListener('click', () => {
                    if (bottomNav.querySelectorAll('.nav-item-container').length < 5) {
                        const newItem = document.createElement('div');
                        newItem.className = 'nav-item-container';
                        newItem.innerHTML = `
                            <button class="nav-delete-btn">×</button>
                            <a href="#" class="bottom-nav-item">
                                <i class="fa-solid fa-bolt-lightning" ></i>
                                <span contenteditable="true">New</span>
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
                        editor.makeTextEditable(newItem.querySelector('span'));

                        // Check if addButton is still in bottomNav before using insertBefore
                        if (bottomNav.contains(newAddButton)) {
                            bottomNav.insertBefore(newItem, newAddButton);
                        } else {
                            // Fallback: Just append the item to bottomNav
                            bottomNav.appendChild(newItem);
                        }

                        updateAddButtonVisibility(bottomNavContainer);
                    }
                });
            } else {
                // If parent-child relationship is broken, just append the new button
                if (bottomNav) {
                    bottomNav.appendChild(newAddButton);

                    // Add fresh event listener (same as above but append instead of insertBefore)
                    newAddButton.addEventListener('click', () => {
                        if (bottomNav.querySelectorAll('.nav-item-container').length < 5) {
                            const newItem = document.createElement('div');
                            newItem.className = 'nav-item-container';
                            newItem.innerHTML = `
                                <button class="nav-delete-btn">×</button>
                                <a href="#" class="bottom-nav-item">
                                    <i class="fa-solid fa-bolt-lightning" ></i>
                                    <span contenteditable="true">New</span>
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
                            editor.makeTextEditable(newItem.querySelector('span'));

                            // Just append to bottomNav
                            bottomNav.appendChild(newItem);
                            updateAddButtonVisibility(bottomNavContainer);
                        }
                    });
                }
            }
        } else {
            // Create a new add button if it doesn't exist
            const newAddButton = document.createElement('button');
            newAddButton.className = 'nav-add-btn';
            newAddButton.innerHTML = '<i class="fas fa-plus"></i>';

            newAddButton.addEventListener('click', () => {
                if (bottomNav.querySelectorAll('.nav-item-container').length < 5) {
                    const newItem = document.createElement('div');
                    newItem.className = 'nav-item-container';
                    newItem.innerHTML = `
                        <button class="nav-delete-btn">×</button>
                        <a href="#" class="bottom-nav-item">
                            <i class="fa-solid fa-bolt-lightning" ></i>
                            <span contenteditable="true">New</span>
                        </a>
                    `;

                    // Add handlers
                    newItem.querySelector('.nav-delete-btn').addEventListener('click', function() {
                        if (bottomNav.querySelectorAll('.nav-item-container').length > 1) {
                            this.closest('.nav-item-container').remove();
                            updateAddButtonVisibility(bottomNavContainer);
                        }
                    });

                    newItem.querySelector('i').addEventListener('click', (e) => {
                        e.preventDefault();
                        showIconPicker(e.target);
                    });

                    editor.makeTextEditable(newItem.querySelector('span'));

                    bottomNav.appendChild(newItem);
                    updateAddButtonVisibility(bottomNavContainer);
                }
            });

            bottomNav.appendChild(newAddButton);
        }

        // Define updateAddButtonVisibility here to avoid referencing an undefined function
        function updateAddButtonVisibility(nav) {
            try {
                if (!nav) return;

                const bottomNav = nav.querySelector('.bottomNav');
                if (!bottomNav) return;

                const itemCount = bottomNav.querySelectorAll('.nav-item-container').length;
                const addBtn = bottomNav.querySelector('.nav-add-btn');

                if (addBtn) {
                    if (itemCount >= 5) {
                        nav.classList.add('max-items');
                        addBtn.style.display = 'none';
                    } else {
                        nav.classList.remove('max-items');
                        addBtn.style.display = 'none'; // Hide by default, will show on hover
                    }
                }
            } catch (err) {
                console.error('Error in updateAddButtonVisibility:', err);
            }
        }

        // Add color swatches for elements with color variables
        const elementsWithColor = bottomNavContainer.querySelectorAll('[style*="var(--color"]');
        elementsWithColor.forEach(element => {
            const swatches = createColorSwatches(element);
            if (swatches) {
                bottomNavContainer.appendChild(swatches);
            }
        });

        // Add hover behavior to show/hide the add button
        bottomNavContainer.addEventListener('mouseenter', () => {
            const addBtn = bottomNav.querySelector('.nav-add-btn');
            if (addBtn && !bottomNavContainer.classList.contains('max-items')) {
                addBtn.style.display = 'block';
            }
        });

        bottomNavContainer.addEventListener('mouseleave', () => {
            const addBtn = bottomNav.querySelector('.nav-add-btn');
            if (addBtn) {
                addBtn.style.display = 'none';
            }
        });

        return bottomNavContainer;
    },

    // Nav STYLES (the bottom nav's "variants"). A style is `data-nav-style` on .bottomNav,
    // read by CSS — the items themselves (count, labels, icons, badges, active page) are
    // untouched, so nothing the user built is lost when switching. Same ◀ n/5 ▶ arrows
    // as other components' variants, top-left of the bar (the "+ Nav Item" button is
    // top-center). container.setVariant(i) also works, so insertComponent({ variant })
    // and templates can pick a style. Safe to call repeatedly.
    STYLES: [
        { id: 'classic', label: 'Classic' },
        { id: 'floating', label: 'Floating' },
        { id: 'center', label: 'Center action' },
        { id: 'icons', label: 'Icons only' },
        { id: 'pill', label: 'Pill indicator' }
    ],

    setupStyleControls(bottomNavContainer) {
        const bottomNav = bottomNavContainer && bottomNavContainer.querySelector('.bottomNav');
        if (!bottomNav) return;
        const STYLES = window.Components.bottomNav.STYLES;
        const currentIndex = () =>
            Math.max(0, STYLES.findIndex(s => s.id === (bottomNav.dataset.navStyle || 'classic')));

        // Saved/synced HTML can carry a dead copy of the arrows — replace it
        bottomNavContainer.querySelectorAll(':scope > .nav-style-controls').forEach(el => el.remove());

        const controls = document.createElement('div');
        controls.className = 'variant-controls nav-style-controls';
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
            if (style.id === 'classic') delete bottomNav.dataset.navStyle;
            else bottomNav.dataset.navStyle = style.id;

            // These styles show the current page by its indicator — make sure one is set
            if ((style.id === 'icons' || style.id === 'pill') &&
                !bottomNav.querySelector('.nav-item-container.active')) {
                bottomNav.querySelector('.nav-item-container')?.classList.add('active');
            }
            render();

            // Save change detection ignores data-attribute changes — flag the screen
            const canvasId = bottomNav.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
            window.projectManager?.addCanvasToChanged(canvasId, 'Bottom nav style changed');
        };

        prevBtn.addEventListener('click', (e) => { e.stopPropagation(); apply(currentIndex() - 1); });
        nextBtn.addEventListener('click', (e) => { e.stopPropagation(); apply(currentIndex() + 1); });
        bottomNavContainer.setVariant = (index) => apply(parseInt(index, 10) || 0);

        render();
        bottomNavContainer.appendChild(controls);
    },

    // "Set active page" toggle: a ✓ button per nav item that marks one item `.active`
    // (bold + underlined label, styled in componentVariants.css). Safe to call repeatedly.
    setupActiveToggle(bottomNavContainer) {
        const bottomNav = bottomNavContainer && bottomNavContainer.querySelector('.bottomNav');
        if (!bottomNav) return;

        // Button is injected per item so older saved navs and items created by
        // any of the add-button paths all get one.
        function ensureActiveBtn(item) {
            if (item.querySelector('.nav-active-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'nav-active-btn non-editable';
            btn.title = 'Set as active page';
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            item.insertBefore(btn, item.firstChild);
        }

        // One delegated listener per nav element (setup can run more than once on
        // the same element, so guard against double-binding, which would toggle twice).
        if (!bottomNav._activeHandlerBound) {
            bottomNav._activeHandlerBound = true;
            bottomNav.addEventListener('click', (e) => {
                const activeBtn = e.target.closest('.nav-active-btn');
                if (activeBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    const item = activeBtn.closest('.nav-item-container');
                    const wasActive = item.classList.contains('active');
                    bottomNav.querySelectorAll('.nav-item-container.active')
                        .forEach(el => el.classList.remove('active'));
                    if (!wasActive) item.classList.add('active');
                    return;
                }
                // The add button's own handler (on the button) runs before this bubbles
                // up, so the new item already exists — give it an active toggle.
                if (e.target.closest('.nav-add-btn')) {
                    bottomNav.querySelectorAll('.nav-item-container').forEach(ensureActiveBtn);
                }
            });
        }

        bottomNav.querySelectorAll('.nav-item-container').forEach(ensureActiveBtn);
    },

    // Notification badge toggle: a bell button per nav item that adds/removes a red
    // `.nav-badge` on the item's icon (styled in componentVariants.css). The badge
    // number is editable inline; clearing it leaves a plain dot. Safe to call repeatedly.
    setupBadgeToggle(bottomNavContainer) {
        const bottomNav = bottomNavContainer && bottomNavContainer.querySelector('.bottomNav');
        if (!bottomNav) return;

        const markChanged = (reason) => {
            const canvasId = bottomNav.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
            window.projectManager?.addCanvasToChanged(canvasId, reason);
        };

        function ensureBadgeBtn(item) {
            if (item.querySelector('.nav-badge-btn')) return;
            const btn = document.createElement('button');
            btn.className = 'nav-badge-btn non-editable';
            btn.title = 'Toggle notification badge';
            btn.innerHTML = '<i class="fa-solid fa-bell"></i>';
            item.insertBefore(btn, item.firstChild);
        }

        if (!bottomNav._badgeHandlerBound) {
            bottomNav._badgeHandlerBound = true;

            bottomNav.addEventListener('click', (e) => {
                const badgeBtn = e.target.closest('.nav-badge-btn');
                if (badgeBtn) {
                    e.preventDefault();
                    e.stopPropagation();
                    const navItem = badgeBtn.closest('.nav-item-container')
                        .querySelector('.bottom-nav-item');
                    if (!navItem) return;
                    const existing = navItem.querySelector('.nav-badge');
                    if (existing) {
                        existing.remove();
                    } else {
                        const badge = document.createElement('span');
                        badge.className = 'nav-badge';
                        badge.contentEditable = 'true';
                        badge.spellcheck = false;
                        badge.textContent = '3';
                        navItem.appendChild(badge);
                    }
                    markChanged('Bottom nav badge toggled');
                    return;
                }
                // New items from the add button get a badge toggle too
                // (the add button's own handler has already run by now).
                if (e.target.closest('.nav-add-btn')) {
                    bottomNav.querySelectorAll('.nav-item-container').forEach(ensureBadgeBtn);
                }
            });

            // Keep the badge short ("9", "12", "99+") and on one line.
            bottomNav.addEventListener('keydown', (e) => {
                if (e.target.classList?.contains('nav-badge') && e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur();
                }
            });
            bottomNav.addEventListener('input', (e) => {
                const badge = e.target;
                if (!badge.classList?.contains('nav-badge')) return;
                if (badge.textContent.length > 3) {
                    badge.textContent = badge.textContent.slice(0, 3);
                    // Put the caret back at the end after rewriting the text
                    const range = document.createRange();
                    range.selectNodeContents(badge);
                    range.collapse(false);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            });
            // An emptied badge becomes a plain dot — strip any stray <br> so :empty matches.
            bottomNav.addEventListener('focusout', (e) => {
                const badge = e.target;
                if (!badge.classList?.contains('nav-badge')) return;
                if (badge.textContent.trim() === '') badge.innerHTML = '';
                markChanged('Bottom nav badge edited');
            });
        }

        bottomNav.querySelectorAll('.nav-item-container').forEach(ensureBadgeBtn);
    }
};
