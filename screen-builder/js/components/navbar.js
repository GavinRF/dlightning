// Component registry module — see docs/component-module-migration.md
// navbar: top navigation bar; variant controls, editable text, and text-contrast adjustment.
window.Components = window.Components || {};

window.Components.navbar = {
    setup(navbar) {
        if (!navbar) return null;

        // Check if it's a wrapper or the direct navbar element
        const topNavbarContainer = navbar.classList.contains('navContain') ?
            navbar : navbar.querySelector('.navContain');

        if (!topNavbarContainer) return null;

        // Find the actual navbar element
        const navbarElement = topNavbarContainer.querySelector('.navbar');
        if (!navbarElement) return null;

        // Set the flag to track the component
        editor.topNavbarAdded = true;

        // Initial setup of interactive elements
        editor.setupVariantControls(topNavbarContainer, navbarElement, 'navbar');
        window.Components.navbar.setupInteractiveElements(navbarElement);

        // Add the delete button if it's not already there
        // const canvas = topNavbarContainer.closest('.canvas');
        // const existingButton = topNavbarContainer.querySelector('.special-component-delete');
        // if (!existingButton && canvas) {
        //     addDeleteButtonToSpecialComponent(topNavbarContainer, 'navbar', canvas);
        // }

        window.Components.navbar.setupPills(topNavbarContainer);

        editor.setupDeleteHandler(topNavbarContainer);
        // update text contrast
        window.TextContrastAdjuster.updateElementContrast(navbarElement);

        // Last, so setup's own changes aren't taken for an edit
        window.componentSync?.attach(topNavbarContainer, 'navbar');   // Reuse / Synced · N / Detach + sync
        return topNavbarContainer;
    },

    // Style switched (ux-mock-bldr.js setupVariantControls): the pills' clicks + group swatch
    afterVariantChange(content, container) {
        window.Components.navbar.setupPills(container?.closest?.('.canvas > .navContain') || container);
    },

    // ---- Category pills (the "Category Tabs" style): select one or many ------------------------
    // Like the Pill group (chipGroup.js): a tap toggles a pill; selected pills share one color,
    // set by one swatch for the row (createColorSwatches skips .nav-pill, so there's no swatch
    // per selected pill). Saved html: data-selected="true|false" on each pill, the color
    // (a --color-* name) as data-pill-color on the pills' row. Html from before has no
    // data-selected: a pill with an inline background is the selected one.
    pillColor(row) {
        if (row?.dataset.pillColor) return row.dataset.pillColor;
        const lit = [...(row?.querySelectorAll(':scope > .nav-pill') || [])].find(p => /var\(--color-/.test(p.style.backgroundColor));
        return lit?.style.backgroundColor.match(/var\((--color-[\w-]+)\)/)?.[1] || '--color-primary';
    },
    pillSelected(pill) {
        const d = pill.getAttribute('data-selected');
        return d ? d === 'true' : !!pill.style.backgroundColor;
    },
    setPill(pill, on, color) {
        pill.setAttribute('data-selected', on ? 'true' : 'false');
        if (on) pill.style.backgroundColor = `var(${color})`;
        else pill.style.removeProperty('background-color');
        if (on) requestAnimationFrame(() => window.TextContrastAdjuster?.updateElementContrast(pill));
        else window.Components.navbar.plainPill(pill);
    },
    // Deselected: the CSS's own gray and text color, which follow dark mode. The contrast check
    // left the selected color's text on it (color + --basic-txt-color): judged on the gray
    // they'd be fixed in one mode only, so they go.
    plainPill(pill) {
        pill.style.removeProperty('color');
        pill.style.removeProperty('--basic-txt-color');
        if (!pill.getAttribute('style')) pill.removeAttribute('style');
    },
    togglePill(pill) {
        const N = window.Components.navbar;
        N.setPill(pill, !N.pillSelected(pill), N.pillColor(pill.parentElement));
    },
    // A pill's prototype filter (prototype.js) is per screen: out of what synced copies share
    dropFilter(pill) {
        if (pill.getAttribute('data-proto-action') !== 'filter') return;
        pill.removeAttribute('data-proto-action');
        pill.removeAttribute('data-proto-elements');
    },
    // Save change detection ignores data-attribute changes: flag the screen
    markPills(el, why) {
        const id = el.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        if (id) window.projectManager?.addCanvasToChanged?.(id, why);
    },

    setupPills(root) {
        const N = window.Components.navbar;
        if (!root) return;
        root.querySelectorAll(':scope > .color-swatch-container.nav-pill-swatch').forEach(s => s.remove());
        const pills = root.querySelectorAll('.nav-pill');
        if (!pills.length) return;
        pills.forEach(pill => {
            if (!N.pillSelected(pill)) N.plainPill(pill);   // saved before this fix
            if (pill._pillBound) return;
            pill._pillBound = true;
            // The label itself is for typing (as in the Pill group): the pill's padding toggles
            pill.addEventListener('click', (e) => {
                if (e.target.closest('[contenteditable="true"]')) return;
                if (document.body.classList.contains('proto-linking')) return;   // Connect mode picks it
                N.togglePill(pill);
                N.markPills(pill, 'Top nav pill selected');
            });
        });
        if (typeof createColorSwatches !== 'function') return;   // galleries
        const row = pills[0].parentElement;
        const probe = document.createElement('div');
        probe.style.backgroundColor = `var(${N.pillColor(row)})`;
        const made = createColorSwatches(probe);
        const swatch = Array.isArray(made) ? made[0] : made;
        if (!swatch?.children.length) return;
        swatch.classList.add('nav-pill-swatch');
        swatch.querySelectorAll('.color-swatch').forEach(button => {
            button.addEventListener('click', () => {
                const color = button.dataset.color;
                row.dataset.pillColor = color;
                row.querySelectorAll(':scope > .nav-pill').forEach(p => {
                    if (N.pillSelected(p)) N.setPill(p, true, color);
                });
                N.markPills(row, 'Top nav pill color');
            });
        });
        root.insertBefore(swatch, root.firstChild);
        window.updateComponentSwatches?.(root);
    },

    // Prototype player (prototype.js SPECIAL_PLAY): pills toggle. A pill with a link still
    // follows it (the player's own tap handling); one without just selects.
    play(root) {
        const N = window.Components.navbar;
        root.querySelectorAll('.nav-pill').forEach(pill => {
            if (pill._playBound) return;
            pill._playBound = true;
            pill.addEventListener('click', () => N.togglePill(pill));
        });
    },

    // ---- Use on other screens / keep copies in sync (js/component-sync.js) ------------------
    // Everything is shared (style, icons, images, colors, links…) except the bar's own text,
    // which names the page: each slot below is per screen. A new copy takes its screen's name
    // as the title (named screens only); a pushed copy keeps the text it had. App packs' top
    // navs of the same style start synced, whatever their titles.
    TITLE_SLOTS: [
        '.nav-title-text, .nav-brand-text',   // a title / brand-as-title: one slot across variants
        '.nav-username',                      // chat variant
        '.nav-status',
    ],

    syncSettings() {
        const N = window.Components.navbar;
        return {
            container: '.navContain',
            noun: 'top nav',
            replacesNote: 'nav',
            groupPrefix: 'tnav_',
            compactBelow: 340,
            normalize(clone) {
                // Which pills are selected is per screen too (their shared color is on the row),
                // and what a pill filters (prototype filter: components of its own screen)
                clone.querySelectorAll('.nav-pill').forEach(p => {
                    N.dropFilter(p);
                    p.removeAttribute('data-selected');
                    p.style.removeProperty('background-color');
                    p.style.removeProperty('color');
                    if (!p.getAttribute('style')) p.removeAttribute('style');
                });
                N.TITLE_SLOTS.forEach(sel => clone.querySelectorAll(sel).forEach(el => {
                    el.textContent = '';
                    el.classList.remove('usa');   // edited or not: per screen too
                }));
            },
            forScreen(clone, canvas) {
                clone.querySelectorAll('.nav-pill').forEach(N.dropFilter);   // a new copy filters nothing yet
                const name = canvas?.getAttribute('data-screen-name')?.trim();
                const title = clone.querySelector(N.TITLE_SLOTS[0]);
                if (name && title) title.textContent = name;
            },
            // Remembered across pushes (_syncTitles: this session only), so stepping the style
            // through a variant without a title and back keeps the screen's own one
            carryOver(old, fresh) {
                const kept = { ...(old._syncTitles || {}) };
                N.TITLE_SLOTS.forEach(sel => {
                    const from = old.querySelector(sel);
                    if (from) kept[sel] = { text: from.textContent, usa: from.classList.contains('usa') };
                    const to = fresh.querySelector(sel);
                    if (!to || !kept[sel]) return;
                    to.textContent = kept[sel].text;
                    to.classList.toggle('usa', kept[sel].usa);
                });
                fresh._syncTitles = kept;
                // Each screen keeps its own selected pills (by position), in the shared color
                const was = [...old.querySelectorAll('.nav-pill')].map(N.pillSelected);
                const now = [...fresh.querySelectorAll('.nav-pill')];
                if (was.length && now.length) {
                    const color = N.pillColor(now[0].parentElement);
                    now.forEach((p, i) => N.setPill(p, !!was[i], color));
                }
                // … and its own filters
                const olds = [...old.querySelectorAll('.nav-pill')];
                now.forEach((p, i) => {
                    N.dropFilter(p);
                    const o = olds[i];
                    if (o?.getAttribute('data-proto-action') === 'filter') {
                        p.setAttribute('data-proto-action', 'filter');
                        p.setAttribute('data-proto-elements', o.getAttribute('data-proto-elements') || '');
                    }
                });
            },
        };
    },

    // Helper function to set up all interactive elements in the navbar
    setupInteractiveElements(navbarElement) {
        if (!navbarElement) return;

        // Make text elements editable
        navbarElement.querySelectorAll('span:not(.non-editable), a').forEach(el => {
            // el.contentEditable = true;

            // Prevent newlines in editable text
            el.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    el.blur();
                }
            });

            // Handle paste to remove formatting
            el.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text/plain');
                document.execCommand('insertText', false, text);
            });
        });

        // Apply text contrast adjustment to elements with background colors
        setTimeout(() => {
            const elementsWithBg = navbarElement.querySelectorAll('[style*="background-color"]');
            elementsWithBg.forEach(el => {
                if (window.TextContrastAdjuster) {
                    window.TextContrastAdjuster.updateElementContrast(el);
                }
            });
        }, 10);

        return navbarElement;
    }
};

// (templates.html loads this module without component-sync.js)
window.componentSync?.register('navbar', window.Components.navbar.syncSettings());
