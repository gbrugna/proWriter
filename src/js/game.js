/******
 * To be separated into more scripts
 * 
 */


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
        currentWordHTML = getCurrentWordHTML();
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


class Text {
    constructor() {
        //carica testo dal db
        this.original = "Testo di prova";
        this.originalArray = this.original.split(' ');
    }

    formatOriginalText() {
        let output = '';
        let i = 0;
        this.originalArray.forEach(word => {
            output += `<span id="word${i}">${word}</span> `;
            i++
        });
        return output;
    }
}

class Page {
    constructor() {
        this.textField = document.querySelector('#inputField');
        this.originalTextDiv = document.querySelector('#originalText');

        this.textField.addEventListener('input', this.updateHandler);
        this.textField.addEventListener('keydown', this.backspaceHandler);

        this.clearTextField();
    }

    clearTextField() {
        this.textField.value = "";
    }

    readTextField() {
        return this.textField.value;
    }

    applyBackspace() {
        this.textField.value = this.readTextField().substring(0, input.length - 1);
    }

    printOriginalText(originalText) {
        this.originalTextDiv.innerHTML = text.formatOriginalText();
    }

    updateHandler() {
        let input = this.readTextField();
        if (input[input.length - 1] == ' ') {
            currentWord.updateColor();
            this.clearTextField();
            currentWord.nextWord();
        } else {
            if (text.originalArray[currentWord][currentWord.nextCharacterIndex] !== input[currentWord.nextCharacterIndex]) {
                currentWord.isCorrect = false;
                currentWord.nErrors++;
            } else if (currentWord.nErrors === 0)
                currentWordCorrect = true;

            currentWord.nextCharacterIndex++;
        }
    }


    backspaceHandler(e) {

        let input = this.readTextField();

        const key = event.key;
        if (key == "Backspace") {
            e.preventDefault();
            if (input[currentWord.nextCharacterIndex - 1] !== text.originalArray[currentWord.index][currentWord.nextCharacterIndex - 1] && currentWord.nErrors > 0) {
                currentWord.nErrors--;
                //console.log("Errore: ", input[currentCharacterIndex-1], "!==", originalTextArray[currentWord][currentCharacterIndex-1], input)
                //console.log(currentCharacterIndex);
            }

            this.applyBackspace();
            currentWord.nextCharacterIndex--;
        }
    }
}



let currentWord = new CurrentWord();
let page = new Page();
let text = new Text();

page.printOriginalText();