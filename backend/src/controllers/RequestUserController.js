const RequestUser = require('../models/RequestUser');
const User = require('../models/User');
const bCrypt = require('../services/hashes');
const { SafeFindOne, SafeCreateObj, SafeFind, SafeDeleteOne } = require('../services/safe-exec');
const { session } = require('passport');
const { getRole, getTitle } = require('../utils/roles');

const { validateString } = require('../utils/str');

module.exports = {
    async store (req, res) {
        let email = (req.body.email)?.toString()?.trim();
        let username = (req.body.username)?.toString()?.trim();
        let password = (req.body.password)?.toString()?.trim();
        let pingParticipant = (req.body.pingParticipant)?.toString()?.trim();
        
        let name = (req.body.name)?.toString()?.trim();
        let institution = (req.body.institution)?.toString()?.trim();
        let course = (req.body.course)?.toString()?.trim();
        let collegeID = (req.body.collegeID)?.toString()?.trim();
        let yearJoinCollege = (req.body.yearJoinCollege)?.toString()?.trim();
        let yearJoinGanesh = (req.body.yearJoinGanesh)?.toString()?.trim();

        if (pingParticipant) {
            pingParticipant = pingParticipant.toString()?.trim();
        }

        pingParticipant = (pingParticipant == 'true');

        let resp;
        
        resp = validateString(email, "Email", true, 64);
        if (resp) {
            return res.status(400).json( { email: resp });
        }

        resp = validateString(username, "Apelido", true, 64);
        if (resp) {
            return res.status(400).json({ username: resp });
        }

        resp = validateString(password, "Senha", true, 64);
        if (resp) {
            return res.status(400).json({ password: resp });
        }

        resp = validateString(name, "Nome", true, 64);
        if (resp) {
            return res.status(400).json({ name: resp });
        }

        resp = validateString(course, "Curso atual", true, 64);
        if (resp) {
            return res.status(400).json({ course: resp });
        }

        resp = validateString(institution, "Instituição", true, 64);
        if (resp) {
            return res.status(400).json({ institution: resp });
        }


        resp = validateString(yearJoinCollege, "Ano de ingresso na instituição", false, 12);
        if (resp) {
            return res.status(400).json({ yearJoinCollege: resp });
        }
        if (institution == 'NENHUMA' || !yearJoinCollege) {
            yearJoinCollege = "";
        }
        else {
            yearJoinCollege = parseInt(yearJoinCollege);
            if (isNaN(yearJoinCollege)) {
                return res.status(400).json({ yearJoinCollege: "O campo 'Ano de ingresso na instituição' é inválido" });
            }
        }
        
        resp = validateString(yearJoinGanesh, "Ano de ingresso no Ganesh", true, 12);
        if (resp) {
            return res.status(400).json({ yearJoinGanesh: resp });
        }
        yearJoinGanesh = parseInt(yearJoinGanesh);
        if (isNaN(yearJoinGanesh)) {
            return res.status(400).json({ yearJoinGanesh: "O campo 'Ano de ingresso no Ganesh' é inválido" });
        }
        
        resp = validateString(collegeID, "Número de Matrícula", false, 12);
        if (resp) {
            return res.status(400).json({ collegeID: resp });
        }
        if (institution == 'NENHUMA' || !collegeID) {
            collegeID = "";
        }
        else {
            collegeID = parseInt(collegeID);
            if (isNaN(collegeID)) {
                return res.status(400).json({ collegeID: "O campo 'Número de Matrícula' é inválido" });
            }
        }

        let user = await SafeFindOne(User, { email });
        if (user) return res.status(409).json( {email: "Email já em uso" });
        user = await SafeFindOne(User, { username });
        if (user) return res.status(409).json( {username: "Apelido já em uso" });

        user = await SafeFindOne(RequestUser, { email });
        if (user) return res.status(409).json( {email: "Email já em uso" });
        user = await SafeFindOne(RequestUser, { username });
        if (user) return res.status(409).json( {username: "Apelido já em uso" });

        password = bCrypt.createHash(password);

        user = await SafeCreateObj(RequestUser, {
            email, 
            password, 
            username, 
            pingParticipant,
            
            name, 
            institution, 
            collegeID,
            course, 
            yearJoinCollege, 
            yearJoinGanesh,
        });

        if (!user) {
            return res.status(500).json({ requestUser: "Não foi possível registrar o usuário" });
        }

        return res.status(201).end();
    },

    async show (req, res) {
        let users = await SafeFind(RequestUser, {});

        return res.status(200).json(users);
    },

    async update (req, res) {
        if (!req.body || !req.body.email) {
            return res.status(400).end();
        }

        let user = await SafeFindOne(RequestUser, {email: req.body.email});
        if (!user) {
            return res.status(404).end();
        }
        

        let role = req.body?.role;
        if (!(role == getRole("pingParticipant") || role == getRole("collaborator") || role == getRole("member"))) {
            return res.status(400).json({ role: "Cargo inválido" });
        }

        let title = getTitle(role);

        let newUser = await SafeCreateObj(User, {
            email: user.email, 
            username: user.username, 
            password: user.password,

            name: user.name,
            institution: user.institution,
            course: user.course,
            collegeID: user.collegeID, 
            yearJoinCollege: user.yearJoinCollege, 
            yearJoinGanesh: user.yearJoinGanesh,

            role,
            title,

            isDeleted: false,
        });
        if (!newUser) {
            return res.status(500).json({ user: "Não foi possível criar o usuário" });
        }

        const response = await SafeDeleteOne(RequestUser, { email: req.body.email });
        if (!response) {
            return res.status(500).json({ requestUser: "Não foi possível deletar o usuário registrado" });
        }
        
        return res.status(200).end();
    },

    async destroy (req, res) {
        if (!req.body || !req.body.email) {
            return res.status(400).end();
        }

        const response = await SafeDeleteOne(RequestUser, { email: req.body.email });
        if (!response) {
            return res.status(500).json({ requestUser: "Não foi possível deletar o usuário registrado" });
        }
        
        return res.status(200).end();
    }
}