// screen-background.js — a screen's own background color / gradient (window.screenBackground).
//
// Kept as JSON in data-screen-bg on .canvas and saved as the screen doc's `background`
// (projectSys.js captureScreenLayout / applyScreenLayout, so save, load, the local draft,
// duplicate and share links all carry it); undo (history.js) and live sync (collab-sync.js)
// carry the attribute too. No attribute / null = the normal screen color. Values:
//   color     'primary' | 'secondary' | 'accent' (follows the theme) or '#rrggbb'
//   gradient  a GRADIENTS key (all built from the theme colors)
//   angle     90 | 135 | 180 — a linear gradient's direction (absent = 180, top to bottom)
//   tone      'light' (dark text) | 'dark' (light text); absent = auto, judged on the colors
// One of color / gradient. Photos are the next step (an `image` field, same attribute).
//
// render() paints it: the CSS for the fill goes in an inline custom property (--screen-bg) on
// .canvas and the tone in data-bg-tone (derived, never saved); the stylesheet
// (ux-mock-bldr.css "SCREEN BACKGROUND") does the rest: .canvas-content and the device status
// bar turn see-through, and text on the background takes the tone's color while components'
// own surfaces keep their look (markSurfaces), so it reads the same in the editor, in Play /
// share links (the player clones .canvas, marks included) and in PNG export. Theme color changes repaint by themselves (var()); auto tones are re-judged.
//
// In the editor: the screen ⋯ menu's "Background" opens the popover (#bg-pop, on <body>).
// Templates set one with a screen-level `background` (templates.js TEMPLATE_BG).
(function () {
    const ATTR = 'data-screen-bg';
    const THEME = ['primary', 'secondary', 'accent'];
    const HEX = /^#[0-9a-f]{6}$/i;
    const ANGLES = [180, 135, 90];
    // Solid swatches offered in the popover (custom colors come from the color input)
    const COLORS = [
        ['primary', 'Primary'], ['secondary', 'Secondary'], ['accent', 'Accent'],
        ['#ffffff', 'White'], ['#f2efe9', 'Sand'], ['#111318', 'Black'],
    ];
    // Pattern layers: an SVG as a data: URL (quotes, #, < and > escaped for CSS)
    const svgUrl = svg => `url("data:image/svg+xml,${svg.replace(/"/g, "'").replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E')}")`;
    // One wave per tile, seamless side to side and top to bottom
    const WAVES = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="24">` +
        `<path d="M0 12 Q20 2 40 12 T80 12" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="3.5"/></svg>`);
    const DOTS = svgUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="1.7" fill="#fff" fill-opacity=".26"/></svg>`);

    // Every preset is built from the theme colors, so it follows the theme.
    //   css(c, angle, x)  the fill: c(token) → CSS color (var(--color-*)), angle = the linear
    //                     direction, x.shift(token, deg) → that theme color hue-rotated (#hex,
    //                     resolved now; render() reruns when the theme colors change)
    //   linear            offers Direction (the angle) in the popover
    //   lum / tone        what auto tone is judged on: theme tokens / hex colors, or a fixed
    //                     tone for presets that are dark or light whatever the theme
    // Darker / softer versions are see-through black / white layers over the theme colors
    // (no color-mix(), which PNG export's html2canvas may not paint).
    const GRADIENTS = {
        theme:  { label: 'Theme', linear: true, lum: ['primary', 'accent'],
                  css: (c, a) => `linear-gradient(${a}deg, ${c('primary')}, ${c('accent')})` },
        deep:   { label: 'Deep', linear: true, lum: ['primary', '#0b0b14'],
                  css: (c, a) => `linear-gradient(${a}deg, ${c('primary')}, #0b0b14)` },
        glow:   { label: 'Glow', lum: ['primary', '#0b0b14', 'primary'], css: c =>
                    `radial-gradient(110% 70% at 85% 0%, ${c('accent')} 0%, transparent 60%), ` +
                    `radial-gradient(90% 60% at 0% 100%, ${c('secondary')} 0%, transparent 70%), ` +
                    `linear-gradient(165deg, ${c('primary')} 10%, #0b0b14 115%)` },
        // The theme colors darkened, fading to black
        night:  { label: 'Night', linear: true, tone: 'dark', css: (c, a) =>
                    `linear-gradient(${a}deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.92)), ` +
                    `radial-gradient(90% 55% at 80% 0%, ${c('accent')} 0%, transparent 70%), ` +
                    `linear-gradient(${a}deg, ${c('primary')}, ${c('secondary')})` },
        // Rows of thin light waves (patterns are tiled SVG images: PNG export's html2canvas
        // doesn't paint repeating / tiled gradients)
        waves:  { label: 'Waves', linear: true, lum: ['primary', 'accent'], css: (c, a) =>
                    `${WAVES} 0 0 / 40px 14px repeat, ` +
                    `linear-gradient(${a}deg, ${c('primary')}, ${c('accent')})` },
        // A fine dot grid
        dots:   { label: 'Dots', linear: true, lum: ['primary', 'secondary'], css: (c, a) =>
                    `${DOTS} 0 0 / 16px 16px repeat, ` +
                    `linear-gradient(${a}deg, ${c('primary')}, ${c('secondary')})` },
        // The primary color drifting a little around the color wheel
        shift:  { label: 'Shift', linear: true, lum: ['primary'], css: (c, a, x) =>
                    `linear-gradient(${a}deg, ${x.shift('primary', -18)}, ${c('primary')}, ${x.shift('primary', 32)})` },
        // Soft: the theme colors with lots of white
        pastel: { label: 'Pastel', linear: true, tone: 'light', css: (c, a) =>
                    `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), ` +
                    `linear-gradient(${a}deg, ${c('primary')}, ${c('accent')})` },
    };

    // ---- state -------------------------------------------------------------------------------

    const isColor = v => THEME.includes(v) || (typeof v === 'string' && HEX.test(v));

    function clean(raw) {
        const out = {};
        if (!raw || typeof raw !== 'object') return out;
        if (typeof raw.gradient === 'string' && GRADIENTS[raw.gradient]) {
            out.gradient = raw.gradient;
            if (ANGLES.includes(raw.angle) && raw.angle !== 180 && GRADIENTS[raw.gradient].linear) out.angle = raw.angle;
        } else if (isColor(raw.color)) {
            out.color = THEME.includes(raw.color) ? raw.color : raw.color.toLowerCase();
        }
        if (!out.color && !out.gradient) return {};
        if (raw.tone === 'light' || raw.tone === 'dark') out.tone = raw.tone;
        return out;
    }

    function read(canvas) {
        const raw = canvas?.getAttribute(ATTR);
        if (!raw) return {};
        try { return clean(JSON.parse(raw)); } catch { return {}; }
    }

    // For save / snapshots: the stored values, or null for none
    function capture(canvas) {
        const bg = read(canvas);
        return Object.keys(bg).length ? bg : null;
    }

    // Set a screen's background (load / undo / live sync / templates) without marking it changed
    function set(canvas, bg) {
        if (!canvas) return;
        const cleaned = clean(bg);
        const json = Object.keys(cleaned).length ? JSON.stringify(cleaned) : null;
        if ((canvas.getAttribute(ATTR) || null) !== json) {
            if (json) canvas.setAttribute(ATTR, json);
            else canvas.removeAttribute(ATTR);
        }
        render(canvas);
    }

    // A user change: set, flag the screen for saving
    function update(canvas, bg, why) {
        const before = canvas.getAttribute(ATTR) || null;
        set(canvas, bg);
        if ((canvas.getAttribute(ATTR) || null) !== before) markChanged(canvas, why);
    }

    function markChanged(canvas, why) {
        const id = canvas.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        const pm = window.projectManager;
        if (id && pm && typeof pm.addCanvasToChanged === 'function') {
            pm.addCanvasToChanged(id, why || 'Screen background changed');
            pm.contentChanged = true;
        }
    }

    // ---- colors ------------------------------------------------------------------------------

    const cssColor = v => THEME.includes(v) ? `var(--color-${v})` : v;

    // The CSS fill for a background, or '' for none
    function cssFor(bg) {
        if (bg.color) return cssColor(bg.color);
        const g = GRADIENTS[bg.gradient];
        if (!g) return '';
        return g.css(cssColor, bg.angle || 180, { shift });
    }

    // A color token → { r, g, b } (theme colors as currently set). A 2D context normalizes any
    // CSS color string to #rrggbb / rgba().
    let ctx = null;
    function rgbOf(v) {
        const str = THEME.includes(v)
            ? getComputedStyle(document.documentElement).getPropertyValue(`--color-${v}`).trim()
            : v;
        ctx = ctx || document.createElement('canvas').getContext('2d');
        ctx.fillStyle = '#808080';
        ctx.fillStyle = str || '#808080';
        const s = ctx.fillStyle;
        if (s[0] === '#') return { r: parseInt(s.slice(1, 3), 16), g: parseInt(s.slice(3, 5), 16), b: parseInt(s.slice(5, 7), 16) };
        const m = s.match(/[\d.]+/g) || [128, 128, 128];
        return { r: +m[0], g: +m[1], b: +m[2] };
    }
    // A theme color with its hue turned by `deg` (saturation / lightness kept), as #hex
    function shift(token, deg) {
        let { r, g, b } = rgbOf(token);
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
        let h = 0, sat = 0;
        if (max !== min) {
            const d = max - min;
            sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
            h *= 60;
        }
        h = ((h + deg) % 360 + 360) % 360;
        const k = n => (n + h / 30) % 12;
        const a = sat * Math.min(l, 1 - l);
        const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
        return '#' + [f(0), f(8), f(4)].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
    }
    const luminance = ({ r, g, b }) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // 'light' (a light background: dark text) or 'dark' (light text); '' for none
    function toneFor(bg) {
        if (!bg.color && !bg.gradient) return '';
        if (bg.tone) return bg.tone;
        const g = GRADIENTS[bg.gradient];
        if (g?.tone) return g.tone;
        const colors = bg.color ? [bg.color] : g.lum;
        const avg = colors.reduce((sum, c) => sum + luminance(rgbOf(c)), 0) / colors.length;
        return avg > 0.6 ? 'light' : 'dark';
    }

    // ---- rendering ---------------------------------------------------------------------------

    function render(canvas) {
        if (!canvas) return;
        const bg = read(canvas);
        const css = cssFor(bg);
        const tone = toneFor(bg);
        if (css) {
            if (canvas.style.getPropertyValue('--screen-bg') !== css) canvas.style.setProperty('--screen-bg', css);
            if (canvas.getAttribute('data-bg-tone') !== tone) canvas.setAttribute('data-bg-tone', tone);
        } else {
            if (canvas.style.getPropertyValue('--screen-bg')) canvas.style.removeProperty('--screen-bg');
            if (canvas.hasAttribute('data-bg-tone')) canvas.removeAttribute('data-bg-tone');
        }
        // Only screens in the editor are watched (not the player's copies)
        if (canvas.closest('#mockZone')) watch(canvas, !!css);
        recontrast(canvas);
    }

    // ---- surfaces ----------------------------------------------------------------------------
    // Text directly on the background takes the tone's color (CSS); components' own opaque
    // surfaces (cards, fields, chips…) keep theirs: each is marked with the session class
    // bg-surface-light / bg-surface-dark by how light it is (stripped on save, live sync and
    // undo: EDITOR_CHROME.SESSION_CLASSES), and the CSS puts the normal text colors back in it.
    const SURFACE = ['bg-surface-light', 'bg-surface-dark'];
    const SURFACE_SEL = '.bg-surface-light, .bg-surface-dark';

    function parseRgba(str) {
        const m = str && str.match(/[\d.]+/g);
        if (!m || m.length < 3 || !/^rgba?\(/.test(str)) return null;
        return { r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3] };
    }

    // root: a screen's .canvas-content or a thumbnail (.tp-scale)
    function markSurfaces(root) {
        if (!root) return;
        // Editor chrome (handles, arrows, swatches…) keeps its own look and is never saved
        const chrome = window.EDITOR_CHROME?.ALL?.join(', ');
        root.querySelectorAll('*').forEach(el => {
            if (chrome && el.closest(chrome)) {
                if (el.classList.contains(SURFACE[0]) || el.classList.contains(SURFACE[1])) el.classList.remove(...SURFACE);
                return;
            }
            const c = parseRgba(getComputedStyle(el).backgroundColor);
            const want = c && c.a >= 0.5 ? (luminance(c) > 0.5 ? SURFACE[0] : SURFACE[1]) : null;
            SURFACE.forEach(cls => {
                if ((cls === want) !== el.classList.contains(cls)) el.classList.toggle(cls, cls === want);
            });
        });
    }

    function unmarkSurfaces(root) {
        root?.querySelectorAll(SURFACE_SEL).forEach(el => {
            el.classList.remove(...SURFACE);
            if (!el.classList.length) el.removeAttribute('class');
        });
        root?.querySelectorAll('[style*="--sb-chrome-color"]').forEach(el => el.style.removeProperty('--sb-chrome-color'));
    }

    // Editor chrome inside a component's content inherits the tone's text color; pin each such
    // control's inherited color to what it is WITHOUT the background, measured by taking the
    // tone off for a moment (same task, so nothing paints). Chrome is never saved or synced.
    function pinChromeColors(canvas) {
        const chrome = window.EDITOR_CHROME?.ALL?.join(', ');
        const content = canvas.querySelector('.canvas-content');
        if (!chrome || !content) return;
        const roots = Array.from(content.querySelectorAll(`.component-content :is(${chrome})`))
            .filter(el => !el.parentElement.closest(chrome));
        if (!roots.length) return;
        const tone = canvas.getAttribute('data-bg-tone');
        canvas.removeAttribute('data-bg-tone');
        const colors = roots.map(el => getComputedStyle(el).color);
        canvas.setAttribute('data-bg-tone', tone);
        roots.forEach((el, i) => {
            if (el.style.getPropertyValue('--sb-chrome-color') !== colors[i]) el.style.setProperty('--sb-chrome-color', colors[i]);
        });
    }

    // While a screen has a background, components added / restyled on it get marked too
    const watchers = new WeakMap();   // .canvas → MutationObserver
    function watch(canvas, on) {
        let obs = watchers.get(canvas);
        if (!on) { obs?.disconnect(); watchers.delete(canvas); return; }
        if (obs) return;
        let timer = null;
        obs = new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (!canvas.hasAttribute('data-bg-tone')) return;
                markSurfaces(canvas.querySelector('.canvas-content'));
                pinChromeColors(canvas);
            }, 120);
        });
        const content = canvas.querySelector('.canvas-content');
        if (content) obs.observe(content, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
        watchers.set(canvas, obs);
    }

    // Editor chrome inside the content (handles, variant arrows, swatches…) keeps the editor's
    // own text color variables: the tone's overrides on .canvas-content would otherwise reach
    // it. Built from the one chrome list (js/editor-chrome.js).
    (function chromeRule() {
        const all = window.EDITOR_CHROME?.ALL;
        if (!all?.length || document.getElementById('bg-chrome-rules')) return;
        const style = document.createElement('style');
        style.id = 'bg-chrome-rules';
        style.textContent = `:where(.canvas[data-bg-tone] .component-content :is(${all.join(', ')})) {` +
            ' --basic-txt-color: var(--sb-editor-txt); --variant-nav-btn: var(--sb-editor-nav);' +
            ' --placeholder-color: var(--sb-editor-placeholder); }';
        document.head.appendChild(style);
    })();

    // Text on colored parts follows what it sits on
    function recontrast(canvas) {
        const content = canvas.querySelector('.canvas-content');
        if (canvas.hasAttribute('data-bg-tone')) { markSurfaces(content); pinChromeColors(canvas); }
        else unmarkSurfaces(content);
        const tca = window.TextContrastAdjuster;
        const chrome = window.EDITOR_CHROME?.ALL?.join(', ');
        if (tca) canvas.querySelectorAll('[style*="background-color"]').forEach(el => {
            if (!(chrome && el.closest(chrome))) tca.updateElementContrast(el);   // not editor chrome (swatches…)
        });
        window.statusBarLook?.updateContrast(canvas.querySelector('.status-bar .mobile-status'));
    }

    function renderAll() {
        document.querySelectorAll(`.canvas[${ATTR}]`).forEach(render);
    }

    // A thumbnail (template picker): paint `el` with a background's fill and tone
    function paint(el, bg) {
        const cleaned = clean(bg);
        const css = cssFor(cleaned);
        if (!css) return;
        el.style.setProperty('--screen-bg', css);
        el.setAttribute('data-bg-tone', toneFor(cleaned));
        markSurfaces(el);
    }

    // PNG export (renderScreenAt, on its clone): html2canvas paints a box-shadow's shape under
    // a see-through fill, which shows as bands at the edges of glassy cards. Drop those shadows.
    function prepareExport(clone) {
        if (!clone?.hasAttribute('data-bg-tone')) return;
        clone.querySelectorAll('*').forEach(el => {
            const cs = getComputedStyle(el);
            if (cs.boxShadow === 'none') return;
            const m = cs.backgroundColor.match(/rgba?\(([^)]+)\)/);
            const alpha = m ? parseFloat(m[1].split(/[,/\s]+/).filter(Boolean)[3] ?? '1') : 1;
            if (alpha > 0 && alpha < 1) el.style.boxShadow = 'none';
        });
    }

    // Auto tones follow the theme colors (inline variables on <html>)
    let themeTimer = null;
    new MutationObserver(() => {
        clearTimeout(themeTimer);
        themeTimer = setTimeout(renderAll, 120);
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    // The editor's dark mode (a body class) changes how light the surfaces are
    const watchBody = () => new MutationObserver(() => {
        clearTimeout(themeTimer);
        themeTimer = setTimeout(renderAll, 120);
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    if (document.body) watchBody(); else document.addEventListener('DOMContentLoaded', watchBody);

    // ---- popover -----------------------------------------------------------------------------

    let pop = null, popCanvas = null, popAnchor = null;
    // The custom color's iro wheel (same look as the Theme tab's): built once per popover and
    // moved back in on every fill(), so a redraw doesn't rebuild it mid-use
    let pickerOpen = false, pickerEl = null, iroPicker = null;
    const hasIro = () => typeof iro !== 'undefined' && !!iro.ColorPicker;

    function close() {
        if (!pop) return;
        pop.remove();
        pop = null;
        popCanvas = null;
        popAnchor = null;
        pickerOpen = false;
        pickerEl = null;
        iroPicker = null;
    }

    // anchor: the element to open under (the screen's ⋯ button)
    function open(canvas, anchor) {
        close();
        if (!canvas) return;
        popCanvas = canvas;
        popAnchor = anchor;
        pop = document.createElement('div');
        pop.id = 'bg-pop';
        pop.className = 'sb-pop bg-pop';
        pop.setAttribute('role', 'dialog');
        pop.setAttribute('aria-label', 'Screen background');
        document.body.appendChild(pop);
        fill();
        place();
    }

    // Under the anchor, kept inside the window (again when the picker opens / closes)
    function place() {
        if (!pop) return;
        const r = (popAnchor?.isConnected ? popAnchor : popCanvas).getBoundingClientRect();
        const w = pop.offsetWidth, h = pop.offsetHeight;
        const left = Math.min(Math.max(8, r.right - w), window.innerWidth - w - 8);
        let top = r.bottom + 6;
        if (top + h > window.innerHeight - 8) top = Math.max(8, window.innerHeight - h - 8);
        pop.style.left = `${left}px`;
        pop.style.top = `${top}px`;
    }

    function swatch(attrs, title, fillCss, active) {
        return `<button type="button" class="bg-pop-swatch${active ? ' active' : ''}" ${attrs} title="${title}" aria-label="${title}" aria-pressed="${!!active}" style="--sw: ${fillCss.replace(/"/g, '&quot;')}"></button>`;
    }

    function fill() {
        const canvas = popCanvas;
        const bg = read(canvas);
        const none = !bg.color && !bg.gradient;
        const custom = bg.color && HEX.test(bg.color) && !COLORS.some(([v]) => v === bg.color);
        const tone = bg.tone || 'auto';
        const linear = bg.gradient && GRADIENTS[bg.gradient].linear;
        pop.innerHTML = /*html*/`
            <div class="sb-pop-row sb-pop-col">
                <span class="sb-pop-label">Color</span>
                <div class="bg-pop-swatches">
                    <button type="button" class="bg-pop-swatch bg-pop-none${none ? ' active' : ''}" data-none title="None (the normal screen color)" aria-label="None" aria-pressed="${none}"><i class="fa-solid fa-ban"></i></button>
                    ${COLORS.map(([v, label]) => swatch(`data-color="${v}"`, label, cssColor(v), bg.color === v)).join('')}
                    ${hasIro() ? /*html*/`
                    <button type="button" class="bg-pop-swatch bg-pop-custom${custom ? ' active' : ''}${pickerOpen ? ' open' : ''}" data-custom title="Pick any color" aria-label="Pick any color" aria-expanded="${pickerOpen}" style="--sw: ${custom ? bg.color : RAINBOW}"></button>` : /*html*/`
                    <label class="bg-pop-swatch bg-pop-custom${custom ? ' active' : ''}" title="Pick any color" style="--sw: ${custom ? bg.color : RAINBOW}">
                        <input type="color" value="${custom ? bg.color : '#3a6df0'}" aria-label="Pick any color">
                    </label>`}
                </div>
                ${pickerOpen ? '<div class="bg-pop-picker-slot"></div>' : ''}
            </div>
            <div class="sb-pop-row sb-pop-col">
                <span class="sb-pop-label">Gradient</span>
                <div class="bg-pop-swatches">
                    ${Object.entries(GRADIENTS).map(([k, g]) => swatch(`data-gradient="${k}"`, g.label, cssFor({ gradient: k, angle: bg.gradient === k ? bg.angle : undefined }), bg.gradient === k)).join('')}
                </div>
            </div>
            ${linear ? /*html*/`
            <div class="sb-pop-row">
                <span class="sb-pop-label">Direction</span>
                <div class="sb-pop-seg" role="radiogroup" aria-label="Direction">
                    ${[[180, 0, 'Top to bottom'], [135, -45, 'Diagonal'], [90, -90, 'Left to right']].map(([a, turn, label]) =>
                        `<button type="button" class="sb-pop-btn${(bg.angle || 180) === a ? ' active' : ''}" data-angle="${a}" title="${label}" aria-label="${label}" role="radio" aria-checked="${(bg.angle || 180) === a}"><i class="fa-solid fa-arrow-down" style="transform: rotate(${turn}deg)"></i></button>`).join('')}
                </div>
            </div>` : ''}
            <div class="sb-pop-row">
                <span class="sb-pop-label">Text</span>
                <div class="sb-pop-seg" role="radiogroup" aria-label="Text color">
                    ${[['auto', 'Auto'], ['light', 'Dark'], ['dark', 'Light']].map(([v, label]) =>
                        `<button type="button" class="sb-pop-btn${tone === v ? ' active' : ''}" data-tone="${v}" role="radio" aria-checked="${tone === v}"${none ? ' disabled' : ''}>${label}</button>`).join('')}
                </div>
            </div>
            <button type="button" class="sb-pop-btn sb-pop-all" title="Give every screen this background">
                <i class="fa-solid fa-clone"></i> Apply to all screens</button>
        `;
        const name = () => (typeof editor !== 'undefined' && editor.getScreenName)
            ? editor.getScreenName(canvas.closest('.canvas-wrapper')) : 'Screen';
        pop.querySelector('[data-none]').addEventListener('click', () => {
            update(canvas, null, `${name()}: background removed`);
            fill();
        });
        pop.querySelectorAll('[data-color]').forEach(b => b.addEventListener('click', () => {
            update(canvas, { color: b.dataset.color, tone: read(canvas).tone }, `${name()}: background color`);
            fill();
        }));
        const pickColor = hex => update(canvas, { color: hex.toLowerCase(), tone: read(canvas).tone }, `${name()}: background color`);
        const input = pop.querySelector('input[type="color"]');
        if (input) {
            // No iro (CDN didn't load): the browser's own picker. Live while dragging; redrawn when done
            input.addEventListener('input', () => pickColor(input.value));
            input.addEventListener('change', () => { if (pop) fill(); });
        }
        pop.querySelector('[data-custom]')?.addEventListener('click', () => {
            pickerOpen = !pickerOpen;
            fill();
            place();
        });
        if (pickerOpen) mountPicker(canvas, bg, custom, pickColor);
        pop.querySelectorAll('[data-gradient]').forEach(b => b.addEventListener('click', () => {
            const cur = read(canvas);
            update(canvas, { gradient: b.dataset.gradient, angle: cur.angle, tone: cur.tone }, `${name()}: background gradient`);
            fill();
        }));
        pop.querySelectorAll('[data-angle]').forEach(b => b.addEventListener('click', () => {
            update(canvas, { ...read(canvas), angle: +b.dataset.angle }, `${name()}: gradient direction`);
            fill();
        }));
        pop.querySelectorAll('[data-tone]').forEach(b => b.addEventListener('click', () => {
            const t = b.dataset.tone;
            update(canvas, { ...read(canvas), tone: t === 'auto' ? undefined : t }, `${name()}: background text color`);
            fill();
        }));
        pop.querySelector('.sb-pop-all').addEventListener('click', e => {
            const json = canvas.getAttribute(ATTR) || null;
            const others = Array.from(document.querySelectorAll('#mockZone .canvas'))
                .filter(other => other !== canvas && (other.getAttribute(ATTR) || null) !== json);
            const copy = () => others.forEach(other =>
                update(other, read(canvas), 'Screen background copied from another screen'));
            // One undo step for all of them (history.js group), not one per screen
            if (window.historyManager?.group) historyManager.group(copy, { targets: others, label: 'Background on all screens' });
            else copy();
            const btn = e.currentTarget;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Applied';
            setTimeout(() => { if (btn.isConnected) btn.innerHTML = '<i class="fa-solid fa-clone"></i> Apply to all screens'; }, 1400);
        });
    }

    const toHex = ({ r, g, b }) => '#' + [r, g, b].map(n => Math.round(n).toString(16).padStart(2, '0')).join('');
    const RAINBOW = 'conic-gradient(#f44, #fd4, #4d6, #4bf, #a5f, #f44)';

    function mountPicker(canvas, bg, custom, pickColor) {
        const slot = pop.querySelector('.bg-pop-picker-slot');
        // Starts on the screen's color (a theme color resolved to its hex), else a blue
        const start = custom ? bg.color : (bg.color ? toHex(rgbOf(bg.color)) : null) || '#3a6df0';
        if (!pickerEl) {
            pickerEl = document.createElement('div');
            pickerEl.className = 'bg-pop-picker';
            pickerEl.innerHTML = '<div class="bg-pop-wheel"></div><input type="text" class="bg-pop-hex" maxlength="7" spellcheck="false" aria-label="Hex color">';
            slot.replaceWith(pickerEl);
            // Same settings as the Theme tab's picker (index.html #theme-color-picker)
            iroPicker = new iro.ColorPicker(pickerEl.querySelector('.bg-pop-wheel'), {
                width: 190, color: start, handleRadius: 7, borderWidth: 1, activeHandleRadius: 11,
                borderColor: '#fff', wheelAngle: 90, sliderSize: 22,
            });
            const hex = pickerEl.querySelector('.bg-pop-hex');
            hex.value = start;
            // input:* = the user's own drags (not setting it from code): live on the screen,
            // the swatch follows, the rest of the popover is redrawn when the drag ends
            iroPicker.on('input:change', c => {
                pickColor(c.hexString);
                hex.value = c.hexString;
                const sw = pop?.querySelector('[data-custom]');
                if (sw) sw.style.setProperty('--sw', c.hexString);
            });
            iroPicker.on('input:end', () => { if (pop) fill(); });
            hex.addEventListener('change', () => {
                let v = hex.value.trim();
                if (!v.startsWith('#')) v = '#' + v;
                if (/^#[0-9a-f]{3}$/i.test(v)) v = '#' + v.slice(1).split('').map(ch => ch + ch).join('');
                if (!HEX.test(v)) { hex.value = iroPicker.color.hexString; return; }
                iroPicker.color.hexString = v;
                pickColor(v);
                fill();
            });
            hex.addEventListener('keydown', e => { if (e.key === 'Enter') hex.blur(); });
        } else {
            slot.replaceWith(pickerEl);
            // A swatch picked meanwhile: the wheel shows it
            if (bg.color && start.toLowerCase() !== iroPicker.color.hexString.toLowerCase()) {
                iroPicker.color.hexString = start;
                pickerEl.querySelector('.bg-pop-hex').value = start;
            }
        }
    }

    document.addEventListener('pointerdown', e => {
        if (pop && !pop.contains(e.target) && !e.target.closest('.screen-menu-btn')) close();
    }, true);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && pop) close(); });
    // Fixed on the page: close when the screens move under it (not for the native color picker)
    document.addEventListener('editorzoomchange', close);
    document.addEventListener('wheel', e => { if (pop && !pop.contains(e.target)) close(); }, { capture: true, passive: true });
    document.addEventListener('scroll', e => { if (pop && !pop.contains(e.target)) close(); }, { capture: true, passive: true });

    window.screenBackground = {
        read, capture, set, update, render, renderAll, paint, prepareExport, cssFor, toneFor, open, close,
        isOpen: () => !!pop, GRADIENTS, ATTR,
    };
})();
