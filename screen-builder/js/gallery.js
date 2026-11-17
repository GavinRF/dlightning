// gallery.js — header controls shared by the read-only galleries (components.html, templates.html).
// Each page renders its tiles first, then calls initGalleryControls(). Markup it expects:
// #darkModeToggle, [data-color-var] inputs in .g-swatch + #gColorReset, #gIconStyle buttons,
// #gScale + #gScaleOut, #gSearch + #gSearchClear, #gEmpty, and .g-category > .g-component blocks.
//
// Filter: a block with data-search is shown or hidden whole; a block without one is filtered
// tile by tile (.g-tile[data-search]) and hidden once none of its tiles match.
window.initGalleryControls = function initGalleryControls({ defaultScale = 0.85, scaleKey = 'galleryScale' } = {}) {
    const main = document.getElementById('gMain');
    const empty = document.getElementById('gEmpty');

    // Dark mode: same body class + localStorage key as the builder, so the setting is shared.
    const dark = document.getElementById('darkModeToggle');
    const applyDark = (on) => { document.body.classList.toggle('dark-mode', on); dark.checked = on; };
    applyDark(localStorage.getItem('darkMode') === 'true');
    dark.addEventListener('change', () => { localStorage.setItem('darkMode', dark.checked); applyDark(dark.checked); });

    // Text contrast: same rule as the builder's TextContrastAdjuster (ux-mock-bldr.js, not
    // loaded here) — anything with an inline background gets black or white text by luminance.
    // All reads first, then all writes: interleaving them makes every read restyle the whole
    // page, which on the template gallery (~160 full screens) took seconds per pass, so text
    // swapped in some places and not (yet) in others.
    const runContrast = () => {
        const updates = [];
        main.querySelectorAll('.g-frame [style*="background-color"], .g-frame [style*="background: var(--color"]').forEach(el => {
            const bg = getComputedStyle(el).backgroundColor;
            const rgb = bg && bg !== 'transparent' && bg.match(/\d+(\.\d+)?/g);
            if (!rgb || (rgb.length > 3 && +rgb[3] === 0)) return;
            updates.push([el, (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 0.5 ? '#000000' : '#FFFFFF']);
        });
        main.querySelectorAll('.g-frame').forEach(frame => window.accentContrast?.updateAll(frame));
        updates.forEach(([el, color]) => {
            el.style.color = color;
            el.setAttribute('data-g-contrast', '');   // its text inherits this (css/gallery.css)
            if (el.classList.contains('data-table-header-bg')) {
                const thead = el.parentElement?.querySelector('.data-table-main > thead');
                if (thead) thead.style.color = color;
            }
        });
    };
    // At most one pass per frame while a color picker is being dragged
    let contrastFrame = 0;
    const updateContrast = () => {
        if (contrastFrame) return;
        contrastFrame = requestAnimationFrame(() => { contrastFrame = 0; runContrast(); });
    };

    // Theme colors: inline CSS vars on <html>, as the builder's Theme tab sets them. Gallery-only
    // preference (localStorage, shared by both galleries) — the builder keeps colors per project.
    const colorInputs = document.querySelectorAll('[data-color-var]');
    const rootStyle = document.documentElement.style;
    const COLOR_KEY = 'galleryColors';
    const defaults = {};
    colorInputs.forEach(inp => { defaults[inp.dataset.colorVar] = getComputedStyle(document.documentElement).getPropertyValue(inp.dataset.colorVar).trim(); });
    const applyColors = (colors) => {
        colorInputs.forEach(inp => {
            const v = inp.dataset.colorVar;
            if (colors[v]) rootStyle.setProperty(v, colors[v]); else rootStyle.removeProperty(v);
            inp.value = colors[v] || defaults[v];
            inp.closest('.g-swatch').style.background = inp.value;
        });
        updateContrast();
    };
    let savedColors = {};
    try { savedColors = JSON.parse(localStorage.getItem(COLOR_KEY)) || {}; } catch (e) { /* ignore bad data */ }
    applyColors(savedColors);
    colorInputs.forEach(inp => inp.addEventListener('input', () => {
        savedColors[inp.dataset.colorVar] = inp.value;
        localStorage.setItem(COLOR_KEY, JSON.stringify(savedColors));
        applyColors(savedColors);
    }));
    document.getElementById('gColorReset').addEventListener('click', () => {
        savedColors = {};
        localStorage.removeItem(COLOR_KEY);
        applyColors(savedColors);
    });
    dark.addEventListener('change', updateContrast);

    // Icon style: same <html data-icon-style> hook the builder's Theme tab sets (css/icon-styles.css).
    // Gallery-only preference — the builder keeps it per project.
    const iconBtns = document.querySelectorAll('#gIconStyle button');
    const applyIconStyle = (style) => {
        if (!['ph-regular', 'ph-fill', 'ph-duotone'].includes(style)) style = '';
        if (style) document.documentElement.setAttribute('data-icon-style', style);
        else document.documentElement.removeAttribute('data-icon-style');
        iconBtns.forEach(b => {
            const on = b.dataset.iconStyle === style;
            b.classList.toggle('active', on);
            b.setAttribute('aria-checked', on ? 'true' : 'false');
        });
    };
    applyIconStyle(localStorage.getItem('galleryIconStyle') || '');
    iconBtns.forEach(b => b.addEventListener('click', () => {
        applyIconStyle(b.dataset.iconStyle);
        localStorage.setItem('galleryIconStyle', b.dataset.iconStyle);
    }));

    // Scale (per page: whole screens want a smaller default than single components)
    const scale = document.getElementById('gScale');
    const scaleOut = document.getElementById('gScaleOut');
    const applyScale = (s) => {
        document.body.style.setProperty('--scale', s);
        scaleOut.textContent = Math.round(s * 100) + '%';
        scale.value = s;
    };
    applyScale(parseFloat(localStorage.getItem(scaleKey)) || defaultScale);
    scale.addEventListener('input', () => { applyScale(scale.value); localStorage.setItem(scaleKey, scale.value); });

    // Filter: every word of the query must appear
    const search = document.getElementById('gSearch');
    const clearBtn = document.getElementById('gSearchClear');
    const clearSearch = () => {
        search.value = '';
        search.dispatchEvent(new Event('input'));
        search.focus();
    };
    clearBtn.addEventListener('click', clearSearch);
    search.addEventListener('keydown', (e) => { if (e.key === 'Escape' && search.value) { e.preventDefault(); clearSearch(); } });
    search.addEventListener('input', () => {
        clearBtn.hidden = !search.value;
        const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        const hit = (el) => words.every(w => el.dataset.search.includes(w));
        let shown = 0;
        document.querySelectorAll('.g-category').forEach(section => {
            let any = false;
            section.querySelectorAll('.g-component').forEach(block => {
                let show;
                if (block.dataset.search != null) {
                    show = hit(block);
                } else {
                    show = false;
                    block.querySelectorAll('.g-tile[data-search]').forEach(tile => {
                        tile.hidden = !hit(tile);
                        if (!tile.hidden) show = true;
                    });
                }
                block.hidden = !show;
                if (show) { any = true; shown++; }
            });
            section.hidden = !any;
        });
        empty.style.display = shown ? 'none' : 'block';
    });
};
