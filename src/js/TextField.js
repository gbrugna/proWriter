class TextField {
    constructor() {
        this.textField = document.getElementById('inputField');

        this.textField.addEventListener('keydown', backspaceHandler);
        this.textField.addEventListener('keypress', updateHandler);
        this.clear();
    }

    clear() {
        this.textField.value = "";
    }

    read() {
        return this.textField.value;
    }

    len() {
        return this.read().length;
    }

    applyBackspace() {
        let input = this.read();
        this.textField.value = input.substring(0, input.length - 1);
    }

    currentChar() {
        return this.read()[text.currentWord.currentCharIndex];
    }

    removeFromDOM() {
        this.textField.remove();
    }
}