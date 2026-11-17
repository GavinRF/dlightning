// Component registry module — see docs/component-module-migration.md
// slider: range slider. Owns its variants (setupVariants falls through here).
//
// Variant 1 is the original native <input type="range">. The others are a small custom
// slider (.cs-slider) so they can have two handles / labeled stops, and so their
// position lives in the markup (thumb `left` %, fill left/width %, data-value) — saved,
// synced, duplicated and undone like any other edit. One delegated document listener
// (installed once) drives every custom slider; no per-instance binding.
//
// Custom slider markup:
//   .cs-slider[data-min][data-max][data-step][data-prefix][data-suffix]
//     .cs-track-area  (hit area)  > .cs-track > .cs-fill
//                                 > .cs-thumb[data-value]   (1, or 2 for a range)
//     .cs-value        (optional) — "50", or "$20 – $80" for a range
// Color: one inline `color: var(--color-*)` on .cs-slider; fill/thumbs use currentColor
// in CSS, so there's a single swatch per slider.
window.Components = window.Components || {};

window.Components.slider = (() => {
    const thumb = (value, min, max) =>
        `<div class="cs-thumb" data-value="${value}" style="left: ${((value - min) / (max - min)) * 100}%;"></div>`;

    const VARIANTS = [
        // 1 — Classic native range (matches the old JS factory's markup)
        /*html*/
        `<div class="range-slider-container">
            <input type="range" min="0" max="100" value="50" class="custom-range-slider" style="flex: 1;">
            <span class="range-value">50</span>
        </div>`,

        // 2 — Range: two handles
        /*html*/
        `<div class="range-slider-container cs-wrap">
            <div class="cs-head">
                <span class="cs-label usa" contenteditable="true">Price range</span>
                <span class="cs-value non-editable">$20 – $80</span>
            </div>
            <div class="cs-slider" data-min="0" data-max="100" data-step="1" data-prefix="$" style="color: var(--color-primary);">
                <div class="cs-track-area">
                    <div class="cs-track"><div class="cs-fill" style="left: 20%; width: 60%;"></div></div>
                    ${thumb(20, 0, 100)}${thumb(80, 0, 100)}
                </div>
            </div>
        </div>`,

        // 3 — Volume: icons at both ends, no number
        /*html*/
        `<div class="range-slider-container cs-wrap cs-volume">
            <div class="icon-container cs-end-icon"><i class="fas fa-volume-low"></i></div>
            <div class="cs-slider" data-min="0" data-max="100" data-step="1" style="color: var(--color-primary);">
                <div class="cs-track-area">
                    <div class="cs-track"><div class="cs-fill" style="left: 0%; width: 65%;"></div></div>
                    ${thumb(65, 0, 100)}
                </div>
            </div>
            <div class="icon-container cs-end-icon"><i class="fas fa-volume-high"></i></div>
        </div>`,

        // 4 — Stepped: snaps to 5 labeled stops
        /*html*/
        `<div class="range-slider-container cs-wrap">
            <div class="cs-head">
                <span class="cs-label usa" contenteditable="true">Size</span>
            </div>
            <div class="cs-slider cs-stepped" data-min="0" data-max="4" data-step="1" style="color: var(--color-primary);">
                <div class="cs-track-area">
                    <div class="cs-track">
                        <div class="cs-fill" style="left: 0%; width: 50%;"></div>
                        <div class="cs-ticks"><span></span><span></span><span></span><span></span><span></span></div>
                    </div>
                    ${thumb(2, 0, 4)}
                </div>
                <div class="cs-step-labels">
                    <span class="usa" contenteditable="true">XS</span><span class="usa" contenteditable="true">S</span><span class="usa" contenteditable="true">M</span><span class="usa" contenteditable="true">L</span><span class="usa" contenteditable="true">XL</span>
                </div>
            </div>
        </div>`
    ];

    // --- custom slider -----------------------------------------------------------------
    const num = (el, key, fallback) => {
        const v = parseFloat(el.dataset[key]);
        return Number.isFinite(v) ? v : fallback;
    };
    const cfg = (sliderEl) => {
        const min = num(sliderEl, 'min', 0);
        const max = num(sliderEl, 'max', 100);
        return { min, max: max > min ? max : min + 1, step: num(sliderEl, 'step', 1) };
    };
    const pct = (v, { min, max }) => ((v - min) / (max - min)) * 100;

    const render = (sliderEl) => {
        const c = cfg(sliderEl);
        const thumbs = [...sliderEl.querySelectorAll('.cs-thumb')];
        const values = thumbs.map(t => num(t, 'value', c.min));
        thumbs.forEach((t, i) => {
            const left = `${pct(values[i], c)}%`;
            if (t.style.left !== left) t.style.left = left;
        });
        const fill = sliderEl.querySelector('.cs-fill');
        if (fill) {
            const lo = thumbs.length > 1 ? Math.min(...values) : c.min;
            const hi = thumbs.length > 1 ? Math.max(...values) : values[0];
            const left = `${pct(lo, c)}%`, width = `${pct(hi, c) - pct(lo, c)}%`;
            if (fill.style.left !== left) fill.style.left = left;
            if (fill.style.width !== width) fill.style.width = width;
        }
        // Value text lives next to the slider (same .range-slider-container)
        const out = sliderEl.closest('.range-slider-container')?.querySelector('.cs-value');
        if (out) {
            const p = sliderEl.dataset.prefix || '', s = sliderEl.dataset.suffix || '';
            const sorted = [...values].sort((a, b) => a - b);
            const text = sorted.map(v => `${p}${v}${s}`).join(' – ');
            if (out.textContent !== text) out.textContent = text;
        }
    };

    const valueAt = (sliderEl, clientX) => {
        const c = cfg(sliderEl);
        const rect = sliderEl.querySelector('.cs-track').getBoundingClientRect();
        const f = rect.width ? Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) : 0;
        const raw = c.min + f * (c.max - c.min);
        const stepped = Math.round((raw - c.min) / c.step) * c.step + c.min;
        return Math.min(c.max, Math.max(c.min, +stepped.toFixed(4)));
    };

    if (!window.__customSliderInstalled) {
        window.__customSliderInstalled = true;
        document.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            const area = e.target.closest?.('.cs-track-area');
            const sliderEl = area?.closest('.cs-slider');
            if (!sliderEl) return;
            e.preventDefault();

            // Grab the thumb nearest the pointer (matters for two-handle ranges)
            const v = valueAt(sliderEl, e.clientX);
            const thumbs = [...sliderEl.querySelectorAll('.cs-thumb')];
            if (!thumbs.length) return;
            const active = thumbs.reduce((best, t) =>
                Math.abs(num(t, 'value', 0) - v) < Math.abs(num(best, 'value', 0) - v) ? t : best);

            const update = (clientX) => {
                const next = String(valueAt(sliderEl, clientX));
                if (active.dataset.value !== next) {
                    active.dataset.value = next;
                    render(sliderEl);
                }
            };
            update(e.clientX);

            const move = (ev) => update(ev.clientX);
            const end = () => {
                document.removeEventListener('pointermove', move);
                document.removeEventListener('pointerup', end);
                document.removeEventListener('pointercancel', end);
                // Save change detection ignores data attributes — flag the screen
                const canvasId = sliderEl.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
                window.projectManager?.addCanvasToChanged(canvasId, 'Slider moved');
            };
            document.addEventListener('pointermove', move);
            document.addEventListener('pointerup', end);
            document.addEventListener('pointercancel', end);
        });
    }

    return {
        variants() {
            return VARIANTS.slice();
        },

        // Build a fresh slider (variant 1) — used by the editor factory on insert.
        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            const el = temp.firstElementChild;
            this.setup(el);
            return el;
        },

        afterVariantChange(content) {
            this.setup(content);
        },

        // Prototype player (js/prototype.js): drag to change the value. The native range
        // works by itself (just mirror its number); custom sliders bind here because the
        // player stops events reaching the delegated document listener above.
        play(root) {
            root.querySelectorAll('input.custom-range-slider').forEach(input => {
                if (input._playBound) return;
                input._playBound = true;
                const out = input.closest('.range-slider-container')?.querySelector('.range-value');
                input.addEventListener('input', () => { if (out) out.textContent = input.value; });
            });
            root.querySelectorAll('.cs-slider').forEach(sliderEl => {
                const area = sliderEl.querySelector('.cs-track-area');
                if (!area || area._playBound) return;
                area._playBound = true;
                area.style.touchAction = 'none';
                area.addEventListener('pointerdown', (e) => {
                    if (e.button !== 0) return;
                    e.preventDefault();
                    const thumbs = [...sliderEl.querySelectorAll('.cs-thumb')];
                    if (!thumbs.length) return;
                    const v = valueAt(sliderEl, e.clientX);
                    const active = thumbs.reduce((best, t) =>
                        Math.abs(num(t, 'value', 0) - v) < Math.abs(num(best, 'value', 0) - v) ? t : best);
                    const update = (ev) => {
                        const next = String(valueAt(sliderEl, ev.clientX));
                        if (active.dataset.value !== next) { active.dataset.value = next; render(sliderEl); }
                    };
                    update(e);
                    area.setPointerCapture?.(e.pointerId);
                    const end = () => {
                        area.removeEventListener('pointermove', update);
                        area.removeEventListener('pointerup', end);
                        area.removeEventListener('pointercancel', end);
                    };
                    area.addEventListener('pointermove', update);
                    area.addEventListener('pointerup', end);
                    area.addEventListener('pointercancel', end);
                });
            });
        },

        // Safe to call repeatedly. Binds the classic native slider; custom sliders need
        // no binding (delegated), just a render to make sure positions match values.
        setup(root) {
            if (!root) return;
            const scope = root.querySelectorAll ? root : null;
            if (!scope) return;

            scope.querySelectorAll('input.custom-range-slider').forEach(input => {
                const out = input.closest('.range-slider-container')?.querySelector('.range-value');
                if (out && input.getAttribute('value') != null) out.textContent = input.value;
                if (input._sliderBound) return;
                input._sliderBound = true;
                input.addEventListener('input', () => {
                    // Mirror into the attribute so saved/synced HTML keeps the position
                    input.setAttribute('value', input.value);
                    if (out) out.textContent = input.value;
                });
            });

            scope.querySelectorAll('.cs-slider').forEach(render);
        }
    };
})();
