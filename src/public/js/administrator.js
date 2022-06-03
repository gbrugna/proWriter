function displayOutcome(message, error = true){
    let messageBox = document.getElementById('outcomeAddText');
    messageBox.innerText = message;
    messageBox.classList.remove('invisible');
    if(!error)
        messageBox.classList.add('success');
    else
    messageBox.classList.remove('success');
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
        loadTexts();
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

async function addText() {
    let textToAdd = document.getElementById("text-to-add").value;

    if(textToAdd.length == 0){
        displayOutcome('Impossibile inserire un testo vuoto!');
        return;
    }
    const response = await fetch('/api/v1/texts', {
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
}

async function loadTexts(){
    await fetch('/api/v1/texts/')
    .then(res => res.json())
    .then(res => {
        // clean the texts div so that texts can be retrieved and added from scratch
        // this is necessary because a new text could have been added from the "Aggiungi testo" tab
        // since the last texts retrieval
        if (res.length == 0) {
            document.getElementById("remove-text-container").innerHTML = '' +
            '<button class="generic red" onclick="cancel(\'remove\')">Indietro</button>' +
            '<p style="text-align: center;">Nessun testo presente.';
            return;
        }

        document.getElementById("remove-text-container").innerHTML = '' +
            '<div id="texts"></div>' +
            '<button class="generic red" onclick="cancel(\'remove\')">Indietro</button>';

        while(document.getElementById('texts').firstChild)
            document.getElementById('texts').removeChild(document.getElementById('texts').firstChild);
        
        // Render the UI element for the single text and add it to the texts div
        res.forEach(res => {
            let textItem = document.createElement('div');
            textItem.classList.add('text-item');
            textItem.id = res.id;
            textItem.innerHTML = '<p class="text">' + res.content + '</p>';

            let btn = document.createElement('button');
            btn.setAttribute('class','generic red remove-text-button text-item-buttons');
            
            let btnColumn = document.createElement('div');
            btnColumn.classList.add('text-btn-column');
            btn.setAttribute('onclick', `deleteText('${res.id}', this)`);
            btnColumn.appendChild(btn);
            textItem.appendChild(btnColumn);
            document.getElementById('texts').appendChild(textItem);
        });
    });
}

function deleteText(id, btn){
    btn.setAttribute('onclick', '');
    fetch(`/api/v1/texts/${id}`, {
        method : 'DELETE'
    })
    .then(res => {
        if (res.status == 204)
            deleteTextUI(id);
        else if(res.status == 404)
            console.log('Errore: testo non trovato'); 
    });
}

function deleteTextUI(id){
    document.getElementById(id).classList.add('fade-out');
    setTimeout(()=>{document.getElementById(id).remove()}, 500);
}