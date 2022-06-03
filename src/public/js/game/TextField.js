/***************************************************************************************
 * TextField class
 * Represents the state of the field in which the user types.
 * It's instantiated in the Page class
 ***************************************************************************************/

class TextField {
    constructor() {
        this.textField = document.getElementById('inputField');
        this.textField.addEventListener('keypress', updateHandler);
        this.clear();
    }

    //TextField.clear(): cleans the value of the TextField on the webpage. Used to avoid remaining text in the field when refreshing.
    clear() {
        this.textField.value = "";
    }

    //TextField.read(): returns the text typed into the textField so far
    read() {
        return this.textField.value;
    }

    //TextField.len(): returns the len of the text inserted into the textField.
    //This function is used in order to compare the length of the textField and the original word
    //As this operation is executed after a space has been typed, the result is returned decremented by 1, in order to return
    //the length of the word and not the length of the word plus the space. 
    len() {
        return this.read().length;
    }

    //TextField.applyBackspace(): deletes the last character that was inserted in the field
    //Where? We need to compare the new char that is being deleted with the original one.
    //the deletion of the character can't happen as the user types backspace, as this would erase the character that we need 
    //to do the comparison. Because of this, the default behaviour of pressing backspace is prevented.
    //Anyway, after we are done with our comparison and correctness check we must execute the deletion of the character and here the 
    //function applyBackspace is useful.
    applyBackspace() {
        let input = this.read();
        this.textField.value = input.substring(0, input.length - 1);
    }

    //TextField.removeFromDOM(): removes the textField from the DOM. It is used when the game's over.
    removeFromDOM() {
        this.textField.remove();
    }
}

