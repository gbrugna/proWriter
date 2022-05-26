function updateHandler(e) {
    const key = e.key;
    if (key === " ") {
        //space pressed
        if (page.textField.len() > 0) {
            if (text.currentWord.len !== page.textField.len()) text.currentWord.isCorrect = false;

            let correctness = text.currentWord.checkCorrectness(page.textField.read());//pass the value without any space

            if (correctness) text.correctWords++; else text.wrongWords++;

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
    } else if (key == "Backspace") {
        //backspace
        text.currentWord.currentCharIndex--;
        e.preventDefault();
        page.textField.applyBackspace();
    } else {
        text.currentWord.currentCharIndex++;
    }
}

function updateCounter(counter, stop) {
    if (stop) counter.stopTime();
    else counter.start();
    incrementCounter(counter);
}

function incrementCounter(counter) {
    //call increment method if it's not stopped
    if (!counter.stop) {
        setTimeout(function () {
            counter.increment();
            incrementCounter(counter);
        }, 1000);
    }
}