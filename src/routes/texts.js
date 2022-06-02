const express = require('express');
const router = express.Router();
const Text = require('../models/text');
const Admin = require('../models/user');

router.get('/', async (req, res)=>{
    let texts = await Text.find({}).exec();

    texts = texts.map( t => {
        return {
            id: t._id,
            content : t.content
        }
    });

    res.json(texts);
});

router.get('/random', async (req, res)=>{
    const text = await Text.aggregate([{$sample: {size : 1}}]);
    res.json(text[0]);
});

/* router.get('/:id', (req, res)=>{
    const {id} = req.params;
    res.json(texts.find((text) => text.id === Number(id)));
}); */

router.post('/', async (req, res)=>{
    let text = new Text({
        content: req.body.content
    });

    // Criteri accettazione testo
    /* if () {
        res.status(400).json({ error: '' });
        return;
    } */
    
	text = await text.save();
    
    let textId = text.id;

    res.location("/api/v1/texts/" + textId).status(201).send();
});

router.delete('/:id', async (req, res)=>{
    let text = await Text.findById(req.params.id).exec();
    if (!text) {
        res.status(404).send()
        return;
    }
    await text.deleteOne()
    res.status(204).send()
});

async function isAdmin(req, res, next) {
    const token = req.cookies.auth;
    if (token == null)
        return res.status(200).json({ state: 'false' });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
        if (err) return res.status(200).json({ state: 'false' });
        req.data = decodedData;
    });

    let administrator = await Admin.findOne({ email: req.data.email });
    if (administrator == null || administrator.admin != 'true')
        return res.status(200).json({ state: 'false' });

    next();
}

module.exports = router;