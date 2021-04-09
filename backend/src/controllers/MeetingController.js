const { frequencyClient } = require('../services/redis-store');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const Front = require('../models/Front');

const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec');
const { validateString } = require('../utils/str');
const { isCoordinator, isMember } = require('../middlewares/perms');

function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function validateMeetingFields (title, content, frontSlug, duration, place, date) {
    let resp;

    let ans = {};
    let hasError = false;

    resp = validateString(title, "título", true, 64);
    if (resp) {
        hasError = true;
        ans.title = resp;
    }

    resp = validateString(content, "conteúdo", false, 1024);
    if (resp) {
        hasError = true;
        ans.content = resp;
    }

    resp = validateString(frontSlug, "frontSlug", true, 16);
    if (resp) {
        hasError = true;
        ans.frontSlug = resp;
    }

    resp = validateString(duration, "duração", false, 64);
    if (resp) {
        hasError = true;
        ans.duration = resp;
    }

    resp = validateString(place, "local", false, 64);
    if (resp) {
        hasError = true;
        ans.place = resp;
    }

    //TODO: fazer data nao obrigatoria
    resp = !(date instanceof Date && !isNaN(date));
    if (resp || date < new Date()) {
        hasError = true;
        ans.date = "Data da reunião inválida";
    }

    return (hasError) ? ans : null;
}

