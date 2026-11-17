// Shared helper, not a component. Components that color their active item from a CSS var
// get readable text on it: their CSS sets --accent (e.g. var(--color-primary)) and uses
// var(--on-accent, #fff) for the text; update() writes --on-accent (black/white, same
// luminance rule as TextContrastAdjuster) inline on the component. Called from the
// components' setup, and for every match of SELECTOR by TextContrastAdjuster.updateTextColors
// (theme color changes) and the galleries' contrast pass. Lives in js/components/ so the
// galleries (which load the raw modules, not the editor) get it too.
window.accentContrast = {
    SELECTOR: '.shelf, .breadcrumb.bc-pills',

    update(el) {
        if (!el?.isConnected) return;
        const accent = getComputedStyle(el).getPropertyValue('--accent').trim();
        if (!accent) return;
        const ctx = (this._ctx ||= document.createElement('canvas').getContext('2d'));
        ctx.fillStyle = '#000';
        ctx.fillStyle = accent;   // normalizes any CSS color to #rrggbb / rgba()
        const c = ctx.fillStyle;
        const rgb = c.startsWith('#')
            ? [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16))
            : (c.match(/\d+(\.\d+)?/g) || []).map(Number);
        if (rgb.length < 3) return;
        const on = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 > 0.5 ? '#000000' : '#FFFFFF';
        if (el.style.getPropertyValue('--on-accent') !== on) el.style.setProperty('--on-accent', on);
    },

    updateAll(root = document) {
        root.querySelectorAll(this.SELECTOR).forEach(el => this.update(el));
    }
};
