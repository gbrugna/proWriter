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
    //removing multiple spaces, newline characters and spaces at the end
    let textToAdd = document.getElementById("text-to-add").value.replace(/(\r\n|\n|\r)/gm, " ").replace(/  +/g, ' ').trimEnd();
    if (textToAdd.split(' ').length < 10) {
        displayOutcome('Impossibile inserire un testo con meno di 10 parole!');
        return;
    }
    if (textToAdd.split(' ').length > 200) {
        displayOutcome('Impossibile inserire un testo con più di 200 parole!');
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
        displayOperationOutcome('Testo aggiunto con successo', false, 'outcomeAddText', 3000);
        document.getElementById('addBtn').classList.add('invisible');
        setTimeout(()=>{
            document.getElementById('addBtn').classList.remove('invisible');
            document.getElementById('text-to-add').value = '';
        }, 3000);
    }else
        displayOperationOutcome('Il testo non è stato aggiunto', true, 'outcomeAddText', 3000);
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