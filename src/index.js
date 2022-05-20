let express = require('express');
let app = express();

const port = 3000;

//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('./swagger.json');
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Delivering static content
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.sendFile('index.html', {root: __dirname + "/public"});
})

app.get('/game', (req,res)=>{
    res.sendFile('game.html', {root: __dirname + "/public"});
})


// this will be the subsituted by the data returned by the database
const texts = [{id:1,content:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fames ac turpis egestas integer eget aliquet nibh praesent tristique. Euismod quis viverra nibh cras pulvinar. Eu sem integer vitae justo eget. Sed pulvinar proin gravida hendrerit. Et pharetra pharetra massa massa ultricies mi. Faucibus interdum posuere lorem ipsum dolor sit. Orci eu lobortis elementum nibh. Facilisis leo vel fringilla est ullamcorper eget nulla facilisi etiam. Orci phasellus egestas tellus rutrum tellus. Lectus magna fringilla urna porttitor rhoncus dolor purus. "},{id:2,content:"Quel ramo del lago di Como, che volge a mezzogiorno, tra due catene non interrotte di monti, tutte a seni e a golfi, a seconda dello sporgere e del rientrare di quelli, vien, quasi a un tratto, a ristringersi, e a prender corso e figura di fiume, tra un promontorio a destra, e un’ampia costiera dall’altra parte; e il ponte, che ivi congiunge le due rive, par che renda ancor più sensibile all’occhio questa trasformazione, e segni il punto in cui il lago cessa, e l’Adda rincomincia, per ripigliar poi nome di lago dove le rive, allontanandosi di nuovo, lascian l’acqua distendersi e rallentarsi in nuovi golfi e in nuovi seni. "}];

// API
app.get('/v1/texts', (req, res)=>{
    res.json(texts);
});

//DA VALUTARE
app.get('/v1/texts/random', (req, res)=>{
    res.json(texts[Math.floor(Math.random()*texts.length)]);
});

app.get('/v1/texts/:id', (req, res)=>{
    const {id} = req.params;
    res.json(texts.find((text) => text.id === Number(id)));
});

app.post('/v1/texts/:id', (req, res)=>{

});

app.delete('/v1/texts/:id', (req, res)=>{

});

app.listen(port, ()=>{console.log(`Listening on port ${port}`)});