const User = require('../models/User');

const bCrypt = require('../services/hashes');
const passport = require('passport');
const { SafeFindOne, SafeCreateObj, SafeFindById, SafeFind } = require('../services/safe-exec');

const { canChangeRole } = require('../middlewares/perms');

const { getRole, getTitle } = require('../utils/roles');
const { validateString } = require('../utils/str');

const pingActive = true;

function validateUserFields (email, username, name, institution, course, collegeID, yearJoinCollege, yearJoinGanesh) {
    let resp;
    let ans = {};
    let hasError = false;
    
    resp = validateString(email, "Email", true, 64);
    if (resp) {
        hasError = true;
        ans.email = resp;
    }

    resp = validateString(username, "Apelido", true, 64);
    if (resp) {
        hasError = true;
        ans.username = resp;
    }

    resp = validateString(name, "Nome", true, 64);
    if (resp) {
        hasError = true;
        ans.name = resp;
    }

    resp = validateString(course, "Curso atual", true, 64);
    if (resp) {
        hasError = true;
        ans.course = resp;
    }
    else if (course != "NENHUM" && institution == "NENHUMA") {
        hasError = true;
        ans.course = "O curso precisa estar atrelado a uma instituição";
    }

    resp = validateString(institution, "Instituição", true, 64);
    if (resp) {
        hasError = true;
        ans.institution = resp;
    }

    resp = validateString(yearJoinCollege, "Ano de ingresso na instituição", false, 12);
    if (resp) {
        hasError = true;
        ans.yearJoinCollege = resp;
    }
    else if (institution != 'NENHUMA') {
        yearJoinCollege = parseInt(yearJoinCollege);
        if (isNaN(yearJoinCollege)) {
            hasError = true;
            ans.yearJoinCollege = "O campo 'Ano de ingresso na instituição' é inválido";
        }
    }

    resp = validateString(collegeID, "Número de Matrícula", false, 12);
    if (resp) {
        ans.collegeID = resp;
    }
    else if (institution != 'NENHUMA') {
        collegeID = parseInt(collegeID);
        if (isNaN(collegeID)) {
            hasError = true;
            ans.collegeID = "O campo 'Número de Matrícula' é inválido";
        }
    }
    
    resp = validateString(yearJoinGanesh, "Ano de ingresso no Ganesh", true, 12);
    if (resp) {
        hasError = true;
        ans.yearJoinGanesh = resp;
    }
    else {
        yearJoinGanesh = parseInt(yearJoinGanesh);
        if (isNaN(yearJoinGanesh)) {
            hasError = true;
            ans.yearJoinGanesh = "O campo 'Ano de ingresso no Ganesh' é inválido";
        }
    }

    return (hasError) ? ans : null;
}

