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

        editor.setupDeleteHandler(topNavbarContainer);
        // update text contrast
        window.TextContrastAdjuster.updateElementContrast(navbarElement);

        // Last, so setup's own changes aren't taken for an edit
        window.componentSync?.attach(topNavbarContainer, 'navbar');   // Reuse / Synced · N / Detach + sync
        return topNavbarContainer;
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
                N.TITLE_SLOTS.forEach(sel => clone.querySelectorAll(sel).forEach(el => {
                    el.textContent = '';
                    el.classList.remove('usa');   // edited or not: per screen too
                }));
            },
            forScreen(clone, canvas) {
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
