// Component registry module — see docs/component-module-migration.md
// aiWelcome: the empty state of an AI assistant: logo, greeting and starter prompts. Owns
// its variants (setupVariants falls through to variants() here). No editor behavior.
// In play (prototype.js playChat), tapping a prompt (.aw-prompt) sends its text as a
// message — title, plus ": sub" when it has one — and the first message hides the welcome.
window.Components = window.Components || {};

window.Components.aiWelcome = (() => {
    const logo = /*html*/`<div class="icon-container aw-logo" style="background-color: var(--color-primary);"><i class="fas fa-wand-magic-sparkles"></i></div>`;

    const card = (icon, title, sub) => /*html*/`<div class="aw-prompt">
                <span class="icon-container aw-prompt-icon"><i class="fas ${icon}"></i></span>
                <span class="aw-prompt-title usa" contenteditable="true">${title}</span>
                <span class="aw-prompt-sub usa" contenteditable="true">${sub}</span>
            </div>`;

    const row = (icon, title) => /*html*/`<div class="aw-prompt aw-row">
                <span class="icon-container aw-prompt-icon"><i class="fas ${icon}"></i></span>
                <span class="aw-prompt-title usa" contenteditable="true">${title}</span>
                <i class="fas fa-arrow-up aw-row-go non-editable"></i>
            </div>`;

    const VARIANTS = [
        // 1 — Centered logo + greeting, 2×2 prompt cards
        /*html*/
        `<div class="ai-welcome aw-cards">
        ${logo}
        <div class="heading-wrapper"><h2 class="aw-title usa" contenteditable="true">How can I help today?</h2></div>
        <div class="aw-prompts">
            ${card('fa-plane', 'Plan a trip', '3 days in Lisbon')}
            ${card('fa-pen', 'Write an email', 'to reschedule a meeting')}
            ${card('fa-lightbulb', 'Brainstorm', 'names for my app')}
            ${card('fa-file-lines', 'Summarize', 'a long article')}
        </div>
    </div>`,

        // 2 — Personal greeting + a list of suggestions
        /*html*/
        `<div class="ai-welcome aw-list">
        <div class="heading-wrapper"><h2 class="aw-title usa" contenteditable="true">Good morning, Alex</h2></div>
        <div><p class="aw-sub usa" contenteditable="true">What would you like to work on?</p></div>
        <div class="aw-prompts">
            ${row('fa-calendar-check', 'What’s on my calendar today?')}
            ${row('fa-list-check', 'Turn my notes into a to-do list')}
            ${row('fa-language', 'Translate a message to Spanish')}
        </div>
    </div>`,

        // 3 — Minimal: logo, title, subtitle, horizontally scrolling prompt cards
        /*html*/
        `<div class="ai-welcome aw-scroll">
        ${logo}
        <div class="heading-wrapper"><h2 class="aw-title usa" contenteditable="true">Ask me anything</h2></div>
        <div><p class="aw-sub usa" contenteditable="true">I can write, plan, summarize and more.</p></div>
        <div class="aw-prompts">
            ${card('fa-utensils', 'Dinner ideas', 'with what’s in my fridge')}
            ${card('fa-dumbbell', 'Workout plan', '20 minutes, no gear')}
            ${card('fa-gift', 'Gift ideas', 'for my sister')}
        </div>
    </div>`
    ];

    return {
        variants() {
            return VARIANTS.slice();
        },

        // Build a fresh welcome (variant 1) — used by the editor factory on insert.
        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            return temp.firstElementChild;
        }
    };
})();
