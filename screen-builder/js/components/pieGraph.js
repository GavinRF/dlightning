// Pie graph component (data-component-type="pieGraph").
//
// State lives in the DOM so it survives save/load, duplicate, and live sync:
//   .pie-graph-wrapper[data-graph] = JSON {segments: [{label, value, color}], center?: {value, label}}
//   .pie-graph-wrapper[data-graph-style="donut"] = the donut variant (ring + editable center text)
// setup() reads that state (or scrapes legacy markup), renders, and binds delegated
// listeners once per element. All pie graphs share one color-picker modal.
window.Components = window.Components || {};

window.Components.pieGraph = (() => {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const PIE_SIZE = 200;
    const MIN_SEGMENTS = 2;
    const MAX_SEGMENTS = 8;
    const DEFAULT_COLORS = [
        '#5D0BB5', '#027BD1', '#00CD67', '#F23A0C',
        '#CE1590', '#FF5722', '#E0CE28', '#84898B'
    ];

    const segmentName = (i) => `Segment ${String.fromCharCode(65 + i)}`;
    const INNER_RADIUS = 62; // donut hole

    const VARIANTS = [
        /*html*/ `<div class="pie-graph-wrapper"></div>`,
        /*html*/ `<div class="pie-graph-wrapper" data-graph-style="donut"></div>`
    ];
    const isDonut = (wrapper) => wrapper.dataset.graphStyle === 'donut';

    // Last state written per .component-content, so a variant switch keeps the slices.
    const lastState = new WeakMap();

    const defaultState = () => ({
        segments: [
            { label: 'Segment A', value: 35, color: DEFAULT_COLORS[0] },
            { label: 'Segment B', value: 15, color: DEFAULT_COLORS[1] },
            { label: 'Segment C', value: 15, color: DEFAULT_COLORS[2] },
            { label: 'Segment D', value: 35, color: DEFAULT_COLORS[3] }
        ]
    });

    const findWrapper = (root) => {
        if (!root) return null;
        if (root.classList?.contains('pie-graph-wrapper')) return root;
        return root.querySelector?.('.pie-graph-wrapper') || null;
    };

    // Legacy pies (saved before data-graph): colors from the legend, values from the
    // rendered percentage labels. Labels were set as a property, so they weren't saved.
    function scrapeState(wrapper) {
        const items = wrapper.querySelectorAll('.pie-graph-legend-item');
        if (!items.length) return null;
        const percents = Array.from(wrapper.querySelectorAll('svg text')).map(t => parseFloat(t.textContent));
        const segments = Array.from(items).map((item, i) => {
            const box = item.querySelector('.pie-graph-legend-color-box');
            const input = item.querySelector('.pie-graph-legend-label');
            return {
                label: input?.getAttribute('value') || segmentName(i),
                value: percents[i] > 0 ? percents[i] : 25,
                color: box?.style.backgroundColor || box?.style.background || DEFAULT_COLORS[i % DEFAULT_COLORS.length]
            };
        });
        return { segments };
    }

    function readState(wrapper) {
        try {
            const parsed = JSON.parse(wrapper.dataset.graph || 'null');
            if (parsed && Array.isArray(parsed.segments) && parsed.segments.length) return parsed;
        } catch (e) {
            console.warn('pieGraph: invalid data-graph, falling back to markup', e);
        }
        return scrapeState(wrapper) || defaultState();
    }

    function writeState(wrapper, state) {
        wrapper.dataset.graph = JSON.stringify(state);
        const host = wrapper.closest('.component-content');
        if (host) lastState.set(host, state);
    }

    const DEFAULT_CENTER = { value: '$2,450', label: 'Total spent' };

    const totalOf = (state) => state.segments.reduce((sum, s) => sum + s.value, 0) || 1;
    const HANDLE_RADIUS = 100;
    const MIN_SLICE_DEG = 7.2; // 2% — keeps every slice (and its handles) grabbable

    // (Re)draw slices, % labels, and resize handles into `svg`. Used by render() and,
    // during a handle drag, on its own so the legend isn't rebuilt on every mousemove.
    function drawPie(svg, state, donut = false) {
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        const total = totalOf(state);
        const r = INNER_RADIUS;
        const pt = (rad, radius) => `${radius * Math.cos(rad)} ${radius * Math.sin(rad)}`;
        const boundaries = [];

        let startAngle = 0;
        state.segments.forEach((item, i) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const endAngle = startAngle + angle;
            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;

            const segment = document.createElementNS(SVG_NS, 'path');
            segment.setAttribute('class', 'pie-graph-segment');
            segment.dataset.index = i;
            // A lone 100% slice can't be drawn as an arc (start == end), so use a circle path.
            const large = angle > 180 ? 1 : 0;
            let d;
            if (donut) {
                // Ring slice: outer arc out, inner arc back (a full ring is two circles, evenodd)
                d = percentage >= 0.9999
                    ? `M 0 -100 A 100 100 0 1 1 0 100 A 100 100 0 1 1 0 -100 Z M 0 -${r} A ${r} ${r} 0 1 0 0 ${r} A ${r} ${r} 0 1 0 0 -${r} Z`
                    : `M ${pt(startRad, 100)} A 100 100 0 ${large} 1 ${pt(endRad, 100)} ` +
                      `L ${pt(endRad, r)} A ${r} ${r} 0 ${large} 0 ${pt(startRad, r)} Z`;
                segment.setAttribute('fill-rule', 'evenodd');
            } else {
                d = percentage >= 0.9999
                    ? 'M 0 -100 A 100 100 0 1 1 0 100 A 100 100 0 1 1 0 -100 Z'
                    : `M 0 0 L ${pt(startRad, 100)} A 100 100 0 ${large} 1 ${pt(endRad, 100)} Z`;
            }
            segment.setAttribute('d', d);
            segment.setAttribute('fill', item.color);
            segment.style.cursor = 'pointer';
            segment.style.transition = 'filter 0.2s, opacity 0.2s';
            svg.appendChild(segment);

            const labelRad = (startAngle + angle / 2 - 90) * Math.PI / 180;
            const labelGroup = document.createElementNS(SVG_NS, 'g');
            const labelR = donut ? (100 + r) / 2 : 70;
            labelGroup.setAttribute('transform', `translate(${labelR * Math.cos(labelRad)} ${labelR * Math.sin(labelRad)})`);
            labelGroup.style.pointerEvents = 'none';
            const labelText = document.createElementNS(SVG_NS, 'text');
            labelText.textContent = `${Math.round(percentage * 100)}%`;
            labelText.setAttribute('text-anchor', 'middle');
            labelText.setAttribute('dominant-baseline', donut ? 'central' : 'auto');
            labelText.setAttribute('fill', donut ? '#fff' : 'var(--basic-txt-color)');
            if (donut) {
                labelText.setAttribute('font-size', '13');
                labelText.setAttribute('font-weight', '600');
                // Too thin to fit a label
                if (percentage < 0.06) labelText.textContent = '';
            }
            labelGroup.appendChild(labelText);
            svg.appendChild(labelGroup);

            startAngle = endAngle;
            boundaries.push(endAngle);
        });

        // One handle per boundary between slice i and i+1. The boundary at 12 o'clock
        // (end of the last slice) stays fixed so dragging never rotates the whole pie.
        boundaries.slice(0, -1).forEach((angle, i) => {
            const rad = (angle - 90) * Math.PI / 180;
            const handle = document.createElementNS(SVG_NS, 'circle');
            handle.setAttribute('class', 'pie-graph-handle');
            handle.dataset.boundary = i;
            handle.setAttribute('cx', HANDLE_RADIUS * Math.cos(rad));
            handle.setAttribute('cy', HANDLE_RADIUS * Math.sin(rad));
            handle.setAttribute('r', 6);
            svg.appendChild(handle);
        });
    }

    // Drag boundary i: moves value between slice i and i+1; their sum (and the total) stay fixed.
    function startHandleDrag(wrapper, handle, e) {
        e.preventDefault();
        e.stopPropagation(); // don't start a component drag/select
        const svg = handle.ownerSVGElement;
        const i = Number(handle.dataset.boundary);
        const state = readState(wrapper);
        const a = state.segments[i], b = state.segments[i + 1];
        if (!a || !b) return;

        const total = totalOf(state);
        const before = state.segments.slice(0, i).reduce((sum, s) => sum + s.value, 0);
        const lo = (before / total) * 360 + MIN_SLICE_DEG;                    // start of slice i
        const hi = ((before + a.value + b.value) / total) * 360 - MIN_SLICE_DEG; // end of slice i+1
        if (hi <= lo) return;
        const pairSum = a.value + b.value;
        let current = ((before + a.value) / total) * 360;
        const round1 = (v) => Math.round(v * 10) / 10;

        wrapper.classList.add('pie-graph-dragging');

        const onMove = (ev) => {
            const rect = svg.getBoundingClientRect();
            const dx = ev.clientX - (rect.left + rect.width / 2);
            const dy = ev.clientY - (rect.top + rect.height / 2);
            let angle = Math.atan2(dx, -dy) * 180 / Math.PI; // clockwise from 12 o'clock
            // Unwrap so crossing 12 o'clock doesn't jump: pick the turn nearest the last angle.
            angle = [angle - 360, angle, angle + 360].reduce((best, c) =>
                Math.abs(c - current) < Math.abs(best - current) ? c : best);
            angle = Math.max(lo, Math.min(hi, angle));
            current = angle;

            a.value = round1(((angle / 360) * total) - before);
            b.value = round1(pairSum - a.value);
            drawPie(svg, state, isDonut(wrapper));
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            wrapper.classList.remove('pie-graph-dragging');
            wrapper._pieDragEndedAt = Date.now();
            writeState(wrapper, state);
            render(wrapper);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }

    function render(wrapper) {
        const state = readState(wrapper);
        wrapper.querySelectorAll(':scope > .pie-graph-container').forEach(el => el.remove());

        // Controls persist across renders so their hover state (opacity) survives a
        // click on +/-; rebuilding them would hide them while the mouse is still inside.
        let controls = wrapper.querySelector(':scope > .pie-graph-controls');
        // Graphs saved before this module have controls without data-graph-action; replace them.
        if (controls && !controls.querySelector('[data-graph-action]')) {
            controls.remove();
            controls = null;
        }
        if (!controls) {
            controls = document.createElement('div');
            controls.className = 'pie-graph-controls';
            controls.innerHTML =
                '<button class="pie-graph-add-btn" data-graph-action="remove"><i class="fas fa-minus"></i></button>' +
                '<button class="pie-graph-add-btn" data-graph-action="add"><i class="fas fa-plus"></i></button>';
            wrapper.appendChild(controls);
        }

        const graphContainer = document.createElement('div');
        graphContainer.className = 'pie-graph-container';

        const svgContainer = document.createElement('div');
        svgContainer.style.cssText = `flex: 0 0 ${PIE_SIZE}px; height: ${PIE_SIZE}px; position: relative;`;

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('width', PIE_SIZE);
        svg.setAttribute('height', PIE_SIZE);
        svg.setAttribute('viewBox', '-100 -100 200 200');
        svg.style.overflow = 'visible'; // handles sit on the rim

        const donut = isDonut(wrapper);
        drawPie(svg, state, donut);
        svgContainer.appendChild(svg);

        if (donut) {
            const center = { ...DEFAULT_CENTER, ...state.center };
            state.center = center;
            const hole = document.createElement('div');
            hole.className = 'pie-graph-center';
            const value = document.createElement('div');
            value.className = 'pie-graph-center-value';
            value.setAttribute('contenteditable', 'true'); value.classList.add('usa');
            value.dataset.centerField = 'value';
            value.textContent = center.value;
            const label = document.createElement('div');
            label.className = 'pie-graph-center-label';
            label.setAttribute('contenteditable', 'true'); label.classList.add('usa');
            label.dataset.centerField = 'label';
            label.textContent = center.label;
            hole.append(value, label);
            svgContainer.appendChild(hole);
        }

        const legend = document.createElement('div');
        legend.className = 'pie-graph-legend';
        state.segments.forEach((item, i) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'pie-graph-legend-item';
            legendItem.dataset.index = i;

            const colorBox = document.createElement('div');
            colorBox.className = 'pie-graph-legend-color-box';
            colorBox.style.background = item.color;

            const labelInput = document.createElement('input');
            labelInput.className = 'pie-graph-legend-label';
            // Attribute, not property: the property isn't serialized into saved HTML.
            labelInput.setAttribute('value', item.label);

            legendItem.append(colorBox, labelInput);
            legend.appendChild(legendItem);
        });

        graphContainer.append(svgContainer, legend);
        wrapper.appendChild(graphContainer);
        writeState(wrapper, state);
    }

    // --- Shared color picker modal ------------------------------------------------
    const picker = { modal: null, pickerEl: null, listEl: null, iro: null, wrapper: null };

    function ensureModal() {
        if (picker.modal && document.body.contains(picker.modal)) return;
        const modal = document.createElement('div');
        modal.className = 'color-picker-modal-overlay';
        modal.innerHTML =
            '<div class="color-picker-modal-content">' +
                '<button class="close-color-modal">×</button>' +
                '<div id="segment-color-picker"></div>' +
                '<div class="modal-color-list-con"></div>' +
            '</div>';
        modal.querySelector('.close-color-modal').addEventListener('click', closeColorPicker);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeColorPicker(); });
        document.body.appendChild(modal);
        picker.modal = modal;
        picker.pickerEl = modal.querySelector('#segment-color-picker');
        picker.listEl = modal.querySelector('.modal-color-list-con');
    }

    function closeColorPicker() {
        if (picker.modal) picker.modal.style.display = 'none';
        picker.wrapper = null;
    }

    function renderColorList() {
        const wrapper = picker.wrapper;
        if (!wrapper || !picker.iro) return;
        const state = readState(wrapper);
        picker.listEl.innerHTML = '';
        picker.iro.colors.forEach((color, index) => {
            if (!state.segments[index]) return;
            const row = document.createElement('div');
            row.style.cssText = 'display: flex; align-items: center; gap: 10px; cursor: pointer;';
            const swatch = document.createElement('div');
            swatch.style.cssText = `width: 20px; height: 20px; border-radius: 4px; background: ${color.hexString};`;
            const name = document.createElement('span');
            name.style.color = 'var(--basic-txt-color)';
            name.textContent = state.segments[index].label;
            const hex = document.createElement('span');
            hex.style.cssText = 'color: gray; font-size: smaller; margin-left: auto;';
            hex.textContent = color.hexString;
            row.append(swatch, name, hex);
            row.addEventListener('click', () => picker.iro.setActiveColor(index));
            picker.listEl.appendChild(row);
        });
    }

    function openColorPicker(wrapper, index) {
        if (typeof iro === 'undefined') return;
        ensureModal();
        picker.wrapper = wrapper;
        const state = readState(wrapper);

        // Rebuild the picker for this graph's colors (simplest way to sync the handle count).
        picker.pickerEl.innerHTML = '';
        picker.iro = new iro.ColorPicker(picker.pickerEl, {
            width: 190,
            colors: state.segments.map(s => s.color),
            handleRadius: 7,
            borderWidth: 1,
            activeHandleRadius: 11,
            borderColor: '#fff',
            wheelAngle: 90,
            sliderSize: 22
        });
        picker.iro.setActiveColor(Math.min(index, state.segments.length - 1));
        picker.iro.on('color:change', (color) => {
            const target = picker.wrapper;
            // The graph may have been deleted or replaced by a live-sync update.
            if (!target || !document.body.contains(target)) { closeColorPicker(); return; }
            const s = readState(target);
            if (!s.segments[color.index]) return;
            s.segments[color.index].color = color.hexString;
            writeState(target, s);
            render(target);
            renderColorList();
        });

        renderColorList();
        picker.modal.style.display = 'flex';
    }

    // --- Listeners ----------------------------------------------------------------
    function bind(wrapper) {
        if (wrapper._pieGraphBound) return;
        wrapper._pieGraphBound = true;

        wrapper.addEventListener('mousedown', (e) => {
            const handle = e.target.closest('.pie-graph-handle');
            if (handle && wrapper.contains(handle)) startHandleDrag(wrapper, handle, e);
        });

        wrapper.addEventListener('click', (e) => {
            // The click that ends a handle drag shouldn't open the value prompt.
            if (wrapper._pieDragEndedAt && Date.now() - wrapper._pieDragEndedAt < 300) return;
            const btn = e.target.closest('[data-graph-action]');
            if (btn && wrapper.contains(btn)) {
                const state = readState(wrapper);
                const n = state.segments.length;
                if (btn.dataset.graphAction === 'add' && n < MAX_SEGMENTS) {
                    state.segments.push({
                        label: segmentName(n),
                        value: Math.floor(Math.random() * 30) + 10,
                        color: DEFAULT_COLORS[n % DEFAULT_COLORS.length]
                    });
                } else if (btn.dataset.graphAction === 'remove' && n > MIN_SEGMENTS) {
                    state.segments.pop();
                } else {
                    return;
                }
                writeState(wrapper, state);
                render(wrapper);
                return;
            }

            const segment = e.target.closest('.pie-graph-segment');
            if (segment) {
                const state = readState(wrapper);
                const item = state.segments[Number(segment.dataset.index)];
                if (!item) return;
                const newValue = prompt(`Enter new value for ${item.label}:`, item.value);
                if (newValue !== null && newValue.trim() !== '' && !isNaN(newValue) && Number(newValue) >= 0) {
                    item.value = Number(newValue);
                    writeState(wrapper, state);
                    render(wrapper);
                }
                return;
            }

            const box = e.target.closest('.pie-graph-legend-color-box');
            if (box) openColorPicker(wrapper, Number(box.closest('.pie-graph-legend-item').dataset.index));
        });

        // Donut center text: keep edits in state so the next render doesn't revert them
        wrapper.addEventListener('input', (e) => {
            const field = e.target.closest?.('[data-center-field]');
            if (!field) return;
            const state = readState(wrapper);
            state.center = { ...DEFAULT_CENTER, ...state.center, [field.dataset.centerField]: field.textContent.trim() };
            writeState(wrapper, state);
        });

        wrapper.addEventListener('change', (e) => {
            const input = e.target.closest('.pie-graph-legend-label');
            if (!input) return;
            const state = readState(wrapper);
            const item = state.segments[Number(input.closest('.pie-graph-legend-item').dataset.index)];
            if (!item) return;
            item.label = input.value;
            writeState(wrapper, state);
            render(wrapper);
        });

        // Slice hover highlight: CSS (.pie-graph-segment:hover, componentVariants.css)

        const setControlsOpacity = (v) => {
            const controls = wrapper.querySelector(':scope > .pie-graph-controls');
            if (controls) controls.style.opacity = v;
        };
        wrapper.addEventListener('mouseenter', () => setControlsOpacity('1'));
        wrapper.addEventListener('mouseleave', () => setControlsOpacity('0'));
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

        // New variant markup swapped in: carry the slices over and render.
        afterVariantChange(content) {
            const wrapper = findWrapper(content);
            if (!wrapper) return;
            const prev = lastState.get(content);
            if (prev) {
                let own = null;
                try { own = JSON.parse(wrapper.dataset.graph || 'null'); } catch (e) { /* fresh variant */ }
                writeState(wrapper, { ...own, segments: prev.segments, center: own?.center ?? prev.center });
            }
            this.setup(wrapper);
        },

        // Wire up a pie found at/under `root`. Safe to call more than once.
        setup(root) {
            const wrapper = findWrapper(root);
            if (!wrapper) return null;
            render(wrapper);
            bind(wrapper);
            return wrapper;
        }
    };
})();
