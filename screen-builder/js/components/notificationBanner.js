// Component registry module — see docs/component-module-migration.md
// notificationBanner: a notification with an optional action button whose visibility
// is toggled by an eye/eye-slash control. Owns its variants (setupVariants falls
// through to variants() here).
//
// Variant hooks setup() looks for (any variant may omit them):
//   .notification-action-btn  — the action button (data-always-visible + display)
//   .noti-visibility-toggle   — the eye toggle, positioned by its variant's root
window.Components = window.Components || {};

window.Components.notificationBanner = (() => {
    const EYE = '<div class="noti-visibility-toggle"><i class="fas fa-eye"></i></div>';

    const VARIANTS = [
        // 1 — Classic banner (matches what the JS factory used to build, so banners
        // saved before variants existed are this variant)
        /*html*/
        `<div class="notification-banner" style="border-left: 4px solid var(--color-primary);">
            <div class="icon-container" style="flex-shrink: 0;">
                <i class="fas fa-bell" style="font-size: 20px; color: var(--color-accent);"></i>
            </div>
            <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px;">
                <div class="usa" contenteditable="true" style="font-weight: 500; color: var(--basic-txt-color);">Click to edit this important notification message.</div>
                <div class="usa" contenteditable="true" style="font-size: 14px; color: #666;">Additional details can go here.</div>
                <div class="notification-action-btn usa" contenteditable="true" data-always-visible="true" style="background-color: var(--color-primary);">Action</div>
            </div>
            ${EYE}
        </div>`,

        // 2 — Push notification (lock-screen style)
        /*html*/
        `<div class="noti-push">
            <div class="noti-push-head">
                <div class="icon-container noti-app-icon" style="background-color: var(--color-primary);">
                    <i class="fas fa-bolt"></i>
                </div>
                <span class="noti-app-name usa" contenteditable="true">APP NAME</span>
                <span class="noti-time usa" contenteditable="true">now</span>
            </div>
            <div class="noti-title usa" contenteditable="true">New message</div>
            <div class="noti-body usa" contenteditable="true">You have a new notification. Tap to view the details.</div>
        </div>`,

        // 3 — Toast (compact bar with an inline action)
        /*html*/
        `<div class="noti-toast" style="background-color: var(--color-secondary);">
            <div class="icon-container" style="flex-shrink: 0;">
                <i class="fas fa-circle-check"></i>
            </div>
            <div class="noti-title usa" contenteditable="true" style="flex-grow: 1;">Changes saved</div>
            <div class="notification-action-btn noti-toast-action usa" contenteditable="true" data-always-visible="true">Undo</div>
            ${EYE}
        </div>`,

        // 4 — Card with actions
        /*html*/
        `<div class="noti-card">
            <div class="noti-card-top">
                <div class="icon-container noti-card-icon" style="background-color: var(--color-accent);">
                    <i class="fas fa-bell"></i>
                </div>
                <div style="flex-grow: 1; min-width: 0;">
                    <div class="noti-title usa" contenteditable="true">Reminder</div>
                    <div class="noti-body usa" contenteditable="true">Your appointment starts in 15 minutes.</div>
                </div>
                <div class="icon-container noti-close"><i class="fas fa-xmark"></i></div>
            </div>
            <div class="noti-card-actions">
                <div class="noti-btn-secondary usa" contenteditable="true">Dismiss</div>
                <div class="notification-action-btn usa" contenteditable="true" data-always-visible="true" style="background-color: var(--color-primary);">View</div>
            </div>
            ${EYE}
        </div>`
    ];

    return {
        variants() {
            return VARIANTS.slice();
        },

        // Build a fresh banner (variant 1) — used by the editor factory on insert.
        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            const banner = temp.firstElementChild;
            this.setup(banner);
            return banner;
        },

        afterVariantChange(content) {
            this.setup(content);
        },

        // Prototype player (js/prototype.js): dismiss with the × / "Dismiss", or swipe it
        // sideways. Linked parts (e.g. a "View" button) keep their link; a swipe that
        // started on one doesn't also follow it.
        play(root) {
            const banner = root.querySelector('.notification-banner, .noti-push, .noti-toast, .noti-card');
            if (!banner || banner._playBound) return;
            banner._playBound = true;

            const dismiss = (dir = 1) => {
                banner.style.transition = 'transform .22s ease, opacity .22s ease';
                banner.style.transform = `translateX(${dir * 110}%)`;
                banner.style.opacity = '0';
                // then fold the space it took
                setTimeout(() => {
                    root.style.transition = 'height .2s ease, margin .2s ease, padding .2s ease';
                    root.style.height = `${root.offsetHeight}px`;
                    root.style.overflow = 'hidden';
                    void root.offsetHeight;
                    Object.assign(root.style, { height: '0px', marginTop: '0px', marginBottom: '0px', paddingTop: '0px', paddingBottom: '0px' });
                    setTimeout(() => { root.style.display = 'none'; }, 220);
                }, 200);
            };

            banner.addEventListener('click', (e) => {
                if (banner._protoDragged) { banner._protoDragged = false; e.stopPropagation(); e.preventDefault(); return; }
                if (e.target.closest('[data-proto-action]')) return;
                if (e.target.closest('.noti-close, .noti-btn-secondary')) dismiss();
            }, true);
            banner.querySelectorAll('.noti-close, .noti-btn-secondary').forEach(el => { el.style.cursor = 'pointer'; });

            banner.style.touchAction = 'pan-y';
            banner.addEventListener('pointerdown', (e) => {
                if (e.button !== 0) return;
                const startX = e.clientX;
                const width = banner.getBoundingClientRect().width || 1;
                let dragging = false;
                const move = (ev) => {
                    const dx = ev.clientX - startX;
                    if (!dragging && Math.abs(dx) < 8) return;
                    if (!dragging) { dragging = true; banner.setPointerCapture?.(ev.pointerId); }
                    banner.style.transition = 'none';
                    banner.style.transform = `translateX(${dx}px)`;
                    banner.style.opacity = String(Math.max(0.2, 1 - Math.abs(dx) / width));
                };
                const end = (ev) => {
                    banner.removeEventListener('pointermove', move);
                    banner.removeEventListener('pointerup', end);
                    banner.removeEventListener('pointercancel', end);
                    if (!dragging) return;
                    banner._protoDragged = true; // swallow the click this drag ends with
                    setTimeout(() => { banner._protoDragged = false; }, 0);
                    const dx = ev.clientX - startX;
                    if (Math.abs(dx) > width * 0.3) return dismiss(Math.sign(dx));
                    banner.style.transition = 'transform .2s ease, opacity .2s ease';
                    banner.style.transform = '';
                    banner.style.opacity = '';
                };
                banner.addEventListener('pointermove', move);
                banner.addEventListener('pointerup', end);
                banner.addEventListener('pointercancel', end);
            });
        },

        setup(content) {
            if (!content) return;
            const actionButton = content.querySelector('.notification-action-btn');
            const toggleButton = content.querySelector('.noti-visibility-toggle');

            if (actionButton && toggleButton) {
                // Remove any existing listeners first
                toggleButton.replaceWith(toggleButton.cloneNode(true));
                const newToggleButton = content.querySelector('.noti-visibility-toggle');

                // Add fresh event listener
                newToggleButton.addEventListener('click', () => {
                    const isVisible = actionButton.dataset.alwaysVisible === 'true';
                    actionButton.dataset.alwaysVisible = (!isVisible).toString();
                    actionButton.style.display = !isVisible ? 'block' : 'none';
                    newToggleButton.innerHTML = !isVisible ?
                        '<i class="fas fa-eye"></i>' :
                        '<i class="fas fa-eye-slash"></i>';

                    // Mark the screen dirty right away: change detection ignores `display`
                    // changes and debounces 3.5s, so a quick save could otherwise skip this screen.
                    const canvasId = newToggleButton.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
                    window.projectManager?.addCanvasToChanged(canvasId, 'Notification button visibility toggled');
                });
            }
        }
    };
})();
