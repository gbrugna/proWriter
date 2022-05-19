class Text {
    constructor() {
        //carica testo dal db
        this.original = "Testo di prova";
        this.originalArray = this.original.split(' ');
        this.currentWord = new CurrentWord(this.originalArray[0]);
        this.arrayDOM;
    }

    formatOriginalText() {
        let output = '';
        this.originalArray.forEach(word => output += `<span class="word">${word}</span> `);
        return output;
    }

    readArrayDOM() {
        this.arrayDOM = document.getElementsByClassName('word');
        this.arrayDOM[0].classList.add("currentWord"); //focus on the first word
    }

    nextWord() {
        this.currentWord.index++;
        this.currentWord.currentCharIndex = 0;
        this.currentWord.nErrors = 0;
        this.currentWord.isCorrect = true;
        this.currentWord.len = this.originalArray[this.currentWord.index].length;
        this.currentWord.word = this.originalArray[this.currentWord.index];
        this.arrayDOM[this.currentWord.index].classList.add("currentWord"); //focus on the i-th word
    }

    lastWord() {
        return text.currentWord.index == text.originalArray.length - 1;
    }

    firstWord() {
        return text.currentWord.index == 0;
    }
}