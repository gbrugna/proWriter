const express = require('express');
const router = express.Router();
const Text = require('../models/text');

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

module.exports = router;