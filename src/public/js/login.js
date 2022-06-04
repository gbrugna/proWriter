let loginForm = document.getElementById("loginForm");
let signupForm = document.getElementById("signupForm");
let loginBtn = document.getElementById("loginButton");
let signupBtn = document.getElementById("signupButton");

function showLoginForm() {
    loginForm.classList.remove('invisible');
    signupForm.classList.add('invisible');
    loginBtn.classList.add('tab_selected');
    signupBtn.classList.remove('tab_selected');
}

function showSignUpForm() {
    loginForm.classList.add('invisible');
    signupForm.classList.remove('invisible');
    loginBtn.classList.remove('tab_selected');
    signupBtn.classList.add('tab_selected');
}

async function login() {
    let email = document.getElementById('loginEmail').value;
    let password = document.getElementById('loginPassword').value;

    const response = await fetch('/api/v1/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email, password: password})
    }).catch(error => console.error(error));

    const body = await response.json();
    if (body.state == "successful") {
        window.location.href = '/account';
    } else if (body.state == "wrong-psw") {
        displayOperationOutcome('Password errata', true, 'errorLogin', 3000);
    } else {
        displayOperationOutcome('Non esiste un account associato a questo indirizzo mail.', true, 'errorLogin', 3000);
    }
}

async function signup() {
    let email = document.getElementById('signupEmail').value;
    let password = document.getElementById('signupPassword').value;
    let username = document.getElementById('username').value;

    //checks that can be done client-side
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    if (!regexExp.test(email)) {
        displayOperationOutcome('Indirizzo email non valido', true, 'errorSignup', 3000);
        return;
    } else if (password.length < 8) {
        displayOperationOutcome('Inserire una password composta da almeno 8 caratteri', true, 'errorSignup', 3000);
        return;
    }

    const response = await fetch('/api/v1/user/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email, password: password, username: username})
    }).catch(error => console.error(error));


    const body = await response.json();
    //console.log(body.state);
    if (body.state == "successful") {
        //console.log("account-created!");
        window.location.href = '/account';
    } else if (body.state == "email-already-in-use") {
        //console.log("email-already-in-use");
        displayOperationOutcome('Esiste già un account con questo indirizzo email', true, 'errorSignup', 3000);
        /* } else if (body.state == "psw-too-short") {
            //console.log("psw-too-short"); Error managed on client-side
        } else if (body.state.localeCompare("invalid-email") == 0) {
            console.log("invalid-email"); */
    } else if (body.state.localeCompare("db-error") == 0) {
        displayOperationOutcome('Si è verificato un errore per cui ti chiediamo di contattare gli amministratori del sistema.', true, 'errorSignup', 3000);
        //console.log("db-error");
    }
}

showLoginForm();