const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.me = function(req,res){
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, secret.secretToken);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        return decoded.id;
        
    }
    return res.send(500);
}
