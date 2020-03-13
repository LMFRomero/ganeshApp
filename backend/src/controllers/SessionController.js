const mongoose = require('mongoose');
const User = require('../models/User');
const bCrypt = require('../services/hashes');
const session = require('express-session');
const redisStore = require('../services/redis-store');
const passport = require('passport');

require('../services/passaport')(passport);

module.exports = {
    destroy (req, res) {
        try {

            redisStore.destroy(req.body.sessionID, (error) => {
                if (error) res.status(400).end();
                else res.status(200).end();
            });

        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

    },

    isAuth (req, res, next) {
        // Cant use this function due to cors not allowing third party cookies
        // if (req.isAuthenticated()) {
        //     return next();
        // }
        try {

        redisStore.get(req.body.sessionID, (error, session) => {
            if (error) console.log(error);

            if (session) next();
            else res.status(401).end();
        });

        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
    },

    store (req, res, next) {
        // TODO: treat a lot of sessions request on redis
        try {

            passport.authenticate('local', (err, user, info) => {
                if (err) return next(err);

                if (!user) {
                    return res.status(403).end();
                }

                else {
                    req.logIn(user, (err) => {
                        if (err) return next(err);
                        return res.status(200).json({sessionID: req.session.id});
                    });
                } 
            })(req, res, next);

        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
    },
}