const ResetPassword = require('../models/ResetPassword');
const User = require('../models/User');
const mongoose = require('mongoose');
const transporter = require('../services/nodemailer-auth');
const bCrypt = require('../services/hashes');

module.exports = {
    async store (req, res) {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(200).end();

        const resetUser = await ResetPassword.create({ name: user._id });

        if (!resetUser) return res.status(200).end();

        const mailOptions = {
            from: {
                name: 'Ganesh Password Reset',
                address: 'lucasmfromero@gmail.com'
            },
            to: "lucasromero@usp.br",
            subject: 'Link para reset de senha',
            text: 'http://192.168.0.13:3000/reset-password/' + resetUser.id
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return res.status(400).end();
            }
            return res.status(200).json({ id: resetUser.id });
        });
        
    },

    async update (req, res) {
        const resetID = req.body.id;

        console.log(resetID);

        if (!resetID) return res.status(200).end();

        console.log(2);

        const resetUser = await ResetPassword.findOne({ "_id": resetID });

        if (!resetUser) return res.status(200).end();

        console.log(3);

        const password = req.body.password;

        const passwordHash = bCrypt.createHash(password);

        await User.updateOne({ "_id": resetUser.name }, { $set: { password: passwordHash } }); 

        console.log(4);

        return res.status(200).end();
    },
}