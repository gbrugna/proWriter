class CurrentWord {
    constructor(firstWord) {
        this.index = 0;
        this.isCorrect = true;
        this.currentCharIndex = 0;
        this.nErrors = 0;
        this.len = firstWord.length;
        this.word = firstWord;
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

    currentChar(){
        return this.word[this.currentCharIndex];
    }
}