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
        this.counter = null;

        this.correctWords = 0;
        this.wrongWords = 0;
    }

    setCounter(counter) {
        this.counter = counter;
    }

    //Text.loadText(): loads text from backend and initializes Text variables, returning a promise when it has ended
    async loadText(){
        let res = await fetch('/api/v1/texts/random');
        if (res.status == 404){
            // if there are no texts available we launch a rejected promise. This allows to manage DOM manipulation in the catch block in the init.js file
            return new Promise((resolve, reject)=>{reject("no texts available")});
        }
        else{
            res = await res.json();
            this.original = res.content;
            this.originalArray = this.original.split(' ');
            this.currentWord = new CurrentWord(this.originalArray[0]);
        }
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
        //new assignment
        this.currentWord.index++;
        this.currentWord.isCorrect = true;
        this.currentWord.len = this.originalArray[this.currentWord.index].length;
        this.currentWord.word = this.originalArray[this.currentWord.index];
        this.arrayDOM[this.currentWord.index].classList.add("currentWord"); //focus on the i-th word

        //set word per minute (wpm), but only if we are past one second (otherwise we get division by zero)
        if(this.counter.getTime()>0){
            score.wpm = parseInt((this.currentWord.index * 60) / (this.counter.getTime()));
            document.getElementById("wpm").innerText = score.wpm + " wpm";
        }
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
