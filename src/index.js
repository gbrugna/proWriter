const app = require('./app');
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');


const port = process.env.PORT;


const swaggerOptions = {
    openapi: '3.0.0',
    swaggerDefinition: {
        info: {
            title: 'proWriter API',
            version: '1.0.0',
            license: {
                name: 'GNU General Public License v3.0',
                url: 'https://www.gnu.org/licenses/gpl-3.0.en.html'
            },
            servers: [
                {
                    url: `https://localhost:${port}`,
                    description: 'development server'
                },
                {
                    url: 'https://prowriteralpha.herokuapp.com/',
                    description: 'production server'
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
console.dir(swaggerSpecs, {depth: null});
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

//Connection to database
app.locals.db = mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to database");
    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    });
})
.catch((e) => {
    console.log("Error in database connection", process.env.DB_URL)
});
