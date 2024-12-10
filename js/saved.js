
// CUSTOM CODE EDITOR //////////////////// ////
// Dead for now
        // Select elements for the code editor functionality
        // this.codeEditorContainer = document.querySelector('.code-editor-container');
        // this.codeEditorToggle = document.querySelector('.code-editor-toggle');
        // this.codeEditor = document.querySelector('.code-editor');
        // this.previewBtn = document.querySelector('.preview-btn');
        // this.addBtn = document.querySelector('.add-btn');
        // this.selectedCanvas = document.querySelector('.phoneScrollCon');
    // Method to create a custom component from provided HTML code

    // this.initializeCodeEditor();
class SomethingFake {

    createCustomComponent(code) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = code.trim();
    return wrapper.firstChild || wrapper;
}

    initializeCodeEditor() {
        var self = this;

        // Toggle code editor visibility
        this.codeEditorToggle.addEventListener('click', function() {
            self.codeEditorContainer.classList.toggle('open');
        });

        this.previewBtn.addEventListener('click', function() {
            try {
                var code = self.codeEditor.value;
                var previewComponent = self.createCustomComponent(code);
                var wrappedComponent = self.wrapComponentInContainer(previewComponent, 'custom');
                self.selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
            } catch (error) {
                alert('Invalid HTML code. Please check your syntax.');
            }
        });

        this.addBtn.addEventListener('click', function() {
            try {
                var code = self.codeEditor.value;
                var customComponent = self.createCustomComponent(code);
                var wrappedComponent = self.wrapComponentInContainer(customComponent, 'custom');
                self.selectedCanvas.querySelector('.canvas-content').appendChild(wrappedComponent);
                self.codeEditor.value = ''; // Clear the editor
            } catch (error) {
                alert('Invalid HTML code. Please check your syntax.');
            }
        });
    }
}