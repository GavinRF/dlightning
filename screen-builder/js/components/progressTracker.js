// Component registry module — see docs/component-module-migration.md
// progressTracker: a horizontal stepper — selectable steps with connecting
// lines, add/remove step controls (1–7), and color swatches for the selected
// step's circle. Uses globals createColorSwatches + window.updateComponentSwatches.
window.Components = window.Components || {};

// Layouts: horizontal (default) / vertical, as `data-tracker-layout` on
// .progress-tracker-container, read by CSS — the steps (count, labels, selection) are
// untouched. Toggled from a button in the hover toolbar. It's a <span>, not a <button>:
// the −/+ buttons are found by their .pt-remove-step / .pt-add-step icons.
const PT_LAYOUTS = {
    horizontal: { icon: 'fa-grip-lines-vertical', title: 'Switch to vertical layout' },
    vertical: { icon: 'fa-grip-lines', title: 'Switch to horizontal layout' }
};

function ptTracker(root) {
    return root?.classList?.contains('progress-tracker-container')
        ? root
        : root?.querySelector?.('.progress-tracker-container') || root?.closest?.('.progress-tracker-container');
}

function ptRenderLayoutBtn(tracker, btn) {
    const layout = tracker.dataset.trackerLayout === 'vertical' ? 'vertical' : 'horizontal';
    btn.innerHTML = `<i class="fas ${PT_LAYOUTS[layout].icon}"></i>`;
    btn.title = PT_LAYOUTS[layout].title;
}

function ptEnsureLayoutToggle(root) {
    const tracker = ptTracker(root);
    const controls = tracker?.querySelector('.progress-tracker-controls');
    if (!controls) return;
    let btn = controls.querySelector('.pt-layout-btn');
    if (!btn) {
        btn = document.createElement('span');
        btn.className = 'pt-count-btn pt-layout-btn non-editable';
        btn.setAttribute('role', 'button');
        controls.prepend(btn);
    }
    ptRenderLayoutBtn(tracker, btn);
    if (btn._ptBound) return;
    btn._ptBound = true;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.Components.progressTracker.setLayout(tracker,
            tracker.dataset.trackerLayout === 'vertical' ? 'horizontal' : 'vertical');
    });
}

