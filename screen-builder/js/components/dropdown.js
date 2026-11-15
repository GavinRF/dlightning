// Component registry module — see docs/component-module-migration.md
// dropdown: collapsible select with editable, add/removable options.
window.Components = window.Components || {};

window.Components.dropdown = {
    // Prototype player (js/prototype.js): open, pick an option (closes), no add/delete.
    play(root) {
        const header = root.querySelector('.dropdown-header');
        const options = root.querySelector('.options-container');
        if (!header || !options || header._playBound) return;
        header._playBound = true;
        const chevron = header.querySelector('.fa-chevron-down, .fa-chevron-up');
        const setOpen = (open) => {
            options.classList.toggle('active', open);
            chevron?.classList.toggle('fa-chevron-up', open);
            chevron?.classList.toggle('fa-chevron-down', !open);
        };
        header.addEventListener('click', () => setOpen(!options.classList.contains('active')));
        options.addEventListener('click', (e) => {
            const option = e.target.closest('.option');
            if (!option) return;
            const selected = root.querySelector('.selected-text');
            if (selected) selected.textContent = option.textContent;
            setOpen(false);
        });
    },

    setup(container) {
        const header = container.querySelector('.dropdown-header');
        const selectedText = container.querySelector('.selected-text');
        const chevron = container.querySelector('.fa-chevron-down, .fa-chevron-up');
        const optionsContainer = container.querySelector('.options-container');
        const addOptionWrapper = container.querySelector('.add-option-wrapper');
        const addButton = addOptionWrapper.querySelector('.add-button');

        header.addEventListener('click', () => {
            optionsContainer.classList.toggle('active');
            chevron.classList.toggle('fa-chevron-up');
            chevron.classList.toggle('fa-chevron-down');
        });

        addButton.addEventListener('click', () => {
            const optionWrapper = document.createElement('div');
            optionWrapper.className = 'option-wrapper';

            const option = document.createElement('div');
            option.className = 'option';
            option.setAttribute('contenteditable', 'true');
            option.textContent = 'New Option';

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.innerHTML = '<i class="fas fa-times"></i>';

            optionWrapper.appendChild(option);
            optionWrapper.appendChild(deleteButton);

            optionsContainer.insertBefore(optionWrapper, addOptionWrapper);
            option.focus();

            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                optionWrapper.remove();
            });
        });

        optionsContainer.addEventListener('click', (e) => {
            const option = e.target.closest('.option');
            if (option) {
                selectedText.textContent = option.textContent;
            }
        });
    }
};
