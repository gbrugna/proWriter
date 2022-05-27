require("dotenv").config();
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')

//create a new user
router.post('/', async (req, res) => {
    try {
        //checking that the user doesn't already exist 
        const duplicateUser = await User.findOne({ 'email': req.body.email })
        if (duplicateUser != null) {
            res.json({ login: 'User already exists!' })
            return;
        }

        //checking whether the email is valid
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        const str = req.body.email
        if (!regexExp.test(str)) {
            res.json({ login: 'email not valid' })
            return;
        }

        //checking whether the password is at least 12 characters long
        if (req.body.password.length < 12) {
            res.send({ login: 'psw too short' })
            return;
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        let user = new User({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            average_wpm: undefined,
            races_count: 0,
            precision: undefined
        });

        insertedUser = await user.save();
        res.location("/api/v1/user/" + insertedUser.id).status(201);

        //creating jwt
        const userMail = req.body.email
        const jwtInfo = { email: userMail }

        const accessToken = jwt.sign(jwtInfo, process.env.ACCESS_TOKEN_SECRET)

        res.json({ login: 'successful', accessToken: accessToken })
    } catch {
        res.status(500).send()
    }
})

//login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ 'email': req.body.email })

    if (user == null) {
        return res.status(400).send('Cannot find user') //C'è un motivo particolare per 400 e non 404?
    }

    try {
        if (!await bcrypt.compare(req.body.password, user.password)) {
            return res.status(401).send('wrong password')
        }
    } catch {
        res.status(500).send()
    }   

    //creating jwt
    const userEmail = req.body.email
    const jwtInfo = { email: userEmail }    //information that is going to be decoded

    const accessToken = jwt.sign(jwtInfo, process.env.ACCESS_TOKEN_SECRET)

    //putting the token in the cookie
    res.cookie('auth', accessToken, {maxAge: 15000})
    res.json({ login: 'successful', accessToken: accessToken })
})

//get the list of all users (useful when displaying users' friends)
router.get('/', authenticateToken, async (req, res) => {
    //EXAMPLE: only the admin can obtain this info
    //console.log(req.data.email)
    //if (req.data.email.localeCompare("edmond@unitn.it")) {
        //return res.sendStatus(401).json({message: 'unauthorized'})
    //}
    let users = await User.find({}).exec()

    users = users.map(t => {
        return {
            email: t.email,
            password: t.password,
            username: t.username,
            average_wpm: t.average_wpm,
            races_count: t.races_count,
            precision: t.precision
        }
    })

    res.json(users);
})

router.post('/logout', (req,res) => {
    req.clearCookie("auth")
    res.sendFile('login.html')  //perhaps it is better to go back to the main page idk
})

//get a single user
router.get('/:email', async (req, res) => {
    let user = await User.findOne({ email: req.params.email })
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    res.json(user)
})

function authenticateToken(req, res, next) {
    //getting the token out of the cookie    
    var token = req.cookies.auth
    console.log(token)
    if (token == null) return res.sendStatus(401).json({message: 'no token provided'})

    //verifying that the token was not tampered with
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
        if (err) return res.status(403).json({message: 'invalid token'})
        req.data = decodedData  //at this point we know for sure that the information contained in data is valid
        next()
    })
}

module.exports = router;