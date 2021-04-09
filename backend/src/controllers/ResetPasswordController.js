const mongoose = require('mongoose');
const crypto = require('crypto');

const ResetPassword = require('../models/ResetPassword');
const User = require('../models/User');

const transporter = require('../services/nodemailer-auth');
const bCrypt = require('../services/hashes');

const { SafeFindOne, SafeCreateObj, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeFind } = require('../services/safe-exec');
const { validateString } = require('../utils/str');


module.exports = {
    async store (req, res) {
        const email = req.body.email;
        let resp = validateString(email, "Email", true, 64);
        if (resp) {
            return res.status(400).json({ email: resp });
        }

        const user = await SafeFindOne(User, { email });
        if (!user) {
            return res.status(200).json({ message: "Um email foi enviado para essa conta" });
        }

        const pastUser = await SafeFindOne(ResetPassword, { name: user._id });
        if (pastUser) {
            await SafeDeleteOne(ResetPassword, { name: user._id });
        }

        let resetToken = crypto.randomBytes(20).toString('hex');

        try {
            console.log(resetToken);
            const resetUser = await SafeCreateObj(ResetPassword, { name: user._id, token: resetToken, createdAt: new Date() });
            if (!resetUser) {
                return res.status(500).json({ message: "Não foi possível enviar um email" });
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
                    return res.status(500).json({ message: "Não foi possível enviar um email" });
                }

                return res.status(200).json({ message: "Um email foi enviado para essa conta" });
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Não foi possível enviar um email" });
        }
    },

    async update (req, res) {
        const resetToken = req.params.token;
        if (!resetToken) {
            return res.status(400).json({ message: "Um token é obrigatório" });
        }

        const tmpReset = await SafeFindOne(ResetPassword, { token : resetToken });
        if (!tmpReset) {
            return res.status(404).json({ message: "Token não encontrado" });
        }

        let password = req.body?.password;
        resp = validateString(password, 'Nova Senha', true, 64);
        if (resp) {
            return res.status(400).json({ password: resp });
        }
        else {
            if (password.trim().length < 8) {
                return res.status(400).json({ password: "A senha precisa ter pelo menos 8 caracteres" });
            }
        }

        const passwordHash = bCrypt.createHash(password);

        let user = await SafeFindById(User, tmpReset.name); 
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        user.password = passwordHash;

        try {
            await user.save();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Não foi possível alterar senha" });
        }

        await SafeDeleteOne(ResetPassword, { token: resetToken });
        
        return res.status(200).json({ message: "Senha alterada com sucesso" });
    },
}