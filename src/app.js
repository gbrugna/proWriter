require("dotenv").config();
const express = require('express');
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const textsRouter = require('./routes/texts');
const userRouter = require('./routes/users');

// Parsing middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Delivering static content
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname + "/public"});
})

app.get('/game', (req, res) => {
    res.sendFile('game.html', {root: __dirname + "/public"});
})

app.get('/login', (req, res) => {
    //checking whether the user has already logged in
    var token = req.cookies.auth
    if (token != null) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
            if (!err) return res.status(303).redirect('/account');  //if the token is correct then we send the user to his account
        })
    }
    // else we let him log in
    res.sendFile('login.html', {root: __dirname + "/public"});
})

app.get('/account', (req, res) => {
    res.sendFile('profile.html', {root: __dirname + "/public"});
})

app.get('/friends', (req, res) => {
    res.sendFile('friends.html', {root: __dirname + "/public"});
})

app.get('/admin', (req, res) => {
    res.sendFile('administrator.html', {root: __dirname + "/public"});
})

//Resources routing
app.use('/api/v1/texts', textsRouter);
app.use('/api/v1/user', userRouter);

module.exports = app;