const express = require('express');
const router = express.Router();
const Text = require('../models/text');
const Admin = require('../models/user');

const isAdmin = require('../scripts/isAdmin');

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


//add text to db
router.post('/', isAdmin, async (req, res) => {
    var text = new Text({
        content: req.body.content
    });

    text = await text.save(function (err, Text) {
        if (err) {
            console.error(err);
            return res.status(500).json({ state: 'fail' });
        }
    });

    let textId = text.id;
    return res.location("/api/v1/texts/" + textId).status(201).json({ state: 'success' });
})


router.delete('/:id', isAdmin, async (req, res)=>{
    let text = await Text.findById(req.params.id).exec();
    if (!text) {
        res.status(404).send()
        return;
    }
    await text.deleteOne()
    res.status(204).send()
});

module.exports = router;