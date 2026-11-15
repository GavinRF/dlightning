// Bar graph component (data-component-type="graph").
//
// State lives in the DOM so it survives save/load, duplicate, and live sync:
//   .bar-graph-wrapper[data-graph] = JSON {bars: [{label, value}], color, active?}
//   .bar-graph-wrapper[data-graph-style] = the variant's look (absent = vertical):
//     horizontal — label | bar | value rows, dragged sideways
//     activity   — rounded pill bars, no axis; one highlighted bar (`active`, click to pick)
//     grouped    — 2 series side by side per label, with a legend
//     stacked    — 2 series stacked per label, total on top, with a legend
//   Multi-series looks add {series: [{name, color}], bars[i].more: [series-2 value]}: series 1
//   is still bars[i].value + state.color (so the swatch and single looks keep working); a
//   series' legend dot cycles its color. Single looks ignore the extra fields.
// setup() reads that state (or, for graphs saved before data-graph existed, scrapes
// it from the rendered bars), renders, and binds delegated listeners once per element.
// Switching variants keeps the bars (afterVariantChange re-seeds from the last state).
window.Components = window.Components || {};

window.Components.graph = (() => {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const CATEGORIES = ['Housing', 'Food', 'Transport', 'Shopping', 'Health', 'Travel', 'Fun', 'Bills', 'Gifts', 'Pets', 'Kids', 'Other'];
    const DEFAULT_COLOR = 'var(--color-primary)';
    const MIN_BARS = 2;
    const MAX_BARS = 12;

    const VARIANTS = [
        /*html*/ `<div class="bar-graph-wrapper resizeable"></div>`,
        /*html*/ `<div class="bar-graph-wrapper" data-graph-style="horizontal"></div>`,
        /*html*/ `<div class="bar-graph-wrapper resizeable" data-graph-style="activity"></div>`,
        /*html*/ `<div class="bar-graph-wrapper resizeable" data-graph-style="grouped"></div>`,
        /*html*/ `<div class="bar-graph-wrapper resizeable" data-graph-style="stacked"></div>`
    ];
    const isMulti = (style) => style === 'grouped' || style === 'stacked';
    // Legend dot click cycles a series through these
    const SERIES_COLORS = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-secondary)', 'var(--neutral-gray)', '#F59E0B', '#10B981'];

    // Give single-series data a second series (a plausible "previous period") so a
    // switch to grouped/stacked has something to show; keeps what's already there.
    function ensureMulti(state) {
        if (!Array.isArray(state.series) || state.series.length < 2) {
            state.series = [{ name: 'This year' }, { name: 'Last year', color: 'var(--color-accent)' }];
        }
        state.bars.forEach((b, i) => {
            if (!Array.isArray(b.more) || !b.more.length) {
                b.more = [Math.max(0, Math.round(b.value * (0.55 + ((i * 37) % 30) / 100)))];
            }
        });
        return state;
    }
    const seriesColor = (state, k) => k === 0 ? state.color : (state.series?.[k]?.color || SERIES_COLORS[k % SERIES_COLORS.length]);
    const valuesOf = (b) => [b.value, ...(b.more || [])];

    const styleOf = (wrapper) => wrapper.dataset.graphStyle || 'vertical';
    const labelFor = (style, i) => (style === 'horizontal' ? CATEGORIES : style === 'activity' ? DAYS : MONTHS)[i % (style === 'activity' ? 7 : 12)];

    const defaultState = (style = 'vertical') => {
        if (style === 'horizontal') return {
            bars: [
                { label: 'Housing', value: 1250 },
                { label: 'Food', value: 640 },
                { label: 'Transport', value: 320 },
                { label: 'Shopping', value: 410 },
                { label: 'Health', value: 180 }
            ],
            color: DEFAULT_COLOR
        };
        if (style === 'activity') return {
            bars: DAYS.map((label, i) => ({ label, value: [6200, 8400, 4100, 9800, 7300, 11200, 5600][i] })),
            color: DEFAULT_COLOR,
            active: 5
        };
        if (isMulti(style)) return {
            bars: [
                { label: 'Jan', value: 42, more: [30] },
                { label: 'Feb', value: 38, more: [34] },
                { label: 'Mar', value: 55, more: [41] },
                { label: 'Apr', value: 49, more: [45] },
                { label: 'May', value: 63, more: [47] }
            ],
            color: DEFAULT_COLOR,
            series: [{ name: 'Income' }, { name: 'Spending', color: 'var(--color-accent)' }]
        };
        return {
            bars: [
                { label: 'Jan', value: 30 },
                { label: 'Feb', value: 45 },
                { label: 'Mar', value: 25 },
                { label: 'Apr', value: 60 },
                { label: 'May', value: 40 }
            ],
            color: DEFAULT_COLOR
        };
    };

    // Last state written per .component-content, so a variant switch keeps the user's bars.
    const lastState = new WeakMap();

    const findWrapper = (root) => {
        if (!root) return null;
        if (root.classList?.contains('bar-graph-wrapper')) return root;
        return root.querySelector?.('.bar-graph-wrapper') || null;
    };

    // Legacy graphs (saved before data-graph) only have the rendered markup.
    function scrapeState(wrapper) {
        const barWrappers = wrapper.querySelectorAll('.bar-graph-bar-wrapper');
        if (!barWrappers.length) return null;
        const bars = Array.from(barWrappers).map((bw, i) => ({
            label: bw.querySelector('.bar-graph-month-label')?.textContent.trim() || MONTHS[i % 12],
            value: Math.max(0, parseFloat(bw.querySelector('.bar-graph-bar-value')?.textContent) || 0)
        }));
        const firstBar = wrapper.querySelector('.bar-graph-bar');
        const color = firstBar?.style.backgroundColor || firstBar?.style.background || DEFAULT_COLOR;
        return { bars, color };
    }

    function readState(wrapper) {
        try {
            const parsed = JSON.parse(wrapper.dataset.graph || 'null');
            if (parsed && Array.isArray(parsed.bars) && parsed.bars.length) {
                return { ...parsed, color: parsed.color || DEFAULT_COLOR };
            }
        } catch (e) {
            console.warn('graph: invalid data-graph, falling back to markup', e);
        }
        return scrapeState(wrapper) || defaultState(styleOf(wrapper));
    }

    function writeState(wrapper, state) {
        wrapper.dataset.graph = JSON.stringify(state);
        const host = wrapper.closest('.component-content');
        if (host) lastState.set(host, state);
    }

    const fmt = (v) => Number(v).toLocaleString('en-US');
    const activeIndex = (state) => Math.min(Math.max(0, state.active ?? state.bars.length - 1), state.bars.length - 1);

    function ensureControls(wrapper) {
        // Controls persist across renders so their hover state (opacity) survives a
        // click on +/-; rebuilding them would hide them while the mouse is still inside.
        let controls = wrapper.querySelector(':scope > .bar-graph-controls');
        // Graphs saved before this module have controls without data-graph-action; replace them.
        if (controls && !controls.querySelector('[data-graph-action]')) {
            controls.remove();
            controls = null;
        }
        if (!controls) {
            controls = document.createElement('div');
            controls.className = 'bar-graph-controls';
            controls.innerHTML =
                '<button class="bar-graph-add-btn" data-graph-action="remove"><i class="fas fa-minus"></i></button>' +
                '<button class="bar-graph-add-btn" data-graph-action="add"><i class="fas fa-plus"></i></button>';
            wrapper.appendChild(controls);
        }
    }

    function renderColumns(wrapper, state, style) {
        const maxValue = Math.max(...state.bars.map(b => b.value), 1);
        const active = activeIndex(state);

        const graphContainer = document.createElement('div');
        graphContainer.className = 'bar-graph-container';

        if (style !== 'activity') {
            const gridLines = document.createElement('div');
            gridLines.className = 'bar-graph-grid-lines';
            for (let i = 0; i <= 5; i++) {
                const line = document.createElement('div');
                line.className = 'bar-graph-grid-line';
                const label = document.createElement('div');
                label.className = 'bar-graph-grid-line-label';
                label.textContent = Math.round(maxValue * (1 - i / 5));
                line.appendChild(label);
                gridLines.appendChild(line);
            }
            graphContainer.appendChild(gridLines);
        }

        const barsContainer = document.createElement('div');
        barsContainer.className = 'bar-graph-bars-container';
        state.bars.forEach((item, i) => {
            const heightPercent = (item.value / maxValue) * 100;

            const barWrapper = document.createElement('div');
            barWrapper.className = 'bar-graph-bar-wrapper';
            if (style === 'activity' && i === active) barWrapper.classList.add('active');
            barWrapper.dataset.index = i;

            const valueLabel = document.createElement('div');
            valueLabel.className = 'bar-graph-bar-value';
            valueLabel.textContent = style === 'activity' ? fmt(item.value) : item.value;
            valueLabel.style.bottom = `${heightPercent}%`;

            const bar = document.createElement('div');
            bar.className = 'bar-graph-bar';
            bar.style.height = `${heightPercent}%`;
            bar.style.background = state.color;

            const monthLabel = document.createElement('div');
            monthLabel.className = 'bar-graph-month-label';
            monthLabel.setAttribute('contenteditable', 'true');
            monthLabel.textContent = item.label;
            monthLabel.title = item.label; // full text when truncated

            barWrapper.append(valueLabel, bar, monthLabel);
            barsContainer.appendChild(barWrapper);
        });

        graphContainer.appendChild(barsContainer);
        wrapper.appendChild(graphContainer);
    }

    function renderRows(wrapper, state) {
        const maxValue = Math.max(...state.bars.map(b => b.value), 1);
        const graphContainer = document.createElement('div');
        graphContainer.className = 'bar-graph-container';

        state.bars.forEach((item, i) => {
            const row = document.createElement('div');
            row.className = 'bar-graph-bar-wrapper';
            row.dataset.index = i;

            const label = document.createElement('div');
            label.className = 'bar-graph-month-label';
            label.setAttribute('contenteditable', 'true');
            label.textContent = item.label;
            label.title = item.label;

            const track = document.createElement('div');
            track.className = 'bar-graph-track';
            const bar = document.createElement('div');
            bar.className = 'bar-graph-bar';
            bar.style.width = `${(item.value / maxValue) * 100}%`;
            bar.style.background = state.color;
            track.appendChild(bar);

            const value = document.createElement('div');
            value.className = 'bar-graph-bar-value';
            value.textContent = fmt(item.value);

            row.append(label, track, value);
            graphContainer.appendChild(row);
        });
        wrapper.appendChild(graphContainer);
    }

    // Grouped / stacked columns. `fixedMax` keeps the scale still during a drag.
    function renderMulti(wrapper, state, style, fixedMax) {
        ensureMulti(state);
        const stacked = style === 'stacked';
        const n = state.series.length;
        const maxValue = fixedMax || Math.max(...state.bars.map(b => {
            const vals = valuesOf(b).slice(0, n);
            return stacked ? vals.reduce((a, v) => a + v, 0) : Math.max(...vals);
        }), 1);

        const legend = document.createElement('div');
        legend.className = 'bar-graph-legend';
        state.series.forEach((ser, k) => {
            const item = document.createElement('div');
            item.className = 'bar-graph-legend-item';
            item.dataset.series = k;
            const dot = document.createElement('span');
            dot.className = 'bar-graph-legend-dot';
            dot.style.background = seriesColor(state, k);
            dot.title = 'Change color';
            const name = document.createElement('span');
            name.className = 'bar-graph-legend-name';
            name.setAttribute('contenteditable', 'true');
            name.textContent = ser.name;
            item.append(dot, name);
            legend.appendChild(item);
        });
        wrapper.appendChild(legend);

        const graphContainer = document.createElement('div');
        graphContainer.className = 'bar-graph-container';
        const gridLines = document.createElement('div');
        gridLines.className = 'bar-graph-grid-lines';
        for (let i = 0; i <= 5; i++) {
            const line = document.createElement('div');
            line.className = 'bar-graph-grid-line';
            const label = document.createElement('div');
            label.className = 'bar-graph-grid-line-label';
            label.textContent = Math.round(maxValue * (1 - i / 5));
            line.appendChild(label);
            gridLines.appendChild(line);
        }
        graphContainer.appendChild(gridLines);

        const barsContainer = document.createElement('div');
        barsContainer.className = 'bar-graph-bars-container';
        state.bars.forEach((item, i) => {
            const vals = valuesOf(item).slice(0, n);
            while (vals.length < n) vals.push(0);
            const col = document.createElement('div');
            col.className = 'bar-graph-bar-wrapper';
            col.dataset.index = i;

            const holder = document.createElement('div');
            holder.className = stacked ? 'bar-graph-stack' : 'bar-graph-group';
            const sum = vals.reduce((a, v) => a + v, 0);
            if (stacked) holder.style.height = `${(sum / maxValue) * 100}%`;
            vals.forEach((v, k) => {
                const bar = document.createElement('div');
                bar.className = 'bar-graph-bar';
                bar.dataset.series = k;
                bar.dataset.value = fmt(v);
                bar.style.background = seriesColor(state, k);
                bar.style.height = stacked ? `${sum ? (v / sum) * 100 : 0}%` : `${(v / maxValue) * 100}%`;
                holder.appendChild(bar);
            });
            col.appendChild(holder);

            if (stacked) {
                const total = document.createElement('div');
                total.className = 'bar-graph-bar-value';
                total.textContent = fmt(sum);
                total.style.bottom = `${(sum / maxValue) * 100}%`;
                col.appendChild(total);
            }

            const monthLabel = document.createElement('div');
            monthLabel.className = 'bar-graph-month-label';
            monthLabel.setAttribute('contenteditable', 'true');
            monthLabel.textContent = item.label;
            monthLabel.title = item.label;
            col.appendChild(monthLabel);
            barsContainer.appendChild(col);
        });
        graphContainer.appendChild(barsContainer);
        wrapper.appendChild(graphContainer);
    }

    // Drag one segment of a grouped / stacked column. Re-renders on each move with the
    // scale held still; state is saved on release.
    function startMultiDrag(wrapper, barWrapper, bar, e) {
        const index = Number(barWrapper.dataset.index);
        const k = Number(bar.dataset.series);
        const state = ensureMulti(readState(wrapper));
        const item = state.bars[index];
        if (!item) return;
        e.preventDefault();
        const style = styleOf(wrapper);
        const stacked = style === 'stacked';
        const n = state.series.length;
        const maxValue = Math.max(...state.bars.map(b => {
            const vals = valuesOf(b).slice(0, n);
            return stacked ? vals.reduce((a, v) => a + v, 0) : Math.max(...vals);
        }), 1);
        const step = maxValue >= 2000 ? 100 : maxValue >= 200 ? 10 : 1;
        const area = wrapper.querySelector('.bar-graph-bars-container');
        const rect = area.getBoundingClientRect();
        const below = stacked ? valuesOf(item).slice(0, k).reduce((a, v) => a + v, 0) : 0;
        const set = (v) => { if (k === 0) item.value = v; else item.more[k - 1] = v; };
        wrapper.classList.add('bar-graph-dragging');

        const onMove = (ev) => {
            const frac = Math.max(0, Math.min(1, (rect.bottom - ev.clientY) / rect.height));
            const v = Math.max(0, Math.round((frac * maxValue - below) / step) * step);
            if (v === valuesOf(item)[k]) return;
            set(v);
            wrapper.querySelectorAll(':scope > .bar-graph-container, :scope > .bar-graph-legend').forEach(el => el.remove());
            renderMulti(wrapper, state, style, maxValue);
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            wrapper.classList.remove('bar-graph-dragging');
            writeState(wrapper, state);
            render(wrapper);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    // Tilt the x labels 45° (.labels-angled) when any of them is wider than its bar's
    // column; straight again once they fit. Re-checked on render and on resize.
    function fitLabels(wrapper) {
        const style = styleOf(wrapper);
        const room = style === 'activity' ? 0 : 6; // how far into the gap a label may reach (gap 6px vs 10px)
        const angled = style !== 'horizontal' &&
            Array.from(wrapper.querySelectorAll('.bar-graph-bars-container .bar-graph-bar-wrapper')).some(col => {
                const label = col.querySelector('.bar-graph-month-label');
                return label && col.clientWidth > 0 && label.scrollWidth > col.clientWidth + room;
            });
        if (wrapper.classList.contains('labels-angled') !== angled) wrapper.classList.toggle('labels-angled', angled);
    }

    function render(wrapper) {
        const state = readState(wrapper);
        const style = styleOf(wrapper);

        // Rebuild our own parts only; leave editor-added chrome (swatches etc.) alone.
        wrapper.querySelectorAll(':scope > .bar-graph-container, :scope > .bar-graph-legend').forEach(el => el.remove());
        ensureControls(wrapper);

        if (style === 'horizontal') renderRows(wrapper, state);
        else if (isMulti(style)) renderMulti(wrapper, state, style);
        else renderColumns(wrapper, state, style);
        writeState(wrapper, state);
        fitLabels(wrapper);
    }

    function startDrag(wrapper, barWrapper, e) {
        const index = Number(barWrapper.dataset.index);
        const state = readState(wrapper);
        if (!state.bars[index]) return;

        e.preventDefault(); // avoid text selection while dragging
        const style = styleOf(wrapper);
        const horizontal = style === 'horizontal';
        const area = horizontal ? barWrapper.querySelector('.bar-graph-track') : wrapper.querySelector('.bar-graph-bars-container');
        const bar = barWrapper.querySelector('.bar-graph-bar');
        const valueLabel = barWrapper.querySelector('.bar-graph-bar-value');
        // Scale stays fixed during the drag; the axis re-scales on release.
        const maxValue = Math.max(...state.bars.map(b => b.value), 1);
        // Big numbers (steps, dollars) snap to tidy steps instead of single units
        const step = maxValue >= 2000 ? 100 : maxValue >= 200 ? 10 : 1;
        const startX = e.clientX, startY = e.clientY;
        let moved = false;
        bar.style.background = 'var(--interface-color)';

        const onMove = (ev) => {
            if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 3) return;
            moved = true;
            const rect = area.getBoundingClientRect();
            const frac = horizontal
                ? Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width))
                : Math.max(0, Math.min(1, (rect.bottom - ev.clientY) / rect.height));
            const newValue = Math.round((frac * maxValue) / step) * step;
            if (newValue === state.bars[index].value) return;
            state.bars[index].value = newValue;
            const pct = (newValue / maxValue) * 100;
            if (horizontal) {
                bar.style.width = `${pct}%`;
                valueLabel.textContent = fmt(newValue);
            } else {
                bar.style.height = `${pct}%`;
                valueLabel.textContent = style === 'activity' ? fmt(newValue) : newValue;
                valueLabel.style.bottom = `${pct}%`;
            }
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            // A click without a drag picks the highlighted bar of the activity look
            if (!moved && style === 'activity') state.active = index;
            writeState(wrapper, state);
            render(wrapper);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    function bind(wrapper) {
        if (wrapper._graphBound) return;
        wrapper._graphBound = true;

        wrapper.addEventListener('mousedown', (e) => {
            const bar = e.target.closest('.bar-graph-bar, .bar-graph-track');
            if (!bar || !wrapper.contains(bar)) return;
            if (isMulti(styleOf(wrapper))) startMultiDrag(wrapper, bar.closest('.bar-graph-bar-wrapper'), bar, e);
            else startDrag(wrapper, bar.closest('.bar-graph-bar-wrapper'), e);
        });

        wrapper.addEventListener('click', (e) => {
            // Legend dot: next color for that series
            const dot = e.target.closest('.bar-graph-legend-dot');
            if (dot && wrapper.contains(dot)) {
                const state = ensureMulti(readState(wrapper));
                const k = Number(dot.closest('.bar-graph-legend-item').dataset.series);
                const current = seriesColor(state, k);
                const next = SERIES_COLORS[(SERIES_COLORS.indexOf(current) + 1) % SERIES_COLORS.length];
                if (k === 0) state.color = next; else state.series[k].color = next;
                writeState(wrapper, state);
                render(wrapper);
                return;
            }
            const btn = e.target.closest('[data-graph-action]');
            if (!btn || !wrapper.contains(btn)) return;
            const state = readState(wrapper);
            const n = state.bars.length;
            if (btn.dataset.graphAction === 'add' && n < MAX_BARS) {
                const max = Math.max(...state.bars.map(b => b.value), 10);
                const step = max >= 2000 ? 100 : max >= 200 ? 10 : 1;
                const rnd = () => Math.round((max * (0.2 + Math.random() * 0.7)) / step) * step;
                const bar = { label: labelFor(styleOf(wrapper), n), value: rnd() };
                if (state.series) bar.more = state.series.slice(1).map(rnd);
                state.bars.push(bar);
            } else if (btn.dataset.graphAction === 'remove' && n > MIN_BARS) {
                state.bars.pop();
            } else {
                return;
            }
            writeState(wrapper, state);
            render(wrapper);
        });

        // Keep edited labels in state so the next render doesn't revert them.
        wrapper.addEventListener('input', (e) => {
            const name = e.target.closest?.('.bar-graph-legend-name');
            if (name) {
                const state = ensureMulti(readState(wrapper));
                const k = Number(name.closest('.bar-graph-legend-item').dataset.series);
                state.series[k].name = name.textContent.trim();
                writeState(wrapper, state);
                return;
            }
            const label = e.target.closest('.bar-graph-month-label');
            if (!label) return;
            const index = Number(label.closest('.bar-graph-bar-wrapper')?.dataset.index);
            const state = readState(wrapper);
            if (!state.bars[index]) return;
            state.bars[index].label = label.textContent.trim();
            label.title = state.bars[index].label;
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
        // Re-check as a label is typed
        wrapper.addEventListener('input', (e) => { if (e.target.closest?.('.bar-graph-month-label')) fitLabels(wrapper); });
    }

    return {
        // Owns its variants (setupVariants falls through here).
        variants() {
            return VARIANTS.slice();
        },

        // Build a fresh graph element (used by the editor factory on insert / the gallery).
        create(variant = 0) {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[variant] || VARIANTS[0];
            const wrapper = temp.firstElementChild;
            writeState(wrapper, defaultState(styleOf(wrapper)));
            this.setup(wrapper);
            return wrapper;
        },

        // Wire up a graph found at/under `root` (wrapper, .component-content, or container).
        // Safe to call more than once on the same element.
        setup(root) {
            const wrapper = findWrapper(root);
            if (!wrapper) return null;
            render(wrapper);
            bind(wrapper);
            return wrapper;
        },

        // New variant markup swapped in: carry the bars over, render, and re-add the swatch.
        afterVariantChange(content) {
            const wrapper = findWrapper(content);
            if (!wrapper) return;
            const prev = lastState.get(content);
            if (prev) {
                const own = (() => { try { return JSON.parse(wrapper.dataset.graph || 'null'); } catch (e) { return null; } })();
                writeState(wrapper, { ...own, bars: prev.bars, color: prev.color, active: own?.active ?? prev.active, series: prev.series ?? own?.series });
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
            // Multi-series: only series 1 takes the swatch color
            if (isMulti(styleOf(wrapper))) render(wrapper);
            else wrapper.querySelectorAll('.bar-graph-bar').forEach(bar => { bar.style.background = color; });
        }
    };
})();
