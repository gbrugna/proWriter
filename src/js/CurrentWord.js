class CurrentWord {
    constructor() {
        this.index = 0;
        this.isCorrect = true;
        this.nextCharacterIndex = 0;
        this.nErrors = 0;
    }

    getCurrentWordHTML() {
        return document.getElementById(`word${this.index}`);
    }

    updateColor() {
        let currentWordHTML = this.getCurrentWordHTML();
        if (this.isCorrect)
            currentWordHTML.classList.add('correctWord');
        else
            currentWordHTML.classList.add('incorrectWord');
    }

    nextWord() {
        this.index++;
        this.nextCharacterIndex = 0;
        this.nErrors = 0;
        this.isCorrect = true;
    }
}