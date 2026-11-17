// Component registry module — see docs/component-module-migration.md
// map: mock map view (street-map artwork + pins / place chips / route / controls).
// Owns its variants (setupVariants falls through to window.Components.map.variants()).
//
// Markup:
//   .map-component                        root of every variant
//     .map-view.resizeable                the map window (height is resizable)
//       .map-layer                        everything that pans/zooms in the prototype
//         svg.map-art                     terrain artwork (preserveAspectRatio slice)
//         svg.map-route                   optional route overlay, 0–100 % space (stretch)
//         .map-marker[style=left/top %]   pins (.map-pin), place chips (.map-chip), user dot
//       .map-controls / .map-locate       zoom & locate buttons ([data-map-action])
//
// Markers are positioned with left/top percentages of the map view, so they stay put
// when the map is resized. In the editor they can be dragged to a new spot (delegated
// document listener, installed once — survives duplicate, save/load and live sync with
// no per-instance binding). `data-map-fixed` markers (route ends) don't drag, so the
// route line can't come apart from them.
//
// Place previews: a place marker (chip or pin) carries the card shown when it's tapped
// in Play, as data-place-name / -meta / -desc / -action (data-place-off = no card).
// Hovering the map in the editor shows an "Edit locations" button that opens a floating
// card editor (outside the screen, so opening it is never an undo step or a sync);
// only the marker's data attributes are written. A marker with data-map-min-zoom
// (set from the same panel) only shows in Play once zoomed in that far. Route variant: "Go" runs turn-by-turn
// navigation along the route in Play.
//
// Terrain colors are SVG presentation attributes, not CSS, so html2canvas exports match.
// Theme color comes in through var(--color-primary) on pins, chips and the route.
window.Components = window.Components || {};

