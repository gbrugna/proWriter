/***************************************************************************************
 * Page class
 * contains the UI elements and manages them
 * Data:
 * - textField: TextField object, representing the state of the field in which the user types
 * - originalTextDiv: HTML Element where the original text is rendered.
 ***************************************************************************************/

class Page {
    constructor() {
        this.textField = new TextField();
        this.originalTextDiv = document.getElementById("originalText");
        document.getElementById("go_profile").hidden = true;
        document.getElementById("start_again").innerText = "Nuovo testo";

        this.timer = new Counter();
        updateCounter(this.timer, false);
        text.setCounter(this.timer);
    }

    //Page.printOriginalText(): inserts the text into the originalTextDiv. The text has already been formatted by Text.formatOriginalText
    //so that it already has words separated into different HTMLElements labeled with the class "word" 
    printOriginalText() {
        //console.log(text);
        this.originalTextDiv.innerHTML = text.formatOriginalText();
    }

    //Page.gameOver(): manages the edits to the UI that must be done at the end of the game
    gameOver() {
        this.textField.removeFromDOM();
        document.getElementById("go_profile").hidden = false;
        document.getElementById("start_again").innerText = "Esercitati di nuovo";

        document.getElementById("scoreBoard").classList.remove("invisible");
        let time = document.getElementById("timer").innerText;
        let totalWords = text.correctWords + text.wrongWords;
        let words = {
            "total": totalWords,
            "correct": {"percent": ((text.correctWords * 100) / totalWords), "number": text.correctWords},
            "wrong": {"percent": ((text.wrongWords * 100) / totalWords), "number": text.wrongWords}
        };

        score.precision = words["correct"]["percent"];
        document.getElementById("scoreCorrectWords").innerText = "Parole corrette: " + words["correct"]["number"] + "/" + words["total"] + " (" + words["correct"]["percent"].toFixed(1) + "%)";
        document.getElementById("scoreWrongWords").innerText = "Parole sbagliate: " + words["wrong"]["number"] + "/" + words["total"] + " (" + words["wrong"]["percent"].toFixed(1) + "%)";
        document.getElementById("scoreWordsPerMinute").innerText = "Velocità (parole al minuto): " + score.wpm + " wpm";
        document.getElementById("scoreTime").innerText = "Tempo impiegato: " + time;
        document.getElementById("inGamingScore").classList.add("invisible");

        updateCounter(this.timer, true);
    }
}