window.Components.progressTracker = {
    layouts: Object.keys(PT_LAYOUTS),

    // 'horizontal' | 'vertical' (also usable from templates)
    setLayout(root, layout) {
        const tracker = ptTracker(root);
        if (!tracker) return;
        if (layout === 'vertical') tracker.dataset.trackerLayout = 'vertical';
        else delete tracker.dataset.trackerLayout;
        const btn = tracker.querySelector('.pt-layout-btn');
        if (btn) ptRenderLayoutBtn(tracker, btn);
        // Save change detection ignores data attributes — flag the screen
        const canvasId = tracker.closest('.canvas-wrapper')?.getAttribute('data-canvas-id');
        window.projectManager?.addCanvasToChanged(canvasId, 'Progress tracker layout changed');
    },

    // Prototype player (js/prototype.js): tap a step to move to it (forward or back). Same
    // colors as setSelectedStep in setup(), without the swatch rebuild.
    play(root) {
        const tracker = ptTracker(root);
        if (!tracker || tracker._playBound) return;
        tracker._playBound = true;
        tracker.addEventListener('click', (e) => {
            const step = e.target.closest('[data-step]');
            if (!step || step.closest('[data-proto-action]')) return;
            // The selected color moves with the selection (keeps a swatch-picked color)
            const color = tracker.querySelector('.selected-step .step-circle')?.style.backgroundColor || 'var(--color-primary)';
            tracker.querySelectorAll('[data-step]').forEach(s => {
                const circle = s.querySelector('.step-circle');
                s.classList.toggle('selected-step', s === step);
                if (!circle) return;
                if (s === step) {
                    circle.style.backgroundColor = color;
                    window.TextContrastAdjuster?.updateElementContrast(circle);
                } else {
                    circle.style.backgroundColor = 'var(--neutral-gray)';
                    circle.style.color = '#666';
                }
            });
        });
    },

    setup(container) {
    if (!container) return;
    ptEnsureLayoutToggle(container);

    // First, clean up any existing color swatches to prevent duplicates
    const existingSwatches = container.querySelectorAll('.color-swatch-container');
    existingSwatches.forEach(swatch => swatch.remove());

    // Ensure steps container exists
    let stepsContainer = container.querySelector('.steps-container');
    if (!stepsContainer) {
        stepsContainer = document.createElement('div');
        stepsContainer.className = 'steps-container';
        stepsContainer.style.cssText = 'display: flex; align-items: center; width: 100%; position: relative;';
        
        // Move existing steps to the new container
        const steps = Array.from(container.querySelectorAll('[data-step]'));
        steps.forEach(step => stepsContainer.appendChild(step));
        
        // Insert steps container before controls
        const controls = container.querySelector('.progress-tracker-controls');
        if (controls) {
            container.insertBefore(stepsContainer, controls);
        } else {
            container.appendChild(stepsContainer);
        }
    }

    // Keep track of selected step
    let selectedStep = null;

    // Find existing selected step or select the first one
    const selectedStepElement = container.querySelector('[data-step].selected-step');
    if (selectedStepElement) {
        selectedStep = selectedStepElement;
    } else {
        // If no step is selected, select the first one
        selectedStep = container.querySelector('[data-step]');
        if (selectedStep) {
            selectedStep.classList.add('selected-step');
        }
    }

    function createStep(index) {
        const stepContainer = document.createElement('div');
        stepContainer.className = 'step-container';
        stepContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2; flex: 0 1 auto; text-align: center; cursor: pointer;';
        stepContainer.setAttribute('data-step', '');

        const circle = document.createElement('div');
        circle.className = 'step-circle';
        circle.style.cssText = `
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            margin: 0 6px;
            ${index === 0 ? 'background-color: var(--color-primary);' : 'background-color: var(--neutral-gray); color: #666;'}
        `;
        circle.textContent = (index + 1).toString();
        circle.setAttribute('contentEditable', 'true');

        const label = document.createElement('div');
        label.className = 'step-label';
        label.textContent = `Step ${index + 1}`;
        label.style.cssText = 'font-size: 14px; color: #666; font-weight: 500;';
        label.setAttribute('contentEditable', 'true');

        stepContainer.appendChild(circle);
        stepContainer.appendChild(label);
        stepContainer.style.cursor = 'pointer';
        
        // Set first step as selected by default
        if (index === 0 && !selectedStep) {
            selectedStep = stepContainer;
            stepContainer.classList.add('selected-step');
        }
        
        stepContainer.addEventListener('click', () => {
            setSelectedStep(stepContainer);
        });
        
        return stepContainer;
    }

    function createConnectingLine() {
        const line = document.createElement('div');
        line.style.cssText = 'height: 2px; background-color: #E0E0E0; flex: 1; margin: 18px 0 0 0; align-self: flex-start; border-radius: 2px';
        line.classList.add('connecting-line');
        return line;
    }

    function setSelectedStep(stepContainer) {
        // Deselect all steps
        container.querySelectorAll('[data-step]').forEach(step => {
            step.classList.remove('selected-step');
            const circle = step.querySelector('.step-circle');
            if (circle) {
                circle.style.backgroundColor = 'var(--neutral-gray)';
                circle.style.color = '#666';
            }
        });
        
        // Select the clicked step
        stepContainer.classList.add('selected-step');
        const circle = stepContainer.querySelector('.step-circle');
        if (circle) {
            circle.style.backgroundColor = 'var(--color-primary)';
            window.TextContrastAdjuster?.updateElementContrast(circle);
        }
        
        // Update selected step reference
        selectedStep = stepContainer;
        
        // Remove any existing swatches
        const existingSwatches = container.querySelectorAll('.color-swatch-container');
        existingSwatches.forEach(swatch => swatch.remove());
        
        // Update color swatches to target the selected step
        updateColorSwatches(stepContainer);
    }

    function updateColorSwatches(stepContainer) {
        if (!stepContainer) return;
        
        const circle = stepContainer.querySelector('.step-circle');
        if (!circle) return;
        
        // Create new swatches for the selected step
        const swatches = createColorSwatches(circle);
        if (swatches && swatches.children && swatches.children.length > 0) {
            container.insertBefore(swatches, container.firstChild);
        }
        
        // Make swatches responsive
        window.updateComponentSwatches(container);
    }

    function updateConnectingLines() {
        stepsContainer.querySelectorAll('.connecting-line').forEach(line => line.remove());
        
        const steps = stepsContainer.querySelectorAll('[data-step]');
        steps.forEach((step, index) => {
            if (index < steps.length - 1) {
                const line = createConnectingLine();
                stepsContainer.insertBefore(line, steps[index + 1]);
            }
        });
    }

    function updateSteps() {
        const steps = stepsContainer.querySelectorAll('[data-step]');
        steps.forEach((step, i) => {
            const circle = step.querySelector('.step-circle');
            if (circle) {
                circle.textContent = (i + 1).toString();
            }
        });
        updateConnectingLines();
        updateButtonStates();
    }

    function updateButtonStates() {
        const controls = container.querySelector('.progress-tracker-controls');
        if (!controls) return;

        const steps = stepsContainer.querySelectorAll('[data-step]');
        const removeButton = controls.querySelector('.pt-remove-step')?.closest('button');
        const addButton = controls.querySelector('.pt-add-step')?.closest('button');
        
        if (removeButton && addButton) {
            removeButton.style.opacity = steps.length === 1 ? '0.5' : '1';
            removeButton.style.cursor = steps.length === 1 ? 'default' : 'pointer';
            addButton.style.opacity = steps.length === 5 ? '0.5' : '1';
            addButton.style.cursor = steps.length === 5 ? 'default' : 'pointer';
        }
    }

    // Setup event listeners
    const controls = container.querySelector('.progress-tracker-controls');
    if (controls) {
        const addButton = controls.querySelector('.pt-add-step')?.closest('button');
        const removeButton = controls.querySelector('.pt-remove-step')?.closest('button');

        if (addButton) {
            // Remove existing listener by cloning
            const newAddButton = addButton.cloneNode(true);
            if (addButton.parentNode) {
                addButton.parentNode.replaceChild(newAddButton, addButton);
            }
            
            // Add new listener
            newAddButton.onclick = () => {
                const steps = stepsContainer.querySelectorAll('[data-step]');
                if (steps.length < 7) {
                    const newStep = createStep(steps.length);
                    stepsContainer.appendChild(newStep);
                    updateSteps();
                }
            };
        }

        if (removeButton) {
            // Remove existing listener by cloning
            const newRemoveButton = removeButton.cloneNode(true);
            if (removeButton.parentNode) {
                removeButton.parentNode.replaceChild(newRemoveButton, removeButton);
            }
            
            // Add new listener
            newRemoveButton.onclick = () => {
                const steps = stepsContainer.querySelectorAll('[data-step]');
                if (steps.length > 1) {
                    const lastStep = steps[steps.length - 1];
                    
                    // If removing the selected step, select the previous one
                    if (selectedStep === lastStep) {
                        selectedStep = steps[steps.length - 2];
                        setSelectedStep(selectedStep);
                    }
                    
                    lastStep.remove();
                    updateSteps();
                }
            };
        }
    }

    // Setup step click handlers and find currently selected step
    const steps = container.querySelectorAll('[data-step]');
    steps.forEach(stepContainer => {
        const circle = stepContainer.querySelector('.step-circle');
        
        // Check if this step is currently selected (has the primary color)
        if (circle && circle.style.backgroundColor.includes('--color-primary')) {
            selectedStep = stepContainer;
            stepContainer.classList.add('selected-step');
        }
        
        // Reattach click handler
        stepContainer.addEventListener('click', () => {
            setSelectedStep(stepContainer);
        });
    });

    // If no step is found to be selected, select the first one
    // if (!selectedStep && steps.length > 0) {
    //     selectedStep = steps[0];
    //     setSelectedStep(selectedStep);
    // }

    // Initial update
    // updateSteps();
    
    // Initial color swatch setup for selected element
    // if (selectedStep) {
    //     updateColorSwatches(selectedStep);
    // }
    }
};
