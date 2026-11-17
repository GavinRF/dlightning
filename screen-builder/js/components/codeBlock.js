// Component registry module — see docs/component-module-migration.md
// codeBlock: a code snippet with a language label and a Copy button. Owns its variants
// (setupVariants falls through to variants() here). No editor behavior, so no setup: the
// code is one contenteditable <pre>; the light syntax colors are plain spans (cb-k keyword,
// cb-s string, cb-c comment, cb-f function) that survive editing.
// The AI response chat variant embeds variant 1 (js/components/chat.js), and prototype.js
// calls play() on those nested blocks too.
window.Components = window.Components || {};

window.Components.codeBlock = (() => {
    const SAMPLE = [
        '<span class="cb-k">function</span> <span class="cb-f">formatPrice</span>(amount) {',
        '  <span class="cb-c">// 1234.5 → "$1,234.50"</span>',
        '  <span class="cb-k">return</span> amount.<span class="cb-f">toLocaleString</span>(<span class="cb-s">\'en-US\'</span>, {',
        '    style: <span class="cb-s">\'currency\'</span>,',
        '    currency: <span class="cb-s">\'USD\'</span>',
        '  });',
        '}'
    ].join('\n');

    const head = (lang) => /*html*/`<div class="cb-head">
            <span class="cb-lang usa" contenteditable="true">${lang}</span>
            <span class="cb-copy non-editable"><i class="far fa-copy"></i> Copy</span>
        </div>`;

    const VARIANTS = [
        // 1 — Dark (the one AI responses embed)
        /*html*/
        `<div class="code-block cb-dark">
        ${head('javascript')}
        <pre class="cb-code" contenteditable="true" spellcheck="false">${SAMPLE}</pre>
    </div>`,

        // 2 — Light, outlined
        /*html*/
        `<div class="code-block cb-light">
        ${head('javascript')}
        <pre class="cb-code" contenteditable="true" spellcheck="false">${SAMPLE}</pre>
    </div>`,

        // 3 — Terminal: window dots, shell prompt
        /*html*/
        `<div class="code-block cb-dark cb-terminal">
        <div class="cb-head">
            <span class="cb-dots non-editable"><i></i><i></i><i></i></span>
            <span class="cb-lang usa" contenteditable="true">Terminal</span>
            <span class="cb-copy non-editable"><i class="far fa-copy"></i> Copy</span>
        </div>
        <pre class="cb-code" contenteditable="true" spellcheck="false"><span class="cb-c">$</span> npm install my-app
<span class="cb-c">$</span> npm run dev
<span class="cb-s">✓ Ready on http://localhost:3000</span></pre>
    </div>`
    ];

    return {
        variants() {
            return VARIANTS.slice();
        },

        // Build a fresh block (variant 1) — used by the editor factory on insert.
        create() {
            const temp = document.createElement('div');
            temp.innerHTML = VARIANTS[0];
            return temp.firstElementChild;
        },

        // Prototype player: Copy flashes "Copied". Root may be a component or a nested block.
        play(root) {
            const blocks = root.matches?.('.code-block') ? [root] : root.querySelectorAll('.code-block');
            blocks.forEach(block => {
                const copy = block.querySelector('.cb-copy');
                if (!copy || copy._protoBound) return;
                copy._protoBound = true;
                const base = copy.innerHTML;
                copy.classList.add('proto-tap');
                copy.addEventListener('click', () => {
                    clearTimeout(copy._protoT);
                    copy.innerHTML = '<i class="fas fa-check"></i> Copied';
                    copy._protoT = setTimeout(() => { copy.innerHTML = base; }, 1400);
                });
            });
        }
    };
})();
