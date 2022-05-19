class Page {
    constructor() {
        this.textField = new TextField();
        this.originalTextDiv = document.getElementById("originalText");
    }

    printOriginalText() {
        this.originalTextDiv.innerHTML = text.formatOriginalText();
    }

    gameOver() {
        this.textField.removeFromDOM();
    }
}
