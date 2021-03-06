loadAdministrator();

async function loadAdministrator() {
    if (await checkAdministrator()) {
        //It's an administrator -> show the "Administrator" tab
        document.getElementsByClassName("tab")[0].classList.add("width33percent");
        document.getElementsByClassName("tab")[1].classList.add("width33percent");
        document.getElementsByClassName("tab")[2].classList.add("width33percent");
        document.getElementsByClassName("tab")[2].classList.remove("invisible");
    }
}

async function checkAdministrator() {
    let res = await fetch('/api/v1/user/verifyAdmin');
    res = await res.json();
    return res.state == true;
}

async function logout() {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = '/';
}

async function search(text) {
    if (text.replaceAll(" ", "") !== "") getUserByUsername(text);
    else getAllFollowingUsers();
}

function getHTMLFriend(index, id, username, emailMD5, alreadyFriend = false, wpm, precision, numberGames) {
    let buttonAddOrRemove = "add-button dark";

    if (alreadyFriend) {
        //the user is already in the following list
        buttonAddOrRemove = "remove-button red";
    }

    return '' +
        '<div class="friend-item">' +
        '    <div class="grid-container grid-container-friend friend-item-username grid-container-friend-compressed">' +
        '        <div class="grid-item">' +
        '           <div class="user-pic-friend"' +
        '                style="background-image: url(\'https://www.gravatar.com/avatar/' + emailMD5 + '?s=500\')">' +
        '            </div>' +
        '        </div>' +
        '        <div class="grid-item">' +
        '            <div class="username-friend">' + username + '</div>' +
        '            <div class="stats invisible">' +
        '                <div class="data"><span class="label">Velocità media:</span>' +
        '                    <span class="wpm-friend">' + wpm.toFixed(2) + '</span> parole per minuto' +
        '                </div>' +
        '                <div class="data"><span class="label">Precisione:</span>' +
        '                    <span class="precision-friend">' + precision.toFixed(2) + '</span> %' +
        '                </div>' +
        '                <div class="data"><span class="label">Testi trascritti:</span>' +
        '                    <span class="numberOfGames-friend">' + numberGames + '</span>' +
        '                </div>' +
        '            </div>' +
        '        </div>' +
        '    </div>' +
        '    <div class="friend-item-buttons">' +
        '        <button class="generic ' + buttonAddOrRemove + '" onclick="followOrUnfollow(' + alreadyFriend + ', \'' + id + '\', this)"></button>' +
        '        <button class="generic dark details-button" onClick="showHideDetails(' + index + ')"></button>' +
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
            for (let i = 0; i < res.searchingList.length; i++) {
                document.getElementById("friends").innerHTML += getHTMLFriend(i, res.searchingList[i]._id, res.searchingList[i].username, res.searchingList[i].emailMD5, res.searchingList[i].friend, res.searchingList[i].average_wpm, res.searchingList[i].precision, res.searchingList[i].races_count);
            }

            if (res.searchingList.length === 0) {
                document.getElementById("friends").innerHTML = '' +
                    '<div class="message-box text-align-center">' +
                    '    Nessun utente trovato con questa ricerca.' +
                    '</div>';
            }
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
    const response = await fetch('api/v1/user/following', {
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
                    document.getElementById("friends").innerHTML += getHTMLFriend(i, res.followingList[i]._id, res.followingList[i].username, res.followingList[i].emailMD5, true, res.followingList[i].average_wpm, res.followingList[i].precision, res.followingList[i].races_count);
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
    const response = await fetch('/api/v1/user/following/' + _id, {
        method: 'PUT',
        headers: {'Content-Type': 'application/JSON'}
    })
        .then(res => {
            let valueToReturn = res.ok;
            if (valueToReturn) {
                //followed correctly, reset status of button to unfollow
                if (element.classList.contains("add-button")) {
                    element.classList.remove("add-button", "dark");
                }
                element.classList.add("remove-button", "red");
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
    const response = await fetch('/api/v1/user/following/' + _id, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/JSON'}
    })
        .then(res => {
            let valueToReturn = res.ok;
            if (valueToReturn) {
                //unfollowed correctly, reset status of button to follow
                if (element.classList.contains("remove-button")) {
                    element.classList.remove("remove-button", "red");
                }
                element.classList.add("add-button", "dark");
                element.onclick = function () {
                    followOrUnfollow(false, _id, element);
                }
            }
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

function showHideDetails(index) {
    if (document.getElementsByClassName("friend-item-username")[index].classList.contains("grid-container-friend-compressed")) {
        //shown -> so hide details
        document.getElementsByClassName("friend-item-username")[index].classList.remove("grid-container-friend-compressed");
        document.getElementsByClassName("stats")[index].classList.remove("invisible");
    } else {
        //hidden -> so show details
        document.getElementsByClassName("friend-item-username")[index].classList.add("grid-container-friend-compressed");
        document.getElementsByClassName("stats")[index].classList.add("invisible");
    }
}
