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
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({content: textToAdd})
            }).catch(error => console.error(error));

            const body = await response.json();
            if (body.state == 'success') {
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

async function logout() {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = '/';
}

async function search(text) {
    if (text.replaceAll(" ", "") != "") getUserByUsername(text);
}

function getHTMLFriend(id, username, emailMD5, alreadyFriend) {
    let buttonAddOrRemove = "";

    if (!alreadyFriend) {
        //the user is not in the following list
        buttonAddOrRemove = "add-button";
    } else {
        //the user is already in the following list
        buttonAddOrRemove = "remove-button";
    }

    return '' +
        '<div class="friend-item">' +
        '    <div class="friend-item-username">' +
        '        <div class="friend-pic" style="background-image: url(\"https://www.gravatar.com/avatar/' + emailMD5 + '?s=50\")">' +
        '        </div>' +
        '        <p id="usernameParagraph" class="friend-username">' + username + '</p>' +
        '    </div>' +
        '    <div class="friend-item-buttons">' +
        '        <button class="generic dark ' + buttonAddOrRemove + '" onclick="followUser(' + id + ')"></button>' +
        '        <button class="generic dark details-button" onclick="location.href=\"/account?userid=' + id + '\""></button>' +
        '    </div>' +
        '</div>';
}

//search the list of users that share the same username
//return value is in JSON format, empty when no results were found, list of users otherwise
//JSON contains username email and _id
async function getUserByUsername(username) {
    const response = await fetch("/api/v1/user/search/" + username, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    const body = await response.json();
    document.getElementById("friends").innerHTML = "";
    for (let i = 0; i < body.length; i++) {
        console.log(body[i]);
        document.getElementById("friends").innerHTML = "";
        document.getElementById("friends").innerHTML += getHTMLFriend(body[i].id, body[i].username, body[i].emailMD5, body[i].friend);
    }
    return body;
}

//given an _id returns the _id, email and username in JSON format
//JSON contains username email and _id
async function getUserByID(_id) {
    const response = await fetch("/api/v1/user/search/id/" + _id, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    const body = await response.json();
    return body;
}

//get the list of all the people that the user is following
//return value is in JSON format, empty when no results were found, list of users otherwise
//important: JSON only contains _id
async function getFollowingList() {
    const response = await fetch('api/v1/user/following/all', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });
    const body = await response.json();
    return body;
}

//add a user to the following list
//return true if the insertion was successful, false otherwise
async function followUser(_id) {
    const response = await fetch('/api/v1/user/following/add/' + _id, {
        method: 'POST',
        headers: {'Content-Type': 'application/JSON'}
    });

    const body = await response.json();
    return body.state.localeCompare("ok") == 0;
}

//remove a user from the following list
//returns true if the removal was successful, false otherwise
async function unfollowUser(_id) {
    const response = await fetch('/api/v1/user/following/remove/' + _id, {
        method: 'POST',
        headers: {'Content-Type': 'application/JSON'}
    });

    const body = await response.json();
    return body.state.localeCompare("ok") == 0;
}

//check whether the user is following _id
function isFollowing(followingList, _id) {
    followingList.forEach(element => {
        if (element._id == _id) {
            return true;
        }
    });
    return false;
}
