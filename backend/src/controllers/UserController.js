const User = require('../models/User');
const bCrypt = require('../services/hashes');
const { SafeFindOne, SafeCreateObj } = require('../services/safe-exec');

module.exports = {
    async store (req, res) {
        //TODO: Anti NoSQL Injection?
        
        let newEmail = (req.body.email).toString();
        let password = (req.body.password).toString();
        let NUSP = parseInt(req.body.NUSP);
        let name = (req.body.name).toString();
        let username = (req.body.username).toString();
        let anoUSP = parseInt(req.body.anoIngressoUSP);
        let anoGanesh = parseInt(req.body.anoIngressoGanesh);
        let privilege = 0;

        if (!newEmail || !password || !NUSP || !name || !username || !anoUSP || !anoGanesh) {
            return res.status(400).json({ message: "Missing Information"}).end();
        }

        if (isNaN(anoUSP) || isNaN(anoGanesh) || isNaN(NUSP)) {
            return res.status(400).json({ message: "Bad Request" }).end();
        }

        let user = await SafeFindOne(User, { "email": newEmail });

        if (user) {
            return res.status(409).end();
        }

        let passwordHash = bCrypt.createHash(password);

        user = await SafeCreateObj(User, {email: newEmail, password: passwordHash, name: name, username: username, NUSP: NUSP, anoIngressoUSP: anoUSP, anoIngressoGanesh: anoGanesh, privilege: 0});

        return res.status(201).end();
    },

    async verify (email, password) {
        if (!email || !password) {
            return null;
        }

        let user = await SafeFindOne(User, { "email": email });

        if (!user) {
            return null;
        }

        let passwordHash = user.password;

        if (bCrypt.validateHash(passwordHash, password)) {
            return user;
        } else {
            return null;
        }
    },
}