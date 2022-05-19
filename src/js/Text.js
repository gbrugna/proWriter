class Text {
    constructor() {
        //carica testo dal db
        this.original = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fames ac turpis egestas integer eget aliquet nibh praesent tristique. Euismod quis viverra nibh cras pulvinar. Eu sem integer vitae justo eget. Sed pulvinar proin gravida hendrerit. Et pharetra pharetra massa massa ultricies mi. Faucibus interdum posuere lorem ipsum dolor sit. Orci eu lobortis elementum nibh. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi etiam. Orci phasellus egestas tellus rutrum tellus. Lectus magna fringilla urna porttitor rhoncus dolor purus.";
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
        return text.currentWord.index === (text.originalArray.length - 1);
    }

    firstWord() {
        return text.currentWord.index === 0;
    }
}