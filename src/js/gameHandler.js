function updateHandler() {
        
    let input = page.textField.read();
    
    if (input[input.length - 1] == ' ') {
        currentWord.updateColor();
        page.textField.clear();
        currentWord.nextWord();
    } else {
        if (text.originalArray[currentWord.index][currentWord.nextCharacterIndex] !== input[currentWord.nextCharacterIndex]) {
            currentWord.isCorrect = false;
            currentWord.nErrors++;
        } else if (currentWord.nErrors === 0)
            currentWord.isCorrect = true;

        currentWord.nextCharacterIndex++;
    }
} 


function backspaceHandler(e) {

    let input = page.textField.read();

    const key = event.key;
    if (key == "Backspace") {
        e.preventDefault();
        if (input[currentWord.nextCharacterIndex - 1] !== text.originalArray[currentWord.index][currentWord.nextCharacterIndex - 1] && currentWord.nErrors > 0) {
            currentWord.nErrors--;
            //console.log("Errore: ", input[currentCharacterIndex-1], "!==", originalTextArray[currentWord][currentCharacterIndex-1], input)
            //console.log(currentCharacterIndex);
        }

        page.textField.applyBackspace();
        currentWord.nextCharacterIndex--;
    }
}