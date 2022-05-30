function addText() {
    //TODO
    //check if it's an administrator

}

function cancel(action) {
    hide(action);
}

function hide(action) {
    cancel(action);
    if (action == "add") {
        document.getElementById("add-text-container").classList.add("invisible");
    } else if (action == "remove") {
        document.getElementById("remove-text-container").classList.add("invisible");
    }
    document.getElementById("tab-container").classList.remove("invisible");
}

function toServer(action) {
    //TODO
    //check if it's administrator before send request server-side
    if (action == "add") {
        let textToAdd = document.getElementById("text-to-add").value;
        console.log("HELLLO AXOIS")
        const axios = require('axios');
        axios.post('/admin/text', {
            text: textToAdd
        })
        .then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        })

        //add text to server -> check if it's an administrator before server-side
    } else if (action == "remove") {
        let textToRemove = document.getElementById("text-to-remove").value;
        console.log(textToRemove);
        //remove text from server -> check if it's an administrator before server-side
    }
    hide(action);
}