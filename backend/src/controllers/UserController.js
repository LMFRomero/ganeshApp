const User = require('../models/User');
const RequestUser = require('../models/RequestUser');
const bCrypt = require('../services/hashes');
const { SafeFindOne, SafeCreateObj, SafeFindById } = require('../services/safe-exec');
const { setGlobalRole } = require('../services/privilege');

module.exports = {
    async store (req, res) {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        
        let name = req.body.name;
        let institution = req.body.institution;
        let otherInstitution = req.body.otherInstitution;
        let course = req.body.course;
        let otherCourse = req.body.otherCourse;
        let collegeID = req.body.collegeID;
        let yearJoinCollege = req.body.yearJoinCollege;
        let yearJoinGanesh = req.body.yearJoinGanesh;


        if (!email) {
            return res.status(400).json({ email: "O campo 'Email' é obrigatório" });
        }
        else {
            email = email.toString();
        }
        if (email.length > 64) {
            return res.status(400).json( { email: "O campo 'Email' só aceita no máximo 64 caracteres" });
        }

        if (!username) {
            return res.status(400).json({ username: "O campo 'Apelido' é obrigatório" });
        }
        else {
            username = username.toString();
        }
        if (username.length > 64) {
            return res.status(400).json({ username: "O campo 'Apelido' só aceita no máximo 64 caracteres" });
        }

        if (!password) {
            return res.status(400).json({ password: "O campo 'Senha' é obrigatório" });
        }
        else {
            password = password.toString();
        }
        if (password.length > 64) {
            return res.status(400).json({ password: "O campo 'Senha' só aceita no máximo 64 caracteres" });
        }

        if (!name) {
            return res.status(400).json({ name: "O campo 'Nome completo' é obrigatório" });
        }
        else {
            name = name.toString();
        }
        if (name.length > 64) {
            return res.status(400).json({ name: "O campo 'Nome completo' só aceita no máximo 64 caracteres" });
        } 

        if (!course) {
            return res.status(400).json({ course: "O campo 'Curso atual' é obrigatório" });
        }
        else {
            course = course.toString();
        }
        if (course.length > 64) {
            return res.status(400).json({ course: "O campo 'Curso atual' só aceita no máximo 64 caracteres" });
        }
        else if (course == 'OUTRO') {
            if (!otherCourse) {
                return res.status(400).json({ otherCourse: "O campo 'Outro curso' é obrigatório" });
            }
            else {
                otherCourse = otherCourse.toString();
            }
            if (otherCourse.length > 64) {
                return res.status(400).json({ otherCourse: "O campo 'Outro curso' só aceita no máximo 64 caracteres" });
            }
            else {
                course = otherCourse;
            }
        }

        if (!institution) {
            return res.status(400).json({ institution: "O campo 'Instituição' é obrigatório" });
        }
        else {
            institution = institution.toString();
        }
        if (institution.length > 64) {
            return res.status(400).json({ institution: "O campo 'Instituição' só aceita no máximo 64 caracteres" });
        }
        else if (institution == 'OUTRA') {
            if (!otherInstitution) {
                return res.status(400).json({ otherInstitution: "O campo 'Outra instituição' é obrigatório" });
            }
            else {
                otherInstitution = otherInstitution.toString();
            }
            if (otherInstitution.length > 64) {
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
        else {
            yearJoinCollege = yearJoinCollege.toString();
        }
        if (yearJoinCollege.length > 12) {
            return res.status(400).json({ yearJoinCollege: "O campo '111' só aceita no máximo 12 caracteres" });
        }
        else if (isNaN(yearJoinCollege)) {
            return res.status(400).json({ yearJoinCollege: "O campo '111' é inválido" });
        }
        
        //TODO: Change fieldname to align with frontend
        if (!yearJoinGanesh) {
            return res.status(400).json({ yearJoinGanesh: "O campo '222' é obrigatório" });
        }
        else {
            yearJoinGanesh = yearJoinGanesh.toString();
        }
        if (yearJoinGanesh.length > 12) {
            return res.status(400).json({ yearJoinGanesh: "O campo '222' só aceita no máximo 12 caracteres" });
        }
        else if (isNaN(yearJoinGanesh)) {
            return res.status(400).json({ yearJoinGanesh: "O campo '222' é inválido" });
        }


        //TODO: Change fieldname to align with frontend
        if (!collegeID) {
            return res.status(400).json({ collegeID: "O campo '333' é obrigatório" });
        }
        else {
            collegeID = collegeID.toString();
        }
        if (collegeID.length > 12) {
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

    async update (req, res) {
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

        let user = await SafeFindById(User, req.params.id);
        if (!user) {
            return res.status(404).json({ user: "Usuário não encontrado" });
        }

        let conflict1, conflict2;

        if (email && email != user.email) {
            if (email.length > 64) {
                return res.status(400).json( { email: "O campo 'Email' só aceita no máximo 64 caracteres" });
            }
            else if (email.length) {
                conflict1 = await SafeFindOne(User, { email });
                conflict2 = await SafeFindOne(RequestUser, { email });
                if (conflict1 || conflict2) {
                    return res.status(409).json( {email: "Email já em uso" });
                }
                user.email = email;
            }
        }

        if (username && username != user.username) {
            if (username.length > 64) {
                return res.status(400).json({ username: "O campo 'Apelido' só aceita no máximo 64 caracteres" });
            }
            else if (username.length > 0) {
                conflict1 = await SafeFindOne(User, { username });
                conflict2 = await SafeFindOne(RequestUser, { username });
                if (conflict1|| conflict2) {
                    return res.status(409).json({ username: "Apelido já em uso" });
                }
                user.username = username;
            }
        }

        if (password && password != user.password) {
            if (password.length > 64) {
                return res.status(400).json({ password: "O campo 'Senha' só aceita no máximo 64 caracteres" });
            }
            else if (password.length > 0) {
                password = bCrypt.createHash(password);
                user.password = password;
            }
        }

        if (name && name != user.name) {
            if (name.length > 64) {
                return res.status(400).json({ name: "O campo 'Nome completo' é obrigatório" });
            }
            else if (name.length > 0) {
                user.name = name;
            }
        }

        if (course && course != user.course) {
            if (course.length > 64) {
                return res.status(400).json({ course: "O campo 'Curso atual' só aceita no máximo 64 caracteres" });
            }
            else if (course.length > 0) {
                if (course == 'OUTRO') {
                        if (otherCourse && otherCourse != user.course) {
                            if (otherCourse.length > 64) {
                                return res.status(400).json({ otherCourse: "O campo 'Outro curso' só aceita no máximo 64 caracteres" });
                            }
                            else if (otherCourse.length > 0) {
                                user.course = otherCourse;
                            }
                        }
                }
                else {
                    user.course = course;
                }
            }
        }
        
        if (institution && institution != user.institution) {
            if (institution.length > 64) {
                return res.status(400).json({ institution: "O campo 'Instituição' só aceita no máximo 64 caracteres" });
            }
            else if (institution.length > 0) {
                if (institution == 'OUTRA') {
                        if (otherInstitution && otherInstitution != user.institution) {
                            if (otherInstitution.length > 64) {
                                return res.status(400).json({ otherInstitution: "O campo 'Outra instituição' só aceita no máximo 64 caracteres" });
                            }
                            else if (otherInstitution.length > 0) {
                                user.institution = otherInstitution;
                            }
                        }
                }
                else {
                    user.institution = institution;
                }
            }
        }

        //TODO: Change fieldname to align with frontend
        if (yearJoinCollege) {
            if (yearJoinCollege.length > 12) {
                return res.status(400).json({ yearJoinCollege: "O campo '111' só aceita no máximo 12 caracteres" });
            }
            else if (isNaN(yearJoinCollege) == false) {
                user.yearJoinCollege = parseInt(yearJoinCollege);
            } 
        }
        
        //TODO: Change fieldname to align with frontend
        if (yearJoinGanesh) {
            if (yearJoinGanesh.length > 12) {
                return res.status(400).json({ yearJoinGanesh: "O campo '222' só aceita no máximo 12 caracteres" });
            }
            else if (isNaN(yearJoinGanesh) == false) {
                user.yearJoinGanesh = parseInt(yearJoinGanesh);
            } 
        }

        //TODO: Change fieldname to align with frontend
        if (collegeID) {
            if (collegeID.length > 12) {
                return res.status(400).json({ collegeID: "O campo '333' só aceita no máximo 12 caracteres" });
            }
            else if (isNaN(collegeID) == false) {
                user.collegeID = parseInt(collegeID);
            } 
        }

        try {
            await user.save();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ user: "Não foi possível atualizar usuário" });
        }

        return res.status(200).end();
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