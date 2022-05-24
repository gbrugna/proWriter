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
        this.original = "";
        this.originalArray = "";
        this.currentWord = "";
        this.arrayDOM;
    }

    //Text.loadText(): loads text from backend and initializes Text variables, returning a promise when it has ended
    async loadText(){
        await fetch('/api/v1/texts/random')
        .then(res=>res.json())
        .then((res)=>{
            this.original = res.content;
            this.originalArray = this.original.split(' ');
            this.currentWord = new CurrentWord(this.originalArray[0]);
        })
        return new Promise((resolve, reject)=>{resolve("OK")});
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