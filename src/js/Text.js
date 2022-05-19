/***************************************************************************************
 * Text class
 * Data:
 * - original: text as retrieved from the DB 
 * - originalArray: text splitted into words 
 * - arrayDOM: array of DOM Elements containing the words 
 * - currentWord : current word object, initialized with the first word
 ***************************************************************************************/

class Text {
    constructor() {
        //carica testo dal db
        this.original = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fames ac turpis egestas integer eget aliquet nibh praesent tristique. Euismod quis viverra nibh cras pulvinar. Eu sem integer vitae justo eget. Sed pulvinar proin gravida hendrerit. Et pharetra pharetra massa massa ultricies mi. Faucibus interdum posuere lorem ipsum dolor sit. Orci eu lobortis elementum nibh. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi etiam. Orci phasellus egestas tellus rutrum tellus. Lectus magna fringilla urna porttitor rhoncus dolor purus.";
        this.originalArray = this.original.split(' ');
        this.currentWord = new CurrentWord(this.originalArray[0]);
        this.arrayDOM;
    }

    // Text.formatOriginalText(): generates HTML code that will be injected into the originalText DIV. It returns the text as a string.
    // Appending the text in the div is managed by the Page class, which manages the interactive fields on the page.
    formatOriginalText() {
        let output = '';
        this.originalArray.forEach(word => output += `<span class="word">${word}</span> `);
        return output;
    }

    // Text.readArrayDOM(): loads the array of HTML Elements containing the text's words on the page and saves them in the Text.arrayDOM attribute
    // basically it creates the array of HTML Elements corresponding to the array of words Text.originalArray.
    readArrayDOM() {
        this.arrayDOM = document.getElementsByClassName('word');
        this.arrayDOM[0].classList.add("currentWord"); //focus on the first word
    }

    // Text.nextWord(): changes the state of the CurrentWord object in order to represent the next word.
    nextWord() {
        this.currentWord.index++;
        this.currentWord.currentCharIndex = 0;
        this.currentWord.nErrors = 0;
        this.currentWord.isCorrect = true;
        this.currentWord.len = this.originalArray[this.currentWord.index].length;
        this.currentWord.word = this.originalArray[this.currentWord.index];
        this.arrayDOM[this.currentWord.index].classList.add("currentWord"); //focus on the i-th word
    }

    // Text.lastWord(): returns true if the current word is the last word, false otherwise.
    lastWord() {
        return text.currentWord.index === (text.originalArray.length - 1);
    }
    
    // Text.lastWord(): returns true if the current word is the first word, false otherwise.
    firstWord() {
        return text.currentWord.index === 0;
    }
}