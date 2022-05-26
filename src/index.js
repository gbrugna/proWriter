require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const port = process.env.PORT;

const textsRouter = require('./routes/texts');

const users = [] //local 'db'

//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Log incoming data
/* app.use((req,res,next) => {
    console.log(req.method + ' ' + req.url)
    next()
}) */

//signup and login requests

//get the list of all users
//app.get('/users', (req, res) => {
    //res.json(users)
//})

//create a new user
app.post('/users', async (req, res) => {
    try {
        //TODO: check that user doesnt already exist       
        //checking whether the email is valid
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        const str = req.body.email

        if(!regexExp.test(str)) {
            console.log("Not an email")
        } else {
            console.log("email ok")
        }

        console.log(req.body)

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //TODO: push new user in db
        const user = { email: req.body.email, password: hashedPassword}
        users.push(user)   //add user to the db (for the time being hardcoded)
    } catch {
        res.status(500).send()
    }
    res.sendFile('account_created.html', {root: __dirname + "/public"});
})


//login
app.post('/users/login', async (req, res) => {
    console.log(users)
    const user = users.find(user => user.email === req.body.email)
    if (user == null) {
        return res.status(400).send('Cannot find user')
    }

    try {
        if (!await bcrypt.compare(req.body.password, user.password)) {
            res.send('Not allowed')
        }
    } catch {
        res.status(500).send()
    }
    res.sendFile('login_successful.html', {root: __dirname + "/public"});
})


// Delivering static content
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.sendFile('index.html', {root: __dirname + "/public"});
})

app.get('/game', (req,res)=>{
    res.sendFile('game.html', {root: __dirname + "/public"});
})

app.get('/login', (req,res)=>{
    res.sendFile('login.html', {root: __dirname + "/public"});
})

app.get('/signup', (req,res)=>{
    res.sendFile('signup.html', {root: __dirname + "/public"});
})

//Resources routing
app.use('/api/v1/texts', textsRouter);

//Connection to database
app.locals.db = mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("Connected to database");
    app.listen(port, ()=>{console.log(`Listening on port ${port}`)});
})
.catch((e)=>{console.log("Error in database connection" , process.env.DB_URL)});