module.exports = {
    async show (req, res) {
        if (req.params?.id) {
            let id = req.params.id;
            let resp = validateString(id, "userId", true, 100);
            if (resp) {
                return res.status(400).json({ userId: resp });
            }

            try {
                var user = await User.findById(req.params.id)
                                     .select("name course institution collegeID yearJoinCollege yearJoinGanesh email username role title isDeleted createdAt");
            } catch (error) {
                if (error.kind == "ObjectId") {
                    return res.status(404).json({ message: "Usuário não encontrado" });
                }

                console.log(error);
                return res.status(500).json({ message: "Houve um erro ao procurar o usuário" });
            }

            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            return res.status(200).json(user);
        }
        else if (req.query?.needsApproval == '1') {
            try {
                var users = await User.find({ needsApproval: true })
                                      .select("name course institution collegeID yearJoinCollege yearJoinGanesh email username");
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Houve um erro ao procurar usuários" });
            }

            return res.status(200).json(users);
        }
        else {
            try {
                var users = await User.find({ needsApproval: { $ne: true } })
                                      .select("email username yearJoinGanesh title isDeleted");
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Houve um erro ao procurar usuários" });
            }

            return res.status(200).json(users);
        }
    },

    async store (req, res) {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        
        let name = req.body.name;
        let institution = req.body.institution;
        let course = req.body.course;

        let collegeID = req.body.collegeID;
        let yearJoinCollege = req.body.yearJoinCollege;
        let yearJoinGanesh = req.body.yearJoinGanesh;
        
        let pingParticipant = (req.body.pingParticipant === true);
        let needsApproval = (pingParticipant && pingActive) ? false : true;

        if (pingParticipant && !pingActive) {
            return res.status(400).json({ pingParticipant: "Nosso processo de ingresso está fechado" });
        }
        
        let resp = validateUserFields(email, username, name, institution, course, collegeID, yearJoinCollege, yearJoinGanesh);
        if (resp) {
            return res.status(400).json(resp);
        }

        resp = validateString(password, "Senha", true, 64);
        if (resp) {
            hasError = true;
            ans.password = resp;
        }
        else {
            if (password.trim().length < 8) {
                return res.status(400).json({ password: "A senha precisa ter pelo menos 8 caracteres" });
            }
        }

        email = email.trim();
        username = username.trim();
        password = password.trim();
        name = name.trim();
        institution = institution.trim();
        course = course.trim();

        if (institution == "NENHUMA") {
            course = "NENHUM";
            yearJoinCollege = "";
            collegeID = "";
        }

        password = bCrypt.createHash(password);

        let role;
        let title;
        if (pingParticipant) {
            role = getRole("pingParticipant");
        }
        else {
            role = getRole("pendingApproval");
        }
        title = getTitle(role);

        try {
            var user = await User.create({
                createdAt: new Date(),
    
                email, 
                username,
                password, 
                name, 
    
                institution, 
                course,
                collegeID, 
                yearJoinCollege, 
                yearJoinGanesh,
    
                role,
                title,

                needsApproval,
    
                isDeleted: false,
            });
        } catch (error) {
            if (error.code == 11000) {
                if (error.keyValue.email) {
                    return res.status(409).json({ email: "Email já em uso" });
                }
                if (error.keyValue.username) {
                    return res.status(409).json({ username: "Apelido já em uso" });
                }
            } 
            console.log(error);
            return res.status(500).json({ message: "Houve um erro ao criar usuário" });
        }

        if (!user) {
            return res.status(500).json({ message: "Houve um erro ao criar usuário" });
        }

        return res.status(201).json({ message: "Usuário registrado com sucesso" });
    },

    async update (req, res) {
        let id = req.params?.id;
        let resp = validateString(id, "userId", true, 100);
        if (resp) {
            return res.status(400).json({ userId: resp });
        }

        let email = req.body.email;
        let username = req.body.username;
        
        let name = req.body.name;
        let institution = req.body.institution;
        let course = req.body.course;

        let collegeID = req.body.collegeID;
        let yearJoinCollege = req.body.yearJoinCollege;
        let yearJoinGanesh = req.body.yearJoinGanesh;

        let role = parseInt(req.body.role);

        resp = validateUserFields(email, username, name, institution, course, collegeID, yearJoinCollege, yearJoinGanesh);
        if (resp) {
            return res.status(400).json(resp);
        }

        if (isNaN(role) || !getTitle(role)) {
            return res.status(400).json({ role: "Cargo Inválido" });
        }

        email = email.trim();
        username = username.trim();
        name = name.trim();
        institution = institution.trim();
        course = course.trim();

        if (institution == "NENHUMA") {
            course = "NENHUM";
            yearJoinCollege = "";
            collegeID = "";
        }

        try {
            var user = await User.findById(id);
        } catch (error) {
            if (error.kind == "ObjectId") {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            console.log(error);
            return res.status(500).json({ message: "Houve um erro ao atualizar usuário" });
        }

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        let title;
        if (role != user.role) {
            if (await canChangeRole(req, res) == false) {
                return res.status(403).json({ role: "Não é possível mudar o cargo" });
            }
        }
        title = getTitle(role);

        try {
            await User.updateOne({ _id: id }, {
                email, 
                username, 
                name, 
    
                institution, 
                course,
                collegeID, 
                yearJoinCollege, 
                yearJoinGanesh,
    
                role,
                title,
            });
        } catch (error) {
            if (error.code == 11000) {
                if (error.keyValue.email) {
                    return res.status(409).json({ email: "Email já em uso" });
                }
                if (error.keyValue.username) {
                    return res.status(409).json({ username: "Apelido já em uso" });
                }
            } 
            console.log(error);
            return res.status(500).json({ message: "Houve um erro ao atualizar usuário" });
        }

        return res.status(200).json({ message: "Dados atualizados com sucesso!" });
    },

    async updatePassword (req, res) {
        let user = await SafeFindById(User, req.params?.id);
        let id = req.params?.id;
        
        let resp = validateString(id, "userId", true, 100);
        if (resp) {
            return res.status(400).json({ userId: resp });
        }

        if (!user) {
            return res.status(404).end();
        }

        let password = req.body?.newPassword;
        resp = validateString(password, 'Nova Senha', true, 64);
        if (resp) {
            return res.status(400).json({ newPassword: resp });
        }
        else {
            if (password.trim().length < 8) {
                return res.status(400).json({ message: "A senha precisa ter pelo menos 8 caracteres" });
            }
        }

        let oldPassword = req.body?.password;
        resp = validateString(oldPassword, 'Senha', true, 64);
        if (resp) {
            return res.status(400).json({ password: resp });
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
            return res.status(500).end({ message: "Houve um erro ao atualizar senha" });
        }

        return res.status(200).json({ message: "Senha atualizada com sucesso!" });
    },

    async destroy (req, res) {
        let id = req.params?.id;
        
        let resp = validateString(id, "userId", true, 100);
        if (resp) {
            return res.status(400).json({ userId: resp });
        }
        
        try {
            var user = await User.findById(id);
        } catch (error) {
            if (error.kind == "ObjectId") {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
        }

        if (!user) {
            return res.status(404).json({ userId: "Usuário não encontrado" });
        }

        user.isDeleted = true;

        try {
            user.save();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Não foi possível excluir a conta" });
        }

        req.logOut();
        return res.status(200).json({ message: "Conta excluída com sucesso!" });
    },

    async verify (email, password) {
        if (!email || !password) {
            return null;
        }

        let user = await SafeFindOne(User, { email });
        if (!user)
            return null;

        if (user.isDeleted == true || user.needsApproval == true) {
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
    },

    async acceptUser (req, res) {
        let email = req.body.email;
        let role = 80;
        let title = getTitle(role);

        let resp = validateString(email, "Email", true, 64);
        if (resp) {
            return res.status(400).json({ email: resp });
        }
    
        let user = await SafeFindOne(User, { email });
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        user.role = role;
        user.title = title;
        user.needsApproval = false;

        try {
            user.save();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Houve um erro ao aprovar usuário" });
        }

        return res.status(200).json({ message: "Usuário aprovado com sucesso" });
    },

    async rejectUser (req, res) {
        let email = req.body.email;

        let resp = validateString(email, "Email", true, 64);
        if (resp) {
            return res.status(400).json({ email: resp });
        }

        try {
            await User.deleteOne({ email });
        } catch (error) {
            return res.status(500).json({ message: "Não foi possível deletar o usuário" });
        }

        return res.status(200).json({ message: "Usuário deletado com sucesso" });
    }
}
