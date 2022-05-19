class TextField{
    constructor(){
        this.textField =  document.querySelector('#inputField');

        this.textField.addEventListener('input', updateHandler);
        this.textField.addEventListener('keydown', backspaceHandler);
        this.clear();
    }

    clear() {
        this.textField.value = "";
    }

    read() {
        return this.textField.value;
    }

    len() {
        return this.read().length-1;
    }

    applyBackspace() {
        let input = this.read();
        this.textField.value = input.substring(0, input.length - 1);
    }

    spacePressed(){
        let input = this.read();
        return input[input.length - 1] == ' ';
    }

    currentChar(){
        return this.read()[text.currentWord.currentCharIndex];
    }

    removeFromDOM(){
        this.textField.remove();
    }

}