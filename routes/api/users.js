const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys')
const jwt = require('jsonwebtoken');
const { secretOrKey } = require("../../config/keys");
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
const passport = require('passport');

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

router.get('/current', passport.authenticate('jwt', {session: false}),
(req, res) => {
    res.send(req.user);
})

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }
    
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({email: 'A user is already registered with that email.'});
        } else {
            const newGuy = new User({
                handle: req.body.handle,
                email: req.body.email,
                password: req.body.password
            })
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newGuy.password, salt, (err, hash) => {
                    if (err) throw err;
                    newGuy.password = hash;
                    newGuy.save().then(user => res.json(user)).catch(err => console.log(err));
                })
            })
        }
    })
})

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({email: 'This user does not exist'});
        }
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch){
                return res.status(400).json({password: 'Password incorrect'})
            }
            const payload = {
                id: user.id,
                handle: user.handle,
                email: user.email
            }
            jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600},
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer" + token
                    })
                })
        });
    })
})
module.exports = router;