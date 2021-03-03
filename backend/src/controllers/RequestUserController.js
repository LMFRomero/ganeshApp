const RequestUser = require('../models/RequestUser');
const User = require('../models/User');
const bCrypt = require('../services/hashes');
const { SafeFindOne, SafeCreateObj, SafeFind, SafeDeleteOne } = require('../services/safe-exec');
const { session } = require('passport');
const { getRoleInt, getTitle } = require('../utils/roles');

module.exports = {
    async store (req, res) {
        let email = (req.body.email)?.toString();
        let username = (req.body.username)?.toString();
        let password = (req.body.password)?.toString();
        let pingParticipant = (req.body.pingParticipant)?.toString();
        
        let name = (req.body.name)?.toString();
        let institution = (req.body.institution)?.toString();
        let otherInstitution = (req.body.otherInstitution)?.toString();
        let course = (req.body.course)?.toString();
        let otherCourse = (req.body.otherCourse)?.toString();
        let collegeID = (req.body.collegeID)?.toString();
        let yearJoinCollege = (req.body.yearJoinCollege)?.toString();
        let yearJoinGanesh = (req.body.yearJoinGanesh)?.toString();

        if (pingParticipant) {
            pingParticipant = pingParticipant.toString();
        }

        pingParticipant = (pingParticipant == 'true');

        if (!email) {
            return res.status(400).json({ email: "O campo 'Email' é obrigatório" });
        }
        else if (email.length > 64) {
            return res.status(400).json( { email: "O campo 'Email' só aceita no máximo 64 caracteres" });
        }

        if (!username) {
            return res.status(400).json({ username: "O campo 'Apelido' é obrigatório" });
        }
        else if (username.length > 64) {
            return res.status(400).json({ username: "O campo 'Apelido' só aceita no máximo 64 caracteres" });
        }

        if (!password) {
            return res.status(400).json({ password: "O campo 'Senha' é obrigatório" });
        }
        else if (password.length > 64) {
            return res.status(400).json({ password: "O campo 'Senha' só aceita no máximo 64 caracteres" });
        }

        if (!name) {
            return res.status(400).json({ name: "O campo 'Nome completo' é obrigatório" });
        }
        else if (name.length > 64) {
            return res.status(400).json({ name: "O campo 'Nome completo' só aceita no máximo 64 caracteres" });
        } 

        if (!course) {
            return res.status(400).json({ course: "O campo 'Curso atual' é obrigatório" });
        }
        else if (course.length > 64) {
            return res.status(400).json({ course: "O campo 'Curso atual' só aceita no máximo 64 caracteres" });
        }
        else if (course == 'OUTRO') {
            if (!otherCourse) {
                return res.status(400).json({ otherCourse: "O campo 'Outro curso' é obrigatório" });
            }
            else if (otherCourse.length > 64) {
                return res.status(400).json({ otherCourse: "O campo 'Outro curso' só aceita no máximo 64 caracteres" });
            }
            else {
                course = otherCourse;
            }
        }

        if (!institution) {
            return res.status(400).json({ institution: "O campo 'Instituição' é obrigatório" });
        }
        else if (institution.length > 64) {
            return res.status(400).json({ institution: "O campo 'Instituição' só aceita no máximo 64 caracteres" });
        }
        else if (institution == 'OUTRA') {
            if (!otherInstitution) {
                return res.status(400).json({ otherInstitution: "O campo 'Outra instituição' é obrigatório" });
            }
            else if (otherInstitution.length > 64) {
                return res.status(400).json({ otherInstitution: "O campo 'Outra instituição' só aceita no máximo 64 caracteres" });
            }
            else {
                institution = otherInstitution;
            }
        }

        //TODO: Change fieldname to align with frontend
        if (!yearJoinCollege) {
            return res.status(400).json({ yearJoinCollege: "O campo 'Ano de ingresso na instituição' é obrigatório" });
        }
        else if (yearJoinCollege.length > 12) {
            return res.status(400).json({ yearJoinCollege: "O campo 'Ano de ingresso na instituição' só aceita no máximo 12 caracteres" });
        }
        else if (isNaN(yearJoinCollege)) {
            return res.status(400).json({ yearJoinCollege: "O campo 'Ano de ingresso na instituição' é inválido" });
        }
        
        //TODO: Change fieldname to align with frontend
        if (!yearJoinGanesh) {
            return res.status(400).json({ yearJoinGanesh: "O campo 'Ano de ingresso no Ganesh' é obrigatório" });
        }
        else if (yearJoinGanesh.length > 12) {
            return res.status(400).json({ yearJoinGanesh: "O campo 'Ano de ingresso no Ganesh' só aceita no máximo 12 caracteres" });
        }
        else if (isNaN(yearJoinGanesh)) {
            return res.status(400).json({ yearJoinGanesh: "O campo 'Ano de ingresso no Ganesh' é inválido" });
        }


        //TODO: Change fieldname to align with frontend
        if (!collegeID) {
            collegeID = '-1';
        }
        if (collegeID.length > 12) {
            return res.status(400).json({ collegeID: "O campo 'Número de Matrícula' só aceita no máximo 12 caracteres" });
        }
        else if (isNaN(collegeID)) {
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
        

        let roleInt;
        if (req.body.role == "pingParticipant" || req.body.role == "collaborator" || req.body.role == "member") {
            roleInt = getRoleInt(req.body.role);
        }
        else {
            return res.status(400).json({ role: "Função inválida" });
        }

        let title = getTitle(roleInt);

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

            roleInt,
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