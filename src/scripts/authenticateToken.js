const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    //getting the token out of the cookie    
    var token = req.cookies.auth
    if (token == null) return res.status(401).json({state: 'no token provided'})

    //verifying that the token was not tampered with
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
        if (err) return res.status(403).json({state: 'invalid token'})
        req.data = decodedData  //at this point we know for sure that the information contained in data is valid
        next()
    })
}


module.exports = authenticateToken;