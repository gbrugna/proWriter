loadAdministrator();

function loadAdministrator() {
    if (!checkAdministrator()) {
        //It's not an administrator -> hide the "Administrator" tab
        document.getElementsByClassName("tab")[0].classList.add("width50percent");
        document.getElementsByClassName("tab")[1].classList.add("width50percent");
        document.getElementsByClassName("tab")[2].classList.add("invisible");
    } else {
        //Administrator -> show the "Administrator" tab
    }
}

function checkAdministrator() {
    //TODO
    return true; //true of false
}

function text(action) {
    if (action == "add") {
        document.getElementById("add-text-container").classList.remove("invisible");
        document.getElementById("tab-container").classList.add("invisible");
    } else if (action == "remove") {
        document.getElementById("remove-text-container").classList.remove("invisible");
        document.getElementById("tab-container").classList.add("invisible");
    }
}

function cancel(action) {
    if (action == "add") {
        document.getElementById("add-text-container").classList.add("invisible");
    } else if (action == "remove") {
        document.getElementById("remove-text-container").classList.add("invisible");
    }
    document.getElementById("tab-container").classList.remove("invisible");
}

function hide(action) {
    cancel(action);
}

function toServer(action) {
    //TODO
    if (action == "add") {
        let textToAdd = document.getElementById("text-to-add").value;
        console.log(textToAdd);
        //add text to server -> check if it's an administrator before
    } else if (action == "remove") {
        let textToRemove = document.getElementById("text-to-remove").value;
        console.log(textToRemove);
        //remove text from server -> check if it's an administrator before
    }
    hide(action);
}