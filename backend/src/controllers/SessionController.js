const mongoose = require('mongoose');
const User = require('../models/User');
const bCrypt = require('../services/hashes');
const jwt = require('jsonwebtoken');

module.exports = {
    destroy (req, res) {
        console.log(req.headers);
        return res.status(200).json({ auth: false, token: "" });
    },

    async store (req, res) {
        let email = req.body.email;
        let password = req.body.password;

        if (!email || !password) {
            return res.status(400).send('Missing Information!');
        }
        let user = await User.findOne({ "email": email });

        if (!user) {
            return res.status(400).send('Login inválido!'); 
        }


        let passwordHash = user.password;
        let id = user._id;


        if (bCrypt.validateHash(passwordHash, password)) {
            var token = jwt.sign({ id }, process.env.SECRET, {
                expiresIn: 3600 // expires in 1h
            });
            
            res.status(200).send({ auth: true, token: token });
        }

        else {
            res.status(400).send('Login inválido!');
        }
        
    }
}