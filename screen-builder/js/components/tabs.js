// Component registry module — see docs/component-module-migration.md
// tabs: a row of selectable, editable tabs with add/remove controls and switchable
// STYLES (Classic / Underline / Segmented / Pills).
//
// Why styles instead of markup variants: tabs carry content the user builds up (how
// many tabs, their names, which is selected). Swapping in template markup would reset
// that, so a style is just `data-tab-style` on .tabs-container, read by CSS, and every
// tab survives the switch. The style arrows live in the existing hover toolbar
// (.tabs-controls) next to − / +, and are injected into older saved tabs on setup.
//
// Selected-tab color:
//   inline styles (Classic / Segmented / Pills): the selected tab gets an inline
//     background var(--color-primary) (swatch + text contrast), as before.
//   Underline: no tab backgrounds; the .tabs-wrapper carries an inline
//     `color: var(--color-primary)` that the selected tab inherits (one swatch).
//
// Tab panels — each tab shows its own content, in the editor and in play mode:
//   ids      .tabs-container[data-tabs-group] (random, per tabs component) and
//            .ui-tab[data-tab-id]; minted by setup() when missing (older saved tabs).
//   members  a top-level component below the tabs carries
//            data-tab-panel="<group>:<tabId>" on its .component-container (carried through
//            save / sync / undo by unwrapComponents / rewrapComponents in projectSys.js).
//            No attribute = "All tabs": shown whichever tab is selected.
//   showing  one generated stylesheet (#tab-panel-rules) hides a group's members whose tab
//            isn't the selected one, via :has() on the tab's .selected class. Nothing on
//            the members changes when you switch tabs, so switching isn't an edit to them,
//            and the prototype player (a clone of the screen) gets it for free.
//   joining  a component inserted / dropped below a tabs component joins its selected tab
//            (adopt, called from insertComponent and the sidebar drop); its hover toolbar
//            has a "Show on all tabs" toggle (.tab-scope-btn). Removing a tab moves its
//            components to All tabs. Duplicating / pasting a tabs component on the same
//            screen gives the copy a fresh group (claimGroup), so the two don't collide.
//   end      an optional "End of tab content" line: its own top-level component
//            (data-component-type="tabsEnd", inner .tabs-end[data-tabs-end="<group>"]).
//            Everything below it shows on every tab (a footer, say), whatever its
//            data-tab-panel says — so dragging the line back down restores them. A new tabs
//            component gets one right under it; sidebar-button inserts land just above it
//            (the end of the tab's content); dragging a component from below it to above
//            it joins the selected tab. Older tabs add one from their hover toolbar. It's
//            editor-only: hidden in play mode and in downloads.
window.Components = window.Components || {};

