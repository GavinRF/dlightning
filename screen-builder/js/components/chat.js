// Component registry module — see docs/component-module-migration.md
// chat: left/right chat bubbles. Two sidebar types share this file:
//   window.Components.chat      — shared setup (the classic bubble's image-upload area)
//   window.Components.leftChat  — variants + factory for the left (incoming) bubble
//   window.Components.rightChat — variants + factory for the right (outgoing) bubble
// setupVariants('leftChat' | 'rightChat') falls through to those entries' variants().
//
// Keep `.chat-avatar` / `.chat-content` in variants — templates.js sets text through them.
window.Components = window.Components || {};

window.Components.chat = {
    setup(container) {
        if (!container) return;

        // Find the image container regardless of chat type
        const imageContainer = container.querySelector('.chat-image-container');

        // Set up image upload functionality
        if (imageContainer) {
            // Clean up any existing event listeners by cloning and replacing
            const newImageContainer = imageContainer.cloneNode(true);
            if (imageContainer.parentNode) {
                imageContainer.parentNode.replaceChild(newImageContainer, imageContainer);
            }

            // Get the actual image and placeholder elements
            const img = newImageContainer.querySelector('.chat-image');
            const placeholder = newImageContainer.querySelector('.chat-image-placeholder');

            // Find the bubble element (works for both left and right chat)
            const bubble = newImageContainer.closest('.leftChat, .rightChat');
            if (bubble) {
                // Add hover behavior
                bubble.addEventListener('mouseenter', () => {
                    newImageContainer.style.display = 'block';
                });

                bubble.addEventListener('mouseleave', () => {
                    // Only hide if no image is displayed
                    if (!img || img.style.display === 'none') {
                        newImageContainer.style.display = 'none';
                    }
                });
            }

            // Add click handler for image upload
            newImageContainer.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = window.shrinkImage?.ACCEPT || 'image/*';

                input.onchange = async (e) => {
                    let file = e.target.files[0];
                    if (file && window.shrinkImage) {
                        const { ok, skipped } = await window.shrinkImage.filterImages([file]);
                        if (skipped.length) window.projectManager?.showNotification(window.shrinkImage.skippedMessage(skipped), 'error');
                        file = ok[0];
                    }
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            // If img doesn't exist, create it
                            let imgElement = img;
                            if (!imgElement) {
                                imgElement = document.createElement('img');
                                imgElement.className = 'chat-image';
                                newImageContainer.appendChild(imgElement);
                            }

                            // Update the image
                            imgElement.src = event.target.result;
                            imgElement.style.display = 'block';

                            // Hide the placeholder
                            if (placeholder) {
                                placeholder.style.display = 'none';
                            }

                            // Ensure the image container remains visible
                            newImageContainer.style.display = 'block';
                        };
                        // Shrink first (js/image-shrink.js) so the screen doesn't carry the full photo
                        (window.shrinkImage ? window.shrinkImage(file) : Promise.resolve(file))
                            .then(small => reader.readAsDataURL(small));
                    }
                };

                input.click();
            });
        }

        return container;
    }
};

