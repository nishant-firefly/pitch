/**
 * ASM Debug output displays all errors currently in the ASM debug service
 */
class ASMDebugOutput extends HTMLElement {
    constructor() {
        super();
    }

    // The HTML element that contains the error list.  This is a ul created on initialization
    _errorListEl;

    _errorList = [];

    /** Custom Component Lifecycle Hooks **/

    connectedCallback() {
        var me = this;

        ASM.DebugService.listen(function(eventType, errorItem){
            switch (eventType) {
                case ASM.DebugService.ErrorTypes.errorAdded:
                    me.onErrorAdded(errorItem);
                    break;
                case ASM.DebugService.ErrorTypes.errorCleared:
                    me.onErrorCleared(errorItem);
                    break;
            }
        });

        this._errorListEl = document.createElement('ul');
        this._errorListEl.classList.add('asm-error-list');
        this.appendChild(this._errorListEl);
    }


    /**
     * Event fired when an error item is added to render a list object
     * @param errorItem
     */
    onErrorAdded(errorItem) {
        if (ASM.DebugService.isDebug()) {
            errorItem.errorEl = document.createElement('li');
            errorItem.errorEl.classList.add('asm-error-item');
            errorItem.errorEl.innerText = errorItem.message;
            this._errorListEl.appendChild(errorItem.errorEl);

            this._errorListEl.classList.add('has-error');
        }
    }


    /**
     * Event fired when an error item is removed to render a list object
     * @param errorItem
     */
    onErrorCleared(errorItem) {
        if (ASM.DebugService.isDebug()) {
            this._errorListEl.removeChild(errorItem.errorEl);

            if (!DebugService.getErrorList().length) {
                this._errorListEl.classList.remove('has-error');
            }
        }
    }

    /**
     * Refresh the list of error from the debug service with the errors in the dom
     */
    refresh() {
        var rawErrorList = ASM.DebugService.getErrorList();

    }

    disconnectedCallback() {
        console.log("asm-debug-output disconnected from page");
    }

    adoptedCallback() {
        console.log("asm-debug-output adopted in page");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("asm-debug-output attr: " + name + " changed from '"
            + oldValue + "' to '" + newValue + "'");
    }

}

customElements.define("asm-debug-output", ASMDebugOutput);