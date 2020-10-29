const RequestUser = require('../models/RequestUser');
const User = require('../models/User');
const bCrypt = require('../services/hashes');
const { SafeFindOne, SafeCreateObj, SafeFind, SafeDeleteOne } = require('../services/safe-exec');
const { session } = require('passport');
const { setGlobalRole } = require('../services/privilege');

module.exports = {
    async store (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        let newEmail = (req.body.email).toString();
        let password = (req.body.password).toString();
        let collegeID = parseInt(req.body.collegeID);
        let name = (req.body.name).toString();
        let username = (req.body.username).toString();
        let yearCollege = parseInt(req.body.yearJoinCollege);
        let yearGanesh = parseInt(req.body.yearJoinGanesh);
        if (!newEmail || !password || !collegeID || !name || !username || !yearCollege || !yearGanesh) {
            return res.status(400).json({ message: "Missing Information"});
        }

        if (isNaN(yearCollege) || isNaN(yearGanesh) || isNaN(collegeID)) {
            return res.status(400).end();
        }

        let user = await SafeFindOne(User, { email: newEmail });
        if (user) return res.status(409).json( {"message": "user already exists"} );
        user = await SafeFindOne(User, { name: name });
        if (user) return res.status(409).json( {"message": "name already in use"} );
        user = await SafeFindOne(User, { username: username });
        if (user) return res.status(409).json( {"message": "username already in use"} );
        user = await SafeFindOne(RequestUser, { email: newEmail });
        if (user) return res.status(409).json( {"message": "user already exists"} );
        user = await SafeFindOne(RequestUser, { name: name });
        if (user) return res.status(409).json( {"message": "name already in use"} );
        user = await SafeFindOne(RequestUser, { username: username });
        if (user) return res.status(409).json( {"message": "username already in use"} );

        let passwordHash = bCrypt.createHash(password);

        user = await SafeCreateObj(RequestUser, {email: newEmail, password: passwordHash, name: name, username: username, collegeID: collegeID, yearJoinCollege: yearCollege, yearJoinGanesh: yearGanesh, privilege: 0});

        if (!user) return res.status(500).end();

        return res.status(201).end();
    },

    async show (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        let users = await SafeFind(RequestUser, {});
        return res.status(200).json(users);
    },

    async update (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.body || !req.body.email) {
            return res.status(400).end();
        }

        let user = await SafeFindOne(RequestUser, {email: req.body.email});
        if (!user) return res.status(404).end();

        let newUser = await SafeCreateObj(User, {email: user.email, password: user.password, name: user.name, username: user.username, collegeID: user.collegeID, yearJoinCollege: user.yearJoinCollege, yearJoinGanesh: user.yearJoinGanesh});
        if (!newUser) return res.status(500).end();
        
        await SafeDeleteOne(RequestUser, { email: req.body.email });

        if (req.body.role == "member") await setGlobalRole(newUser._id, "member");
        else await setGlobalRole(newUser._id, "collaborator");

        return res.status(200).end();
    },

    async destroy (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();
            
        if (!req.body || !req.body.email) {
            return res.status(400).end();
        }

        await SafeDeleteOne(RequestUser, { email: req.body.email });

        return res.status(200).end();
    }
}