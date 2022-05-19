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
        this.originalTextDiv = document.querySelector('#originalText');        
    }

    //Page.printOriginalText(): inserts the text into the originalTextDiv. The text has already been formatted by Text.formatOriginalText
    //so that it already has words separated into different HTMLElements labeled with the class "word" 
    printOriginalText() {
        this.originalTextDiv.innerHTML = text.formatOriginalText();
    }

    //Page.gameOver(): manages the edits to the UI that must be done at the end of the game
    gameOver(){
        this.textField.removeFromDOM();
        //show results
        //...
    }
}
