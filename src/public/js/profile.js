loadAdministrator();

async function loadAdministrator() {
    if (await checkAdministrator() == true) {
        //It's not an administrator -> hide the "Administrator" tab
        document.getElementsByClassName("tab")[0].classList.add("width33percent");
        document.getElementsByClassName("tab")[1].classList.add("width33percent");
        document.getElementsByClassName("tab")[2].classList.add("width33percent");
        document.getElementsByClassName("tab")[2].classList.remove("invisible");
    }
}

async function checkAdministrator() {
    const response = await fetch('/api/v1/admin/verify', {
        method: 'POST',
    }).catch(error => console.error(error));

    const body = await response.json();
    return body.state == true;
}

function text(action) {
    if (action == "add") {
        document.getElementById("add-text-container").classList.remove("invisible");
        document.getElementById("tab-container").classList.add("invisible");
        document.getElementById("addBtn").classList.remove("invisible");
        document.getElementById("text-to-add").value = '';
        document.getElementById("outcomeAddText").classList.add("invisible");
    } else if (action == "remove") {
        document.getElementById("remove-text-container").classList.remove("invisible");
        document.getElementById("tab-container").classList.add("invisible");
    }
}

function cancel(action) {
    hide(action);
}

function hide(action) {
    if (action == "add") {
        document.getElementById("add-text-container").classList.add("invisible");
    } else if (action == "remove") {
        document.getElementById("remove-text-container").classList.add("invisible");
    }
    document.getElementById("tab-container").classList.remove("invisible");
}

async function toServer(action) {
    if (await checkAdministrator()) {
        //check if it's administrator before send request server-side
        if (action == "add") {
            let textToAdd = document.getElementById("text-to-add").value;

            if(textToAdd.length == 0){
                displayOutcome('Impossibile inserire un testo vuoto!');
                return;
            }
            const response = await fetch('/api/v1/admin/addText', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({content: textToAdd})
            }).catch(error => console.error(error));
            const body = await response.json();
            if(body.state == 'success'){
                displayOutcome('Testo aggiunto con successo', false);
                document.getElementById('addBtn').classList.add('invisible');
            }else
                displayOutcome('Il testo non è stato aggiunto');
        } else if (action == "remove") {
            let textToRemove = document.getElementById("text-to-remove").value;
            console.log(textToRemove);
            //remove text from server -> check if it's an administrator before server-side
        }
    }
    //hide(action);
}

function displayOutcome(message, error = true){
    let messageBox = document.getElementById('outcomeAddText');
    messageBox.innerText = message;
    messageBox.classList.remove('invisible');
    if(!error)
        messageBox.classList.add('success');
    else
    messageBox.classList.remove('success');
}

async function logout(){
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = '/';
}
