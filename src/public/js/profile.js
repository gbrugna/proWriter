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
        console.log(textToAdd);
        //add text to server -> check if it's an administrator before server-side
    } else if (action == "remove") {
        let textToRemove = document.getElementById("text-to-remove").value;
        console.log(textToRemove);
        //remove text from server -> check if it's an administrator before server-side
    }
    hide(action);
}