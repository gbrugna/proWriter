let express = require('express');
let app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.use('/public', express.static('static'));

/**
 * @openapi
 * /:
 *   get:
 *      description: Welcome to prowriter!
 *      responses:
 *          200:
 *              description: returns a mysterious string
 */

app.get('/', function(req, res){
    res.send('Hello world');
});

app.delete('/text', (req, res)=>{
    res.send('Got a Delete request');
});

app.listen(5000, function(){
    console.log('Server running', 3000);
});