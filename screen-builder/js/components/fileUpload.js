// File upload component (data-component-type="fileUpload").
//
// A dashed drop zone (label) over a hidden-ish file input, plus preview cards for the
// chosen files. Listeners are delegated on .file-upload-container, so setup() works on
// freshly built, duplicated, or restored (save/load, live sync) markup — including the
// delete buttons on preview cards that were saved with the project. The same binding runs
// on the prototype player's clone through play().
window.Components = window.Components || {};

window.Components.fileUpload = (() => {
    const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const LABEL_HTML = '<span><i class="fas fa-cloud-upload-alt"></i> Drop files here or click to upload</span>';
    const LABEL_DRAG_HTML = '<i class="fas fa-cloud-upload-alt"><br><br></i>';

    const findContainer = (root) => {
        if (!root) return null;
        if (root.classList?.contains('file-upload-container')) return root;
        return root.querySelector?.('.file-upload-container') || null;
    };

    function createPreviewCard(file) {
        const card = document.createElement('div');
        card.className = 'file-upload-preview-card';

        const content = document.createElement('div');
        content.className = 'file-upload-preview-card-content';

        if (VALID_IMAGE_TYPES.includes(file.type)) {
            const img = document.createElement('img');
            img.className = 'file-upload-preview-img';
            const reader = new FileReader();
            reader.onload = e => { img.src = e.target.result; };
            // Small thumbnail copy (js/image-shrink.js); the card still shows the real file's size
            (window.shrinkImage ? window.shrinkImage(file, { maxSize: 400 }) : Promise.resolve(file))
                .then(small => reader.readAsDataURL(small));
            content.appendChild(img);
        } else {
            const icon = document.createElement('i');
            icon.className = 'fas fa-file';
            icon.style.cssText = 'font-size: 40px; color: var(--color-primary);';
            content.appendChild(icon);
        }

        const fileName = document.createElement('div');
        fileName.className = 'file-upload-preview-filename';
        fileName.textContent = file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name;
        content.appendChild(fileName);

        const fileSize = document.createElement('div');
        fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        fileSize.style.cssText = 'font-size: 9px; color: #666;';
        content.appendChild(fileSize);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'file-upload-preview-delete-btn';
        deleteBtn.innerHTML = '×';

        card.append(content, deleteBtn);
        return card;
    }

    function showPreviews(container, files) {
        const previewContainer = container.querySelector('.file-preview-container');
        if (!previewContainer) return;
        previewContainer.innerHTML = '';
        Array.from(files).forEach(file => previewContainer.appendChild(createPreviewCard(file)));
    }

    function resetLabel(label) {
        label.style.backgroundColor = 'var(--input-bg-color)';
        label.style.borderColor = 'var(--neutral-gray)';
        label.innerHTML = LABEL_HTML;
    }

    function bind(container) {
        if (container._fileUploadBound) return;
        container._fileUploadBound = true;

        const getInput = () => container.querySelector('input[type="file"]');
        const labelFrom = (e) => {
            const label = e.target.closest?.('.file-upload-label');
            return label && container.contains(label) ? label : null;
        };

        container.addEventListener('click', (e) => {
            const deleteBtn = e.target.closest('.file-upload-preview-delete-btn');
            if (deleteBtn && container.contains(deleteBtn)) {
                deleteBtn.closest('.file-upload-preview-card')?.remove();
                return;
            }
            if (labelFrom(e)) getInput()?.click();
        });

        container.addEventListener('change', (e) => {
            if (e.target.matches('input[type="file"]')) showPreviews(container, e.target.files);
        });

        // Show a card's delete button while hovering it (mouseenter doesn't bubble).
        container.addEventListener('mouseover', (e) => {
            const card = e.target.closest('.file-upload-preview-card');
            const btn = card?.querySelector('.file-upload-preview-delete-btn');
            if (btn) btn.style.display = 'block';
        });
        container.addEventListener('mouseout', (e) => {
            const card = e.target.closest('.file-upload-preview-card');
            if (!card || card.contains(e.relatedTarget)) return;
            const btn = card.querySelector('.file-upload-preview-delete-btn');
            if (btn) btn.style.display = 'none';
        });

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(type => {
            container.addEventListener(type, (e) => {
                if (!labelFrom(e)) return;
                e.preventDefault();
                e.stopPropagation();
            });
        });

        container.addEventListener('dragenter', (e) => {
            const label = labelFrom(e);
            if (!label || label.dataset.dragActive) return;
            label.dataset.dragActive = 'true';
            label.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
            label.style.borderColor = 'var(--color-primary)';
            label.innerHTML = LABEL_DRAG_HTML;
        });

        container.addEventListener('dragleave', (e) => {
            const label = labelFrom(e);
            // Moving onto the label's own children also fires dragleave; ignore those.
            if (!label || label.contains(e.relatedTarget)) return;
            delete label.dataset.dragActive;
            resetLabel(label);
        });

        container.addEventListener('drop', (e) => {
            const label = labelFrom(e);
            if (!label) return;
            delete label.dataset.dragActive;
            resetLabel(label);
            const files = e.dataTransfer?.files;
            if (!files || !files.length) return;
            const input = getInput();
            if (input) input.files = files;
            showPreviews(container, files);
        });
    }

    return {
        // Build a fresh, empty upload component (used by the editor factory on insert).
        create() {
            const container = document.createElement('div');
            container.className = 'file-upload-container';

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            // Deliberately no .file-upload-input class: that rule makes the input an invisible
            // full-height overlay that would swallow clicks on the preview delete buttons.
            // (The original code set `fileInput.class`, which never applied it either.)
            fileInput.multiple = true;

            const label = document.createElement('label');
            label.htmlFor = 'file-upload';
            label.className = 'file-upload-label';
            label.innerHTML = LABEL_HTML;

            const previewContainer = document.createElement('div');
            previewContainer.className = 'file-preview-container';

            container.append(fileInput, label, previewContainer);
            this.setup(container);
            return container;
        },

        // Wire up an upload component found at/under `root`. Safe to call more than once.
        setup(root) {
            const container = findContainer(root);
            if (!container) return null;
            // A drag that ended mid-hover may have been saved in its "drop" look.
            const label = container.querySelector('.file-upload-label');
            if (label && (label.dataset.dragActive || !label.querySelector('span'))) {
                delete label.dataset.dragActive;
                resetLabel(label);
            }
            bind(container);
            return container;
        },

        // Prototype player (js/prototype.js): the same behavior on the player's clone — pick
        // or drop files, see their preview cards, remove them. Nothing is saved.
        play(root) {
            const container = findContainer(root);
            if (container) bind(container);
        }
    };
})();