window.Components.map = (() => {
    // --- artwork --------------------------------------------------------------------
    const PALETTES = {
        light: { land: '#eef0ea', minor: '#ffffff', park: '#cde8c3', water: '#aed3ef', major: '#ffffff', highway: '#f8d37a', label: '#8a9199' },
        dark:  { land: '#1d232b', minor: '#2a323c', park: '#1f3a2c', water: '#12304a', major: '#3a4450', highway: '#6b5a32', label: '#6d7681' }
    };

    // Deterministic street map in a 400×300 box. `slice` crops instead of stretching,
    // so it looks right at any height the user resizes the map to.
    const terrain = (theme = 'light') => {
        const p = PALETTES[theme] || PALETTES.light;
        const minor = 'M30 -10V310M95 -10V310M165 -10V310M285 -10V310M355 -10V310'
                    + 'M-10 25H410M-10 80H410M-10 190H410M-10 235H410';
        return /*html*/`<svg class="map-art" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`
            + `<rect width="400" height="300" fill="${p.land}"/>`
            + `<path d="${minor}" stroke="${p.minor}" stroke-width="4" fill="none"/>`
            + `<rect x="40" y="36" width="112" height="72" rx="8" fill="${p.park}"/>`
            + `<path d="M262 196H372V258H282Z" fill="${p.park}"/>`
            + `<path d="M-20 252C60 222 120 292 200 268S330 230 420 260L420 320L-20 320Z" fill="${p.water}"/>`
            + `<path d="M-10 146L410 118M212 -10L224 310M120 310C140 220 260 200 300 120S330 30 340 -10" stroke="${p.major}" stroke-width="9" fill="none" stroke-linecap="round"/>`
            + `<path d="M-10 62C120 84 250 22 410 48" stroke="${p.highway}" stroke-width="11" fill="none" stroke-linecap="round"/>`
            + `</svg>`;
    };

    // --- markers & controls ---------------------------------------------------------
    const at = (left, top) => `left: ${left}%; top: ${top}%;`;

    // --- place previews (data) ------------------------------------------------------
    // Missing attributes fall back (name → the chip's label, button → "Directions");
    // an empty attribute means the user cleared that line, so it's hidden.
    const PLACE_FIELDS = ['name', 'meta', 'desc', 'action'];
    const escAttr = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const escText = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const placeAttrs = (place) => place
        ? PLACE_FIELDS.filter(f => place[f] != null).map(f => ` data-place-${f}="${escAttr(place[f])}"`).join('')
        : '';

    const isPlaceMarker = (m) => !!m?.matches?.('.map-chip, .map-pin')
        && !m.hasAttribute('data-map-fixed') && !m.closest('.map-location-card');

    const placeOf = (m) => ({
        name: m.dataset.placeName ?? (m.querySelector('.map-chip-text')?.textContent.trim() || 'Dropped pin'),
        meta: m.dataset.placeMeta ?? '',
        desc: m.dataset.placeDesc ?? '',
        action: m.dataset.placeAction ?? 'Directions'
    });

    // The card — shared by the Play sheet and the editor (editable = the editor's copy)
    const cardHTML = (place, editable = false) => {
        const field = (name, cls, hint) => `<div class="${cls}" data-field="${name}"`
            + (editable ? ` contenteditable="true" spellcheck="false" data-hint="${hint}"` : '')
            + `>${escText(place[name])}</div>`;
        return `<div class="map-sheet-card">`
            + (editable ? '' : '<div class="map-sheet-close"><i class="fas fa-xmark"></i></div>')
            + field('name', 'map-sheet-name', 'Place name')
            + field('meta', 'map-sheet-meta', 'Rating · distance · hours')
            + field('desc', 'map-sheet-desc', 'Address or description')
            + `<div class="map-sheet-btn" style="background-color: var(--color-primary);">${field('action', 'map-sheet-btn-text', 'Button')}</div>`
            + `</div>`;
    };

    const CAFE = { name: 'Central Park Cafe', meta: '★ 4.5 (238) · 0.3 mi · Open now', desc: '123 Main St, New York, NY' };

    const pin = (left, top, { icon = 'fa-location-dot', fixed = false, cls = '', place = null } = {}) =>
        `<div class="map-marker map-pin icon-container${cls ? ' ' + cls : ''}"${fixed ? ' data-map-fixed' : ''}${placeAttrs(place)} style="${at(left, top)}">`
        + `<i class="fas ${icon}" style="color: var(--color-primary);"></i></div>`;

    const chip = (left, top, icon, text, { active = false, place = null, minZoom = null } = {}) =>
        `<div class="map-marker map-chip${active ? ' active' : ''}"${placeAttrs(place)}${minZoom ? ` data-map-min-zoom="${minZoom}"` : ''} style="${at(left, top)}">`
        + `<span class="icon-container"><i class="fas ${icon}"></i></span><span class="map-chip-text usa" contenteditable="true">${text}</span></div>`;

    const userDot = (left, top, fixed = false) =>
        `<div class="map-marker map-user non-editable"${fixed ? ' data-map-fixed' : ''} style="${at(left, top)}"></div>`;

    const zoomControls = /*html*/`<div class="map-controls non-editable">`
        + `<div class="map-ctrl" data-map-action="zoom-in" title="Zoom in"><i class="fas fa-plus"></i></div>`
        + `<div class="map-ctrl" data-map-action="zoom-out" title="Zoom out"><i class="fas fa-minus"></i></div>`
        + `</div>`;

    const locate = `<div class="map-ctrl map-locate non-editable" data-map-action="locate" title="Recenter"><i class="fas fa-location-crosshairs"></i></div>`;

    const view = (inner, { height = 220, theme = 'light', extra = '' } = {}) =>
        `<div class="map-view resizeable"${theme !== 'light' ? ` data-map-theme="${theme}"` : ''} style="height: ${height}px;">`
        + `<div class="map-layer">${terrain(theme)}${inner}</div>${extra}</div>`;

    const VARIANTS = [
        // 1 — Classic: one pin, zoom + recenter
        `<div class="map-component">${view(pin(50, 50, { place: CAFE }), { extra: zoomControls + locate })}</div>`,

        // 2 — Nearby places: you-are-here dot + labeled place chips
        `<div class="map-component">${view(
            userDot(48, 58)
            + chip(26, 34, 'fa-mug-hot', 'Cafe', { active: true, place: CAFE })
            + chip(72, 30, 'fa-landmark', 'Museum', { place: { name: 'City Museum', meta: '★ 4.8 (512) · 0.7 mi · Closes 6 PM', desc: 'Art, history and science under one roof' } })
            + chip(70, 80, 'fa-bed', 'Hotel', { place: { name: 'Riverside Hotel', meta: '★ 4.2 (189) · 1.2 mi · From $149', desc: 'Riverfront rooms with free breakfast', action: 'Book' } })
            // Revealed by zooming in (Play)
            + chip(64, 54, 'fa-bread-slice', 'Bakery', { minZoom: '1.5', place: { name: 'Corner Bakery', meta: '★ 4.7 (96) · 0.2 mi · Open now', desc: 'Fresh bread and pastries from 7 AM' } })
            + chip(28, 76, 'fa-prescription-bottle-medical', 'Pharmacy', { minZoom: '1.5', place: { name: 'Main St Pharmacy', meta: '0.4 mi · Open till 9 PM', desc: '210 Main St, New York, NY', action: 'Call' } })
            + chip(45, 41, 'fa-money-bill', 'ATM', { minZoom: '2.25', place: { name: 'ATM', meta: '0.1 mi · Open 24 hours', desc: 'Inside the lobby at 150 Main St' } }),
            { height: 240, extra: zoomControls + locate })}</div>`,

        // 3 — Route: start → destination with an ETA card
        `<div class="map-component">${view(
            `<svg class="map-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">`
            + `<path d="M22 60 L22 44 L53 39 L56 24 L78 21" fill="none" stroke="var(--color-primary)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>`
            + userDot(22, 60, true)
            + pin(78, 21, { icon: 'fa-flag-checkered', fixed: true, cls: 'map-pin-flag' }),
            { height: 260, extra: `<div class="map-eta-card">`
                + `<div class="map-eta-text"><div class="map-eta-time usa" contenteditable="true">12 min</div>`
                + `<div class="map-eta-sub usa" contenteditable="true">3.4 mi &middot; Fastest route</div></div>`
                + `<div class="map-eta-go" style="background-color: var(--color-primary);"><span class="usa" contenteditable="true">Go</span></div></div>` })}</div>`,

        // 4 — Location card: compact map + address row
        `<div class="map-component map-location-card">${view(pin(50, 52), { height: 150 })}`
            + `<div class="map-location-info">`
            + `<div class="icon-container map-location-icon" style="background-color: var(--color-primary);"><i class="fas fa-store"></i></div>`
            + `<div class="map-location-text"><div class="map-location-name usa" contenteditable="true">Central Park Cafe</div>`
            + `<div class="map-location-address usa" contenteditable="true">123 Main St, New York, NY</div></div>`
            + `<div class="map-location-action icon-container"><i class="fas fa-diamond-turn-right"></i></div>`
            + `</div></div>`,

        // 5 — Dark: night-mode artwork
        `<div class="map-component">${view(pin(50, 50, { cls: 'map-pin-glow', place: { name: 'Rooftop Bar', meta: '★ 4.6 (301) · 0.5 mi · Open till 2 AM', desc: '88 Harbor Ave' } }), { theme: 'dark', extra: zoomControls + locate })}</div>`
    ];

    // --- editor: drag markers to reposition -----------------------------------------
    const DRAG_THRESHOLD = 4; // px — below this a press is a click (chip text stays editable)

    const changed = (el, why = 'Map marker moved') => {
        const id = el.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        const pm = window.projectManager;
        if (!id || !pm) return;
        if (typeof pm.addCanvasToChanged === 'function') pm.addCanvasToChanged(id, why);
        pm.contentChanged = true;
    };

    // --- editor: place preview editor -------------------------------------------------
    // Hovering a map on a real screen shows an "Edit locations" button in its top-left
    // corner (the markers' own icons keep the normal icon picker). It opens a floating
    // panel: pick a place from the map's places, edit its preview card, when it appears.
    // Button, panel and the ring marking the selected place all live in <body>, outside
    // every screen, so showing them never touches saved markup; edits write only the
    // marker's data-place-* / data-map-min-zoom attributes (one undo step per pause).
    let hoverBtn = null, hoverFor = null, hoverTimer = 0, panel = null, ring = null;
    // [data-map-min-zoom value, label, tooltip] — values match the +/- zoom steps
    const ZOOM_LEVELS = [
        ['', 'Always', 'Always on the map'],
        ['1.5', 'Zoomed in', 'Appears after zooming in one step'],
        ['2.25', 'Closer', 'Appears after zooming in two steps']
    ];

    const placeMarkers = (mapView) => [...mapView.querySelectorAll('.map-marker')].filter(isPlaceMarker);
    const editableMap = (el) => {
        const v = el?.closest?.('.map-view');
        return v && v.closest('.canvas-content, .canvas') && !v.closest('.proto-frame') && placeMarkers(v).length ? v : null;
    };

    const hideHover = () => {
        clearTimeout(hoverTimer);
        hoverBtn?.remove();
        hoverBtn = null;
        hoverFor = null;
    };
    const hideHoverSoon = () => {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(hideHover, 250);
    };

    function showHover(mapView) {
        clearTimeout(hoverTimer);
        if (hoverFor === mapView && hoverBtn) return;
        hideHover();
        hoverFor = mapView;
        hoverBtn = document.createElement('button');
        hoverBtn.type = 'button';
        hoverBtn.className = 'map-edit-places-btn';
        hoverBtn.innerHTML = '<i class="fas fa-location-dot"></i> Edit locations';
        const vr = mapView.getBoundingClientRect();
        hoverBtn.style.left = `${vr.left + 10}px`;
        hoverBtn.style.top = `${vr.top + 10}px`;
        hoverBtn.addEventListener('pointerenter', () => clearTimeout(hoverTimer));
        hoverBtn.addEventListener('pointerleave', (e) => { if (!mapView.contains(e.relatedTarget)) hideHoverSoon(); });
        hoverBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideHover();
            openPanel(mapView);
        });
        document.body.appendChild(hoverBtn);
    }

    const closePanel = () => {
        panel?.remove();
        panel = null;
        ring?.remove();
        ring = null;
    };

    function placeRing(marker) {
        if (!ring) {
            ring = document.createElement('div');
            ring.className = 'map-place-ring';
            document.body.appendChild(ring);
        }
        const r = marker.getBoundingClientRect(), pad = 4;
        Object.assign(ring.style, {
            left: `${r.left - pad}px`, top: `${r.top - pad}px`,
            width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px`
        });
    }

    const placeLabel = (m) => m.querySelector('.map-chip-text')?.textContent.trim() || placeOf(m).name || 'Pin';

    function openPanel(mapView, marker) {
        closePanel();
        const markers = placeMarkers(mapView);
        if (!markers.length) return;
        panel = document.createElement('div');
        panel.className = 'map-place-editor';
        panel._map = mapView;
        document.body.appendChild(panel);

        const current = () => panel?._marker;
        const render = (m) => {
            panel._marker = m;
            const list = placeMarkers(mapView);
            panel.innerHTML = `<div class="mpe-head"><span>Locations</span>`
                + `<button type="button" class="mpe-close" title="Close"><i class="fas fa-xmark"></i></button></div>`
                + `<div class="mpe-places">` + list.map((n, i) => `<button type="button" data-place-index="${i}"`
                    + `${n === m ? ' class="active"' : ''}>${escText(placeLabel(n))}</button>`).join('') + `</div>`
                + `<div class="mpe-label">Preview when tapped in Play</div>`
                + cardHTML(placeOf(m), true)
                + `<div class="mpe-row"><span>Appears on the map</span><div class="mpe-seg">`
                + ZOOM_LEVELS.map(([v, label, title]) => `<button type="button" data-zoom="${v}" title="${title}"`
                    + `${(m.dataset.mapMinZoom || '') === v ? ' class="active"' : ''}>${label}</button>`).join('')
                + `</div></div>`
                + `<label class="mpe-toggle"><input type="checkbox"${m.hasAttribute('data-place-off') ? '' : ' checked'}> Show preview when tapped</label>`
                + `<div class="mpe-hint">Clear a line to hide it. Change a marker's icon by clicking it on the map.</div>`;
            panel.querySelectorAll('[data-field]').forEach(f => f.classList.toggle('mpe-empty', !f.textContent.trim()));
            placeRing(m);
        };
        render(marker && markers.includes(marker) ? marker : markers[0]);

        // Beside the map if there's room, else on the other side, else below it
        const W = panel.offsetWidth, H = panel.offsetHeight, GAP = 12;
        const vr = mapView.getBoundingClientRect();
        let left = vr.right + GAP, top = vr.top;
        if (left + W > innerWidth - 8) left = vr.left - GAP - W;
        if (left < 8) { left = Math.max(8, Math.min(innerWidth - W - 8, vr.left)); top = vr.bottom + GAP; }
        panel.style.left = `${left}px`;
        panel.style.top = `${Math.max(8, Math.min(innerHeight - H - 8, top))}px`;

        panel.addEventListener('click', (e) => {
            if (e.target.closest('.mpe-close')) return closePanel();
            const pick = e.target.closest('[data-place-index]');
            if (pick) {
                const m = placeMarkers(mapView)[+pick.dataset.placeIndex];
                if (m) render(m);
                return;
            }
            const z = e.target.closest('[data-zoom]');
            const m = current();
            if (z && m?.isConnected) {
                if (z.dataset.zoom) m.setAttribute('data-map-min-zoom', z.dataset.zoom);
                else m.removeAttribute('data-map-min-zoom');
                panel.querySelectorAll('.mpe-seg [data-zoom]').forEach(n => n.classList.toggle('active', n === z));
                placeRing(m);
                changed(m, 'Map marker zoom level');
            }
        });
        panel.addEventListener('input', (e) => {
            const m = current();
            if (!m?.isConnected) return closePanel();
            const f = e.target.closest('[data-field]');
            if (!f) return;
            m.setAttribute(`data-place-${f.dataset.field}`, f.textContent.trim());
            f.classList.toggle('mpe-empty', !f.textContent.trim());
            changed(m, 'Map place preview edited');
        });
        panel.addEventListener('change', (e) => {
            const m = current();
            if (!e.target.matches('.mpe-toggle input') || !m?.isConnected) return;
            m.toggleAttribute('data-place-off', !e.target.checked);
            changed(m, 'Map place preview toggled');
        });
        panel.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.closest('[data-field]')) { e.preventDefault(); e.target.blur(); }
            if (e.key === 'Escape') closePanel();
        });
        panel.addEventListener('paste', (e) => {
            if (!e.target.closest('[data-field]')) return;
            e.preventDefault();
            document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text/plain').replace(/\s+/g, ' '));
        });
    }

    if (!window.__mapPlaceEditorInstalled) {
        window.__mapPlaceEditorInstalled = true;
        document.addEventListener('pointerdown', (e) => {
            if (panel && !panel.contains(e.target) && !hoverBtn?.contains(e.target)) closePanel();
        }, true);
        document.addEventListener('pointerover', (e) => {
            if (e.pointerType && e.pointerType !== 'mouse') return;
            if (hoverBtn?.contains(e.target)) return;
            const v = editableMap(e.target);
            if (v) showHover(v);
        });
        document.addEventListener('pointerout', (e) => {
            if (!hoverFor) return;
            const to = e.relatedTarget;
            if (to && (hoverFor.contains(to) || hoverBtn?.contains(to))) return;
            if (hoverFor.contains(e.target)) hideHoverSoon();
        });
        // The button and ring are positioned once; anything that moves the map hides them
        const onMove = () => { hideHover(); if (ring && panel?._marker) placeRing(panel._marker); };
        document.addEventListener('scroll', onMove, true);
        document.addEventListener('wheel', hideHover, { capture: true, passive: true });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { hideHover(); closePanel(); } });
    }

    if (!window.__mapMarkerDragInstalled) {
        window.__mapMarkerDragInstalled = true;
        document.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            const marker = e.target.closest?.('.map-marker');
            if (!marker || marker.hasAttribute('data-map-fixed')) return;
            const mapView = marker.closest('.map-view');
            // Only on real screens — not template/sidebar previews or the prototype player
            if (!mapView || !marker.closest('.canvas-content, .canvas') || marker.closest('.proto-frame')) return;
            if (e.target.closest('.color-swatch-container, .iconControls')) return;

            const startX = e.clientX, startY = e.clientY;
            let dragging = false;

            const move = (ev) => {
                if (!dragging) {
                    if (Math.hypot(ev.clientX - startX, ev.clientY - startY) < DRAG_THRESHOLD) return;
                    dragging = true;
                    marker.classList.add('map-dragging');
                    window.getSelection?.()?.removeAllRanges();
                    marker.querySelectorAll('[contenteditable="true"]').forEach(n => n.blur());
                }
                ev.preventDefault();
                const r = mapView.getBoundingClientRect();
                if (!r.width || !r.height) return;
                const left = Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100));
                const top = Math.max(0, Math.min(100, ((ev.clientY - r.top) / r.height) * 100));
                marker.style.left = `${left.toFixed(1)}%`;
                marker.style.top = `${top.toFixed(1)}%`;
            };
            const end = () => {
                document.removeEventListener('pointermove', move);
                document.removeEventListener('pointerup', end);
                document.removeEventListener('pointercancel', end);
                if (!dragging) return;
                marker.classList.remove('map-dragging');
                if (panel?._marker === marker) placeRing(marker);
                // Swallow the click that follows a drag so it doesn't open the icon picker
                const swallow = (ce) => { ce.stopPropagation(); ce.preventDefault(); };
                document.addEventListener('click', swallow, { capture: true, once: true });
                setTimeout(() => document.removeEventListener('click', swallow, { capture: true }), 0);
                changed(marker);
            };
            document.addEventListener('pointermove', move);
            document.addEventListener('pointerup', end);
            document.addEventListener('pointercancel', end);
        });
    }

    // --- prototype: pan / zoom / pick a place ---------------------------------------
    const MIN_Z = 1, MAX_Z = 3.375, STEP = 1.5;

    function playView(mapView) {
        if (mapView._mapPlayBound) return;
        mapView._mapPlayBound = true;
        const layer = mapView.querySelector('.map-layer');
        if (!layer) return;

        let z = 1, x = 0, y = 0;
        // While a preview card is open, the map may slide up by the card's height: the
        // edge that exposes is behind the card, and it keeps the tapped place in view.
        let sheetRoom = 0;
        const clamp = () => {
            const mx = ((z - 1) * mapView.clientWidth) / 2;
            const my = ((z - 1) * mapView.clientHeight) / 2;
            x = Math.max(-mx, Math.min(mx, x));
            y = Math.max(-my - sheetRoom, Math.min(my, y));
        };
        const gated = [...mapView.querySelectorAll('.map-marker[data-map-min-zoom]')];
        const apply = (animate = true) => {
            layer.classList.toggle('map-animate', animate);
            layer.style.transform = `translate(${x}px, ${y}px) scale(${z})`;
            mapView.style.setProperty('--map-z', z);
            // Markers set to appear only once zoomed in
            gated.forEach(m => {
                const hidden = z < (parseFloat(m.dataset.mapMinZoom) || 1) - 0.001;
                m.classList.toggle('map-zoom-hidden', hidden);
                if (hidden && m === selected) closePlace();
            });
        };
        // Screen px → the map's own px (the player may show the screen scaled)
        const scaleOf = () => (mapView.getBoundingClientRect().width / mapView.offsetWidth) || 1;
        // Focal point relative to the view's center, in the map's own px
        const focalAt = (clientX, clientY) => {
            const r = mapView.getBoundingClientRect(), sc = scaleOf();
            return { x: (clientX - r.left - r.width / 2) / sc, y: (clientY - r.top - r.height / 2) / sc };
        };
        // Zoom keeping the map point under `f` (default: the center) where it is
        const zoomAt = (next, f = { x: 0, y: 0 }, animate = true) => {
            const prev = z;
            z = Math.max(MIN_Z, Math.min(MAX_Z, next));
            x = f.x - (z / prev) * (f.x - x);
            y = f.y - (z / prev) * (f.y - y);
            clamp();
            apply(animate);
        };

        // Place preview sheet (Play only — built on the player's clone, never saved)
        let sheet = null, selected = null;
        const canPreview = (m) => isPlaceMarker(m) && !m.hasAttribute('data-place-off')
            && !m.closest('[data-proto-action]') && mapView.clientHeight >= 170;
        const openPlace = (m) => {
            if (!sheet) {
                sheet = document.createElement('div');
                sheet.className = 'map-sheet';
                mapView.appendChild(sheet);
            }
            sheet.innerHTML = cardHTML(placeOf(m));
            selected?.classList.remove('map-selected');
            selected = m;
            m.classList.add('map-selected');
            mapView.style.setProperty('--map-sheet-h', `${sheet.offsetHeight}px`);
            requestAnimationFrame(() => mapView.classList.add('map-sheet-open'));

            // Slide the map so the place sits in the space above the card
            sheetRoom = sheet.offsetHeight + 8;
            const vr = mapView.getBoundingClientRect(), sc = scaleOf(), r = m.getBoundingClientRect();
            const top = (r.top - vr.top) / sc, bottom = (r.bottom - vr.top) / sc;
            const visible = mapView.clientHeight - sheetRoom;
            if (bottom > visible - 8 || top < 8) {
                y += visible / 2 - (top + bottom) / 2;
                clamp();
                apply();
            }
        };
        const closePlace = () => {
            mapView.classList.remove('map-sheet-open');
            selected?.classList.remove('map-selected');
            selected = null;
            if (sheetRoom) {
                sheetRoom = 0;
                clamp();
                apply();
            }
        };
        apply(false); // hide zoom-gated markers from the start

        // Turn-by-turn navigation (Route variant): the start dot travels the route,
        // the line shrinks behind it, and the ETA card counts down with directions.
        const NAV_MS = 10000;
        let nav = null;
        const fmtDist = (mi) => mi < 0.1 ? `${Math.max(50, Math.round((mi * 5280) / 50) * 50)} ft` : `${mi.toFixed(1)} mi`;
        const startNav = () => {
            const path = mapView.querySelector('.map-route path');
            const card = mapView.querySelector('.map-eta-card');
            if (!path || !card) return;
            const nums = (path.getAttribute('d').match(/-?[\d.]+/g) || []).map(Number);
            const pts = [];
            for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
            if (pts.length < 2) return;

            const dot = mapView.querySelector('.map-user[data-map-fixed]') || mapView.querySelector('.map-user');
            const timeEl = card.querySelector('.map-eta-time');
            const subEl = card.querySelector('.map-eta-sub');
            const goEl = card.querySelector('.map-eta-go span') || card.querySelector('.map-eta-go');
            const orig = { d: path.getAttribute('d'), left: dot?.style.left, top: dot?.style.top,
                time: timeEl?.textContent, sub: subEl?.textContent, go: goEl?.textContent };
            const totalMin = parseFloat(orig.time) || 12;
            const totalMi = parseFloat((orig.sub || '').match(/([\d.]+)\s*mi\b/)?.[1]) || 3.4;

            // Distances in screen pixels (the route's % space isn't square)
            const w = mapView.clientWidth, h = mapView.clientHeight;
            const px = pts.map(([x, y]) => [(x * w) / 100, (y * h) / 100]);
            const cum = [0];
            for (let i = 1; i < px.length; i++) cum.push(cum[i - 1] + Math.hypot(px[i][0] - px[i - 1][0], px[i][1] - px[i - 1][1]));
            const total = cum[cum.length - 1] || 1;
            const turnAt = (i) => {
                const ax = px[i][0] - px[i - 1][0], ay = px[i][1] - px[i - 1][1];
                const bx = px[i + 1][0] - px[i][0], by = px[i + 1][1] - px[i][1];
                const cross = ax * by - ay * bx;                 // y points down: > 0 = right
                const angle = Math.abs(Math.atan2(cross, ax * bx + ay * by)) * 180 / Math.PI;
                const side = cross > 0 ? 'right' : 'left';
                return angle < 30 ? `keep ${side}` : `turn ${side}`;
            };

            const t0 = performance.now();
            card.classList.add('map-navigating');
            if (goEl) goEl.textContent = 'End';
            const frame = (now) => {
                if (!nav || !mapView.isConnected) return;
                const t = Math.min(1, (now - t0) / NAV_MS);
                const s = t * total;
                let k = 0;
                while (k < cum.length - 2 && cum[k + 1] < s) k++;
                const f = Math.min(1, (s - cum[k]) / ((cum[k + 1] - cum[k]) || 1));
                const cx = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * f;
                const cy = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * f;
                if (dot) { dot.style.left = `${cx.toFixed(2)}%`; dot.style.top = `${cy.toFixed(2)}%`; }
                path.setAttribute('d', `M${cx.toFixed(2)} ${cy.toFixed(2)} ` + pts.slice(k + 1).map(([x, y]) => `L${x} ${y}`).join(' '));

                if (t >= 1) {
                    if (timeEl) timeEl.textContent = 'Arrived';
                    if (subEl) subEl.textContent = 'You’ve reached your destination';
                    if (goEl) goEl.textContent = 'Done';
                    card.classList.remove('map-navigating');
                    return;
                }
                if (timeEl) timeEl.textContent = `${Math.max(1, Math.ceil(totalMin * (1 - t)))} min`;
                const next = k + 1;
                const toNext = ((cum[next] - s) / total) * totalMi;
                if (subEl) subEl.textContent = next < pts.length - 1
                    ? `In ${fmtDist(toNext)}, ${turnAt(next)}`
                    : `Destination in ${fmtDist(toNext)}`;
                nav.raf = requestAnimationFrame(frame);
            };
            nav = { path, dot, card, timeEl, subEl, goEl, orig, raf: requestAnimationFrame(frame) };
        };
        const stopNav = () => {
            const n = nav;
            nav = null;
            cancelAnimationFrame(n.raf);
            n.path.setAttribute('d', n.orig.d);
            if (n.dot) { n.dot.style.left = n.orig.left; n.dot.style.top = n.orig.top; }
            if (n.timeEl) n.timeEl.textContent = n.orig.time;
            if (n.subEl) n.subEl.textContent = n.orig.sub;
            if (n.goEl) n.goEl.textContent = n.orig.go;
            n.card.classList.remove('map-navigating');
        };

        mapView.addEventListener('click', (e) => {
            const go = e.target.closest('.map-eta-go');
            if (go && !go.closest('[data-proto-action]')) {
                e.stopPropagation();
                if (nav) stopNav(); else startNav();
                return;
            }
            if (e.target.closest('.map-sheet')) {
                if (e.target.closest('.map-sheet-close')) closePlace();
                return;
            }
            const btn = e.target.closest('[data-map-action]');
            if (btn && !btn.closest('[data-proto-action]')) {
                e.stopPropagation();
                const a = btn.dataset.mapAction;
                if (a === 'zoom-in') zoomAt(z * STEP);
                else if (a === 'zoom-out') zoomAt(z / STEP);
                else if (a === 'locate') { z = 1; x = 0; y = 0; apply(); }
                return;
            }
            const marker = e.target.closest('.map-chip, .map-pin');
            if (marker && !marker.closest('[data-proto-action]')) {
                if (marker.classList.contains('map-chip')) {
                    mapView.querySelectorAll('.map-chip.active').forEach(n => n !== marker && n.classList.remove('active'));
                    marker.classList.add('active');
                }
                if (canPreview(marker)) {
                    if (selected === marker) closePlace(); else openPlace(marker);
                }
                return;
            }
            // Tap on the map itself dismisses the preview
            if (!e.target.closest('.map-eta-card, [data-proto-action]')) closePlace();
        });

        mapView.addEventListener('dblclick', (e) => {
            if (e.target.closest('[data-map-action], [data-proto-action], .map-sheet, .map-eta-card, .map-marker')) return;
            zoomAt(z * STEP, focalAt(e.clientX, e.clientY));
        });

        // Trackpad pinch: Chrome/Firefox send ctrl+wheel, Safari sends gesture events.
        // A plain wheel/scroll is left alone so the screen still scrolls past the map.
        mapView.addEventListener('wheel', (e) => {
            if (!e.ctrlKey) return;
            e.preventDefault();
            e.stopPropagation();
            zoomAt(z * Math.exp(-e.deltaY * 0.01), focalAt(e.clientX, e.clientY), false);
        }, { passive: false });
        let gestureZ = 1;
        mapView.addEventListener('gesturestart', (e) => { e.preventDefault(); gestureZ = z; });
        mapView.addEventListener('gesturechange', (e) => {
            e.preventDefault();
            zoomAt(gestureZ * e.scale, focalAt(e.clientX, e.clientY), false);
        });
        mapView.addEventListener('gestureend', (e) => e.preventDefault());

        // One finger/mouse pans; two fingers pinch-zoom around their midpoint (and pan).
        mapView.style.touchAction = 'none';
        const pointers = new Map();
        let gesture = null;
        const SKIP = '[data-map-action], [data-proto-action], .map-eta-card, .map-sheet';
        const beginGesture = () => {
            const pts = [...pointers.values()];
            const mx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
            const my = pts.reduce((a, p) => a + p.y, 0) / pts.length;
            const f = focalAt(mx, my);
            gesture = {
                sx: mx, sy: my,
                dist: pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0,
                z0: z,
                // The map point under the midpoint, in unscaled layer coordinates
                qx: (f.x - x) / z, qy: (f.y - y) / z,
                moved: gesture?.moved || false
            };
        };
        const moveGesture = () => {
            const pts = [...pointers.values()];
            const mx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
            const my = pts.reduce((a, p) => a + p.y, 0) / pts.length;
            const d = gesture.dist && pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0;
            if (!gesture.moved && Math.hypot(mx - gesture.sx, my - gesture.sy) < DRAG_THRESHOLD
                && !(d && Math.abs(d - gesture.dist) >= DRAG_THRESHOLD)) return;
            if (!gesture.moved) {
                // Now it's a drag: keep getting moves even if the pointer leaves the map
                pointers.forEach((_, id) => { try { mapView.setPointerCapture(id); } catch (_) { /* gone */ } });
            }
            gesture.moved = true;
            mapView.classList.add('map-panning');
            if (d) z = Math.max(MIN_Z, Math.min(MAX_Z, gesture.z0 * (d / gesture.dist)));
            const f = focalAt(mx, my);
            x = f.x - z * gesture.qx;
            y = f.y - z * gesture.qy;
            // Follow past the edge a little, then spring back on release
            const ex = ((z - 1) * mapView.clientWidth) / 2 + 30;
            const ey = ((z - 1) * mapView.clientHeight) / 2 + 30;
            x = Math.max(-ex, Math.min(ex, x));
            y = Math.max(-ey - sheetRoom, Math.min(ey, y));
            apply(false);
        };
        mapView.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            if (e.target.closest(SKIP)) return;
            // No pointer capture yet: a captured pointer's click lands on the map view
            // instead of the marker under it, so taps on places would never register.
            // Capture starts once the press turns into a drag/pinch (moveGesture).
            pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
            if (pointers.size > 2) return;
            beginGesture();
        });
        mapView.addEventListener('pointermove', (e) => {
            const p = pointers.get(e.pointerId);
            if (!p || !gesture) return;
            p.x = e.clientX; p.y = e.clientY;
            moveGesture();
        });
        const endPointer = (e) => {
            if (!pointers.delete(e.pointerId)) return;
            if (pointers.size) { beginGesture(); return; } // a finger lifted: keep panning with the other
            const moved = gesture?.moved;
            gesture = null;
            mapView.classList.remove('map-panning');
            if (!moved) return;
            clamp();
            apply();
            const swallow = (ce) => { ce.stopPropagation(); };
            mapView.addEventListener('click', swallow, { capture: true, once: true });
            setTimeout(() => mapView.removeEventListener('click', swallow, { capture: true }), 0);
        };
        mapView.addEventListener('pointerup', endPointer);
        mapView.addEventListener('pointercancel', endPointer);
    }

    return {
        variants() {
            return VARIANTS.slice();
        },

        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            return temp.firstElementChild;
        },

        // Prototype player (js/prototype.js): drag to pan, +/- / double-tap to zoom,
        // recenter, tap a place to open its preview card, and "Go" on the Route variant
        // runs turn-by-turn navigation.
        play(root) {
            root.querySelectorAll('.map-view').forEach(playView);
        }
    };
})();
