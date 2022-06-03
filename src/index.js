require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const port = process.env.PORT;

const swaggerOptions = {
    openapi : '3.0.0',
    swaggerDefinition: {
        info: {
            title : 'proWriter API',
            version: '1.0.0',
            license: {
                name : 'GNU General Public License v3.0',
                url : 'https://www.gnu.org/licenses/gpl-3.0.en.html'
            },
            servers: [
                {
                    url : `https://localhost:${port}`,
                    description : 'development server'
                },
                {
                    url : 'https://prowriteralpha.herokuapp.com/',
                    description : 'production server'
                }
            ],
            description: 'Prowriter is a REST API application made with Express on the server-side, and vannilla javascript on the client-side.'
        },
        basePath: '/api/v1',
        tags: [
            {
                name: 'user',
                description: 'user authentication, authorization, social functions and user\'s score update'
            },
            {
                name: 'texts',
                description: 'add, retrieve and delete texts'
            }
        ]
    },
    apis: ['./routes/*js']
}

const swaggerSpecs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));



const textsRouter = require('./routes/texts');
const userRouter = require('./routes/users');

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
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
            if (!err) return res.status(303).redirect('/account');  //if the token is correct then we send the user to his account
        })
    }
    // else we let him log in
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

//Connection to database
app.locals.db = mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to database");
    app.listen(port, () => { console.log(`Listening on port ${port}`) });
})
.catch((e) => { console.log("Error in database connection", process.env.DB_URL) });
