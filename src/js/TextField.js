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

    applyBackspace() {
        let input = this.read();
        this.textField.value = input.substring(0, input.length - 1);
    }

}