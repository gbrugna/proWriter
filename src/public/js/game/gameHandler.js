function updateHandler(e) {
    const key = e.key;
    if (key === " " || key === "Enter") {
        //space pressed
        e.preventDefault();
        if (page.textField.len() > 0) {
            if (text.currentWord.len !== page.textField.len()) text.currentWord.isCorrect = false;

            let correctness = text.currentWord.checkCorrectness(page.textField.read()); //pass the value without any space

            if (correctness) text.correctWords++; else text.wrongWords++;

            page.textField.clear();
            if (!text.lastWord()) {
                text.nextWord();
            } else {
                page.gameOver();
                if (isLogged()) sendResults();
            }
        }
        if (text.currentWord.index === 1) page.textField.textField.removeAttribute('placeholder');  // remove the placeholder if it's the first word (so that we remove the "comincia a scrivere" text)
    } else if (key === "Backspace") {
        //backspace
        e.preventDefault();
        page.textField.applyBackspace();
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
        }, 1);
    }
}

// sends user's score to the backend via a POST HTTP request
async function sendResults() {
    const response = await fetch("/api/v1/user/score", {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({wpm: score.wpm, precision: score.precision})
    });

    const actualResponse = await response.json();
}