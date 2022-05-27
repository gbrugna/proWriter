const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');

//create a new user
router.post('/', async (req, res) => {
    try {
        //checking that the user doesn't already exist 
        const duplicateUser = await User.findOne({ 'email': req.body.email })
        if (duplicateUser != null) {
            res.json({login: 'User already exists!'})
        }
        //checking whether the email is valid
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        const str = req.body.email

        if (!regexExp.test(str)) {
            console.log("Not an email")
        } else {
            console.log("email ok")
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
        res.json({ signup: 'successful' });
    } catch {
        res.status(500).send()
    }
    res.sendFile('profile.html', {root: __dirname + "/public"});
})


//login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ 'email': req.body.email })

    if (user == null) {
        return res.status(400).send('Cannot find user') //C'è un motivo particolare per 400 e non 404?
    }

    try {
        if (!await bcrypt.compare(req.body.password, user.password)) {
            res.send('Not allowed')
        }
    } catch {
        res.status(500).send()
    }
    //res.json({ login: 'successful' });
    res.sendFile('profile.html', {root: __dirname + "/public"});
})

//get the list of all users (useful when displaying users' friends)
router.get('/', async (req, res) => {
    let users = await User.find({}).exec()
    
    users = users.map( t=> {
        return {
            email : t.email,
            password : t.password,
            username : t.username,
            average_wpm : t.average_wpm,
            races_count : t.races_count,
            precision : t.precision
        }
    })

    res.json(users);
})

//get a single user
router.get('/:email', async (req,res) => {
    let user = await User.findOne({email : req.params.email})
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    res.json(user)
})

module.exports = router;