module.exports = {
    async show (req, res) {
        if (req.params?.id) {
            let resp = validateString(req.params.id, "userId", false, 100);
            if (resp) {
                return res.status(400).json({ userId: resp });
            }

            try {
                var meeting = await Meeting.findById(req.params.id)
                                           .select("title date duration place content front membersOnly isDeleted members author createdAt")
                                           .populate({ path: 'front', select: 'name slug -_id' })
                                           .populate({ path: 'author', select: 'username title -_id' })
                                           .populate({ path: 'members', select: 'username -_id' });
            } catch (error) {
                if (error.kind == "ObjectId") {
                    return res.status(404).json({ userId: "Usuário não encontrado" });
                }

                console.log(err);
                return res.status(500).end();
            }
            
            if (!meeting) {
                return res.status(404).json({ message: "Reunião não encontrada" });
            }

            return res.status(200).json(meeting);
        }
        else {
            let filter = {};

            if (isCoordinator(req) == false) {
                filter.isDeleted = { $eq: false };
            }

            if (isMember(req) == false) {
                filter.membersOnly = { $eq: false };
            }

            let slug = req.query.slug;
            let currentPage = parseInt(req.query.page);

            if (slug) {
                let front = await SafeFindOne(Front, { slug });
                if (front) {
                    filter.front = front._id;
                }
            }

            const docsSize = await Meeting.countDocuments(filter);
            const pageSize = 8;
            const div = docsSize/pageSize;

            const maxPage = Math.floor(div) + (Math.floor(div) != div);

            if (isNaN(currentPage) || currentPage < 1) {
                currentPage = 1;
            }

            if (currentPage > maxPage) {
                currentPage = maxPage;
            }

            let resp = { currentPage, maxPage };

            if (maxPage == 0) {
                resp.results = [];
                return res.status(200).json(resp);
            }

            try {
                var meetings = await Meeting.find(filter)
                                            .select("title date duration place front author createdAt members isDeleted")
                                            .populate({ path: "front", select: "name slug -_id" })
                                            .populate({ path: "author", select: "username title -_id" })
                                            .populate({ path: "members", select: "username -_id" })
                                            .skip(pageSize*(currentPage-1))
                                            .limit(pageSize)
                                            .sort({ isDeleted: 1, createdAt: -1 });
                resp.results = meetings;
            } catch (err) {
                console.log(err);
                return res.status(500).end();
            }

            return res.status(200).json(resp);
        }
    },
    
    async store (req, res) {
        let title = req.body?.title;
        let content = req.body?.content;
        let frontSlug = req.body?.frontSlug;
        let duration = req.body?.duration;
        let place = req.body?.place;
        let date = new Date(req.body?.date);
        let membersOnly = (req.body?.membersOnly === true);

        let resp = validateMeetingFields(title, content, frontSlug, duration, place, date);
        if (resp) {
            return res.status(400).json(resp);
        }

        title = title.trim();
        content = content.trim();
        frontSlug = frontSlug.trim();
        duration = duration.trim();
        place = place.trim();

        let front = await SafeFindOne(Front, { slug: frontSlug });
        if (!front) {
            return res.status(404).json({ frontSlug: "Frente não encontrada" });
        }

        let meeting = await SafeCreateObj (Meeting, {
            title,
            content,
            front: front._id,
            date,
            duration,
            place,
            membersOnly,

            author: req.user._id,
            createdAt: new Date(),
            members: [],

            isDeleted: false,
        });
        if (!meeting) {
            return res.status(500).json({ message: "Não foi possível criar a reunião" })
        }

        front.meetings.push(meeting._id);
        try {
            await front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Não foi possível salvar reunião na frente" });
        }

        return res.status(201).json({ message: "Reunião criada com sucesso!!" })
    },
    
    async update (req, res) {
        let id = req.params?.id;

        let title = req.body?.title;
        let content = req.body?.content;
        let frontSlug = req.body?.frontSlug;
        let duration = req.body?.duration;
        let place = req.body?.place;
        let date = new Date(req.body?.date);
        let membersOnly = (req.body?.membersOnly === true);
        let isDeleted = (req.body?.isDeleted === true);

        let resp = validateMeetingFields(title, content, frontSlug, duration, place, date);
        if (resp) {
            return res.status(400).json(resp);
        }

        resp = validateString(id, "meetingId", true, 100);
        if (resp) {
            return res.status(400).json({ meetingId: resp });
        }
        
        let meeting = await SafeFindById(Meeting, id);
        if (!meeting) {
            return res.status(404).json({ message: "Frente não encontrada" });
        }
        
        if (meeting.isDeleted != isDeleted && isCoordinator(req) == false) {
            return res.status(403).json({ message: "Não é possível mudar o estado da reunião" });
        }

        title = title.trim();
        content = content.trim();
        frontSlug = frontSlug.trim();
        duration = duration.trim();
        place = place.trim();

        let front = await SafeFindOne(Front, { slug: frontSlug });
        if (!front) {
            return res.status(404).json({ frontSlug: "Frente não encontrada" });
        }

        try {
            await Meeting.updateOne({ _id: id }, {
                title,
                content,
                front: front._id,
                date,
                duration,
                place,
                membersOnly,
                isDeleted
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Não foi possível atualizar reunião" });
        }

        return res.status(200).json({ message: "Reunião criada com sucesso!!" });
    },

    async destroy (req, res) {
        let id = req.params?.id;
        let resp = validateString(id, "meetingId", true, 100);
        if (resp) {
            return res.status(400).json({ meetingId: resp });
        }

        let meeting = await SafeFindById(Meeting, id);
        if (!meeting) {
            return res.status(404).json({ message: "Frente não encontrada" });
        }

        if (isCoordinator(req) == false) {
            meeting.isDeleted = true;
            
            try {
                meeting.save();
            } catch (error) {
                console.log(error);
                return res.status(500).end();
            }

            return res.status(200).end();
        }

        let size = meeting.members.length;
        for (let i = 0; i < size; i++) {
            let user = await SafeFindById(User, meeting.members[i]);
            if (!user) {
                continue;
            }

            let index = user.meetings.indexOf(meeting._id);
            if (index > -1) {
                user.meetings.splice(index, 1);
            }
            else {
                continue;
            }

            try {
                await user.save();
            } catch (error) {
                console.log(error);
                return res.status(500).end();
            }
        }
        
        let ans = await SafeDeleteOne(Meeting, { _id: meeting._id });
        if (ans.deletedCount < 1) {
            return res.status(500).json({ message: "Erro ao excluir a reunião" })
        }

        return res.status(200).json({ message: "Reunião excluída com sucesso" });
    },

    async checkTime (req, res, next) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.params || !req.params.code)
            return res.status(400);

        frequencyClient.get(req.params.code, async (err, reply) => {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }

            if (!reply)
                return res.status(404).end();

            let now = new Date();
            now.setHours(now.getHours()-3);

            const meeting = await SafeFindById(Meeting, reply);
            if (!meeting)
                return res.status(404).end();

            const start = new Date(meeting.date);
            const finish = new Date(meeting.date);
            finish.setHours(finish.getHours()+meeting.duration);

            if (now > finish || now < start)
                return res.status(400).end();

            next();
        });
        
        return res.status(400).end();
    },

    async checkMemberFrequency (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.params || !req.params.code || !req.body || !req.body.name)
            return res.status(400).end();
            
        frequencyClient.get(req.params.code, async (err, reply) => {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }

            if (!reply)
                return res.status(404).end();

            const meeting = await SafeFindById(Meeting, reply);
            if (!meeting)
                return res.status(400).end();

            const user = await SafeFindOne(User, { name: req.body.name });
            if (!user)
                return res.status(400).end();

            meeting.members.push(user._id);
            user.meetings.push(meeting._id);

            try {
                await user.save();
                await meeting.save();
            } catch (error) {
                console.log(error);
                return res.status(500).end();
            }

            return res.status(200).end();
        });
    },

    async generateMeetingCode (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.params || !req.params.id)
            return res.status(400).end();

        let meeting = await SafeFindById(Meeting, req.params.id);
        if (!meeting)
            return res.status(404).end();

        let code = getRandomInt(9000)+1000;
        //TODO: while true until unused code
        frequencyClient.exists(code, async (err, reply) => {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }

            if (!reply) {
                frequencyClient.set(code, req.params.id);
                frequencyClient.expire(code, 60 * 60 * 12);

                meeting.frequencyCode = code;

                try {
                    await meeting.save();
                } catch (error) {
                    console.log(error);
                    return res.status(500).end();
                }

                return res.status(200).end();
            }

            else {
                return res.status(500).end();
            }
        })

    }
}