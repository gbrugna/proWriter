const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const User = require('../models/user');

//create a new user
router.post('/', async (req, res) => {
    try {
        //TODO: check that user doesnt already exist       
        //checking whether the email is valid
        const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
        const str = req.body.email

        if(!regexExp.test(str)) {
            console.log("Not an email")
        } else {
            console.log("email ok")
        }

        
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

      
        let user = new User({
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username,
            average_wpm : undefined,
            races_count : 0,
            precision : undefined
        });
        
        insertedUser = await user.save();
        res.location("/api/v1/user/" + insertedUser.id).status(201);
        res.json({signup : 'successful'});
    } catch {
        res.status(500).send()
    }

    
})


//login
router.post('/login', async (req, res) => {
    const user = await User.findOne({ 'email' : req.body.email })
    
    if (user == null) {
        return res.status(400).send('Cannot find user') //C'è un motivo particolare per 400 e non 404?
    }
 
    try {
        if (!await bcrypt.compare(req.body.password, user.password)) {
            res.send('Not allowed')
        }
    } catch {
        res.status(500).send()
    }
    res.json({login : 'successful'});
})

//signup and login requests

//get the list of all users
router.get('/', async (req, res)=>{
    let users = await User.find({}).exec();
    
    res.json(users);
})

module.exports = router;