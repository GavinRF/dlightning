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
    // No add/delete. Starts the way it was left in the editor (open / closed), collapsed when
    // a prototype link targets it — and a full-screen menu also starts closed when the
    // screen's navbar has a hamburger to open it. Tapping an item closes it (unless the item's
    // own link opens / closes the sidebar). An open drawer dims the screen behind it
    // (.proto-sidebar-scrim, shown by prototype.css); tapping that closes it. Drawers hide
    // their toggle tab in play (CSS):
    // the hamburger (prototype.js navbarDefault), a link, or a swipe opens / closes them —
    // swipe the panel (its closed rail too) toward / away from its edge, or for the right
    // drawer (fully off-screen when closed) swipe in from the screen's right edge.
    // With the rail on (railOn), the rail is where it rests: the header's rail button, the
    // hamburger, a link, an item tap, the dim and a swipe expand it / shrink it back to the
    // rail instead of closing it (playSetOpen), and the rail doesn't dim the screen.
    play(root, { startOpen } = {}) {
        if (!root || root._playBound) return;
        root._playBound = true;
        if (startOpen === undefined) startOpen = this.isOpen(root);
        const full = this.styleOf(root) === 'full';
        if (full && root.closest('.canvas')?.querySelector('.navContain .fa-bars')) startOpen = false;
        this.setOpen(root, startOpen);   // a minimized rail starts minimized
        root.querySelector('.sidebar-toggle')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playSetOpen(root, !this.playIsOpen(root));
        });
        root.querySelector('.sidebar-rail-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playSetOpen(root, !this.playIsOpen(root));
        });
        const panel = root.querySelector('.sidebar-panel');
        root.querySelector('.sidebar-nav')?.addEventListener('click', (e) => {
            if (panel?._protoDragged) return;   // a swipe, not a tap
            const item = e.target.closest('.sidebar-nav-item');
            if (!item || item.getAttribute('data-proto-overlay') === 'sidebar') return;
            this.playSetOpen(root, false);
        });
        if (!full) {
            const right = this.styleOf(root) === 'right';
            const scrim = document.createElement('div');
            scrim.className = 'proto-sidebar-scrim';
            scrim.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playSetOpen(root, false);
            });
            root.before(scrim);
            // +1 = toward opening (away from the drawer's edge), -1 = toward closing
            const onSwipe = (dir) => this.playSetOpen(root, dir > 0);
            if (panel) this.playSwipe(panel, right, onSwipe);
            if (right) {
                const edge = document.createElement('div');
                edge.className = 'proto-sidebar-edge';
                root.appendChild(edge);
                this.playSwipe(edge, right, onSwipe);
            }
        }
    },

    // Horizontal swipe starting on `el`: onSwipe(+1) for a swipe away from the drawer's edge
    // (open), onSwipe(-1) toward it (close). The move / up are followed on window while the
    // pointer is down (the pointer soon leaves a narrow rail or edge strip), and once it's a
    // drag the pointer is captured to `el`, so the click that ends it lands there and is
    // swallowed (el._protoDragged, read by the player's click handler).
    playSwipe(el, right, onSwipe) {
        el.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            const x0 = e.clientX, y0 = e.clientY, id = e.pointerId;
            let dragging = false;
            const move = (ev) => {
                if (ev.pointerId !== id || dragging) return;
                const dx = ev.clientX - x0, dy = ev.clientY - y0;
                if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
                    dragging = true;
                    try { el.setPointerCapture(id); } catch (_) {}
                    window.getSelection?.()?.removeAllRanges();
                }
            };
            const end = (ev) => {
                if (ev.pointerId !== id) return;
                window.removeEventListener('pointermove', move, true);
                window.removeEventListener('pointerup', end, true);
                window.removeEventListener('pointercancel', end, true);
                const dx = ev.clientX - x0, dy = ev.clientY - y0;
                if (!dragging || ev.type === 'pointercancel' || Math.abs(dx) < 30 || Math.abs(dx) < Math.abs(dy)) return;
                el._protoDragged = true;
                setTimeout(() => { el._protoDragged = false; }, 0);
                onSwipe((dx > 0) !== right ? 1 : -1);
            };
            window.addEventListener('pointermove', move, true);
            window.addEventListener('pointerup', end, true);
            window.addEventListener('pointercancel', end, true);
        });
        // A mouse drag would otherwise start a native drag of an icon / link / image, which
        // cancels the pointer (Firefox especially)
        el.addEventListener('dragstart', (e) => e.preventDefault());
    },

    // Open = shown in full. With the rail on, closing shrinks it to the rail (a closed one,
    // as left in the editor, stays closed); opening also expands a minimized one.
    playSetOpen(root, open) {
        if (!this.railOn(root)) return this.setOpen(root, open);
        if (open) {
            this.setOpen(root, true);
            this.setMin(root, false);
        } else if (this.isOpen(root)) {
            this.setMin(root, true);
        }
    },

    playIsOpen(root) {
        return this.isOpen(root) && !this.isMin(root);
    },

    // ---- Rail (left / right drawers) --------------------------------------------------------
    // data-sidebar-rail on the root = the option is on (the "Rail" switch beside Add Item;
    // shared by synced copies): the header gets a button (.sidebar-rail-btn, part of the design:
    // it shows in play and PNGs; setup adds / removes it) that shrinks the drawer to an icon
    // rail, data-sidebar-min (per screen, like open / closed). CSS (componentVariants.css)
    // draws the rail; the full-screen menu ignores both.
    railOn(root) {
        return !!root?.hasAttribute('data-sidebar-rail') && this.styleOf(root) !== 'full';
    },

    isMin(root) {
        return this.railOn(root) && root.hasAttribute('data-sidebar-min');
    },

    setMin(root, min) {
        if (!root) return;
        const on = !!min && this.railOn(root);
        if (on === root.hasAttribute('data-sidebar-min')) return;
        // Content held at the full layout + clipped while the width animates (CSS); the
        // panel's own transition is 0.25s
        root.classList.add('sidebar-rail-anim');
        clearTimeout(root._railAnim);
        root._railAnim = setTimeout(() => root.classList.remove('sidebar-rail-anim'), 300);
        root.toggleAttribute('data-sidebar-min', on);
    },

    setRail(root, on) {
        if (!root) return;
        root.toggleAttribute('data-sidebar-rail', !!on);
        this.setupRailButton(root);
        this.renderRailOption(root);
    },

    railButton() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sidebar-rail-btn non-editable';
        btn.title = 'Minimize';
        btn.innerHTML = '<i class="fas fa-angles-left"></i>';
        return btn;
    },

    // The header's button, there only while the option is on (also clears a stale minimize)
    setupRailButton(root) {
        let btn = root.querySelector('.sidebar-header > .sidebar-rail-btn');
        if (!root.hasAttribute('data-sidebar-rail')) {
            btn?.remove();
            root.removeAttribute('data-sidebar-min');
            return;
        }
        const header = root.querySelector('.sidebar-header');
        if (!btn && header) { btn = this.railButton(); header.appendChild(btn); }
        if (btn && !btn._sbBound) {
            btn._sbBound = true;
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setMin(root, !this.isMin(root));
                this.markChanged(root, 'Sidebar minimized / expanded');
            });
        }
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

    // One nav item: <div.icon-container><div.sidebar-nav-item><grip/><i/><span/><×/></div></div>.
    // The grip (drag to reorder) and × are editor chrome: not saved, rebuilt by setup().
    // Used by the factory (ux-mock-bldr.js), "Add item" and nothing else. Icon size / color
    // and the label's flex come from CSS (.sidebar-nav-item > i / > span); items saved by
    // older builds still carry them inline, with the same values.
    createNavItem(icon = 'bolt-lightning', text = 'New Item') {
        const wrap = document.createElement('div');
        wrap.className = 'icon-container';
        const item = document.createElement('div');
        item.className = 'sidebar-nav-item';
        const i = document.createElement('i');
        i.className = `fas fa-${icon} icon-container`;
        const label = document.createElement('span');
        label.textContent = text;
        label.setAttribute('contenteditable', 'true');
        label.classList.add('usa');
        item.append(this.itemGrip(), i, label, this.itemDeleteButton());
        wrap.appendChild(item);
        return wrap;
    },

    itemGrip() {
        const grip = document.createElement('div');
        grip.className = 'sidebar-item-grip';
        grip.title = 'Drag to reorder';
        grip.innerHTML = '<i class="fas fa-grip-vertical"></i>';
        return grip;
    },

    itemDeleteButton() {
        const btn = document.createElement('button');
        btn.className = 'nav-item-delete';
        btn.textContent = '×';
        return btn;
    },

    addButton() {
        const btn = document.createElement('div');
        btn.className = 'sidebar-add-btn';
        btn.innerHTML = '<i class="fas fa-plus"></i> Add Item';
        return btn;
    },

    // "Rail" switch, beside Add Item (left / right drawers only: CSS hides it on the
    // full-screen menu)
    railOption() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sidebar-rail-opt';
        btn.innerHTML = '<i class="fas fa-check"></i><span>Rail</span>';
        btn.title = 'Rail: adds a button to the sidebar that shrinks it to its icons (in play too)';
        return btn;
    },

    renderRailOption(root) {
        const btn = root.querySelector('.sidebar-rail-opt');
        if (!btn) return;
        const on = root.hasAttribute('data-sidebar-rail');
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', String(on));
    },

    markChanged(container, why) {
        const canvasId = container.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        if (canvasId) window.projectManager?.addCanvasToChanged?.(canvasId, why);
    },

    // ---- Current page highlight ------------------------------------------------------------
    // The item for the screen the sidebar is on gets .sidebar-current (a session class: never
    // saved or synced, worked out again on every client; the player and PNG export keep it,
    // since they copy the screen as it is). The item is the one linked to this screen, else —
    // when no item links here — the unlinked item whose label matches the screen's name
    // (bottomNav.tabKey / TAB_SYNONYMS: "Settings" on a screen named "Preferences").
    currentItem(root) {
        const id = root.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        const items = [...root.querySelectorAll('.sidebar-nav .sidebar-nav-item')];
        if (!id || !items.length) return null;
        const navigates = el => el.getAttribute('data-proto-action') === 'navigate';
        const linked = items.find(el => navigates(el) && el.getAttribute('data-proto-target') === id);
        if (linked) return linked;
        const B = window.Components.bottomNav;
        if (!B?.tabKey) return null;
        const name = B.tabKey(root.closest('.canvas')?.getAttribute('data-screen-name') || '');
        if (!name) return null;
        const free = items.filter(el => !el.hasAttribute('data-proto-action'));
        const keyOf = el => B.tabKey(el.querySelector(':scope > span')?.textContent || '');
        const same = free.find(el => keyOf(el) === name);
        if (same) return same;
        const syn = B.tabSynonyms(name);
        return syn ? free.find(el => syn.has(keyOf(el))) || null : null;
    },

    markCurrent(root) {
        const current = this.currentItem(root);
        root.querySelectorAll('.sidebar-nav .sidebar-nav-item').forEach(el => {
            if ((el === current) !== el.classList.contains('sidebar-current')) el.classList.toggle('sidebar-current', el === current);
        });
    },

    // One observer for every sidebar: links, screen names / ids and item labels change the
    // highlight, as do loads, undo and live sync (they rebuild nodes). Batched to a frame.
    watchCurrent() {
        if (this._currentObserver) return;
        const zone = document.getElementById('mockZone');
        if (!zone) return;
        let queued = false;
        const run = () => {
            queued = false;
            zone.querySelectorAll('.canvas > .sidebar-container').forEach(root => this.markCurrent(root));
        };
        this._currentObserver = new MutationObserver(() => {
            if (!queued) { queued = true; requestAnimationFrame(run); }
        });
        this._currentObserver.observe(zone, {
            childList: true, subtree: true, characterData: true, attributes: true,
            attributeFilter: ['data-proto-action', 'data-proto-target', 'data-screen-name', 'data-canvas-id']
        });
    },

    // Safe to call repeatedly (load, live sync, undo all rebuild from saved html): editor
    // chrome missing from the html (item ×, "Add item") is rebuilt, and listeners are bound
    // once per element.
    setup(container) {
        if (!container) return null;
        const panel = container.querySelector('.sidebar-panel');
        const nav = panel?.querySelector('.sidebar-nav');
        if (!panel || !nav) return null;

        // Delete (×): bound here, not only by the factory, so a sidebar rebuilt from saved html
        // (load, local draft, live sync, undo) can be deleted too. Idempotent.
        editor.setupDeleteHandler(container);

        // Item grip + × and "Add item" (shown on hover by CSS)
        nav.querySelectorAll('.sidebar-nav-item').forEach(item => {
            if (!item.querySelector(':scope > .sidebar-item-grip')) item.prepend(this.itemGrip());
            if (!item.querySelector(':scope > .nav-item-delete')) item.appendChild(this.itemDeleteButton());
        });
        // Add Item + the Rail switch share a row under the items (.sidebar-add-row)
        let addRow = panel.querySelector(':scope > .sidebar-add-row');
        if (!addRow) { addRow = document.createElement('div'); addRow.className = 'sidebar-add-row'; nav.after(addRow); }
        let addBtn = panel.querySelector('.sidebar-add-btn');
        if (!addBtn) addBtn = this.addButton();
        addBtn.style.display = '';   // older builds toggled it inline on hover (and saved that)
        let railOpt = addRow.querySelector('.sidebar-rail-opt') || this.railOption();
        addRow.append(addBtn, railOpt);
        if (!railOpt._sbBound) {
            railOpt._sbBound = true;
            railOpt.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setRail(container, !container.hasAttribute('data-sidebar-rail'));
                this.markChanged(container, 'Sidebar rail turned on / off');
            });
        }
        this.renderRailOption(container);

        // Item icon picker + ×, delegated so items added, moved or rebuilt need no binding
        if (!nav._sbBound) {
            nav._sbBound = true;
            nav.addEventListener('click', (e) => {
                if (nav._sbDragged) { e.stopPropagation(); return; }   // the click a drag ends with
                const del = e.target.closest('.nav-item-delete');
                if (del) {
                    e.stopPropagation();
                    const row = del.closest('.sidebar-nav > *') || del.closest('.sidebar-nav-item');
                    row.classList.add('delete-animation');
                    setTimeout(() => row.remove(), 200);
                    return;
                }
                const icon = e.target.closest('.sidebar-nav-item > i');
                if (icon && typeof showIconPicker === 'function') {
                    e.preventDefault();
                    e.stopPropagation();
                    showIconPicker(icon);
                }
            });
        }
        if (!addBtn._sbBound) {
            addBtn._sbBound = true;
            addBtn.addEventListener('click', () => {
                const row = this.createNavItem();
                nav.appendChild(row);
                row.querySelector('.sidebar-nav-item > span')?.focus();
            });
        }

        // Drag items to reorder, by their grip only (the icon opens the icon picker, the label
        // is typed in). The ghost stays inside the screen, so it follows the screen's zoom. The
        // drag classes are Sortable's defaults, which save / sync / undo strip (SESSION_CLASSES).
        if (typeof Sortable !== 'undefined') {
            Sortable.get(nav)?.destroy();
            new Sortable(nav, {
                animation: 150,
                draggable: '.sidebar-nav > *',
                handle: '.sidebar-item-grip',
                forceFallback: true,
                onEnd: (e) => {
                    nav._sbDragged = true;
                    setTimeout(() => { nav._sbDragged = false; }, 0);
                    if (e.oldIndex !== e.newIndex) this.markChanged(container, 'Sidebar items reordered');
                }
            });
        }

        // Open / close toggle
        const toggle = panel.querySelector('.sidebar-toggle');
        if (toggle && !toggle._sbBound) {
            toggle._sbBound = true;
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.setOpen(container, !this.isOpen(container));
                this.markChanged(container, 'Sidebar toggled');
            });
        }

        // Older saves kept open/closed as inline styles — convert to the attribute
        this.setOpen(container, this.isOpen(container));
        this.setupRailButton(container);
        this.setupStyleControls(container);
        this.markCurrent(container);
        this.watchCurrent();

        // Last, so setup's own changes aren't taken for an edit
        window.componentSync?.attach(container, 'sidebar');   // Reuse / Synced · N / Detach + sync
        return container;
    },

    // ---- Use on other screens / keep copies in sync (js/component-sync.js) ------------------
    // Everything is shared (style, rail option, items, icons, labels, links, header, footer)
    // except whether it's open / minimized to its rail: each screen keeps its own (a "menu
    // open" screen next to closed ones). The
    // current-page highlight is a session class, worked out per screen anyway. App packs'
    // sidebars that are the same start synced.
    syncSettings() {
        const SB = window.Components.sidebar;
        return {
            container: '.sidebar-container',
            inner: '.sidebar-panel',
            noun: 'sidebar',
            replacesNote: 'sidebar',
            groupPrefix: 'sb_',
            compactBelow: 300,   // the drawers (240px): icon + count; the full-screen menu: labels
            normalize(clone) {
                clone.removeAttribute('data-sidebar-closed');
                clone.removeAttribute('data-sidebar-min');
            },
            carryOver(old, fresh) {
                SB.setOpen(fresh, SB.isOpen(old));
                SB.setMin(fresh, SB.isMin(old));   // only if the pushed one still has the rail
            },
        };
    },
};

// (templates.html loads this module without component-sync.js)
window.componentSync?.register('sidebar', window.Components.sidebar.syncSettings());
