// Component registry module — see docs/component-module-migration.md
// stepper: quantity stepper (− 1 +) — plain, labeled row (guests, tickets), filled pill.
// Owns its variants (setupVariants falls through here).
//
// The value is the editable number between the buttons, so it saves / syncs / undoes as
// ordinary text. The − and + buttons step it in the editor and in play, clamped to the
// stepper's data-min / data-max (defaults 0 and 99); typing a number works too. The −
// button dims at the minimum (the inline opacity is part of the design, so it's saved).
window.Components = window.Components || {};

window.Components.stepper = (() => {
    const btn = (dir, icon, style = '') =>
        `<div class="stepper-btn" role="button" data-step="${dir}"${style ? ` style="${style}"` : ''}><i class="fas ${icon}"></i></div>`;

    const control = (value, min, { filled = false } = {}) => {
        const style = filled ? '' : 'border-color: var(--color-primary); color: var(--color-primary);';
        return /*html*/`<div class="stepper${filled ? ' stepper-filled' : ''}" data-min="${min}" data-max="99"${filled ? ' style="background-color: var(--color-primary);"' : ''}>
                ${btn(-1, 'fa-minus', style)}
                <span class="stepper-value usa" contenteditable="true">${value}</span>
                ${btn(1, 'fa-plus', style)}
            </div>`;
    };

    const VARIANTS = [
        // 1 — Plain: outlined − 1 +
        /*html*/
        `<div class="stepper-container">
            ${control(1, 1)}
        </div>`,

        // 2 — Labeled row: title + description, stepper on the right (guests, tickets)
        /*html*/
        `<div class="stepper-container stepper-row">
            <div class="stepper-text">
                <div class="stepper-title usa" contenteditable="true">Adults</div>
                <div class="stepper-desc usa" contenteditable="true">Ages 13 or above</div>
            </div>
            ${control(2, 0)}
        </div>`,

        // 3 — Filled pill (cart items, add-to-order)
        /*html*/
        `<div class="stepper-container">
            ${control(1, 1, { filled: true })}
        </div>`
    ];

    const limits = (stepper) => {
        const min = parseInt(stepper.dataset.min, 10);
        const max = parseInt(stepper.dataset.max, 10);
        return { min: Number.isFinite(min) ? min : 0, max: Number.isFinite(max) ? max : 99 };
    };

    // Dim − at the minimum, + at the maximum
    const refresh = (stepper) => {
        const value = parseInt(stepper.querySelector('.stepper-value')?.textContent, 10);
        const { min, max } = limits(stepper);
        stepper.querySelectorAll('.stepper-btn').forEach(b => {
            const atEnd = b.dataset.step === '-1' ? value <= min : value >= max;
            if (atEnd) b.style.opacity = '0.4';
            else b.style.removeProperty('opacity');
        });
    };

    return {
        variants() {
            return VARIANTS.slice();
        },

        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            const el = temp.firstElementChild;
            this.setup(el);
            return el;
        },

        play(root) {
            this.setup(root);
        },

        afterVariantChange(content) {
            this.setup(content);
        },

        // Set the value (templates). Clamped to the stepper's limits.
        setValue(root, value) {
            root?.querySelectorAll?.('.stepper').forEach(stepper => {
                const { min, max } = limits(stepper);
                const out = stepper.querySelector('.stepper-value');
                if (out) out.textContent = String(Math.min(max, Math.max(min, value)));
                refresh(stepper);
            });
        },

        // Safe to call repeatedly. `root` = the container, .component-content or wrapper.
        setup(root) {
            if (!root) return;
            const container = root.classList?.contains('stepper-container') ? root : root.querySelector?.('.stepper-container');
            if (!container) return;
            container.querySelectorAll('.stepper').forEach(refresh);
            if (container._stepperBound) return;
            container._stepperBound = true;

            container.addEventListener('click', (e) => {
                const b = e.target.closest('.stepper-btn');
                if (!b || !container.contains(b)) return;
                const stepper = b.closest('.stepper');
                const out = stepper?.querySelector('.stepper-value');
                if (!out) return;
                e.preventDefault();
                const { min, max } = limits(stepper);
                const current = parseInt(out.textContent, 10);
                const next = Math.min(max, Math.max(min, (Number.isFinite(current) ? current : min) + Number(b.dataset.step)));
                out.textContent = String(next);
                refresh(stepper);
            });
            container.addEventListener('input', (e) => {
                const stepper = e.target.closest('.stepper');
                if (stepper && container.contains(stepper)) refresh(stepper);
            });
        }
    };
})();
