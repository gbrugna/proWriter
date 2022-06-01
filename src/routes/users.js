require("dotenv").config();
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const md5 = require('md5');

//create a new user
router.post('/signup', async (req, res) => {

    //checking that the user doesn't already exist 
    const duplicateUser = await User.findOne({ 'email': req.body.email });
    if (duplicateUser != null) {
        console.log("duplicate user!");
        return res.status(409).json({ state: 'email-already-in-use' });
    }

    //checking whether the email is valid
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    const str = req.body.email;
    if (!regexExp.test(str)) {
        console.log("invalid email");
        return res.status(400).json({ state: 'invalid-email' });
    }

    //checking whether the password is at least 12 characters long
    if (req.body.password.length < 8) {
        console.log("psw-too-short");
        return res.status(400).json({ state: 'psw-too-short' });
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
            return res.status(500).json({ state: 'db-error' });
        }
    });

    //creating jwt
    const userMail = req.body.email
    const jwtInfo = { email: userMail }

    const accessToken = jwt.sign(jwtInfo, process.env.ACCESS_TOKEN_SECRET);

    res.cookie('auth', accessToken);  // removed { maxAge: 60000 } so that the cookie lasts until the browser is closed or the user explicitly signs out
    return res.status(200).json({ state: 'successful', accessToken: accessToken });
})

//login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ 'email': req.body.email })

    if (user == null) {
        return res.status(404).json({ state: 'email-not-found' })
    }

    if (!await bcrypt.compare(req.body.password, user.password)) {
        return res.status(401).json({ state: 'wrong-psw' })
    }

    //creating jwt
    const userEmail = req.body.email
    const jwtInfo = { email: userEmail }    //information that is going to be decoded

    const accessToken = jwt.sign(jwtInfo, process.env.ACCESS_TOKEN_SECRET)

    //putting jwt in the cookie
    res.cookie('auth', accessToken) // removed { maxAge: 60000 } so that the cookie lasts until the browser is closed or the user explicitly signs out
    res.json({ state: 'successful' })
})

//get the list of all users (useful when displaying users' friends)
router.get('/', authenticateToken, async (req, res) => {
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

//get the user from the session cookie. Used to load personal account
router.get('/me', authenticateToken, async (req, res) => {
    let user = await User.findOne({ email: req.data.email });
    res.status(200).json({ user_info: { email: user.email, username: user.username, average_wpm: user.average_wpm, races_count: user.races_count, precision: user.precision, avatar: getGravatarURL(user.email) } });
});

//get a single user from their email address
router.get('/:email', async (req, res) => {
    let user = await User.findOne({ email: req.params.email })
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }
    return res.status(200).json({ user_info: { email: user.email, username: user.username, average_wpm: user.average_wpm, races_count: user.races_count, precision: user.precision } })
})

//get a single user from their username
router.get('/search/:username', async (req, res) => {
    let user = await User.find({ username: req.params.username }, '_id email username');
    if (user == null) {
        return res.status(200).json({});
    }
    return res.status(200).json(user);
})

//get the list of people that the user is following
router.get('/following/all', authenticateToken, async (req, res) => {
    let user = await User.findOne({ email: req.data.email });

    retList = [];
    user.followingList.forEach(async entry => {
        let followingUser = await User.findOne({ _id: entry }, '_id email username');
        retList.push(followingUser);
    });
    let user2 = await User.findOne({ _id: user.followingList[0] });
    return res.status(200).json(retList);
})

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

//add a new user to one's following list
router.post('/following/add/:_id', authenticateToken, async (req, res) => {
    const user = await User.findOne({ '_id': req.params._id }); //find user to add
    const filter = { email: req.data.email }; //set user document to modify

    const updateNewUser = {
        $push: { followingList: user._id }
    }
    try {
        const result = await User.updateOne(filter, updateNewUser);
    } catch (err) {
        console.log(err);
        res.status(409).json({ state: 'fail'});
    }
    res.status(200).json({ state: 'ok'});
})

router.post('/following/remove/:_id', authenticateToken, async (req, res) => {
    const filter = { email: req.data.email }; //set user document to modify

    console.log(req.data.email)
    console.log(req.params._id)
    const update = {
        $pull: { followingList: req.params._id }
    }
    
    try {
        const result = await User.updateOne(filter, update);
    } catch (err) {
        console.log(err);
        res.status(409).json({ state: 'fail'});
    }
    res.status(200).json({ state: 'ok'});
})


function authenticateToken(req, res, next) {
    //getting the token out of the cookie    
    var token = req.cookies.auth
    if (token == null) return res.status(401).json({ message: 'no token provided' })

    //verifying that the token was not tampered with
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
        if (err) return res.status(403).json({ message: 'invalid token' })
        req.data = decodedData  //at this point we know for sure that the information contained in data is valid
        next()
    })
}

//post a new race score
router.post('/score', authenticateToken, async (req, res) => {
    const user = await User.findOne({ 'email': req.data.email });

    const filter = { _id: user._id };

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

    res.json({ success: true });
})

function getGravatarURL(email) {
    return `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}`;
}

module.exports = router