window.Components.tabs = (() => {
    const STYLES = [
        { id: 'classic', label: 'Classic' },
        { id: 'underline', label: 'Underline' },
        { id: 'segmented', label: 'Segmented' },
        { id: 'pills', label: 'Pills' }
    ];
    const styleIndex = (container) =>
        Math.max(0, STYLES.findIndex(s => s.id === (container.dataset.tabStyle || 'classic')));

    const findContainer = (root) =>
        root?.classList?.contains('tabs-container') ? root : root?.querySelector?.('.tabs-container');

    // ── Tab panels ────────────────────────────────────────────────────────────
    const PANEL = 'data-tab-panel';
    const SAFE = /^[\w-]+$/;
    const uid = (prefix) => prefix + Math.random().toString(36).slice(2, 8);
    const tabEls = (container) => Array.from(container.querySelectorAll(':scope > .tabs-wrapper > .ui-tab'));
    const selectedTab = (container) => {
        const tabs = tabEls(container);
        return tabs.find(t => t.classList.contains('selected')) || tabs[0] || null;
    };

    // Save change detection ignores data-attribute changes — flag the screen
    const markChanged = (el, reason) => {
        const canvasId = el?.closest?.('.canvas-wrapper')?.getAttribute('data-canvas-id');
        if (canvasId) window.projectManager?.addCanvasToChanged(canvasId, reason);
    };

    // One rule per (group, tab): when that tab is selected, hide the group's other members.
    let rulesQueued = false;
    const writeRules = () => {
        rulesQueued = false;
        const pairs = new Set();
        document.querySelectorAll('.tabs-container[data-tabs-group]').forEach(c => {
            const g = c.dataset.tabsGroup;
            if (!SAFE.test(g)) return;
            tabEls(c).forEach(t => { if (SAFE.test(t.dataset.tabId || '')) pairs.add(`${g}:${t.dataset.tabId}`); });
        });
        let style = document.getElementById('tab-panel-rules');
        if (!style) {
            style = document.createElement('style');
            style.id = 'tab-panel-rules';
            document.head.appendChild(style);
        }
        // The toolbar's end-line toggle is "on" while its line exists
        const groups = new Set(Array.from(pairs, pair => pair.split(':')[0]));
        const endOn = Array.from(groups, g =>
            `.canvas-content:has(> .component-container > .component-content > .tabs-end[data-tabs-end="${g}"]) .tabs-container[data-tabs-group="${g}"] .tabs-end-btn`
            + ' { background-color: var(--interface-color); color: white; }');
        style.textContent = endOn.concat(Array.from(pairs).map(pair => {
            const [g, t] = pair.split(':');
            return `.canvas-content:has(.tabs-container[data-tabs-group="${g}"] > .tabs-wrapper > .ui-tab.selected[data-tab-id="${t}"])`
                + ` > .component-container[${PANEL}^="${g}:"]:not([${PANEL}="${pair}"])`
                + `:not(.component-container:has(> .component-content > .tabs-end[data-tabs-end="${g}"]) ~ *) { display: none !important; }`;
        })).join('\n');
    };
    const scheduleRules = () => {
        if (rulesQueued) return;
        rulesQueued = true;
        queueMicrotask(writeRules);
    };

    const ensureIds = (container) => {
        let changed = false;
        if (!SAFE.test(container.dataset.tabsGroup || '')) {
            container.dataset.tabsGroup = uid('tg');
            changed = true;
        }
        const seen = new Set();
        tabEls(container).forEach(tab => {
            if (!SAFE.test(tab.dataset.tabId || '') || seen.has(tab.dataset.tabId)) {
                tab.dataset.tabId = uid('t');
                changed = true;
            }
            seen.add(tab.dataset.tabId);
        });
        if (changed) markChanged(container, 'Tab ids added');
        scheduleRules();
    };

    // ── End of tab content line ─────────────────────────────────────────────
    const isEnd = (comp) => comp?.getAttribute?.('data-component-type') === 'tabsEnd';
    const findEnd = (container) => {
        const list = container.closest('.canvas-content');
        const g = container.dataset.tabsGroup;
        if (!list || !SAFE.test(g || '')) return null;
        return list.querySelector(`:scope > .component-container > .component-content > .tabs-end[data-tabs-end="${g}"]`)
            ?.closest('.component-container') || null;
    };

    // Add the line under the tabs' last component (right under the tabs if it has none)
    const addEnd = (container) => {
        const tabsComp = container.closest('.component-container');
        const list = container.closest('.canvas-content');
        if (!tabsComp || tabsComp.parentElement !== list || findEnd(container) || typeof editor === 'undefined') return null;
        ensureIds(container);
        const g = container.dataset.tabsGroup;
        const line = document.createElement('div');
        line.className = 'tabs-end non-editable';
        line.dataset.tabsEnd = g;
        line.innerHTML = '<span class="tabs-end-label non-editable">End of tab content · below shows on every tab</span>';
        const comp = editor.wrapComponentInContainer(line, 'tabsEnd', true);
        let after = tabsComp;
        for (let s = tabsComp.nextElementSibling; s; s = s.nextElementSibling) {
            if (isEnd(s) || s.querySelector('.tabs-container')) break;
            if (s.getAttribute(PANEL)?.startsWith(`${g}:`)) after = s;
        }
        after.after(comp);
        markChanged(container, 'Tab content end added');
        return comp;
    };

    // The tabs component a top-level component falls under: the last one in the nearest
    // component above it that holds tabs.
    const governingTabs = (comp) => {
        if (!comp?.parentElement?.classList.contains('canvas-content')) return null;
        for (let s = comp.previousElementSibling; s; s = s.previousElementSibling) {
            if (!s.classList.contains('component-container')) continue;
            if (isEnd(s)) return null; // below the end-of-tab-content line
            const found = s.querySelectorAll('.tabs-container');
            if (found.length) return found[found.length - 1];
        }
        return null;
    };

    const joinTab = (comp, container, tab) => {
        if (!comp || !container || !tab) return false;
        ensureIds(container);
        comp.setAttribute(PANEL, `${container.dataset.tabsGroup}:${tab.dataset.tabId}`);
        markChanged(comp, 'Tab content changed');
        return true;
    };

    // Removing a tab moves its components to All tabs
    const releaseTab = (container, tabId) => {
        const list = container.closest('.canvas-content');
        if (!list || !tabId) return;
        const sel = `:scope > .component-container[${PANEL}="${container.dataset.tabsGroup}:${tabId}"]`;
        list.querySelectorAll(sel).forEach(comp => comp.removeAttribute(PANEL));
        markChanged(container, 'Tab removed');
    };

    // Editor: a selected component that the tab switch just hid shouldn't stay selected
    // (Delete / arrow keys would act on something you can't see).
    const dropHiddenSelection = () => {
        const sel = window.componentSelection;
        if (sel?.selected().some(el => !el.getClientRects().length)) sel.clear();
    };

    // "Show on all tabs" toggle in a component's hover toolbar (added by
    // wrapComponentInContainer, shown by CSS only below a tabs component)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-scope-btn');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        const comp = btn.closest('.component-container');
        if (!comp) return;
        if (comp.hasAttribute(PANEL)) {
            comp.removeAttribute(PANEL);
            markChanged(comp, 'Tab content changed');
        } else {
            const container = governingTabs(comp);
            joinTab(comp, container, container && selectedTab(container));
        }
    }, true);

    document.addEventListener('pointerover', (e) => {
        const btn = e.target.closest?.('.tab-scope-btn');
        if (!btn) return;
        const comp = btn.closest('.component-container');
        if (comp?.hasAttribute(PANEL)) {
            const [g, t] = comp.getAttribute(PANEL).split(':');
            const tab = document.querySelector(`.tabs-container[data-tabs-group="${CSS.escape(g)}"] .ui-tab[data-tab-id="${CSS.escape(t || '')}"]`);
            btn.title = `Only on "${tab?.textContent.trim() || 'this tab'}" — click to show on all tabs`;
        } else {
            btn.title = 'Shown on all tabs — click to keep it on the selected tab only';
        }
    });

    const rebuildSwatches = (container) => {
        container.querySelectorAll('.color-swatch-container').forEach(el => el.remove());
        container.querySelectorAll('[style*="var(--color"]').forEach(element => {
            try {
                const swatches = createColorSwatches(element);
                const list = Array.isArray(swatches) ? swatches : [swatches];
                list.forEach(swatch => {
                    if (swatch && swatch.children.length > 0) {
                        container.insertBefore(swatch, container.firstChild);
                    }
                });
            } catch (error) {
                console.error('Error creating swatches:', error);
            }
        });
    };

    const selectTab = (container, selectedTab, { swatches = true } = {}) => {
        const tabs = container.querySelector('.tabs-wrapper');
        if (!tabs || !selectedTab) return;
        const style = container.dataset.tabStyle || 'classic';

        tabs.querySelectorAll('.ui-tab').forEach(tab => {
            tab.classList.toggle('selected', tab === selectedTab);
            if (style === 'underline') {
                // Colors come from CSS + the wrapper's inherited color
                tab.style.removeProperty('background-color');
                tab.style.removeProperty('color');
            } else if (tab === selectedTab) {
                tab.style.backgroundColor = 'var(--color-primary)';
                tab.style.color = 'var(--basic-txt-color)';
            } else {
                tab.style.backgroundColor = style === 'segmented' ? 'transparent' : 'var(--neutral-gray)';
                tab.style.color = 'var(--basic-txt-color)';
            }
        });

        if (swatches) rebuildSwatches(container);
        if (style !== 'underline') window.TextContrastAdjuster?.updateElementContrast(selectedTab);
    };

    const applyStyle = (container, index) => {
        const style = STYLES[((index % STYLES.length) + STYLES.length) % STYLES.length];
        if (style.id === 'classic') delete container.dataset.tabStyle;
        else container.dataset.tabStyle = style.id;

        const wrapper = container.querySelector('.tabs-wrapper');
        if (wrapper) {
            if (style.id === 'underline') {
                if (!wrapper.style.color) wrapper.style.color = 'var(--color-primary)';
            } else {
                wrapper.style.removeProperty('color');
            }
        }

        const label = container.querySelector('.tabs-style-label');
        if (label) {
            label.textContent = `${STYLES.indexOf(style) + 1}/${STYLES.length}`;
            label.title = style.label;
        }

        const tabs = container.querySelectorAll('.ui-tab');
        selectTab(container, container.querySelector('.ui-tab.selected') || tabs[0]);

        // Save change detection ignores data-attribute changes — flag the screen
        const canvasId = container.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        window.projectManager?.addCanvasToChanged(canvasId, 'Tabs style changed');
    };

    // Style arrows in the hover toolbar: [◀ n/4 ▶] [−][+]. Injected if missing.
    const ensureStyleControls = (container, controls) => {
        if (controls.querySelector('.tabs-style-prev')) return;
        const prev = document.createElement('button');
        prev.className = 'tabs-style-prev non-editable';
        prev.title = 'Previous tab style';
        prev.innerHTML = '<i class="fas fa-chevron-left"></i>';
        const label = document.createElement('span');
        label.className = 'tabs-style-label non-editable';
        const next = document.createElement('button');
        next.className = 'tabs-style-next non-editable';
        next.title = 'Next tab style';
        next.innerHTML = '<i class="fas fa-chevron-right"></i>';
        controls.prepend(prev, label, next);
        const style = STYLES[styleIndex(container)];
        label.textContent = `${styleIndex(container) + 1}/${STYLES.length}`;
        label.title = style.label;
    };

    const createTab = (index) => {
        const tab = document.createElement('div');
        tab.textContent = `Tab ${index}`;
        tab.setAttribute('contentEditable', 'true');
        tab.className = 'ui-tab usa';
        tab.dataset.tabId = uid('t');
        return tab;
    };

    return {
        styles: STYLES.map(s => s.id),

        // Switch style by index or id (e.g. from templates).
        setStyle(root, style) {
            const container = findContainer(root);
            if (!container) return;
            const index = typeof style === 'number' ? style : STYLES.findIndex(s => s.id === style);
            if (index >= 0) applyStyle(container, index);
        },

        // Prototype player (js/prototype.js): switch the selected tab — no swatches/controls.
        // The tab-panel stylesheet swaps the content; the newly shown panels fade in and
        // replay their entrance animations (graphs, progress bars).
        play(root) {
            const container = findContainer(root);
            const tabs = container?.querySelector('.tabs-wrapper');
            if (!tabs || tabs._playBound) return;
            tabs._playBound = true;
            tabs.addEventListener('click', (e) => {
                const tab = e.target.closest('.ui-tab');
                if (!tab || !tabs.contains(tab) || tab.classList.contains('selected')) return;
                selectTab(container, tab, { swatches: false });
                const list = container.closest('.canvas-content');
                const pair = `${container.dataset.tabsGroup}:${tab.dataset.tabId}`;
                if (!list || !SAFE.test(container.dataset.tabsGroup || '')) return;
                const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
                list.querySelectorAll(`:scope > .component-container[${PANEL}="${pair}"]`).forEach(panel => {
                    if (!reduced) {
                        panel.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
                            { duration: 220, easing: 'ease-out' });
                    }
                    window.prototypeMode?.replayEntrance?.(panel);
                });
            });
        },

        // A component just inserted / dropped below a tabs component joins its selected
        // tab. Components above every tabs component, and tabs themselves, stay on All tabs.
        adopt(comp) {
            if (!comp?.classList?.contains('component-container')) return;
            if (isEnd(comp)) {
                // A pasted line whose tabs aren't here ends the nearest tabs above it instead
                comp.removeAttribute(PANEL);
                const line = comp.querySelector('.tabs-end');
                const list = comp.parentElement;
                const g = line?.dataset.tabsEnd;
                if (!line || !list?.classList.contains('canvas-content')) return;
                if (g && list.querySelector(`.tabs-container[data-tabs-group="${CSS.escape(g)}"]`)) return;
                for (let s = comp.previousElementSibling; s; s = s.previousElementSibling) {
                    const found = s.querySelectorAll?.('.tabs-container');
                    if (found?.length) {
                        const container = found[found.length - 1];
                        ensureIds(container);
                        line.dataset.tabsEnd = container.dataset.tabsGroup;
                        scheduleRules();
                        return;
                    }
                }
                return;
            }
            if (comp.hasAttribute(PANEL)) return;
            if (comp.querySelector('.tabs-container')) return;
            const container = governingTabs(comp);
            if (container) joinTab(comp, container, selectedTab(container));
        },

        // Templates: put a component on the governing tabs' nth tab (0-based).
        assign(comp, index) {
            this.placeInTab(comp);
            const container = governingTabs(comp);
            if (container) joinTab(comp, container, tabEls(container)[index]);
        },

        // A component appended below an end-of-tab-content line (sidebar button, template)
        // moves up to just above it — the end of the selected tab's content.
        placeInTab(comp) {
            if (!comp?.parentElement?.classList.contains('canvas-content') || isEnd(comp)) return;
            if (comp.querySelector('.tabs-container')) return;
            for (let s = comp.previousElementSibling; s; s = s.previousElementSibling) {
                if (!s.classList.contains('component-container')) continue;
                if (s.querySelector('.tabs-container')) return; // already in a tab's content
                if (isEnd(s)) { s.before(comp); return; }
            }
        },

        // New tabs component (insertComponent): its end line goes right under it.
        addEnd(root) {
            const container = findContainer(root);
            return container ? addEnd(container) : null;
        },

        // Sortable drag (ux-mock-bldr.js initializeSortable): note where items start, and
        // when one moves from outside a tab's content into it, it joins the selected tab.
        dragStart(items) {
            items.forEach(item => { item._tabsWasIn = !!governingTabs(item); });
        },
        dragEnd(items) {
            items.forEach(item => {
                const was = item._tabsWasIn;
                delete item._tabsWasIn;
                if (isEnd(item)) return;
                if (!was && governingTabs(item)) {
                    item.removeAttribute(PANEL);
                    this.adopt(item);
                }
            });
        },

        // A copied tabs component (duplicate / paste) that lands on a screen where its group
        // already exists gets a fresh group. Components in `remap` (pasted alongside it)
        // follow it to the new group.
        claimGroup(root, remap = []) {
            const containers = root?.classList?.contains('tabs-container')
                ? [root] : Array.from(root?.querySelectorAll?.('.tabs-container') || []);
            containers.forEach(container => {
                const list = container.closest('.canvas-content');
                const old = container.dataset.tabsGroup;
                if (!list || !SAFE.test(old || '')) return;
                const clash = Array.from(list.querySelectorAll(`.tabs-container[data-tabs-group="${old}"]`))
                    .some(other => other !== container);
                if (!clash) return;
                const fresh = uid('tg');
                container.dataset.tabsGroup = fresh;
                remap.forEach(comp => {
                    const v = comp.getAttribute(PANEL);
                    if (v && v.startsWith(`${old}:`)) comp.setAttribute(PANEL, fresh + v.slice(old.length));
                    comp.querySelectorAll(`:scope > .component-content > .tabs-end[data-tabs-end="${old}"]`)
                        .forEach(line => { line.dataset.tabsEnd = fresh; });
                });
                markChanged(container, 'Tabs copied');
            });
            scheduleRules();
        },

        // Safe to call repeatedly: element-level listeners are guarded by flags (which
        // don't survive cloneNode, so duplicates get their own fresh binding).
        setup(root) {
            const container = findContainer(root);
            if (!container) return;
            const tabs = container.querySelector('.tabs-wrapper');
            const controls = container.querySelector('.tabs-controls');
            const addButton = controls?.querySelector('.tabs-add-btn');
            const removeButton = controls?.querySelector('.tabs-remove-btn');
            if (!tabs || !controls || !addButton || !removeButton) return;

            ensureStyleControls(container, controls);
            ensureIds(container);
            if (!controls.querySelector('.tabs-end-btn')) {
                const endBtn = document.createElement('button');
                endBtn.className = 'tabs-end-btn non-editable';
                endBtn.title = 'End of tab content: things below the line show on every tab';
                endBtn.innerHTML = '<i class="fas fa-grip-lines"></i>';
                controls.appendChild(endBtn);
            }

            if (!tabs._tabsBound) {
                tabs._tabsBound = true;
                tabs.addEventListener('click', (e) => {
                    const tab = e.target.closest('.ui-tab');
                    if (tab && tabs.contains(tab)) {
                        selectTab(container, tab);
                        dropHiddenSelection();
                    }
                });
            }

            if (!controls._tabsBound) {
                controls._tabsBound = true;
                controls.addEventListener('click', (e) => {
                    const btn = e.target.closest('button');
                    if (!btn) return;
                    if (btn.classList.contains('tabs-add-btn')) {
                        if (tabs.children.length < 5) {
                            const newTab = createTab(tabs.children.length + 1);
                            tabs.appendChild(newTab);
                            ensureIds(container);
                            selectTab(container, newTab);
                            dropHiddenSelection();
                        }
                    } else if (btn.classList.contains('tabs-remove-btn')) {
                        if (tabs.children.length > 1) {
                            const removed = tabs.lastElementChild;
                            tabs.removeChild(removed);
                            releaseTab(container, removed.dataset.tabId);
                            if (!tabs.querySelector('.ui-tab.selected')) {
                                selectTab(container, tabs.lastElementChild);
                            }
                            scheduleRules();
                        }
                    } else if (btn.classList.contains('tabs-end-btn')) {
                        const end = findEnd(container);
                        if (end) {
                            end.remove();
                            markChanged(container, 'Tab content end removed');
                        } else {
                            addEnd(container);
                        }
                    } else if (btn.classList.contains('tabs-style-prev')) {
                        applyStyle(container, styleIndex(container) - 1);
                    } else if (btn.classList.contains('tabs-style-next')) {
                        applyStyle(container, styleIndex(container) + 1);
                    }
                });
            }

            // Restyle the current selection (also rebuilds swatches)
            const selected = tabs.querySelector('.ui-tab.selected');
            if (selected) selectTab(container, selected);
        }
    };
})();
