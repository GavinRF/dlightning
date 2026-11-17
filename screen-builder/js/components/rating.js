// Component registry module — see docs/component-module-migration.md
// rating: star rating (stars only, score + count, "rate this" prompt, review summary with
// bars). Owns its variants (setupVariants falls through here).
//
// State lives in the markup: a star is OFF when it has the inline `color` OFF_COLOR, a half
// star uses fa-star-half-stroke. The rating is read back from the stars, so a saved /
// synced / undone rating keeps working. Stars are plain <i> (not .icon-container) so a click
// rates instead of opening the icon picker; Phosphor icon styles still swap them via CSS.
// Clicking a star sets the rating, in the editor and in play; clicking the current rating
// again clears down to one less (so a prompt can go back to 0). Review-summary bars set
// their fill from where they're clicked. Inline style changes are what save detects.
window.Components = window.Components || {};

window.Components.rating = (() => {
    const OFF_COLOR = 'var(--neutral-gray)';
    // Play: the prompt variant's caption follows the chosen rating
    const PROMPT_WORDS = ['Tap a star to rate', 'Terrible', 'Not great', 'Okay', 'Good', 'Excellent!'];

    // `value` 0–5, halves allowed
    const stars = (value, extra = '') => {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            if (value >= i) html += '<i class="fas fa-star"></i>';
            else if (value >= i - 0.5) html += '<i class="fas fa-star-half-stroke"></i>';
            else html += `<i class="fas fa-star" style="color: ${OFF_COLOR};"></i>`;
        }
        return `<div class="rating-stars${extra}" style="color: var(--color-accent);">${html}</div>`;
    };

    const bar = (label, pct) => /*html*/`<div class="rating-bar-row">
                    <span class="rating-bar-label">${label}</span>
                    <div class="rating-bar"><div class="rating-bar-fill" style="width: ${pct}%; background-color: var(--color-accent);"></div></div>
                </div>`;

    const VARIANTS = [
        // 1 — Stars only
        /*html*/
        `<div class="rating rating-plain">${stars(4)}</div>`,

        // 2 — Score + stars + review count (product / place headers)
        /*html*/
        `<div class="rating rating-inline">
            <span class="rating-score usa" contenteditable="true">4.5</span>
            ${stars(4.5)}
            <span class="rating-count usa" contenteditable="true">(1,204 reviews)</span>
        </div>`,

        // 3 — Rate prompt: big empty stars to tap (after an order, ride, lesson…)
        /*html*/
        `<div class="rating rating-prompt">
            <div class="rating-title usa" contenteditable="true">How was your experience?</div>
            ${stars(0, ' rating-lg')}
            <div class="rating-caption usa" contenteditable="true">Tap a star to rate</div>
        </div>`,

        // 4 — Review summary: average + bars per star level
        /*html*/
        `<div class="rating rating-summary">
            <div class="rating-summary-score">
                <div class="rating-big usa" contenteditable="true">4.5</div>
                ${stars(4.5, ' rating-sm')}
                <div class="rating-count usa" contenteditable="true">1,204 ratings</div>
            </div>
            <div class="rating-bars">
                ${bar(5, 72)}
                ${bar(4, 18)}
                ${bar(3, 6)}
                ${bar(2, 2)}
                ${bar(1, 2)}
            </div>
        </div>`
    ];

    const isOff = (star) => (star.style.color || '').includes('neutral-gray');

    // Current value of a .rating-stars row (halves count 0.5)
    const valueOf = (row) => Array.from(row.querySelectorAll('i')).reduce((sum, star) =>
        sum + (isOff(star) ? 0 : star.classList.contains('fa-star-half-stroke') ? 0.5 : 1), 0);

    // value 0–5; a .5 shows a half star
    const setValue = (row, value) => {
        row.querySelectorAll('i').forEach((star, i) => {
            const half = value < i + 1 && value >= i + 0.5;
            star.classList.toggle('fa-star-half-stroke', half);
            star.classList.toggle('fa-star', !half);
            if (value >= i + 0.5) star.style.removeProperty('color');
            else star.style.color = OFF_COLOR;
        });
    };

    const markChanged = (el, why) => {
        const id = el.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        if (id) window.projectManager?.addCanvasToChanged?.(id, why);
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

        // Prototype player: same behavior (no edit chrome), plus the prompt's caption words
        play(root) {
            this.setup(root, { play: true });
        },

        afterVariantChange(content) {
            this.setup(content);
        },

        // Set a component's (first) star row — used by templates. value 0–5 (halves ok).
        setRating(root, value) {
            const row = root?.querySelector?.('.rating-stars');
            if (row) setValue(row, value);
        },

        // Safe to call repeatedly. `root` = the .rating, .component-content or wrapper.
        setup(root, { play = false } = {}) {
            if (!root) return;
            const container = root.classList?.contains('rating') ? root : root.querySelector?.('.rating');
            if (!container || container._ratingBound) return;
            container._ratingBound = true;

            container.addEventListener('click', (e) => {
                const star = e.target.closest('.rating-stars i');
                if (star && container.contains(star)) {
                    const row = star.closest('.rating-stars');
                    const index = Array.from(row.querySelectorAll('i')).indexOf(star) + 1;
                    const next = valueOf(row) === index ? index - 1 : index;
                    setValue(row, next);
                    if (play) {
                        const caption = container.querySelector('.rating-prompt .rating-caption');
                        if (caption) caption.textContent = PROMPT_WORDS[next];
                    } else {
                        markChanged(container, `Rating set to ${next}`);
                    }
                    return;
                }
                const track = e.target.closest('.rating-bar');
                if (track && container.contains(track) && !play) {
                    const rect = track.getBoundingClientRect();
                    const pct = Math.round(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) * 100);
                    const fill = track.querySelector('.rating-bar-fill');
                    if (fill) fill.style.width = `${pct}%`;
                    markChanged(container, 'Rating bar changed');
                }
            });
        }
    };
})();
