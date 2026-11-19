// Line graph component (data-component-type="lineGraph").
//
// State lives in the DOM so it survives save/load, duplicate, and live sync:
//   .line-graph-wrapper[data-graph] = JSON {points: [{label, value}], color, stat?: {title, value, change}}
//   .line-graph-wrapper[data-graph-style] = the variant's look:
//     area (default) — smooth line with a gradient fill, y grid + x labels
//     line           — straight segments with dots
//     stat           — KPI card: title, big number, change pill, sparkline (no axes)
//     compare        — area chart + a dashed "previous period" line and a legend
//                      (adds {compare: [value per point], legend: [name, name]})
// The plot is an SVG in a 0–100 viewBox stretched to the box (non-scaling strokes); the
// dots are HTML on top so they stay round and can be dragged up/down to set a value.
// +/- reuse the bar graph's control classes, so play mode / icon styles already treat
// them as editor chrome. Switching variants keeps the points (afterVariantChange).
window.Components = window.Components || {};

window.Components.lineGraph = (() => {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const DEFAULT_COLOR = 'var(--color-primary)';
    const MIN_POINTS = 2;
    const MAX_POINTS = 12;

    const VARIANTS = [
        /*html*/ `<div class="line-graph-wrapper resizeable" data-graph-style="area"></div>`,
        /*html*/ `<div class="line-graph-wrapper resizeable" data-graph-style="line"></div>`,
        /*html*/ `<div class="line-graph-wrapper" data-graph-style="stat"></div>`,
        /*html*/ `<div class="line-graph-wrapper resizeable" data-graph-style="compare"></div>`
    ];
    const DEFAULT_LEGEND = ['This year', 'Last year'];

    // One previous-period value per point; fills in any that are missing (a switch from
    // another look, or points added) with a plausible lower run.
    function ensureCompare(state) {
        const prev = Array.isArray(state.compare) ? state.compare : [];
        state.compare = state.points.map((p, i) => prev[i] ?? Math.max(0, Math.round(p.value * (0.6 + ((i * 29) % 25) / 100))));
        if (!Array.isArray(state.legend) || state.legend.length < 2) state.legend = DEFAULT_LEGEND.slice();
        return state;
    }

    const DEFAULT_STAT = { title: 'Revenue', value: '$12,480', change: '▲ 12.5%' };

    const defaultState = () => ({
        points: [
            { label: 'Jan', value: 32 },
            { label: 'Feb', value: 48 },
            { label: 'Mar', value: 41 },
            { label: 'Apr', value: 66 },
            { label: 'May', value: 58 },
            { label: 'Jun', value: 82 }
        ],
        color: DEFAULT_COLOR
    });

    const lastState = new WeakMap();

    const styleOf = (wrapper) => wrapper.dataset.graphStyle || 'area';

    const findWrapper = (root) => {
        if (!root) return null;
        if (root.classList?.contains('line-graph-wrapper')) return root;
        return root.querySelector?.('.line-graph-wrapper') || null;
    };

    function readState(wrapper) {
        try {
            const parsed = JSON.parse(wrapper.dataset.graph || 'null');
            if (parsed && Array.isArray(parsed.points) && parsed.points.length) {
                return { ...parsed, color: parsed.color || DEFAULT_COLOR };
            }
        } catch (e) {
            console.warn('lineGraph: invalid data-graph, using defaults', e);
        }
        return defaultState();
    }

    function writeState(wrapper, state) {
        wrapper.dataset.graph = JSON.stringify(state);
        const host = wrapper.closest('.component-content');
        if (host) lastState.set(host, state);
    }

    // Round the axis top up to 1 / 2 / 2.5 / 5 × 10^n so grid labels are tidy
    function niceMax(v) {
        if (v <= 0) return 10;
        const mag = Math.pow(10, Math.floor(Math.log10(v)));
        const n = v / mag;
        return [1, 2, 2.5, 5, 10].find(s => n <= s) * mag;
    }

    const isDown = (text) => /^\s*[-−▼↓]/.test(text || '');

    // Value range of the plot. Charts with an axis start at 0; the stat card's sparkline
    // fits the data so a trend still reads at 64px tall.
    function scaleOf(state, style) {
        const values = state.points.map(p => p.value).concat(style === 'compare' ? state.compare || [] : []);
        const hi = Math.max(...values, 1);
        if (style !== 'stat') return { min: 0, max: niceMax(hi) };
        const lo = Math.min(...values);
        const pad = Math.max((hi - lo) * 0.25, hi * 0.05, 1);
        return { min: Math.max(0, lo - pad), max: hi + pad * 0.4 };
    }

    // x/y of each point in the 0–100 plot space
    function coords(state, scale, inset, values = state.points.map(p => p.value)) {
        const n = values.length;
        const span = scale.max - scale.min || 1;
        return values.map((v, i) => ({
            x: n === 1 ? 50 : inset + (i / (n - 1)) * (100 - inset * 2),
            y: 100 - ((Math.max(scale.min, v) - scale.min) / span) * 100
        }));
    }

    // Catmull-Rom → cubic Bézier, y clamped to the plot so the curve never overshoots it
    function smoothPath(pts) {
        if (pts.length < 3) return linePath(pts);
        const clamp = (y) => Math.max(0, Math.min(100, y));
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
            const c1x = p1.x + (p2.x - p0.x) / 6, c1y = clamp(p1.y + (p2.y - p0.y) / 6);
            const c2x = p2.x - (p3.x - p1.x) / 6, c2y = clamp(p2.y - (p3.y - p1.y) / 6);
            d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
        }
        return d;
    }
    const linePath = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');

    // (Re)draw the SVG paths + dots. Used by render() and on every drag move.
    function drawPlot(plot, state, style, scale) {
        const inset = style === 'stat' ? 0 : 4;
        const pts = coords(state, scale, inset);
        const d = style === 'line' ? linePath(pts) : smoothPath(pts);
        const svg = plot.querySelector('svg');
        svg.querySelector('.line-graph-line:not(.compare)').setAttribute('d', d);
        const area = svg.querySelector('.line-graph-area');
        if (area) area.setAttribute('d', `${d} L ${pts[pts.length - 1].x} 100 L ${pts[0].x} 100 Z`);

        plot.querySelectorAll('.line-graph-point:not(.compare)').forEach((dot, i) => {
            if (!pts[i]) return;
            dot.style.left = `${pts[i].x}%`;
            dot.style.top = `${pts[i].y}%`;
            dot.dataset.value = state.points[i].value;
        });

        const prevLine = svg.querySelector('.line-graph-line.compare');
        if (prevLine && state.compare) {
            const cpts = coords(state, scale, inset, state.compare);
            prevLine.setAttribute('d', smoothPath(cpts));
            plot.querySelectorAll('.line-graph-point.compare').forEach((dot, i) => {
                if (!cpts[i]) return;
                dot.style.left = `${cpts[i].x}%`;
                dot.style.top = `${cpts[i].y}%`;
                dot.dataset.value = state.compare[i];
            });
        }
    }

    // Tilt the x labels 45° (.labels-angled) when any is wider than the space between
    // points; straight again once they fit. Re-checked on render and on resize.
    function fitLabels(wrapper) {
        const labels = wrapper.querySelector('.line-graph-labels');
        const gap = labels ? labels.clientWidth * (parseFloat(labels.dataset.spacing) || 100) / 100 - 4 : 0;
        const angled = !!labels && gap > 0 &&
            Array.from(labels.children).some(label => label.scrollWidth > gap);
        if (wrapper.classList.contains('labels-angled') !== angled) wrapper.classList.toggle('labels-angled', angled);
    }

    function render(wrapper) {
        const state = readState(wrapper);
        const style = styleOf(wrapper);
        if (style === 'compare') ensureCompare(state);
        const scale = scaleOf(state, style);
        const yMax = scale.max;

        wrapper.querySelectorAll(':scope > .line-graph-body').forEach(el => el.remove());
        wrapper.classList.remove('line-graph--area', 'line-graph--line', 'line-graph--stat', 'line-graph--compare');
        wrapper.classList.add(`line-graph--${style}`);

        // Persisted controls (see graph.js) — same classes, so they're stripped in play
        if (!wrapper.querySelector(':scope > .bar-graph-controls')) {
            const controls = document.createElement('div');
            controls.className = 'bar-graph-controls';
            controls.innerHTML =
                '<button class="bar-graph-add-btn" data-graph-action="remove"><i class="fas fa-minus"></i></button>' +
                '<button class="bar-graph-add-btn" data-graph-action="add"><i class="fas fa-plus"></i></button>';
            wrapper.appendChild(controls);
        }

        const body = document.createElement('div');
        body.className = 'line-graph-body';

        if (style === 'stat') {
            const stat = { ...DEFAULT_STAT, ...state.stat };
            state.stat = stat;
            const head = document.createElement('div');
            head.className = 'line-graph-stat';
            head.innerHTML =
                '<div class="line-graph-stat-title usa" contenteditable="true" data-stat-field="title"></div>' +
                '<div class="line-graph-stat-row">' +
                    '<div class="line-graph-stat-value usa" contenteditable="true" data-stat-field="value"></div>' +
                    '<div class="line-graph-stat-change usa" contenteditable="true" data-stat-field="change"></div>' +
                '</div>';
            head.querySelector('.line-graph-stat-title').textContent = stat.title;
            head.querySelector('.line-graph-stat-value').textContent = stat.value;
            const change = head.querySelector('.line-graph-stat-change');
            change.textContent = stat.change;
            change.classList.toggle('down', isDown(stat.change));
            body.appendChild(head);
        }

        if (style === 'compare') {
            const legend = document.createElement('div');
            legend.className = 'line-graph-legend';
            state.legend.forEach((name, k) => {
                const item = document.createElement('div');
                item.className = 'line-graph-legend-item' + (k ? ' compare' : '');
                const swatch = document.createElement('span');
                swatch.className = 'line-graph-legend-swatch';
                if (!k) swatch.style.background = state.color;
                const text = document.createElement('span');
                text.className = 'line-graph-legend-name';
                text.setAttribute('contenteditable', 'true'); text.classList.add('usa');
                text.dataset.legend = k;
                text.textContent = name;
                item.append(swatch, text);
                legend.appendChild(item);
            });
            body.appendChild(legend);
        }

        const chart = document.createElement('div');
        chart.className = 'line-graph-chart';

        if (style !== 'stat') {
            const grid = document.createElement('div');
            grid.className = 'line-graph-grid';
            for (let i = 0; i <= 4; i++) {
                const line = document.createElement('div');
                line.className = 'line-graph-grid-line';
                const label = document.createElement('span');
                label.className = 'line-graph-grid-label';
                label.textContent = Math.round(yMax * (1 - i / 4));
                line.appendChild(label);
                grid.appendChild(line);
            }
            chart.appendChild(grid);
        }

        const plot = document.createElement('div');
        plot.className = 'line-graph-plot';
        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'none');

        if (style !== 'line') {
            // Unique per render; a clone (duplicate / play) carries the same color, so a shared id is harmless
            const gradId = `lg-grad-${Math.random().toString(36).slice(2, 9)}`;
            const defs = document.createElementNS(SVG_NS, 'defs');
            const grad = document.createElementNS(SVG_NS, 'linearGradient');
            grad.setAttribute('id', gradId);
            grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0');
            grad.setAttribute('x2', '0'); grad.setAttribute('y2', '1');
            [['0%', '.35'], ['100%', '0']].forEach(([offset, opacity]) => {
                const stop = document.createElementNS(SVG_NS, 'stop');
                stop.setAttribute('offset', offset);
                stop.setAttribute('style', `stop-color: ${state.color}; stop-opacity: ${opacity}`);
                grad.appendChild(stop);
            });
            defs.appendChild(grad);
            svg.appendChild(defs);

            const area = document.createElementNS(SVG_NS, 'path');
            area.setAttribute('class', 'line-graph-area');
            area.setAttribute('fill', `url(#${gradId})`);
            svg.appendChild(area);
        }

        if (style === 'compare') {
            // Under the main line, so the current period reads on top
            const prev = document.createElementNS(SVG_NS, 'path');
            prev.setAttribute('class', 'line-graph-line compare');
            prev.setAttribute('fill', 'none');
            prev.setAttribute('vector-effect', 'non-scaling-stroke');
            svg.appendChild(prev);
        }

        const line = document.createElementNS(SVG_NS, 'path');
        line.setAttribute('class', 'line-graph-line');
        line.setAttribute('fill', 'none');
        line.setAttribute('vector-effect', 'non-scaling-stroke');
        line.style.stroke = state.color;
        svg.appendChild(line);
        plot.appendChild(svg);

        state.points.forEach((p, i) => {
            const dot = document.createElement('div');
            dot.className = 'line-graph-point';
            dot.dataset.index = i;
            dot.style.borderColor = state.color;
            plot.appendChild(dot);
        });
        if (style === 'compare') state.compare.forEach((v, i) => {
            const dot = document.createElement('div');
            dot.className = 'line-graph-point compare';
            dot.dataset.index = i;
            dot.dataset.series = 1;
            plot.appendChild(dot);
        });
        chart.appendChild(plot);

        if (style !== 'stat') {
            const labels = document.createElement('div');
            labels.className = 'line-graph-labels';
            const xs = coords(state, scale, 4); // same x as the dots above
            labels.dataset.spacing = xs.length > 1 ? xs[1].x - xs[0].x : 100;
            state.points.forEach((p, i) => {
                const label = document.createElement('div');
                label.className = 'line-graph-label';
                label.setAttribute('contenteditable', 'true'); label.classList.add('usa');
                label.dataset.index = i;
                label.style.left = `${xs[i].x}%`;
                // No wider than the space between points, so long labels truncate instead of colliding
                label.style.maxWidth = xs.length > 1 ? `calc(${xs[1].x - xs[0].x}% - 4px)` : '100%';
                label.textContent = p.label;
                label.title = p.label; // full text when truncated
                labels.appendChild(label);
            });
            chart.appendChild(labels);
        }

        body.appendChild(chart);
        wrapper.appendChild(body);
        drawPlot(plot, state, style, scale);
        writeState(wrapper, state);
        fitLabels(wrapper);
    }

    function startDrag(wrapper, dot, e) {
        const index = Number(dot.dataset.index);
        const state = readState(wrapper);
        if (!state.points[index]) return;
        e.preventDefault();
        e.stopPropagation(); // don't start a component drag/select

        const style = styleOf(wrapper);
        if (style === 'compare') ensureCompare(state);
        const isPrev = dot.classList.contains('compare');
        const get = () => isPrev ? state.compare[index] : state.points[index].value;
        const set = (v) => { if (isPrev) state.compare[index] = v; else state.points[index].value = v; };
        const plot = dot.closest('.line-graph-plot');
        // Scale stays fixed during the drag; the axis re-scales on release.
        const scale = scaleOf(state, style);
        const step = scale.max >= 2000 ? 100 : scale.max >= 200 ? 10 : 1;
        wrapper.classList.add('line-graph-dragging');
        dot.classList.add('dragging');

        const onMove = (ev) => {
            const rect = plot.getBoundingClientRect();
            const frac = Math.max(0, Math.min(1, (rect.bottom - ev.clientY) / rect.height));
            const value = Math.round((scale.min + frac * (scale.max - scale.min)) / step) * step;
            if (value === get()) return;
            set(value);
            drawPlot(plot, state, style, scale);
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            wrapper.classList.remove('line-graph-dragging');
            writeState(wrapper, state);
            render(wrapper);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    function bind(wrapper) {
        if (wrapper._lineGraphBound) return;
        wrapper._lineGraphBound = true;

        wrapper.addEventListener('mousedown', (e) => {
            const dot = e.target.closest('.line-graph-point');
            if (dot && wrapper.contains(dot)) startDrag(wrapper, dot, e);
        });

        wrapper.addEventListener('click', (e) => {
            const btn = e.target.closest('[data-graph-action]');
            if (!btn || !wrapper.contains(btn)) return;
            const state = readState(wrapper);
            const n = state.points.length;
            if (btn.dataset.graphAction === 'add' && n < MAX_POINTS) {
                const last = state.points[n - 1]?.value ?? 50;
                const max = Math.max(...state.points.map(p => p.value), 10);
                const value = Math.max(0, Math.round(last + (Math.random() - 0.4) * max * 0.4));
                state.points.push({ label: MONTHS[n % 12], value });
                // compare (if any) gets its new value from ensureCompare on render
            } else if (btn.dataset.graphAction === 'remove' && n > MIN_POINTS) {
                state.points.pop();
                if (Array.isArray(state.compare)) state.compare.length = state.points.length;
            } else {
                return;
            }
            writeState(wrapper, state);
            render(wrapper);
        });

        // Keep edited text in state so the next render doesn't revert it
        wrapper.addEventListener('input', (e) => {
            const state = readState(wrapper);
            const label = e.target.closest?.('.line-graph-label');
            const field = e.target.closest?.('[data-stat-field]');
            const legend = e.target.closest?.('[data-legend]');
            if (legend) {
                ensureCompare(state);
                state.legend[Number(legend.dataset.legend)] = legend.textContent.trim();
            } else if (label) {
                const p = state.points[Number(label.dataset.index)];
                if (!p) return;
                p.label = label.textContent.trim();
                label.title = p.label;
            } else if (field) {
                state.stat = { ...DEFAULT_STAT, ...state.stat, [field.dataset.statField]: field.textContent.trim() };
                if (field.dataset.statField === 'change') field.classList.toggle('down', isDown(field.textContent));
            } else {
                return;
            }
            writeState(wrapper, state);
        });

        const setControlsOpacity = (v) => {
            const controls = wrapper.querySelector(':scope > .bar-graph-controls');
            if (controls) controls.style.opacity = v;
        };
        wrapper.addEventListener('mouseenter', () => setControlsOpacity('1'));
        wrapper.addEventListener('mouseleave', () => setControlsOpacity('0'));

        // Also covers the first layout after insert (render can run while detached)
        if (typeof ResizeObserver === 'function') new ResizeObserver(() => fitLabels(wrapper)).observe(wrapper);
        wrapper.addEventListener('input', (e) => { if (e.target.closest?.('.line-graph-label')) fitLabels(wrapper); });
    }

    return {
        // Owns its variants (setupVariants falls through here).
        variants() {
            return VARIANTS.slice();
        },

        create(variant = 0) {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[variant] || VARIANTS[0];
            const wrapper = temp.firstElementChild;
            writeState(wrapper, defaultState());
            this.setup(wrapper);
            return wrapper;
        },

        // Wire up a line graph found at/under `root`. Safe to call more than once.
        setup(root) {
            const wrapper = findWrapper(root);
            if (!wrapper) return null;
            render(wrapper);
            bind(wrapper);
            return wrapper;
        },

        // New variant markup swapped in: carry the points over, render, and re-add the swatch.
        afterVariantChange(content) {
            const wrapper = findWrapper(content);
            if (!wrapper) return;
            const prev = lastState.get(content);
            if (prev) {
                let own = null;
                try { own = JSON.parse(wrapper.dataset.graph || 'null'); } catch (e) { /* fresh variant */ }
                writeState(wrapper, { ...own, points: prev.points, color: prev.color, stat: own?.stat ?? prev.stat,
                    compare: prev.compare ?? own?.compare, legend: prev.legend ?? own?.legend });
            }
            this.setup(wrapper);
            if (typeof createGraphColorSwatch === 'function') createGraphColorSwatch(wrapper);
        },

        // Called by the graph color swatch (createGraphColorSwatch in extra-func.js).
        setColor(root, color) {
            const wrapper = findWrapper(root);
            if (!wrapper) return;
            const state = readState(wrapper);
            state.color = color;
            writeState(wrapper, state);
            render(wrapper);
        }
    };
})();
