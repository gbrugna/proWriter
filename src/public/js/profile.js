loadAdministrator();

async function loadAdministrator() {
    if (await checkAdministrator() == true) {
        //It's an administrator -> show the "Administrator" tab
        document.getElementsByClassName("tab")[0].classList.add("width33percent");
        document.getElementsByClassName("tab")[1].classList.add("width33percent");
        document.getElementsByClassName("tab")[2].classList.add("width33percent");
        document.getElementsByClassName("tab")[2].classList.remove("invisible");
    }
}

async function checkAdministrator() {
    let res = await fetch('/api/v1/user/verifyAdmin')
    .catch(error => console.error(error));
    
    res = await res.json();
    return res.state == true;
}

async function logout(){
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = '/';
}
