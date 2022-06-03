const md5 = require('md5');

function getGravatarURL(email) {
    return `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}`;
}

module.exports = getGravatarURL;