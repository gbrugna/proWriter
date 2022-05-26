require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT;

const textsRouter = require('./routes/texts');

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
