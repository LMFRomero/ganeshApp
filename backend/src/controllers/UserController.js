const User = require('../models/User');
const bCrypt = require('../services/hashes');

module.exports = {
    async store (req, res) {
        //to do: Anti NoSQL Injection?
        
        let newEmail = (req.body.email).toString();
        let password = (req.body.password).toString();
        let NUSP = parseInt(req.body.NUSP);
        let name = (req.body.name).toString();
        let username = (req.body.username).toString();
        let anoUSP = parseInt(eq.body.anoIngressoUSP);
        let anoGanesh = parseInt(req.body.anoIngressoGanesh);
        let privilege = 0;

        if (!newEmail || !password || !NUSP || !name || !username || !anoUSP || !anoGanesh) {
            return res.status(400).json({ message: "Missing Information"}).end();
        }

        if (isNaN(anoUSP) || isNaN(anoGanesh) || isNaN(NUSP)) {
            return res.status(400).json({ message: "Bad Request" }).end();
        }

        let user = await User.findOne({ "email": newEmail });

        if (!user) {
            let passwordHash = bCrypt.createHash(password);

            user = await User.create({email: newEmail, password: passwordHash, name: name, username: username, NUSP: NUSP, anoIngressoUSP: anoUSP, anoIngressoGanesh: anoGanesh, privilege: 0});
            return res.json(user);
        }

        else {
            res.json({ message: "User already exists" });
        }
    }
}