// Component registry module — see docs/component-module-migration.md
// divider (sidebar type `hzDivider`): horizontal rule with a hover toolbar for
// solid / dotted / double style + a thickness range. Owns its variants
// (window.Components.hzDivider.variants — setupVariants falls through to it).
//
// Every variant is just a .hzRule wrapping lines (.divider-line) plus optional text or
// an icon between them; the toolbar is injected by setup() when missing, and its
// style/thickness apply to ALL lines in the divider (the labeled variants have two).
window.Components = window.Components || {};

window.Components.divider = (() => {
    const line = () => '<div class="divider-line" style="border-color: var(--color-transparent-blk);"></div>';

    const VARIANTS = [
        // 1 — Classic line
        `<div class="hzRule"><div class="hzRule-container">${line()}</div></div>`,

        // 2 — Text in the middle ("OR")
        /*html*/
        `<div class="hzRule"><div class="hzRule-container">${line()}<span class="hzRule-text usa" contenteditable="true">OR</span>${line()}</div></div>`,

        // 3 — Section label on the left
        /*html*/
        `<div class="hzRule"><div class="hzRule-container"><span class="hzRule-text hzRule-label usa" contenteditable="true">Section</span>${line()}</div></div>`,

        // 4 — Icon in the middle
        /*html*/
        `<div class="hzRule"><div class="hzRule-container">${line()}<div class="icon-container hzRule-icon"><i class="fas fa-star"></i></div>${line()}</div></div>`
    ];

    const STYLE_BUTTONS = [
        { icon: 'minus', title: 'Solid', style: 'solid' },
        { icon: 'ellipsis-h', title: 'Dotted', style: 'dotted' },
        { icon: 'grip-lines', title: 'Double', style: 'double' }
    ];

    const findRule = (root) =>
        root?.classList?.contains('hzRule') ? root : root?.querySelector?.('.hzRule');

    // Toolbar markup (same classes/look as the original factory's).
    const ensureControls = (rule) => {
        let controls = rule.querySelector(':scope > .hzRuleControls');
        if (controls) return controls;
        controls = document.createElement('div');
        controls.className = 'hzRuleControls';
        const wrap = document.createElement('div');
        wrap.className = 'hzRule-controls-container';
        const btns = document.createElement('div');
        btns.className = 'hzRule-btns-container';
        STYLE_BUTTONS.forEach(({ icon, title }) => {
            const b = document.createElement('i');
            b.className = `fas fa-${icon} hzRule-control-btn`;
            b.title = title;
            btns.appendChild(b);
        });
        const range = document.createElement('input');
        range.type = 'range';
        range.title = 'thickness';
        range.className = 'hzRule-thickness-control';
        range.min = '1';
        range.max = '8';
        range.value = '2';
        const rangeWrap = document.createElement('div');
        rangeWrap.className = 'hzRule-thickness-container';
        rangeWrap.appendChild(range);
        wrap.append(btns, rangeWrap);
        controls.appendChild(wrap);
        rule.insertBefore(controls, rule.firstChild);
        return controls;
    };

    const lines = (rule) => rule.querySelectorAll('.divider-line');

    return {
        variants() {
            return VARIANTS.slice();
        },

        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            const rule = temp.firstElementChild;
            this.setup(rule);
            return rule;
        },

        afterVariantChange(content) {
            this.setup(content);
        },

        // Safe to call repeatedly (flags don't survive cloneNode, so duplicates rebind).
        setup(root) {
            const rule = findRule(root);
            if (!rule) return;
            const controls = ensureControls(rule);
            const range = controls.querySelector('input[type="range"]');

            // Older saved dividers have the slider loose in the toolbar; give it its pill
            if (range && !range.parentElement.classList.contains('hzRule-thickness-container')) {
                const rangeWrap = document.createElement('div');
                rangeWrap.className = 'hzRule-thickness-container';
                range.replaceWith(rangeWrap);
                rangeWrap.appendChild(range);
            }

            // Reflect the current thickness in the range (input values aren't saved)
            const first = rule.querySelector('.divider-line');
            const width = first && parseInt(first.style.borderTopWidth, 10);
            if (range && width) range.value = String(width);

            if (controls._dividerBound) return;
            controls._dividerBound = true;

            controls.addEventListener('click', (e) => {
                const btn = e.target.closest('.hzRule-control-btn');
                if (!btn) return;
                const def = STYLE_BUTTONS.find(s => s.title === btn.title) || STYLE_BUTTONS[0];
                lines(rule).forEach(l => {
                    l.style.borderStyle = def.style;
                    l.style.borderWidth = `${range?.value || 2}px 0 0 0`;
                    l.style.background = 'none';
                    l.style.height = '0';
                    if (!l.style.borderColor) l.style.borderColor = 'var(--color-transparent-blk)';
                });
            });

            range?.addEventListener('input', (e) => {
                lines(rule).forEach(l => { l.style.borderWidth = `${e.target.value}px 0 0 0`; });
            });
        }
    };
})();

// The sidebar/registry type is `hzDivider`; same module.
window.Components.hzDivider = window.Components.divider;
