require("dotenv").config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const Admin = require('../models/user');

//check if the user is an admin
router.post('/verify', async (req, res) => {
    const token = req.cookies.auth;
    if (token == null) {
        return res.status(200).json({state: 'false'});
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
        if (err) return res.status(200).json({state: 'false'});
        req.data = decodedData  //at this point we know for sure that the information contained in data is valid
    })

    let administrator = await Admin.findOne({ email: req.data.email });
    if (administrator == null) {
        return res.status(200).json({state: 'false'});
    } else {
        return res.status(200).json({state: administrator.admin == 'true'});
    }
});

module.exports = router;