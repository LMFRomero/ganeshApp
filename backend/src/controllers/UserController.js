const User = require('../models/User');
const bCrypt = require('../services/hashes');
const { SafeFindOne, SafeCreateObj } = require('../services/safe-exec');
const { setGlobalRole } = require('../services/privilege');

module.exports = {
    async store (req, res) {
        //TODO: Anti NoSQL Injection?
        
        let newEmail = (req.body.email).toString();
        let password = (req.body.password).toString();
        let collegeID = parseInt(req.body.collegeID);
        let name = (req.body.name).toString();
        let username = (req.body.username).toString();
        let yearCollege = parseInt(req.body.yearJoinCollege);
        let yearGanesh = parseInt(req.body.yearJoinGanesh);
        if (!newEmail || !password || !collegeID || !name || !username || !yearCollege || !yearGanesh) {
            return res.status(400).json({ message: "Missing Information"}).end();
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

        let passwordHash = bCrypt.createHash(password);

        user = await SafeCreateObj(User, {email: newEmail, password: passwordHash, name: name, username: username, collegeID: collegeID, yearJoinCollege: yearCollege, yearJoinGanesh: yearGanesh, privilege: 0});

        if (!user) return res.status(500).end();

        awaitsetGlobalRole(user._id, "member")

        return res.status(201).end();
    },

    async verify (email, password) {
        if (!email || !password) {
            return null;
        }

        let user = await SafeFindOne(User, { "email": email });

        if (user === -1) {
            return -1;
        }

        let passwordHash = user.password;

        if (bCrypt.validateHash(passwordHash, password)) {
            return user;
        } else {
            return null;
        }
    },
}