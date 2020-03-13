const ResetPassword = require('../models/ResetPassword');
const User = require('../models/User');
const mongoose = require('mongoose');
const transporter = require('../services/nodemailer-auth');
const bCrypt = require('../services/hashes');
const { SafeFindOne, SafeCreateObj, SafeDeleteOne, SafeUpdateOne, SafeFindById } = require('../services/safe-exec');

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

        try {

            const resetUser = await SafeCreateObj(ResetPassword, { name: user._id });

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
                text: `Se você não solicitou este email, sua conta pode estar em risco. Caso você tenha solicitado, utilize o link a seguir para resetar sua senha: http://${process.env.APP_IP}/reset-password/` + resetUser.id
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    return res.status(400).end();
                }

                return res.status(200).json({ id: resetUser.id });
            });

        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        
    },

    async update (req, res) {
        const resetID = req.body.resetID;

        if (!resetID) {
            return res.status(401).end();
        }
        
        console.log(resetID);

        const tmpReset = await SafeFindById(ResetPassword, resetID);

        console.log(tmpReset);

        if (!tmpReset) {
            return res.status(400).end();
        }

        const passwordHash = bCrypt.createHash(req.body.password);

        await SafeUpdateOne(User, { "_id": tmpReset.name }, { $set: { password: passwordHash } }); 
        
        return res.status(200).end();
    },
}