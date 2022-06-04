const express = require('express');
const router = express.Router();
const Text = require('../models/text');

const authenticateToken = require('../scripts/authenticateToken');
const isAdmin = require('../scripts/isAdmin');

/**
 * @swagger
 * /texts:
 *  get:
 *      tags: [texts]
 *      summary: retrieve all texts
 *      description: the use must be authenticated and is able to retrieve all the texts from the database with one call
 *      parameters:
 *          - in: cookie
 *            name: auth
 *            schema:
 *              type: string
 *      responses:
 *          '401':
 *              description: 'no token provided'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '403':
 *              description: 'invalid token'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '200':
 *              description: 'texts successfully retrieved'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: list
 */
router.get('/', authenticateToken, async (req, res) => {
    let texts = await Text.find({}).exec();

    texts = texts.map(t => {
        return {
            id: t._id,
            content: t.content
        }
    });


    res.status(200).json(texts);
});

/**
 * @swagger
 * /texts/random:
 *  get:
 *      tags: [texts]
 *      summary: retrieve one random text
 *      description: a random text from the database is returned as a string. Authentication ISN'T required for this API call, so that also an anonymous user can use the game.
 *      parameters:
 *      responses:
 *          '404':
 *              description: 'no texts available'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '200':
 *              description: 'text successfully retrieved'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 */
router.get('/random', async (req, res) => {
    const text = await Text.aggregate([{$sample: {size: 1}}]);
    if (!text[0])    //if text[0] is undefined
        res.status(404).json({state: 'no-texts-available'});
    else
        res.status(200).json(text[0]);
});

/**
 * @swagger
 * /texts:
 *  post:
 *      tags: [texts]
 *      summary: add a new text to the database
 *      description: a user authenticated and authorized as an administrator can add a text to the database. The text is sent in the body of the POST request.
 *      parameters:
 *          - in: cookie
 *            name: auth
 *            schema:
 *              type: string
 *      requestBody:
 *          description: the text that has to be added to the database
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          content:
 *                              type: string
 *      responses:
 *          '401':
 *              description: 'no token provided'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '403':
 *              description: 'invalid token'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '500':
 *              description: 'database error'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '201':
 *              description: 'texts successfully added'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *
 */
router.post('/', authenticateToken, isAdmin, async (req, res) => {

    let text = new Text({
        content: req.body.content
    });

    text = await text.save().catch((e) => {
        return res.status(500).json({state: 'fail'});
    });

    let textId = text.id;
    return res.location("/api/v1/texts/" + textId).status(201).json({state: 'success'});
})

/**
 * @swagger
 * /texts/{id}:
 *  delete:
 *      tags: [texts]
 *      summary: remove a text from the database
 *      description: a user authenticated and authorized as an administrator can remove a text from the database. The text id is sent as part of the path.
 *      parameters:
 *          - in: cookie
 *            name: auth
 *            schema:
 *              type: string
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *          '401':
 *              description: 'no token provided'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '403':
 *              description: 'invalid token'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '404':
 *              description: 'text not found'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *          '204':
 *              description: 'texts successfully removed'
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              state:
 *                                  type: string
 *
 */
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    let text = await Text.findById(req.params.id).exec();
    if (!text) {
        res.status(404).json({state: 'text-not-found'})
        return;
    }
    await text.deleteOne()
    res.status(204).json({state: 'success'})
});

module.exports = router;