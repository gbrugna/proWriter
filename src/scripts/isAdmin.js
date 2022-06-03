const jwt = require('jsonwebtoken');
const User = require('../models/user');


async function isAdmin(req, res, next) {
    const token = req.cookies.auth;
    if (token == null)
        return res.status(200).json({ state: 'false' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
        if (err) return res.status(200).json({ state: 'false' });
        req.data = decodedData;
    });

    let administrator = await User.findOne({ email: req.data.email });
    if (administrator == null || administrator.admin != 'true')
        return res.status(200).json({ state: 'false' });

    next();
}

module.exports = isAdmin;