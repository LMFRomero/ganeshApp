const Front = require('../models/Front');
const User = require('../models/User');
const Meeting = require('../models/Meeting');
const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec');
const { validateString, regexp } = require('../utils/str');


module.exports = {
    async show (req, res) {
        if (req.params?.id) {
            let fieldNames = ["name", "slug", "description", "type", "membersOnly", "isDeleted"];
            let resp = await SafeFindById(Front, req.params.id);

            if (!resp) {
                return res.status(404).json({ message: "Frente não encontrada" });
            }

            let front = {};
            front.id = resp._id;

            for (let fieldName of fieldNames) {
                front[fieldName] = resp[fieldName];
            }
            
            return res.status(200).json(front);
        }
        else {
            let fieldNames = ["name", "description", "type", "isDeleted", "slug"];
            let fronts = await SafeFind(Front, {});
             
            if (!fronts) {
                return res.status(200).json({});
            }

            let resp = [];

            for (let front of fronts) {
                if (front.isDeleted && req.user?.role > 30) {
                    continue;
                }
    
                if (front.membersOnly && req.user?.role > 60) {
                    continue;
                }
    
                if (front.type == 'internal' && req.user?.role > 30) {
                    continue;
                }

                let tmpFront = {};

                tmpFront.id = front._id;

                for (let fieldName of fieldNames) {
                    tmpFront[fieldName] = front[fieldName];
                }

                await Front.populate(front, { path: 'members', select: 'username' });
                tmpFront.members = front.members;

                tmpFront.members = front.members;

                resp.push(tmpFront);
            }

            return res.status(200).json({resp});
        }
    },

    async showOptions (req, res) {
        try {
            var fronts = await Front.find({}, 'name slug isDeleted membersOnly');
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        let resp = [];
        let fieldNames = ["name", "slug"];
    
        for (let front of fronts) {
            if (front.isDeleted && req.user?.role > 30) {
                continue;
            }

            if (front.membersOnly && req.user?.role > 60) {
                continue;
            }

            if (front.type == 'internal' && req.user?.role > 30) {
                continue;
            }

            let tmpFront = {};
            tmpFront.id = front._id;

            for (let fieldName of fieldNames) {
                tmpFront[fieldName] = front[fieldName];
            }

            resp.push(tmpFront);
        }

        return res.status(200).json({ options: resp });
    },

    async store (req, res) {
        let name = (req.body?.name)?.toString()?.trim();
        let slug = (req.body?.slug)?.toString()?.trim();
        let description = (req.body?.description)?.toString()?.trim();
        let type = (req.body?.type)?.toString()?.trim();
        let membersOnly = ((req.body?.membersOnly)?.toString()?.trim() == 'true');

        const frontTypes = ["study", "special", "internal"];

        let resp = validateString(name, "name", true, 32, regexp.alNum);
        if (resp) {
            return res.status(400).json({ name: resp });
        }

        let front = await SafeFindOne(Front, { name: name });
        if (front) {
            return res.status(400).json({ name: "Nome já usado" });
        }

        resp = validateString(slug, "slug", true, 16, regexp.slugName);
        if (resp) {
            return res.status(400).json({ slug: resp });
        }
        if (slug.length < 3) {
            return res.status(400).json({ slug: 'O campo slug só aceita no mínimo 3 caracteres'});
        }

        front = await SafeFindOne(Front, { slug });
        if (front) {
            return res.status(400).json({ slug: "Slug já usado" });
        }

        resp = validateString(description, "description", false, 512, regexp.alNum);
        if (resp) {
            return res.status(400).json({ description: resp });
        }

        resp = validateString(type, "type", true, 512, regexp.alNum);
        if (resp) {
            return res.status(400).json({ type: resp });
        }

        if (frontTypes.includes(type) == false) {
            return res.status(400).json({ type: 'O campo type tem valor inválido '});
        }

        front = await SafeCreateObj(Front, { 
            name,
            slug,
            description,
            type,
            membersOnly,
            
            createdAt: Date.now(),
            isDeleted: false,

            members: [],
            meetings: []
        });

        if (!front) {
            return res.status(500).end({ message: "Não foi possível criar a frente" });
        }
        
        return res.status(201).json({ message: "Frente criada com sucesso!!" });
    },

    async destroy (req, res) {        
        let slug = (req.params.slug)?.toString()?.trim();
        let front = await SafeFindOne(Front, { slug });

        if (!front) {
            return res.status(404).json({ message: "Frente não encontrada" });
        }

        let meetingsSize = front.meetings.length;
        if (meetingsSize > 0) {
            return res.status(400).json({ message: "A frente ainda possui reuniões vinculadas. Desvincule as reuniões ou as exclua." })
        }

        let membersSize = front.members.length;
        for (let i = 0; i < membersSize; i++) {
            let userId = front.members[i];
            let user = await SafeFindById(User, userId);
            if (!user) {
                continue;
            }

            let index = user.fronts.indexOf(front._id);
            if (index > -1) {
                user.fronts.splice(index, 1);
            }
            else {
                continue;
            }
            
            try {
                await user.save();
            } catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Erro ao remover usuário da frente" });
            }
        }

        try {
            await SafeDeleteOne(Front, { slug });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Erro ao excluir a frente" });
        }
        
        return res.status(200).json({ message: "Frente excluída com sucesso" });
    },

    async update (req, res) {
        let name = (req.body?.name)?.toString()?.trim();
        let slug = (req.body?.slug)?.toString()?.trim();
        let description = (req.body?.description)?.toString()?.trim();
        let type = (req.body?.type)?.toString()?.trim();
        let membersOnly = (req.body?.membersOnly)?.toString()?.trim();
        let isDeleted = (req.body?.isDeleted)?.toString()?.trim();

        let currFront = await SafeFindOne(Front, { slug: req.params?.slug });
        if (!currFront) {
            return res.status(404).json({ message: "Frente não encontrada" });
        }

        const frontTypes = ["study", "special", "internal"];

        if (name) {
            let resp = validateString(name, "name", true, 32, regexp.alNum);
            if (resp) {
                return res.status(400).json({ name: resp });
            }

            let front = await SafeFindOne(Front, { name: name });
            if (front) {
                return res.status(400).json({ name: "Nome já usado" });
            }

            currFront.name = name;
        }
        

        if (slug) {
            resp = validateString(slug, "slug", true, 16, regexp.slugName);
            if (resp) {
                return res.status(400).json({ slug: resp });
            }
            if (slug.length < 3) {
                return res.status(400).json({ slug: 'O campo slug só aceita no mínimo 3 caracteres'});
            }

            let front = await SafeFindOne(Front, { slug });
            if (front) {
                return res.status(400).json({ slug: "Slug já usado" });
            }

            currFront.slug = slug;
        }
        
        if (description) {
            resp = validateString(description, "description", false, 512, regexp.alNum);
            if (resp) {
                return res.status(400).json({ description: resp });
            }
            
           currFront.description =  description;
        }
        
        if (type) {
            resp = validateString(type, "type", true, 512, regexp.alNum);
            if (resp) {
                return res.status(400).json({ type: resp });
            }
            
            if (frontTypes.includes(type) == false) {
                return res.status(400).json({ type: 'O campo type tem valor inválido '});
            }

            currFront.type = type;
        }

        if (membersOnly) {
            currFront.membersOnly = (membersOnly == 'true');
        }

        if (isDeleted) {
            currFront.isDeleted = (isDeleted == 'true');
        }
        
        try {
            currFront.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).json({ message: "Frente atualizada com sucesso!!" });
    },

    async addUser (req, res) {
        let slug = (req.params?.slug)?.toString()?.trim();
        let username = (req.body?.username)?.toString()?.trim();

        let front = await SafeFindOne(Front, { slug });
        if (!front) {
            return res.status(404).json({ message: "Frente não encontrada" });
        }

        let user = await SafeFindOne(User, { username });
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        if (user.fronts.indexOf(front._id) == -1) {
            user.fronts.push(front._id);
        }

        if (front.members.indexOf(user._id) == -1) {
            front.members.push(user._id);
        }

        try {
            await user.save();
            await front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Não foi possível adicionar o usuário" });
        }

        return res.status(200).json({ message: "Membro adicionado com sucesso!!" });
    },

    async removeUser (req, res) {
        let slug = (req.params?.slug)?.toString()?.trim();
        let username = (req.body?.username)?.toString()?.trim();

        let front = await SafeFindOne(Front, { slug });
        if (!front) {
            return res.status(404).json({ message: "Frente não encontrada" });
        }

        let user = await SafeFindOne(User, { username });
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }


        let index = user.fronts.indexOf(front._id);
        if (index > -1) {
            user.fronts.splice(index, 1);
        }

        index = front.members.indexOf(user._id);
        if (index > -1) {
            front.members.splice(index, 1);
        }
            
        try {
            await user.save();
            await front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Não foi possível remover o usuário" });
        }

        return res.status(200).json({ message: "Membro removido com sucesso!!" });
    },

    async addMeeting (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.body || !req.body.meetingId || !req.params.frontName)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        let meeting = await SafeFindById(Meeting, req.body.meetingId);
        if (!meeting)
            return res.status(404).end();

        meeting.front = front._id;
        front.meetings.push(meeting._id);

        try {
            await meeting.save();
            await front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    },

    async removeMeeting (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
        return res.status(401).end();

        if (!req.body || !req.body.meetingId || !req.params.frontName)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        let meeting = await SafeFindById(Meeting, req.body.meetingId);
        if (!meeting)
            return res.status(404).end();

        meeting.front = "";

        index = front.meetings.indexOf(meeting._id);
        if (index > -1)
            front.meetings.splice(index, 1);

        try {
            await meeting.save();
            await front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    }
};