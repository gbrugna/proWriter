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
        document.getElementById("go_home").hidden = true;
        document.getElementById("go_profile").hidden = true;
        document.getElementById("start_again").innerText = "Ripeti da capo";

        this.timer = new Counter();
        updateCounter(this.timer, false);
    }

    //Page.printOriginalText(): inserts the text into the originalTextDiv. The text has already been formatted by Text.formatOriginalText
    //so that it already has words separated into different HTMLElements labeled with the class "word" 
    printOriginalText() {
        console.log(text);
        this.originalTextDiv.innerHTML = text.formatOriginalText();
    }

    //Page.gameOver(): manages the edits to the UI that must be done at the end of the game
    gameOver() {
        this.textField.removeFromDOM();
        document.getElementById("go_home").hidden = false;
        document.getElementById("go_profile").hidden = false;
        document.getElementById("start_again").innerText = "Esercitati di nuovo";

        updateCounter(this.timer, true);
        //show results
        //...
    }
}
