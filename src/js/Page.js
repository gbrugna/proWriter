class Page {
    constructor() {
        this.textField = new TextField();
        this.originalTextDiv = document.querySelector('#originalText');        
    }

    printOriginalText() {
        this.originalTextDiv.innerHTML = text.formatOriginalText();
    }

    gameOver(){
        this.textField.removeFromDOM();
    }
}
