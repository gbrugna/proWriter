loadAdministrator();

async function loadAdministrator() {
    if (await checkAdministrator() === true) {
        //It's an administrator -> show the "Administrator" tab
        document.getElementsByClassName("tab")[0].classList.add("width33percent");
        document.getElementsByClassName("tab")[1].classList.add("width33percent");
        document.getElementsByClassName("tab")[2].classList.add("width33percent");
        document.getElementsByClassName("tab")[2].classList.remove("invisible");
    }
}

async function checkAdministrator() {
    let res = await fetch('/api/v1/user/verifyAdmin')
        .catch(error => console.error(error))
        .then(res => res.json())
        .then(
            res => {
                return res.state === true;
            }
        );
}

async function logout() {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = '/';
}

async function search(text) {
    if (text.replaceAll(" ", "") !== "") getUserByUsername(text);
    else getAllFollowingUsers();
}

function getHTMLFriend(id, username, emailMD5, alreadyFriend = false) {
    let buttonAddOrRemove = "add-button";

    if (alreadyFriend) {
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
        '        <button class="generic dark ' + buttonAddOrRemove + '" onclick="followOrUnfollow(' + alreadyFriend + ', \'' + id + '\', this)"></button>' +
        '        <button class="generic dark details-button" onclick="location.href=\'\/account?userid=' + id + '\'"></button>' +
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
    })
        .then(res => res.json())
        .then(res => {
            document.getElementById("friends").innerHTML = "";
            for (let i = 0; i < res.length; i++) {
                document.getElementById("friends").innerHTML += getHTMLFriend(res[i]._id, res[i].username, res[i].emailMD5, res[i].friend);
            }

            if (res.length === 0) {
                document.getElementById("friends").innerHTML = '' +
                    '<div class="message-box text-align-center">' +
                    '    Nessun utente trovato con questa ricerca.' +
                    '</div>';
            }
            return res;
        });
}

//given an _id returns all parameters (except for password) in JSON format
//JSON contains all parameters
async function getUserByID(_id) {
    const response = await fetch("/api/v1/user/search/id/" + _id, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => res.json())
        .then(res => {
            //console.log(res);
            return res;
        });
}

function getAllFollowingUsers() {
    document.getElementById("search_friend").classList.add("invisible"); //disable searchbox during loading
    getFollowingList();
}

//get the list of all the people that the user is following
//return value is in JSON format, empty when no results were found, list of users otherwise
//important: JSON only contains _id
async function getFollowingList() {
    const response = await fetch('api/v1/user/following/all', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    })
        .then(res => res.json())
        .then(res => {
                if (document.getElementById("search_friend").classList.contains("invisible")) {
                    document.getElementById("search_friend").classList.remove("invisible"); //re-enable searchbox during loading
                }
                document.getElementById("friends").innerHTML = "";
                for (let i = 0; i < res.followingList.length; i++) {
                    document.getElementById("friends").innerHTML += getHTMLFriend(res.followingList[i]._id, res.followingList[i].username, res.followingList[i].emailMD5, true);
                }

                if (res.followingList.length === 0) {
                    document.getElementById("friends").innerHTML = '' +
                        '<div class="message-box text-align-center">' +
                        '    Non stai seguendo ancora nessun utente.' +
                        '</div>';
                }
                return res;
            }
        );
}

function followOrUnfollow(friend, id, element) {
    if (friend) unfollowUser(id, element);
    else followUser(id, element);
}

//add a user to the following list
//return true if the insertion was successful, false otherwise
async function followUser(_id, element) {
    const response = await fetch('/api/v1/user/following/add/' + _id, {
        method: 'POST',
        headers: {'Content-Type': 'application/JSON'}
    })
        .then(res => res.json)
        .then(res => {
            let valueToReturn = res.state.localeCompare("ok") === 0;
            if (valueToReturn) {
                //followed correctly, reset status of button to unfollow
                if (element.classList.contains("add-button")) {
                    element.classList.remove("add-button");
                }
                element.classList.add("remove-button");
                element.onclick = function () {
                    followOrUnfollow(true, _id, element);
                }
            }
            return valueToReturn;
        });
}

//remove a user from the following list
//returns true if the removal was successful, false otherwise
async function unfollowUser(_id, element) {
    const response = await fetch('/api/v1/user/following/remove/' + _id, {
        method: 'POST',
        headers: {'Content-Type': 'application/JSON'}
    }).then(res => res.json)
        .then(res => {
            let valueToReturn = res.state.localeCompare("ok") === 0;
            if (valueToReturn) {
                //unfollowed correctly, reset status of button to follow
                if (element.classList.contains("remove-button")) {
                    element.classList.remove("remove-button");
                }
                element.classList.add("add-button");
                element.onclick = function () {
                    followOrUnfollow(false, _id, element);
                }
            }
            return valueToReturn;
        });
}

//check whether the user is following _id
function isFollowing(followingList, _id) {
    followingList.forEach(element => {
        if (element._id === _id) {
            return true;
        }
    });
    return false;
}
