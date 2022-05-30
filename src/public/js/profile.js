loadAdministrator();

async function loadAdministrator() {
    if (await checkAdministrator() == false) {
        //It's not an administrator -> hide the "Administrator" tab
        document.getElementsByClassName("tab")[0].classList.add("width50percent");
        document.getElementsByClassName("tab")[1].classList.add("width50percent");
        document.getElementsByClassName("tab")[2].classList.add("invisible");
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
            console.log(textToAdd);

            const response = await fetch('/api/v1/admin/addText', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({content: textToAdd})
            }).catch(error => console.error(error));
        
            const body = await response.json();
            if(body.state == 'success') {
                console.log('success!');
                //TODO: tell admin the outcome of the insertion via the UI
            } else {
                console.log('fail!');
                //TODO: tell admin the outcome of the insertion via the UI
            }

        } else if (action == "remove") {
            let textToRemove = document.getElementById("text-to-remove").value;
            console.log(textToRemove);
            //remove text from server -> check if it's an administrator before server-side
        }
    }
    hide(action);
}