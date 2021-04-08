const User = require('../models/User');
const RequestUser = require('../models/RequestUser');

const bCrypt = require('../services/hashes');
const { SafeFindOne, SafeCreateObj, SafeFindById, SafeFind } = require('../services/safe-exec');

const { canChangeRole } = require('../middlewares/perms');
const { getRole, getTitle } = require('../utils/roles');
const { validateString } = require('../utils/str');

module.exports = {
    async show (req, res) {
        if (req.params?.id) {
            try {
                var user = await User.findById(req.params.id)
                                     .select("name course institution collegeID yearJoinCollege yearJoinGaneshemail username role title isDeleted");
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }

            if (!user) {
                return res.status(404).json({ userId: "Usuário não encontrado" });
            }

            return res.status(200).json(user);
        }
        else {
            try {
                var users = await User.find({})
                                      .select("email username yearJoinGanesh title");
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }

            return res.status(200).json(users);
        }
    },

    async store (req, res) {
        let email = (req.body.email)?.toString();
        let username = (req.body.username)?.toString();
        let password = (req.body.password)?.toString();
        
        let name = (req.body.name)?.toString();
        let institution = (req.body.institution)?.toString();
        let course = (req.body.course)?.toString();
        let collegeID = (req.body.collegeID)?.toString();
        let yearJoinCollege = (req.body.yearJoinCollege)?.toString();
        let yearJoinGanesh = (req.body.yearJoinGanesh)?.toString();


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
        
        resp = validateString(yearJoinGanesh, "Ano de ingresso no Ganesh", true, 12);
        if (resp) {
            return res.status(400).json({ yearJoinGanesh: resp });
        }
        yearJoinGanesh = parseInt(yearJoinGanesh);
        if (isNaN(yearJoinGanesh)) {
            return res.status(400).json({ yearJoinGanesh: "O campo 'Ano de ingresso no Ganesh' é inválido" });
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

        let role = req.body?.role;
        if (!(role == getRole("pingParticipant") || role == getRole("collaborator") || role == getRole("member"))) {
            return res.status(400).json({ role: "Cargo inválido" });
        }

        let title = getTitle(role);

        user = await SafeCreateObj(User, {
            createdAt: new Date(),

            email, 
            password, 
            name, 
            username,

            institution, 
            collegeID, 
            yearJoinCollege, 
            yearJoinGanesh,

            role,
            title,

            isDeleted: false,
        });

        if (!user) {
            return res.status(500).json({ requestUser: "Não foi possível criar o usuário" });
        }

        return res.status(201).end();
    },

    async update (req, res) {
        let email = (req.body.email)?.toString().trim();
        let username = (req.body.username)?.toString().trim();
        
        let name = (req.body.name)?.toString().trim();
        let institution = (req.body.institution)?.toString().trim();
        let course = (req.body.course)?.toString().trim();
        let collegeID = (req.body.collegeID)?.toString().trim();
        let yearJoinCollege = (req.body.yearJoinCollege)?.toString().trim();
        let yearJoinGanesh = (req.body.yearJoinGanesh)?.toString().trim();

        let role = parseInt(req.body.role);

        let user = await SafeFindById(User, req.params.id);
        if (!user) {
            return res.status(404).json({ user: "Usuário não encontrado" });
        }

        let conflict1, conflict2;

        if (email && email != user.email) {
            if (email.length > 64) {
                return res.status(400).json({ email: "O campo 'Email' só aceita no máximo 64 caracteres" });
            }
            else if (email.length) {
                conflict1 = await SafeFindOne(User, { email });
                conflict2 = await SafeFindOne(RequestUser, { email });
                if (conflict1 || conflict2) {
                    return res.status(409).json({ email: "Email já em uso" });
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

        if (name) {
            if (name.length > 64) {
                return res.status(400).json({ name: "O campo 'Nome completo' só aceita no máximo 64 caracteres" });
            }
            else if (name.length > 0) {
                user.name = name;
            }
        }

        if (course) {
            if (course.length > 64) {
                return res.status(400).json({ course: "O campo 'Curso atual' só aceita no máximo 64 caracteres" });
            }
            else if (course.length > 0) {
                user.course = course;
            }
        }
        
        if (institution) {
            if (institution.length > 64) {
                return res.status(400).json({ institution: "O campo 'Instituição' só aceita no máximo 64 caracteres" });
            }
            else if (institution.length > 0) {
                user.institution = institution;
            }
        }

        if (yearJoinCollege) {
            if (yearJoinCollege.length > 12) {
                return res.status(400).json({ yearJoinCollege: "O campo 'Ano de ingresso na instituição' só aceita no máximo 12 caracteres" });
            }
            else if (isNaN(yearJoinCollege) == false) {
                user.yearJoinCollege = parseInt(yearJoinCollege);
            } 
        }
        
        if (yearJoinGanesh) {
            if (yearJoinGanesh.length > 12) {
                return res.status(400).json({ yearJoinGanesh: "O campo 'Ano de ingresso no Ganesh' só aceita no máximo 12 caracteres" });
            }
            else if (isNaN(yearJoinGanesh) == false) {
                user.yearJoinGanesh = parseInt(yearJoinGanesh);
            } 
        }

        if (collegeID) {
            if (collegeID.length > 12) {
                return res.status(400).json({ collegeID: "O campo 'Número de Matrícula' só aceita no máximo 12 caracteres" });
            }
            else if (isNaN(collegeID) == false) {
                user.collegeID = parseInt(collegeID);
            } 
        }

        if (role != -1 && role != user.role) {
            if (await canChangeRole(req, res)) {
                user.role = role;
                user.title = getTitle(user.role);
            }
            else {
                return res.status(403).json({ role: "Não é possível mudar o cargo" });
            }
        }

        try {
            await user.save();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Não foi possível atualizar usuário" });
        }

        return res.status(200).json({ message: "Dados atualizados com sucesso!" });
    },

    async updatePassword (req, res) {
        let user = await SafeFindById(User, req.params?.id);
        if (!user) {
            return res.status(404).end();
        }

        let password = (req.body?.newPassword)?.toString()?.trim();
        let resp = validateString(password, 'newPassword', true, 64);
        if (resp) {
            return res.status(400).json(resp);
        }

        let oldPassword = (req.body?.password)?.toString()?.trim();
        resp = validateString(oldPassword, 'password', true, 64);
        if (resp) {
            return res.status(400).json(resp);
        }

        if (!bCrypt.validateHash(user.password, oldPassword)) {
            return res.status(403).json({ message: "Senha inválida" });
        }

        password = bCrypt.createHash(password);

        user.password = password;

        try {
            user.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).json({ message: "Senha atualizada com sucesso!" });
    },

    async destroy (req, res) {
        let id = (req.params?.id)?.toString()?.trim();
        let resp = validateString(id, "userId", true, 100);
        if (resp) {
            return res.status(400).json({ message: resp });
        }
        
        let user = await SafeFindById(User, req.params?.id);
        if (!user) {
            return res.status(404).json({ userId: "Usuário não encontrado" });
        }

        user.isDeleted = true;

        try {
            user.save();
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Não foi possível excluir a conta" });
        }

        //TODO: tirar a sessao do usuario depois de deletar

        return res.status(200).json({ message: "Conta excluída com sucesso!" });
    },

    async verify (email, password) {
        if (!email || !password) {
            return null;
        }

        let user = await SafeFindOne(User, { email });
        if (!user)
            return null;

        if (user.isDeleted == true) {
            return null;
        }

        let passwordHash = user.password;

        if (bCrypt.validateHash(passwordHash, password))
            return user;
        else
            return null;
    },

    async getLoginInfo (req, res) {
        try {
            var user = await User.findOne({ email: req.body.email })
                                 .select("username title role");
        } catch (err) {
            console.log(err);
            return res.status(500).end();
        }

        if (!user) {
            return res.status(400).json({ "email": "Email não encontrado" });
        }
        
        return res.status(200).json(user);
    },
        
    async promoteUser (req, res) {
        let user = await SafeFindOne (User, { email: req.body.email });
        if (!user) {
            return res.status(404).end();
        }
        let role = parseInt(req.body?.role);
        let title = getTitle(role);

        if (!title) {
            return res.status(400).end();
        }

        user.role = req.body.role;
        user.title = title;
        
        try {
            user.save();
        } catch (error) {
            return res.status(500).end();
        }
        
        return res.status(200).end();
    }
}
