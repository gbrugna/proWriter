require("dotenv").config();
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const md5 = require('md5');
const mongoose = require('mongoose');

const isAdmin = require('../scripts/isAdmin');


//create a new user
router.post('/signup', async (req, res) => {

    //checking that the user doesn't already exist 
    const duplicateUser = await User.findOne({'email': req.body.email});
    if (duplicateUser != null) {
        return res.status(409).json({state: 'email-already-in-use'});
    }

    //checking whether the email is valid
    if (!validateEmail(req.body.email)) {
        return res.status(400).json({state: 'invalid-email'});
    }

    //checking whether the password is at least 12 characters long
    if (req.body.password.length < 8) {
        return res.status(400).json({state: 'psw-too-short'});
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let user = new User({
        email: req.body.email,
        password: hashedPassword,
        username: req.body.username,
        average_wpm: undefined,
        races_count: 0,
        precision: undefined,
        followingList: []
    });

    user.save(function (err, User) {
        if (err) {
            console.error(err);
            return res.status(500).json({state: 'db-error'});
        }
    });

    //creating jwt
    const userMail = req.body.email
    const jwtInfo = {email: userMail}

    const accessToken = jwt.sign(jwtInfo, process.env.ACCESS_TOKEN_SECRET);

    res.cookie('auth', accessToken);
    return res.status(200).json({state: 'successful', accessToken: accessToken});
})

//login
router.post('/login', async (req, res) => {
    const user = await User.findOne({'email': req.body.email})

    if (user == null) {
        return res.status(404).json({state: 'email-not-found'})
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(401).json({state: 'wrong-psw'})
    }

    //creating jwt
    const userEmail = req.body.email
    const jwtInfo = {email: userEmail}    //information that is going to be decoded

    const accessToken = jwt.sign(jwtInfo, process.env.ACCESS_TOKEN_SECRET)

    //putting jwt in the cookie
    res.cookie('auth', accessToken)
    res.json({state: 'successful'})
})

//get the user from the session cookie. Used to load personal account
router.get('/me', authenticateToken, async (req, res) => {
    let user = await User.findOne({email: req.data.email});
    res.status(200).json({
        user_info: {
            email: user.email,
            username: user.username,
            average_wpm: user.average_wpm,
            races_count: user.races_count,
            precision: user.precision,
            avatar: getGravatarURL(user.email)
        }
    });
});

//check if the user is an admin
router.get('/verifyAdmin', isAdmin, async (req, res) => {
    res.status(200).json({state: true});
});

//get a single user from it's email address
/* router.get('/:email', async (req, res) => {
    let user = await User.findOne({ email: req.params.email })
    if (user == null) {
        return res.status(400).json({status : 'Cannot find user'})
    }
    res.json({user_info : {email : user.email, username : user.username, average_wpm : user.average_wpm, races_count : user.races_count, precision : user.precision}})
}) */

//post a new race score
router.post('/score', authenticateToken, async (req, res) => {
    //adding new score to the db
    const user = await User.findOne({'email': req.data.email})
    const filter = {_id: user._id};

    if (user.races_count == 0) {
        const updateNewUser = {
            $set: {
                races_count: 1,
                average_wpm: req.body.wpm,
                precision: req.body.precision
            }
        }
        const result = await User.updateOne(filter, updateNewUser);
    } else {
        const updateOldUser = {
            $set: {
                races_count: user.races_count + 1,
                average_wpm: ((user.average_wpm * user.races_count) + req.body.wpm) / (user.races_count + 1),
                precision: ((user.precision * user.races_count) + req.body.precision) / (user.races_count + 1)
            },
        };
        const result = await User.updateOne(filter, updateOldUser);
    }

    res.json({success: true});
})

function getGravatarURL(email) {
    return `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}`;
}

function authenticateToken(req, res, next) {
    //getting the token out of the cookie    
    var token = req.cookies.auth
    if (token == null) return res.status(401).json({message: 'no token provided'})

    //verifying that the token was not tampered with
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
        if (err) return res.status(403).json({message: 'invalid token'})
        req.data = decodedData  //at this point we know for sure that the information contained in data is valid
        next()
    })
}

function validateEmail(str) {
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    return regexExp.test(str)
}

//get a single user from their email address
router.get('/:email', async (req, res) => {
    let user = await User.findOne({email: req.params.email})
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    return res.status(200).json({
        user_info: {
            email: user.email,
            username: user.username,
            average_wpm: user.average_wpm,
            races_count: user.races_count,
            precision: user.precision
        }
    })
})

//get a single user from their username
router.get('/search/:username', async (req, res) => {
    let user = await User.find({username: req.params.username}, '_id email username');
    if (user == null) {
        return res.status(200).json({});
    }
    return res.status(200).json(user);
})

//get the list of people that the user is following
router.get('/following/all', authenticateToken, async (req, res) => {
    let user = await User.findOne({email: req.data.email});

    retlist = [];
    for (follower of user.followingList)
        retlist.push(await User.findOne({_id: follower}, '_id email username'));

    res.status(200).json({followingList: retlist});
})

//get user info by id
router.get('/search/id/:_id', async (req, res) => {
    let user = await User.findOne({_id: req.params._id}, '_id email username average_wpm races_count precision');
    if (user == null) {
        return res.status(400).json({status: 'Cannot find user'})
    }
    return res.status(200).json(user);
})

-//add a new user to one's following list
router.post('/following/add/:_id', authenticateToken, async (req, res) => {
    const user = await User.findOne({'_id': req.params._id}); //find user to add
    const filter = {email: req.data.email}; //set user document to modify

    const updateNewUser = {
        $push: {followingList: user._id}
    }
    try {
        const result = await User.updateOne(filter, updateNewUser);
    } catch (err) {
        console.log(err);
        res.status(409).json({state: 'fail'});
    }
    res.status(200).json({state: 'ok'});
})

//remove a user to one's following list
router.post('/following/remove/:_id', authenticateToken, async (req, res) => {
    const filter = {email: req.data.email}; //set user document to modify
    var userIdToRemove = mongoose.Types.ObjectId(req.params._id);

    const update = {
        $pull: {followingList: userIdToRemove}
    }

    try {
        const result = await User.updateOne(filter, update);
    } catch (err) {
        console.log(err);
        res.status(409).json({state: 'fail'});
    }
    res.status(200).json({state: 'ok'});
})

module.exports = router