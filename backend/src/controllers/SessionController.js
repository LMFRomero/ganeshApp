const mongoose = require('mongoose');
const User = require('../models/User');
const bCrypt = require('../services/hashes');
const session = require('express-session');
const redisStore = require('../services/redis-store');

module.exports = {
    destroy (req, res) {
        redisStore.destroy(req.body.sessionID, (error) => {
            if (error) res.status(400).end();
            else res.status(200).end();
        });
    },

    async store (email, password) {
        if (!email || !password) {
            return null;
        }

        let user = await User.findOne({ "email": email });

        if (!user) return null;

        let passwordHash = user.password;

        if (bCrypt.validateHash(passwordHash, password)) return user;
        else return null;
    },

    isAuth (req, res, next) {
        // Cant use this function due to cors not allowing third party cookies
        // if (req.isAuthenticated()) {
        //     return next();
        // }

        redisStore.get(req.body.sessionID, (error, session) => {
            if (error) console.log(error);
    
            if (session) return res.status(200).end();
            else res.status(403).end();
        });
    
    }
}