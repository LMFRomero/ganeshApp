const mongoose = require('mongoose');
const User = require('../models/User');
const bCrypt = require('../services/hashes');
const session = require('express-session');
const redisStore = require('../services/redis-store');
const express = require('express');

const passport = require('passport');
require('../services/passaport')(passport);

/**
 * @typedef {express.Request} Request
 * @typedef {express.Response} Response
 */

module.exports = {
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     */
    destroy (req, res) {

        if (req.isAuthenticated()) 
            req.logOut();
                
        res.cookie('ganeshSession', {expires: Date.now()})

        return res.status(200).end();
    },

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {*} next 
     */
    isAuth (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else res.status(401).end();
        // try {

        // redisStore.get(req.body.sessionID, (error, session) => {
        //     if (error) console.log(error);

        //     if (session) next();
        //     else res.status(401).end();
        // });

        // } catch (error) {
        //     console.log(error);
        //     return res.status(500).end();
        // }
    },
}