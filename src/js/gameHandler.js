function updateHandler(e) {
    let key = e.key;
    if (key === " ") {
        //space pressed
        if (page.textField.len() > 0) {
            if (text.currentWord.len !== page.textField.len()) text.currentWord.isCorrect = false;

            text.currentWord.checkCorrectness(page.textField.read());//pass the value without any space
            page.textField.clear();
            if (!text.lastWord()) {
                text.nextWord();
            } else {
                page.gameOver();
            }
        }
        if (key === " ") {
            //only the space have to be prevented
            e.preventDefault();
        }
    } else {
        text.currentWord.currentCharIndex++;
    }
}


function backspaceHandler(e) {
    const key = e.key;
    if (key == "Backspace") {
        text.currentWord.currentCharIndex--;
        e.preventDefault();
        if (text.currentWord.currentChar() !== page.textField.currentChar()) {
            text.currentWord.nErrors--;
        }
        page.textField.applyBackspace();
    }
}