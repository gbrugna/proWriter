function isLogged(){
    return document.cookie.split('=')[0] == 'auth';
}