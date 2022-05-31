function isLogged(){
    return document.cookie.split('=')[0] == 'auth';
}

function toAccountOrLogin(){
    if(isLogged())
        window.location.href = '/account';
    else
        window.location.href = '/login';
}