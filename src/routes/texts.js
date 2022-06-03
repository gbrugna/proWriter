const express = require('express');
const router = express.Router();
const Text = require('../models/text');

const authenticateToken = require('../scripts/authenticateToken');
const isAdmin = require('../scripts/isAdmin');


router.get('/', authenticateToken, async (req, res)=>{
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


//add text to db
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    
    let text = new Text({
        content: req.body.content
    });

    text = await text.save().catch((e)=>{return res.status(500).json({ state: 'fail' });});
    
    let textId = text.id;
    return res.location("/api/v1/texts/" + textId).status(201).json({ state: 'success' });
})


router.delete('/:id', authenticateToken, isAdmin, async (req, res)=>{
    let text = await Text.findById(req.params.id).exec();
    if (!text) {
        res.status(404).send()
        return;
    }
    await text.deleteOne()
    res.status(204).send()
});

module.exports = router;