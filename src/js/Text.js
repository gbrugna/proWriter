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
    }

    nextWord() {
        this.currentWord.index++;
        this.currentWord.currentCharIndex = 0;
        this.currentWord.nErrors = 0;
        this.currentWord.isCorrect = true;
        this.currentWord.len = this.originalArray[this.currentWord.index].length;
        this.currentWord.word = this.originalArray[this.currentWord.index];
    }

    lastWord() {
        return text.currentWord.index == text.originalArray.length - 1;
    }


}