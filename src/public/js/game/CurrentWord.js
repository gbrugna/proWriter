/***************************************************************************************
 * CurrentWord class
 * Class istantiated into Text class as an attribute. It contains the state of the current word that is being typed.
 * Data:
 * - index: the index of the word in the original text
 * - isCorrect: boolean value that is updated when the word is wrong and when it's not
 * - nErrors: number of errors in the typed word. If it is zero when the word is complete, then the word is correct
 * - len: length of the current word
 * - word: the string of the current word
 ***************************************************************************************/

class CurrentWord {
    constructor(firstWord) {
        this.index = 0;
        this.isCorrect = true;
        this.len = firstWord.length;
        this.word = firstWord;
    }

    //CurrentWord.getHTMLElement(): returns the HTML Element corresponding to the word that is being currently edited
    getHTMLElement() {
        return text.arrayDOM[this.index];
    }

    //CurrentWord.checkCorrectness(): returns true if the typed word is correct. False otherwise
    checkCorrectness(wordInserted) {
        this.isCorrect = (wordInserted === this.word);

        this.updateColor();

        return this.isCorrect;
    }

    //CurrentWord.updateColor(): uses the value of CurrentWord.isCorrect in order to update the color of the currentWord (that has just been finalized by pressing space)
    updateColor() {
        let currentWordHTML = this.getHTMLElement();
        if (this.isCorrect) currentWordHTML.classList.add('correctWord'); else currentWordHTML.classList.add('incorrectWord');
    }
}