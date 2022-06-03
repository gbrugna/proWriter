const jwt = require('jsonwebtoken');
const User = require('../models/user');


async function isAdmin(req, res, next) {
    let administrator = await User.findOne({ email: req.data.email });
    if (administrator == null || administrator.admin != 'true')
        return res.status(403).json({ state: 'false' });

    next();
}

module.exports = isAdmin;