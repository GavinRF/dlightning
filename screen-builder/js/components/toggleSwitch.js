// Component registry module — see docs/component-module-migration.md
// toggleSwitch: on/off switch(es). Owns its variants (setupVariants falls through here).
//
// State lives in the markup, not a JS variable: a switch is OFF when its track's inline
// background is var(--neutral-gray), ON otherwise (the track keeps whatever on-color the
// user picked with the swatch). So a saved/synced/undone switch toggles correctly from
// whatever state it was in. One delegated listener per component handles any number of
// switches (the Settings-group variant has several).
//
// Thumb travel per variant comes from CSS custom properties on .toggle-switch
// (--thumb-on / --thumb-off), written to the thumb's inline `left` on toggle, so the
// classic switch's markup and behavior are unchanged (30px / 4px).
window.Components = window.Components || {};

window.Components.toggleSwitch = (() => {
    const OFF_BG = 'var(--neutral-gray)';

    const sw = (on = true) => /*html*/`<div class="toggle-switch">
                <div class="toggle-slider round" style="background-color: ${on ? 'var(--color-primary)' : OFF_BG};">
                    <div class="toggle-thumb round"${on ? '' : ' style="left: 4px;"'}></div>
                </div>
            </div>`;

    // Settings rows (icon = full class, e.g. 'fab fa-bluetooth-b' for brand icons): thumb position for OFF switches is fixed up by setup() (CSS vars)
    const settingsRow = (icon, label, on) => /*html*/`<div class="toggle-row">
                <div class="icon-container toggle-row-icon"><i class="${icon}"></i></div>
                <span class="toggle-row-label usa" contenteditable="true">${label}</span>
                ${sw(on)}
            </div>`;

    const VARIANTS = [
        // 1 — Classic: Off [switch] On (matches the old JS factory's markup)
        /*html*/
        `<div class="toggle-switch-container">
            <span class="usa" contenteditable="true" style="margin-right: 10px; cursor: pointer;">Off</span>
            ${sw(true)}
            <span class="usa" contenteditable="true" style="margin-left: 10px; cursor: pointer;">On</span>
        </div>`,

        // 2 — iOS-style row: title + description, switch on the right
        /*html*/
        `<div class="toggle-switch-container toggle-ios">
            <div class="toggle-text">
                <div class="toggle-title usa" contenteditable="true">Notifications</div>
                <div class="toggle-desc usa" contenteditable="true">Get alerts for new messages</div>
            </div>
            ${sw(true)}
        </div>`,

        // 3 — Material-style: label left, slim track with an overhanging thumb
        /*html*/
        `<div class="toggle-switch-container toggle-material">
            <span class="toggle-title usa" contenteditable="true">Dark mode</span>
            ${sw(true)}
        </div>`,

        // 4 — Settings group: several switches in one card
        /*html*/
        `<div class="toggle-switch-container toggle-group">
            ${settingsRow('fas fa-wifi', 'Wi-Fi', true)}
            ${settingsRow('fab fa-bluetooth-b', 'Bluetooth', false)}
            ${settingsRow('fas fa-plane', 'Airplane mode', false)}
        </div>`
    ];

    const isOn = (switchEl) => {
        const track = switchEl.querySelector('.toggle-slider');
        return !!track && !(track.style.backgroundColor || '').includes('neutral-gray');
    };

    const thumbLeft = (switchEl, on) => {
        const v = getComputedStyle(switchEl).getPropertyValue(on ? '--thumb-on' : '--thumb-off').trim();
        return v || (on ? '30px' : '4px');
    };

    const setOn = (switchEl, on) => {
        const track = switchEl.querySelector('.toggle-slider');
        const thumb = switchEl.querySelector('.toggle-thumb');
        if (!track || !thumb) return;
        if (on) {
            track.style.backgroundColor = track.dataset.onColor || 'var(--color-primary)';
        } else {
            // Remember a custom on-color (picked via swatch) for when it's turned back on
            const current = track.style.backgroundColor;
            if (current && !current.includes('neutral-gray')) track.dataset.onColor = current;
            track.style.backgroundColor = OFF_BG;
        }
        thumb.style.left = thumbLeft(switchEl, on);
    };

    return {
        variants() {
            return VARIANTS.slice();
        },

        // Build a fresh switch (variant 1) — used by the editor factory on insert.
        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            const el = temp.firstElementChild;
            this.setup(el);
            return el;
        },

        // Prototype player (js/prototype.js): setup() is runtime-only (no edit chrome), so reuse it.
        play(root) {
            this.setup(root);
        },

        afterVariantChange(content) {
            this.setup(content);
        },

        // Safe to call repeatedly. `root` = the container, .component-content or wrapper.
        setup(root) {
            if (!root) return;
            const container = root.classList?.contains('toggle-switch-container')
                ? root : root.querySelector?.('.toggle-switch-container');
            if (!container) return;

            if (!container._toggleBound) {
                container._toggleBound = true;
                container.addEventListener('click', (e) => {
                    const switchEl = e.target.closest('.toggle-switch');
                    if (!switchEl || !container.contains(switchEl)) return;
                    setOn(switchEl, !isOn(switchEl));
                });
            }

            // Snap thumbs to their variant's geometry once laid out (no-op for classic)
            requestAnimationFrame(() => {
                container.querySelectorAll('.toggle-switch').forEach(switchEl => {
                    const thumb = switchEl.querySelector('.toggle-thumb');
                    if (!thumb) return;
                    const want = thumbLeft(switchEl, isOn(switchEl));
                    if (thumb.style.left !== want && (thumb.style.left || want !== '30px')) {
                        thumb.style.left = want;
                    }
                });
            });
        }
    };
})();
