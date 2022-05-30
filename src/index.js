require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const port = process.env.PORT;

const textsRouter = require('./routes/texts');
const userRouter = require('./routes/users');
const adminRouter = require('./routes/admins');

// Parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Delivering static content
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname + "/public" });
})

app.get('/game', (req, res) => {
    res.sendFile('game.html', { root: __dirname + "/public" });
})

app.get('/login', (req, res) => {
    //checking whether the user has already logged in
    var token = req.cookies.auth
    if (token != null) {
        //making sure that the token contained in the cookie was not tampered with
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
            if (err) return res.status(403).json({message: 'invalid token'})
            req.data = decodedData  //at this point we know for sure that the information contained in data is valid
        })
        var currentEmail = req.data.email
        res.json({login: 'already logged in as ' + currentEmail})
        return;
    }
    res.sendFile('login.html', { root: __dirname + "/public" });
})

app.get('/account', (req, res) => {
    res.sendFile('profile.html', { root: __dirname + "/public" });
})

app.get('/friends', (req, res) => {
    res.sendFile('friends.html', { root: __dirname + "/public" });
})

app.get('/admin', (req, res) => {
    res.sendFile('administrator.html', { root: __dirname + "/public" });
})

//Resources routing
app.use('/api/v1/texts', textsRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);

//Connection to database
app.locals.db = mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to database");
    app.listen(port, () => { console.log(`Listening on port ${port}`) });
})
    .catch((e) => { console.log("Error in database connection", process.env.DB_URL) });
