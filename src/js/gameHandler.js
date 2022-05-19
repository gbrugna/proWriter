function updateHandler() {
    if (page.textField.spacePressed()) {
        if(text.currentWord.len !== page.textField.len())
            text.currentWord.isCorrect = false;
        text.currentWord.updateColor();
        page.textField.clear();
        text.nextWord();
    } else {
        if (text.currentWord.currentChar() !== page.textField.currentChar()) {
            text.currentWord.isCorrect = false;
            text.currentWord.nErrors++;
        } else if (text.currentWord.nErrors === 0)
            text.currentWord.isCorrect = true;

        text.currentWord.currentCharIndex++;
    }
} 


function backspaceHandler(e) {
    const key = e.key;
    if (key == "Backspace") {
        text.currentWord.currentCharIndex--;
        e.preventDefault();
        if ((text.currentWord.currentChar() !== page.textField.currentChar()) && text.currentWord.nErrors > 0) {
            text.currentWord.nErrors--;
        }

        page.textField.applyBackspace();
    }
}