const RequestUser = require('../models/RequestUser');
const User = require('../models/User');
const bCrypt = require('../services/hashes');
const { SafeFindOne, SafeCreateObj, SafeFind, SafeDeleteOne } = require('../services/safe-exec');
const { session } = require('passport');
const { getRole, getTitle } = require('../utils/roles');

function validateString(str, fieldName, maxLen) {
    if (!str) {
        return `O campo '${fieldName}' é obrigatório`;
    }

    if (str.length > maxLen) {
        return `O campo '${fieldName}' só aceita no máximo ${maxLen} caracteres`;
    }

    else {
        return null;
    }
}

module.exports = {
    async store (req, res) {
        let email = (req.body.email)?.toString();
        let username = (req.body.username)?.toString();
        let password = (req.body.password)?.toString();
        let pingParticipant = (req.body.pingParticipant)?.toString();
        
        let name = (req.body.name)?.toString();
        let institution = (req.body.institution)?.toString();
        let course = (req.body.course)?.toString();
        let collegeID = (req.body.collegeID)?.toString();
        let yearJoinCollege = (req.body.yearJoinCollege)?.toString();
        let yearJoinGanesh = (req.body.yearJoinGanesh)?.toString();

        if (pingParticipant) {
            pingParticipant = pingParticipant.toString();
        }

        pingParticipant = (pingParticipant == 'true');

        let resp;
        
        resp = validateString(email, "Email", 64);
        if (resp) {
            return res.status(400).json( { email: resp });
        }

        resp = validateString(username, "Apelido", 64);
        if (resp) {
            return res.status(400).json({ username: resp });
        }

        resp = validateString(password, "Senha", 64);
        if (resp) {
            return res.status(400).json( { password: resp });
        }

        resp = validateString(name, "Nome", 64);
        if (resp) {
            return res.status(400).json( { name: resp });
        }

        resp = validateString(course, "Curso atual", 64);
        if (resp) {
            return res.status(400).json( { course: resp });
        }

        resp = validateString(institution, "Instituição", 64);
        if (resp) {
            return res.status(400).json( { institution: resp });
        }

        if (!yearJoinCollege) {
            yearJoinCollege = '-1';
        }
        else if (yearJoinCollege.length > 12) {
            return res.status(400).json({ yearJoinCollege: "O campo 'Ano de ingresso na instituição' só aceita no máximo 12 caracteres" });
        }
        yearJoinCollege = parseInt(yearJoinCollege);
        if (isNaN(yearJoinCollege)) {
            return res.status(400).json({ yearJoinCollege: "O campo 'Ano de ingresso na instituição' é inválido" });
        }
        
        resp = validateString(yearJoinGanesh, "Ano de ingresso no Ganesh", 12);
        if (resp) {
            return res.status(400).json( { yearJoinGanesh: resp });
        }
        yearJoinGanesh = parseInt(yearJoinGanesh);
        if (isNaN(yearJoinGanesh)) {
            return res.status(400).json({ yearJoinGanesh: "O campo 'Ano de ingresso no Ganesh' é inválido" });
        }

        if (!collegeID) {
            collegeID = '-1';
        }
        else if (collegeID.length > 12) {
            return res.status(400).json({ collegeID: "O campo 'Número de Matrícula' só aceita no máximo 12 caracteres" });
        }
        collegeID = parseInt(collegeID);
        if (isNaN(collegeID)) {
            return res.status(400).json({ collegeID: "O campo 'Número de Matrícula' é inválido" });
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
        

        let role;
        if (req.body.role == "pingParticipant" || req.body.role == "collaborator" || req.body.role == "member") {
            role = getRole(req.body.role);
        }
        else {
            return res.status(400).json({ role: "Função inválida" });
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