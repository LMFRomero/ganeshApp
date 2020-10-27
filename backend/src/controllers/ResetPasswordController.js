const ResetPassword = require('../models/ResetPassword');
const User = require('../models/User');
const mongoose = require('mongoose');
const transporter = require('../services/nodemailer-auth');
const bCrypt = require('../services/hashes');
const crypto = require('crypto');
const { SafeFindOne, SafeCreateObj, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeFind } = require('../services/safe-exec');

module.exports = {
    async store (req, res) {
        const { email } = req.body;

        const user = await SafeFindOne(User, { email });

        if (!user) {
            return res.status(404).end();
        }

        const pastUser = await SafeFindOne(ResetPassword, { name: user._id });
        
        if (pastUser) {
            await SafeDeleteOne(ResetPassword, { name: user._id });
        }

        let resetToken = crypto.randomBytes(20).toString('hex');

        try {
            console.log(resetToken);
            const resetUser = await SafeCreateObj(ResetPassword, { name: user._id, token: resetToken });

            if (!resetUser) {
                return res.status(500).end();
            }   

            const mailOptions = {
                from: {
                    name: 'Ganesh Password Reset',
                    address: 'lucasmfromero@gmail.com'
                },
                to: email,
                subject: 'Link para reset de senha',
                text: `Se você não solicitou este email, sua conta pode estar em risco. Caso você tenha solicitado, utilize o link a seguir para resetar sua senha: http://${process.env.APP_IP}/reset-password/` + resetToken,
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                    return res.status(400).end();
                }

                return res.status(200).end();
            });

        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        
    },

    async update (req, res) {
        const resetToken = req.params.token;

        if (!resetToken) {
            return res.status(400).end();
        }

        const tmpReset = await SafeFindOne(ResetPassword, { token : resetToken });

        if (!tmpReset) {
            return res.status(404).end();
        }

        let password = req.body.password
        if (!password)
            return res.status(400).end()

        const passwordHash = bCrypt.createHash(password);

        let user = await SafeFindById(User, { "_id": tmpReset.name } ); 

        user.password = passwordHash;
        try {
            user.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        await SafeDeleteOne(ResetPassword, { token: resetToken });
        
        return res.status(200).end();
    },
}