(() => {
    // side: 'left' | 'right'. Builds the row (avatar + bubble + optional timestamp) in the
    // exact shape the old JS factories produced, so classic bubbles round-trip unchanged.
    const row = (side, bubbleInner, { bubbleClass = '', timestamp = true } = {}) => {
        const left = side === 'left';
        const bubbleCls = (left ? 'leftChat' : 'rightChat') + (bubbleClass ? ` ${bubbleClass}` : '');
        const bubbleStyle = left ? '' : ' style="background-color: var(--color-primary);"';
        const ts = timestamp ? '<div class="chat-timestamp usa" contenteditable="true">1 minute ago</div>' : '';
        const wrap = left
            ? '<div style="flex-grow: 1; max-width: 80%;">'
            : '<div class="chat-content-wrapper">';
        return /*html*/`<div class="chat-container"${left ? ' style="flex-direction: row;"' : ''}>
            <div class="chat-avatar usa" contenteditable="true" style="background-color: var(--color-primary);">${left ? 'AV' : 'ME'}</div>
            ${wrap}
                <div class="${bubbleCls}"${bubbleStyle}>${bubbleInner}</div>
                ${ts}
            </div>
        </div>`;
    };

    const classicImageSlot = (side) => /*html*/`
                    <div class="chat-image-container" style="margin-top: 8px; cursor: pointer; display: none;">
                        <img class="chat-image" style="display: none;" alt="Chat image">
                        <div class="chat-image-placeholder"${side === 'left' ? ' style="color: #666; border: 0.12rem dashed #ccc;"' : ''}><i class="fas fa-image" style="margin-right: 8px;"></i>Add Image</div>
                    </div>`;

    const message = (text = 'Click to edit this message.') =>
        `<div class="chat-content usa" contenteditable="true">${text}</div>`;

    const variantsFor = (side) => {
        // Waveform comes from the music player module (loaded later, but variants()
        // only runs at insert/switch time). Bars inherit the bubble's text color.
        const wave = window.Components.musicPlayer?.waveformHTML({ bars: 28, played: 0.35, color: null, height: '28px' }) || '';
        return [
            // 1 — Classic text bubble (hover to attach an image)
            row(side, message() + classicImageSlot(side)),

            // 2 — Image message with caption
            row(side, /*html*/`<div class="card-image chat-media">
                    <span class="non-editable">Click to add image</span>
                    <i class="fa-solid fa-image image-ph non-editable"></i>
                </div>${message('Check this out!')}`, { bubbleClass: 'chat-bubble-media' }),

            // 3 — Voice message (scrubbable waveform)
            row(side, /*html*/`<div class="chat-voice">
                    <div class="icon-container chat-voice-play"><i class="fas fa-play"></i></div>
                    ${wave}
                    <span class="chat-voice-time usa" contenteditable="true">0:42</span>
                </div>`),

            // 4 — Typing indicator
            row(side, '<div class="chat-typing non-editable"><span></span><span></span><span></span></div>', { timestamp: false }),

            // 5 — Message with a reaction
            row(side, message('That sounds great!') + /*html*/`<div class="chat-reactions icon-container">
                    <i class="fas fa-heart"></i><span class="usa" contenteditable="true">2</span>
                </div>`, { bubbleClass: 'chat-bubble-react' }),

            // 6 — AI response: no bubble, full width, assistant label, formatted text,
            //     copy / thumbs / regenerate actions (prototype.js streams replies into it)
            aiResponse(side),

            // 7 — AI response with a collapsible "Thought for 8s" reasoning block
            aiResponse(side, { thought: true }),

            // 8 — AI response with a code block
            aiResponse(side, { code: true })
        ];
    };

    // Reasoning block: the chevron toggles it in the editor (delegated listener below), the
    // whole header in play. Open/closed is data-open, so it saves/syncs/undoes as is.
    const thoughtBlock = /*html*/`<div class="chat-ai-thought" data-open="false">
                    <div class="chat-ai-thought-head">
                        <i class="fas fa-lightbulb non-editable"></i>
                        <span class="chat-ai-thought-label usa" contenteditable="true">Thought for 8s</span>
                        <i class="fas fa-chevron-right chat-ai-thought-chev non-editable"></i>
                    </div>
                    <div class="chat-ai-thought-body usa" contenteditable="true">They want sign-up to feel quicker. The biggest wins are usually fewer fields, visible progress, and letting people skip optional steps.</div>
                </div>`;

    const listBody = /*html*/`<div class="chat-content usa" contenteditable="true">Here are a few ways to make your onboarding feel faster:</div>
                <ul class="chat-ai-list">
                    <li class="usa" contenteditable="true">Ask for only the essentials up front</li>
                    <li class="usa" contenteditable="true">Show progress so people know what's left</li>
                    <li class="usa" contenteditable="true">Let them skip and finish setup later</li>
                </ul>`;

    // Code block markup comes from the codeBlock module (loaded later; variants() only runs
    // at insert/switch time)
    const codeBody = () => /*html*/`<div class="chat-content usa" contenteditable="true">Here's a small helper that formats a price:</div>
                ${window.Components.codeBlock?.variants()[0] || ''}`;

    // side: 'left' | 'right' -> class chat-ai-left / chat-ai-right (chat-ai-right is styled in componentVariants.css)
    const aiResponse = (side, { thought = false, code = false } = {}) => /*html*/`<div class="chat-container chat-ai chat-ai-${side}">
            <div class="chat-ai-head">
                <div class="icon-container chat-ai-icon" style="background-color: var(--color-primary);"><i class="fas fa-wand-magic-sparkles"></i></div>
                <span class="chat-ai-name usa" contenteditable="true">Assistant</span>
            </div>
            <div class="${side === 'left' ? 'leftChat' : 'rightChat'} chat-bubble-ai">
                ${thought ? thoughtBlock : ''}
                ${code ? codeBody() : listBody}
            </div>
            <div class="chat-ai-actions">
                <span class="icon-container chat-ai-copy"><i class="far fa-copy"></i></span>
                <span class="icon-container chat-ai-up"><i class="far fa-thumbs-up"></i></span>
                <span class="icon-container chat-ai-down"><i class="far fa-thumbs-down"></i></span>
                <span class="icon-container chat-ai-regen"><i class="fas fa-rotate-right"></i></span>
            </div>
        </div>`;

    // Editor: the reasoning block's chevron opens/closes it (the label stays editable)
    document.addEventListener('click', (e) => {
        const chev = e.target.closest?.('.canvas .chat-ai-thought-chev');
        if (!chev) return;
        const block = chev.closest('.chat-ai-thought');
        block.dataset.open = block.dataset.open === 'true' ? 'false' : 'true';
    });

    const entry = (side) => ({
        variants() {
            return variantsFor(side);
        },

        // Build a fresh bubble (variant 1) — used by the editor factory on insert.
        create() {
            const temp = document.createElement('div');
            temp.innerHTML = variantsFor(side)[0];
            const bubble = temp.firstElementChild;
            window.Components.chat.setup(bubble);
            return bubble;
        },

        setup(container) {
            return window.Components.chat.setup(container);
        },

        afterVariantChange(content) {
            window.Components.chat.setup(content);
        }
    });

    window.Components.leftChat = entry('left');
    window.Components.rightChat = entry('right');
})();
