require("dotenv").config();
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const md5 = require('md5')

const isAdmin = require('../scripts/isAdmin');
const getGravatarURL = require('../scripts/getGravatarURL');
const validateEmail = require('../scripts/validateEmail');
const authenticateToken = require('../scripts/authenticateToken');


/**
 * @swagger
 * /api/v1/user/signup:
 *  post:
 *      tags: [user, authentication]
 *      summary: create a new user
 *      description: the user is created after a bunch of checks over the submitted data (email already present in the database, valid email address, password length). An JWT access token is returned and saved as a cookie to keep the user logged.
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                          username:
 *                              type: string
 *      responses:
 *          '409':
 *              description: 'email already in use: duplicate user'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '400':
 *              description: 'invalid data: invalid email address or password too short'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '500':
 *              description: 'database error'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '201':
 *              description: 'user successfully created'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *                              accessToken:
 *                                  type: string
 * 
 */
router.post('/signup', async (req, res) => {

    //checking that the user doesn't already exist 
    const duplicateUser = await User.findOne({ 'email': req.body.email });
    if (duplicateUser != null) {
        return res.status(409).json({ state: 'email-already-in-use' });
    }

    //checking whether the email is valid
    if (!validateEmail(req.body.email)) {
        return res.status(400).json({ state: 'invalid-email' });
    }

    //checking whether the password is at least 8 characters long
    if (req.body.password.length < 8) {
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
        precision: undefined
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

    res.cookie('auth', accessToken);
    return res.status(201).json({ state: 'successful', accessToken: accessToken });
})


/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *      tags: [user, authentication]
 *      summary: log into an existing user
 *      description: the user is logged in after validation of his username and password. A JWT token is returned and saved as a cookie to keep the user logged in.
 *      requestBody:
 *          required: true
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          '404':
 *              description: 'email not found'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '400':
 *              description: 'invalid data: invalid email address or password too short'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '401':
 *              description: 'wrong password: failed authentication'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '200':
 *              description: 'user logged in'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 * 
 */
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
    res.cookie('auth', accessToken)
    res.status(200).json({ state: 'successful' })
})

/**
 * @swagger
 * /api/v1/user/me:
 *  get:
 *      tags: [user]
 *      summary: retrieve logged user information
 *      description: logged user information is retrieved from the database after authentication of his token. User data is returned as an object.
 *      parameters:
 *          - in: cookie
 *            name: auth
 *            schema:
 *              type: string
 *      responses:
 *          '401':
 *              description: 'no token provided'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '403':
 *              description: 'invalid token'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '200':
 *              description: 'user information'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              user_info:
 *                                  type: object
 *                                  properties:
 *                                      email:
 *                                          type: string
 *                                      username:
 *                                          type: string
 *                                      average_wpm:
 *                                          type: number
 *                                      races_count:    
 *                                          type: number
 *                                      precision:
 *                                          type: number
 *                                      avatar:
 *                                          type: string
 * 
 */

//get the user from the session cookie. Used to load personal account
router.get('/me', authenticateToken, async (req, res) => {
    let user = await User.findOne({ email: req.data.email });
    res.status(200).json({ user_info: { email: user.email, username: user.username, average_wpm: user.average_wpm, races_count: user.races_count, precision: user.precision, avatar: getGravatarURL(user.email) } });
});


/**
 * @swagger
 * /api/v1/user/verifyAdmin:
 *  get:
 *      tags: [user, authorization]
 *      summary: check if the user is an admin
 *      description: the api authenticate the user and then authorizes him if he is an admin.
 *      parameters:
 *          - in: cookie
 *            name: auth
 *            schema:
 *              type: string
 *      responses:
 *          '401':
 *              description: 'no token provided'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '403':
 *              description: 'invalid token OR user is not an administrator, so he is unauthorized'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '200':
 *              description: 'the current logged user is an administrator'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string

 * 
 */
router.get('/verifyAdmin', authenticateToken, isAdmin, async (req, res) => {
    res.status(200).json({ state: true });
});

/**
 * @swagger
 * /api/v1/user/score:
 *  put:
 *      tags: [user]
 *      summary: update the user's score with his last game
 *      description: the user is authenticated and his score is updated with the last game's score.
 *      parameters:
 *          - in: cookie
 *            name: auth
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          wpm:
 *                              type: number
 *                          precision:
 *                              type: number
 *      responses:
 *          '401':
 *              description: 'no token provided'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '403':
 *              description: 'invalid token'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '200':
 *              description: 'the score was successfully updated'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 * 
 */
router.put('/score', authenticateToken, async (req, res) => {
    const user = await User.findOne({ 'email': req.data.email })
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

    res.status(200).json({ state: 'success' });
})



//get a single user from their email address
router.get('/:email', authenticateToken, async (req, res) => {
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
router.get('/search/:username', authenticateToken, async (req, res) => {
    let retlist = [];
    let myUserid = "";
    let origin = await User.findOne({email: req.data.email});
    myUserid = origin._id.toString();
    let users = await User.find({username: {$regex: req.params.username, $options: 'ix'}})
        .then(users => {
            let tempFollowingList = [];
            try {
                for (id of origin.followingList) {
                    tempFollowingList.push(id.toString());
                    //console.log(id.toString())
                }
                for (user of users) {
                    //for all users found in the researching

                    if (user._id.toString() !== myUserid) {
                        let alreadyFriend = false;
                        //check if it's already a friend
                        //console.log("To compare: " + user._id.toString());
                        alreadyFriend = tempFollowingList.includes(user._id.toString());

                        let userToReturn = {};
                        userToReturn["_id"] = user._id;
                        userToReturn["username"] = user.username;
                        userToReturn["emailMD5"] = md5(user.email);
                        userToReturn["friend"] = alreadyFriend;
                        userToReturn["average_wpm"] = 0;
                        if (user.average_wpm !== undefined) userToReturn["average_wpm"] = user.average_wpm;
                        userToReturn["races_count"] = 0;
                        if (user.races_count !== undefined) userToReturn["races_count"] = user.races_count;
                        userToReturn["precision"] = 0;
                        if (user.precision !== undefined) userToReturn["precision"] = user.precision;
                        //console.log(userToReturn);
                        retlist.push(userToReturn);
                    }
                }
            } catch (e) {
                console.log("Exception: " + e);
            }
        });
    res.status(200).json({searchingList: retlist});
});

//get the list of people that the user is following
router.get('/following/all', authenticateToken, async (req, res) => {
    let user = await User.findOne({email: req.data.email});

    let retlist = [];
    if (user.followingList != null) {
        for (follower of user.followingList) {
            let user = await User.findOne({_id: follower})
                .then(user => {
                    //console.log(user);
                    let userToReturn = {};
                    userToReturn["_id"] = user._id;
                    userToReturn["username"] = user.username;
                    userToReturn["emailMD5"] = md5(user.email);
                    userToReturn["friend"] = true; //it's in the following list, so it's a friend
                    userToReturn["average_wpm"] = 0;
                    if (user.average_wpm !== undefined) userToReturn["average_wpm"] = user.average_wpm;
                    userToReturn["races_count"] = 0;
                    if (user.races_count !== undefined) userToReturn["races_count"] = user.races_count;
                    userToReturn["precision"] = 0;
                    if (user.precision !== undefined) userToReturn["precision"] = user.precision;
                    retlist.push(userToReturn);
                });
        }
    }

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
        $addToSet: {followingList: user._id}
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