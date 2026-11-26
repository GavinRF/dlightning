// Component registry module — see docs/component-module-migration.md
// bottomNav: bottom tab bar; editable labels, icon pickers, and add/delete of up to 5 nav items.
window.Components = window.Components || {};

window.Components.bottomNav = {
    // Prototype player (js/prototype.js): tapping an item makes it the active tab. On entry,
    // the item that links to the screen being shown becomes active, so one nav copied
    // across screens highlights the right tab on each without setting it per screen.
    // A tab's alert chip (.nav-badge) goes away once the tester has been to the screen it
    // links to (`visited`: the player's screen ids this run, current one included), on every
    // screen's copy of the nav, until Play starts over.
    play(bottomNavContainer, { screenId, visited } = {}) {
        const nav = bottomNavContainer?.querySelector('.bottomNav');
        if (!nav || nav._playBound) return;
        nav._playBound = true;
        this.playReturn(bottomNavContainer, { screenId, visited });
        nav.addEventListener('click', (e) => {
            const item = e.target.closest('.nav-item-container');
            if (item) this._playSetActive(nav, item);
        });
    },

    // Also run when the player shows a kept screen again (it keeps what the tester did): the
    // tab tapped to leave was made active, so the screen's own tab is set again, and chips
    // of screens seen since then go.
    playReturn(bottomNavContainer, { screenId, visited } = {}) {
        const nav = bottomNavContainer?.querySelector('.bottomNav');
        if (!nav) return;
        const items = [...nav.querySelectorAll('.nav-item-container')];
        const targetOf = (item) => (item.matches('[data-proto-target]') ? item : item.querySelector('[data-proto-target]'))
            ?.getAttribute('data-proto-target');
        const here = screenId && items.find(i => targetOf(i) === screenId);
        if (here) this._playSetActive(nav, here);
        if (visited?.size) items.forEach(i => {
            if (visited.has(targetOf(i))) i.querySelectorAll('.nav-badge').forEach(b => b.remove());
        });
    },

    _playSetActive(nav, item) {
        nav.querySelectorAll('.nav-item-container').forEach(i => i.classList.toggle('active', i === item));
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
        // Center action style: readable icon on the raised button, whatever the primary color
        const navEl = bottomNavContainer.querySelector('.bottomNav');
        window.accentContrast?.update(navEl);
        requestAnimationFrame(() => window.accentContrast?.update(navEl));   // once a fresh insert is in the page
        window.Components.bottomNav.setupAutoLink(bottomNavContainer);
        // Loaded / synced bottom navs come back with their × but no click handler
        editor.setupDeleteHandler(bottomNavContainer);

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
            // The nav icon itself — not item.querySelector('i'): setupActiveToggle /
            // setupBadgeToggle (above) put their ✓ / bell buttons, each with an <i>, first in
            // the item, so that would bind the picker to the bell instead
            const icon = item.querySelector('.bottom-nav-item > i');
            if (icon && !icon._iconPickerBound) {
                icon._iconPickerBound = true;
                icon.style.cursor = 'pointer';
                icon.addEventListener('click', (e) => {
                    e.preventDefault();
                    showIconPicker(icon);
                });
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
                                <span class="usa" contenteditable="true">New</span>
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
                                    <span class="usa" contenteditable="true">New</span>
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
                            <span class="usa" contenteditable="true">New</span>
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

        // Last, so setup's own changes (chrome, swatches) aren't taken for an edit
        window.componentSync?.attach(bottomNavContainer, 'bottomNav');   // Reuse / Synced · N / Detach + sync
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
            if (style.id === 'center') window.accentContrast?.update(bottomNav);
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
                        badge.className = 'nav-badge usa';
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
    },

    // ---- Use on other screens / keep copies in sync ---------------------------------------
    // The shared code is js/component-sync.js (Reuse / Synced · N / Detach, the screen checklist,
    // pushing edits, the delete question). The bottom nav's own part: each screen has its own
    // active tab (the tab linking to that screen; play() does the same in the player), and after
    // a copy autoLink (below) connects tabs whose names match screens.
    // Screens that usually have no tab bar start unchecked
    SKIP_SCREEN_NAMES: /\b(log ?in|sign ?(in|up)|register|onboard\w*|welcome|splash|verify|verification|forgot|password|reset)\b/i,

    // Bar width (in the controls' px) below which they're icon-only, "+ Nav Item" too: the pill
    // hangs off the style arrows' left, and with labels it only clears "+ Nav Item" from about
    // here. Phone screens at 100% are icon-only.
    COMPACT_BELOW: 500,

    navOf(canvas) {
        return canvas?.querySelector(':scope > .bottomNavContain') || null;
    },

    // The nav and every copy of it (same data-nav-group)
    navCopies(nav) {
        return window.componentSync.copies(nav);
    },

    copyTo(source, canvases, options) {
        return window.componentSync.copyTo(source, canvases, options);
    },

    // Navs built identical (an app pack's tab bars) become synced groups: one per distinct bar
    groupNavs(navs) {
        window.componentSync.groupIdentical(navs);
    },

    // componentSync settings (registered below)
    syncSettings() {
        const B = window.Components.bottomNav;
        const linksHere = (canvas) => {
            const id = canvas?.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
            return id ? `[data-proto-target="${CSS.escape(id)}"]` : null;
        };
        return {
            container: '.bottomNavContain',
            inner: '.bottomNav',
            groupAttr: 'data-nav-group',   // saved html since before component-sync.js: keep
            groupPrefix: 'nav_',
            noun: 'bottom nav',
            replacesNote: 'nav',
            skipScreens: B.SKIP_SCREEN_NAMES,
            compactBelow: B.COMPACT_BELOW,
            // The active tab is per screen
            normalize(clone) {
                clone.querySelectorAll('.nav-item-container').forEach(item => item.classList.remove('active'));
            },
            // … the tab that links to that screen, else none
            forScreen(clone, canvas) {
                const sel = linksHere(canvas);
                clone.querySelectorAll('.nav-item-container').forEach(item => {
                    item.classList.toggle('active', !!sel && (item.matches(sel) || !!item.querySelector(sel)));
                });
            },
            // … else the tab it had (by label)
            carryOver(old, fresh) {
                const oldActive = old.querySelector('.nav-item-container.active');
                const label = oldActive && B.tabLabel(oldActive);
                const items = [...fresh.querySelectorAll('.nav-item-container')];
                if (label && !items.some(i => i.classList.contains('active'))) {
                    items.find(i => B.tabLabel(i) === label)?.classList.add('active');
                }
            },
            // "+ Nav Item" goes icon-only with the sync controls (chrome: not saved)
            onCompact(nav, compact) {
                nav.querySelector('.bottomNav > .nav-add-btn')?.classList.toggle('is-compact', compact);
            },
            afterCopy(source, message) {
                B.announceLinks(B.autoLink(source), message);
            },
        };
    },

    // ---- Auto-connect tabs to screens ------------------------------------------------------
    // A tab with no link yet gets one when exactly one screen fits it (never overwrites a link,
    // never guesses between two screens), checked in this order:
    //   1. its label = a screen's name ("Home" → the screen named Home; case, punctuation,
    //      plurals and words like "screen" / "page" don't count)
    //   2. a close synonym (Profile ↔ Account, Alerts ↔ Notifications…: TAB_SYNONYMS)
    //   3. the tab is the active one on a copy of the nav on an unnamed screen nothing else
    //      claimed (Home is highlighted on "Screen 1" → that screen is Home)
    // Links are tab-bar style (data-proto-transition="none", like app packs' tabBar), go on
    // every copy of a shared nav (same data-nav-group, by tab position) and set the active tab
    // of copies that have none. Runs when a nav is added from the sidebar, copied to screens,
    // a tab label is edited, or a screen is renamed; a toast says what got connected, with Undo.
    TAB_SYNONYMS: [
        ['home', 'feed', 'dashboard', 'main'],
        ['profile', 'account', 'me', 'myaccount', 'myprofile', 'you'],
        ['search', 'explore', 'discover', 'browse', 'find'],
        ['alert', 'notification', 'activity'],
        ['message', 'chat', 'inbox', 'dm', 'conversation'],
        ['cart', 'bag', 'basket'],
        ['setting', 'preference'],
        ['order', 'myorder', 'purchase'],
        ['favorite', 'favourite', 'saved', 'like', 'wishlist'],
        ['create', 'new', 'add', 'post', 'compose', 'upload'],
        ['report', 'analytic', 'insight', 'stat'],
        ['calendar', 'schedule', 'event'],
        ['library', 'collection'],
        ['wallet', 'payment', 'card'],
    ],

    // "My Orders Page" → "myorder"
    tabKey(text) {
        const words = String(text || '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, ' ').trim().split(' ')
            .filter(w => w && !['screen', 'page', 'tab', 'view', 'the'].includes(w))
            .map(w => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) ? w.slice(0, -1) : w);
        return words.join('');
    },

    tabSynonyms(key) {
        if (!key) return null;
        const group = window.Components.bottomNav.TAB_SYNONYMS.find(g => g.includes(key));
        return group ? new Set(group) : null;
    },

    tabLabel(item) {
        return item.querySelector('.bottom-nav-item span[contenteditable]:not(.nav-badge)')?.textContent.trim() || '';
    },

    // Work out and apply the links for `nav` (and its copies). Returns { labels, undo } or null.
    autoLink(nav) {
        const B = window.Components.bottomNav;
        if (!nav?.isConnected) return null;
        const navs = B.navCopies(nav);
        const itemsOf = n => [...n.querySelectorAll('.bottomNav .nav-item-container')];
        const tabs = itemsOf(nav);
        const linked = el => el.hasAttribute('data-proto-action');
        const idOf = el => el.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');

        const screens = [...document.querySelectorAll('#mockZone .canvas-wrapper[data-canvas-id]')].map(w => ({
            id: w.getAttribute('data-canvas-id'),
            key: B.tabKey(w.querySelector('.canvas')?.getAttribute('data-screen-name') || ''),
        }));
        // Screens a tab already goes to
        const taken = new Set(tabs.map(t => linked(t) && t.getAttribute('data-proto-target')).filter(Boolean));
        const plan = new Map();   // tab index → screen id
        const claim = (i, id) => { plan.set(i, id); taken.add(id); };
        const open = () => tabs.map((t, i) => i).filter(i => !linked(tabs[i]) && !plan.has(i));
        const only = list => (list.length === 1 ? list[0] : null);

        // 1. same name — a screen two tabs would both match is left alone
        const keys = tabs.map(t => B.tabKey(B.tabLabel(t)));
        open().forEach(i => {
            if (!keys[i] || keys.filter(k => k === keys[i]).length > 1) return;
            const hit = only(screens.filter(s => s.key === keys[i] && !taken.has(s.id)));
            if (hit) claim(i, hit.id);
        });
        // 2. synonyms
        open().forEach(i => {
            const group = B.tabSynonyms(keys[i]);
            if (!group) return;
            if (open().some(j => j !== i && group.has(keys[j]))) return;   // two tabs, one meaning
            const hit = only(screens.filter(s => s.key && group.has(s.key) && !taken.has(s.id)));
            if (hit) claim(i, hit.id);
        });
        // 3. the active tab on a copy whose screen is unnamed and unclaimed (a named screen
        //    that matched no tab is some other page: "Settings" with Home highlighted isn't Home)
        const hints = new Map();   // tab index → [screen ids]
        const unnamed = new Set(screens.filter(s => !s.key).map(s => s.id));
        navs.forEach(n => {
            const i = itemsOf(n).findIndex(t => t.classList.contains('active'));
            const id = idOf(n);
            if (i < 0 || !id || taken.has(id) || !unnamed.has(id)) return;
            hints.set(i, [...(hints.get(i) || []), id]);
        });
        open().forEach(i => {
            const ids = hints.get(i);
            const id = ids && only([...new Set(ids)]);
            if (id && !taken.has(id)) claim(i, id);
        });
        if (!plan.size) return null;

        // Apply to every copy
        const undo = [];
        const changed = new Set();
        navs.forEach(n => {
            const items = itemsOf(n);
            plan.forEach((id, i) => {
                const item = items[i];
                if (!item || linked(item)) return;
                const hadTransition = item.getAttribute('data-proto-transition');
                item.setAttribute('data-proto-action', 'navigate');
                item.setAttribute('data-proto-target', id);
                if (hadTransition == null) item.setAttribute('data-proto-transition', 'none');
                undo.push({ item, id, hadTransition });
                changed.add(n);
            });
            // A copy with no active tab: the one going to its own screen
            const own = idOf(n);
            if (own && !items.some(t => t.classList.contains('active'))) {
                const here = items.find(t => t.getAttribute('data-proto-target') === own);
                if (here) { here.classList.add('active'); undo.push({ item: here, active: true }); changed.add(n); }
            }
        });
        if (!undo.length) return null;
        const mark = (n, why) => {
            const id = idOf(n);
            if (!id || !window.projectManager) return;
            window.projectManager.addCanvasToChanged(id, why);
            window.projectManager.contentChanged = true;
        };
        changed.forEach(n => mark(n, 'Bottom nav tabs connected to screens'));
        window.prototypeMode?.refresh?.();

        const labels = [...plan.keys()].sort((a, b) => a - b).map(i => B.tabLabel(tabs[i]) || `Tab ${i + 1}`);
        return {
            labels,
            undo() {
                undo.forEach(u => {
                    if (!u.item.isConnected) return;
                    if (u.active) { u.item.classList.remove('active'); return; }
                    if (u.item.getAttribute('data-proto-target') !== u.id) return;   // relinked since
                    u.item.removeAttribute('data-proto-action');
                    u.item.removeAttribute('data-proto-target');
                    if (u.hadTransition == null) u.item.removeAttribute('data-proto-transition');
                });
                changed.forEach(n => n.isConnected && mark(n, 'Bottom nav tab connections undone'));
                window.prototypeMode?.refresh?.();
            },
        };
    },

    // autoLink for every nav (each shared group once) — after a screen rename
    autoLinkAll() {
        const B = window.Components.bottomNav;
        const seen = new Set();
        const results = [];
        document.querySelectorAll('#mockZone .canvas > .bottomNavContain').forEach(n => {
            const key = n.dataset.navGroup || n;
            if (seen.has(key)) return;
            seen.add(key);
            const r = B.autoLink(n);
            if (r) results.push(r);
        });
        if (!results.length) return null;
        return {
            labels: [...new Set(results.flatMap(r => r.labels))],
            undo: () => results.forEach(r => r.undo()),
        };
    },

    // `prefix` (e.g. "Bottom nav added to 2 screens") + what autoLink connected, with Undo
    announceLinks(result, prefix = '') {
        const notify = (msg) => window.projectManager?.showNotification?.(msg);
        if (!result) { if (prefix) notify(prefix); return; }
        const n = result.labels.length;
        const text = `${prefix ? `${prefix}. ` : ''}Connected ${n === 1 ? 'the' : n} ${n === 1 ? 'tab' : 'tabs'} ` +
            `${result.labels.join(', ')} to ${n === 1 ? 'its screen' : 'their screens'}`;
        document.querySelectorAll('.nav-link-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = 'notification success nav-link-toast';
        toast.setAttribute('role', 'status');
        toast.innerHTML = '<span></span><button type="button">Undo</button>';
        toast.querySelector('span').textContent = text;
        toast.querySelector('button').addEventListener('click', () => {
            result.undo();
            toast.remove();
            notify('Tab connections removed');
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 7000);
    },

    // Label edits (bound once per nav by setup): a renamed tab may now match a screen
    setupAutoLink(bottomNavContainer) {
        const bottomNav = bottomNavContainer?.querySelector('.bottomNav');
        if (!bottomNav || bottomNav._autoLinkBound) return;
        bottomNav._autoLinkBound = true;
        bottomNav.addEventListener('focusin', (e) => {
            const span = e.target.closest?.('.bottom-nav-item span[contenteditable]');
            if (span && !span.classList.contains('nav-badge')) span._labelBefore = span.textContent;
        });
        bottomNav.addEventListener('focusout', (e) => {
            const span = e.target.closest?.('.bottom-nav-item span[contenteditable]');
            if (!span || span.classList.contains('nav-badge') || span._labelBefore === span.textContent) return;
            const B = window.Components.bottomNav;
            const item = span.closest('.nav-item-container');
            if (!item || item.hasAttribute('data-proto-action')) return;
            B.announceLinks(B.autoLink(span.closest('.bottomNavContain')));
        });
    }
};

// (templates.html loads this module without component-sync.js)
window.componentSync?.register('bottomNav', window.Components.bottomNav.syncSettings());
