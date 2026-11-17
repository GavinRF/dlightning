// Component registry module — see docs/component-module-migration.md
// blockquote: quote text with optional attribution. Owns its variants (setupVariants
// falls through to variants() here). No behavior, so no setup.
//
// The quote is wrapped in its own <div> (`.bq-quote`) so the text-align controls sit
// above the quote, not the whole card.
// Keep `.blockquote-element` (contenteditable) as the FIRST editable in each variant —
// templates.js sets a plain-string `text` on the first [contenteditable="true"].
window.Components = window.Components || {};

window.Components.blockquote = (() => {
    const VARIANTS = [
        // 1 — Classic: bar on the left (matches the old JS factory's markup)
        /*html*/
        `<div class="component-wrapper" style="width: 100%;">
            <div>
                <blockquote class="blockquote-element usa" contenteditable="true" style="border-left: 5px solid var(--color-primary);">This is a block-quote. Click to edit.</blockquote>
            </div>
        </div>`,

        // 2 — Pull quote: centered, big quote mark, attribution
        /*html*/
        `<div class="component-wrapper bq-pull" style="width: 100%;">
            <div class="bq-quote"><blockquote class="blockquote-element usa" contenteditable="true">Simplicity is the ultimate sophistication.</blockquote></div>
            <div class="icon-container bq-mark" style="color: var(--color-accent);"><i class="fas fa-quote-left"></i></div>
            <div class="bq-cite usa" contenteditable="true">— Leonardo da Vinci</div>
        </div>`,

        // 3 — Testimonial: stars, quote, avatar + name + role
        /*html*/
        `<div class="component-wrapper bq-testimonial" style="width: 100%;">
            <div class="bq-quote"><blockquote class="blockquote-element usa" contenteditable="true">This app completely changed how our team works. I can't imagine going back.</blockquote></div>
            <div class="icon-container bq-stars" style="color: var(--color-accent);">
                <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
            </div>
            <div class="bq-author">
                <div class="card-image bq-avatar"><i class="fas fa-user"></i></div>
                <div>
                    <div class="bq-name usa" contenteditable="true">Jordan Lee</div>
                    <div class="bq-role usa" contenteditable="true">Product Manager</div>
                </div>
            </div>
        </div>`,

        // 4 — Card: colored card with a quote icon
        /*html*/
        `<div class="component-wrapper bq-card" style="width: 100%; background-color: var(--color-primary);">
            <div class="icon-container bq-card-mark"><i class="fas fa-quote-right"></i></div>
            <div class="bq-quote"><blockquote class="blockquote-element usa" contenteditable="true">The best way to predict the future is to create it.</blockquote></div>
            <div class="bq-cite usa" contenteditable="true">— Peter Drucker</div>
        </div>`
    ];

    return {
        variants() {
            return VARIANTS.slice();
        },

        // Build a fresh quote (variant 1) — used by the editor factory on insert.
        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            return temp.firstElementChild;
        }
    };
})();
