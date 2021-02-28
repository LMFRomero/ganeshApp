const User = require('../models/User');
const RequestUser = require('../models/RequestUser');
const bCrypt = require('../services/hashes');
const { SafeFindOne, SafeCreateObj } = require('../services/safe-exec');
const { setGlobalRole } = require('../services/privilege');

module.exports = {
    async store (req, res) {
        let email = (req.body.email)?.toString();
        let username = (req.body.username)?.toString();
        let password = (req.body.password)?.toString();
        
        let name = (req.body.name)?.toString();
        let institution = (req.body.institution)?.toString();
        let otherInstitution = (req.body.otherInstitution)?.toString();
        let course = (req.body.course)?.toString();
        let otherCourse = (req.body.otherCourse)?.toString();
        let collegeID = (req.body.collegeID)?.toString();
        let yearJoinCollege = (req.body.yearJoinCollege)?.toString();
        let yearJoinGanesh = (req.body.yearJoinGanesh)?.toString();


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
            return res.status(400).json({ yearJoinCollege: "O campo '111' é obrigatório" });
        }
        else if (yearJoinCollege.lenght > 12) {
            return res.status(400).json({ yearJoinCollege: "O campo '111' só aceita no máximo 12 caracteres" });
        }
        else if (isNaN(yearJoinCollege)) {
            return res.status(400).json({ yearJoinCollege: "O campo '111' é inválido" });
        }
        
        //TODO: Change fieldname to align with frontend
        if (!yearJoinGanesh) {
            return res.status(400).json({ yearJoinGanesh: "O campo '222' é obrigatório" });
        }
        else if (yearJoinGanesh.length > 12) {
            return res.status(400).json({ yearJoinGanesh: "O campo '222' só aceita no máximo 12 caracteres" });
        }
        else if (isNaN(yearJoinGanesh)) {
            return res.status(400).json({ yearJoinGanesh: "O campo '222' é inválido" });
        }


        //TODO: Change fieldname to align with frontend
        if (!collegeID) {
            return res.status(400).json({ collegeID: "O campo '333' é obrigatório" });
        }
        else if (collegeID.lenght > 12) {
            return res.status(400).json({ collegeID: "O campo '333' só aceita no máximo 12 caracteres" });
        }
        else if (isNaN(collegeID)) {
            return res.status(400).json({ collegeID: "O campo '333' é inválido" });
        }


        let user = await SafeFindOne(User, { email });
        if (user) return res.status(409).json( {email: "Email já em uso" });
        user = await SafeFindOne(User, { username });
        if (user) return res.status(409).json( {username: "Apelido já em uso" });
        user = await SafeFindOne(User, { collegeID });
        if (user) return res.status(409).json( {collegeID: "Número de matrícula já em uso" });

        user = await SafeFindOne(RequestUser, { email });
        if (user) return res.status(409).json( {email: "Email já em uso" });
        user = await SafeFindOne(RequestUser, { username });
        if (user) return res.status(409).json( {username: "Apelido já em uso" });
        user = await SafeFindOne(RequestUser, { collegeID });
        if (user) return res.status(409).json( {collegeID: "Número de matrícula já em uso" });

        password = bCrypt.createHash(password);

        let roleInt;
        if (req.body.role == "pingParticipant" || req.body.role == "collaborator" || req.body.role == "member") {
            roleInt = getRoleInt(req.body.role);
        }
        else {
            return res.status(400).json({ role: "Função inválida" });
        }

        let title = getTitle(roleInt);

        user = await SafeCreateObj(User, {
            email, 
            password, 
            name, 
            username,

            institution, 
            collegeID, 
            yearJoinCollege, 
            yearJoinGanesh,

            roleInt,
            title,

            isDeleted: false,
        });

        if (!user) {
            return res.status(500).json({ requestUser: "Não foi possível criar o usuário" });
        }

        return res.status(201).end();
    },

    async verify (email, password) {
        if (!email || !password) {
            return null;
        }

        let user = await SafeFindOne(User, { email });
        if (!user)
            return null;

        let passwordHash = user.password;

        if (bCrypt.validateHash(passwordHash, password))
            return user;
        else
            return null;
    },

    async getLoginInfo (req, res) {
        let dbUser = await SafeFindOne (User, { email: req.body.email });
        if (!dbUser) {
            return res.status(400).json({ "email": "Email não encontrado" });
        }

        let user = {
            "username": dbUser.username,
            "title": dbUser.title,
            "role": dbUser.roleInt,
        };
        
        return res.status(200).json(user);
    }
}