function isLogged(){
    //let cookies = document.cookie.split(';');
    let logged = false;
    //obtain couples key value for the cookies
    /* cookies = cookies.map(cookie => {
        let element = cookie.split('=');
        if (element[0]=='auth') logged = true;
    }); */
    
    return document.cookie.includes('auth');
}

function toAccountOrLogin(){
    if(isLogged())
        window.location.href = '/account';
    else
        window.location.href = '/login';
}