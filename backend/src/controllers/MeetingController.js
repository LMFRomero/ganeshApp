const { frequencyClient } = require('../services/redis-store');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const Front = require('../models/Front');

const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec');
const { validateString} = require('../utils/str');

function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function generateObjectToSend (object, fieldNames) {
    let resp = object;

    for (let fieldName in fieldNames) {
    }

    return resp;
}

module.exports = {
    async show (req, res) {
        if (req.params?.id) {
            try {
                var meeting = await Meeting.findById(req.params.id)
                                           .select("title date duration place content front membersOnly isDeleted members author createdAt")
                                           .populate({ path: 'front', select: 'name slug' })
                                           .populate({ path: 'author', select: 'username title' })
                                           .populate({ path: 'members', select: 'username' });
            } catch (err) {
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

            if (req.user.role > 30) {
                filter.isDeleted = { $eq: false };
            }

            if (req.user.role > 80) {
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
            const pageSize = 10;
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
        const title = (req.body?.title)?.toString()?.trim();
        const content = (req.body?.content)?.toString()?.trim();
        const frontSlug = (req.body?.frontSlug)?.toString()?.trim();
        const duration = (req.body?.duration)?.toString()?.trim();
        const place = (req.body?.place)?.toString()?.trim();
        const membersOnly = (((req.body?.membersOnly)?.toString()?.trim()) == 'true');

        const date = new Date(req.body?.date);
        
        let front;   
        let resp;        

        resp = validateString(title, "título", true, 64);
        if (resp) {
            return res.status(400).json({ title: resp });
        }

        resp = validateString(content, "conteúdo", false, 1024);
        if (resp) {
            return res.status(400).json({ content: resp });
        }

        resp = validateString(frontSlug, "frontSlug", true, 16);
        if (resp) {
            return res.status(400).json({ frontSlug: resp });
        }

        front = await SafeFindOne(Front, { slug: frontSlug });
        if (!front) {
            return res.status(404).json({ frontSlug: "Frente não encontrada" });
        }

        resp = validateString(duration, "duração", false, 64);
        if (resp) {
            return res.status(400).json({ duration: resp });
        }

        resp = validateString(place, "local", false, 64);
        if (resp) {
            return res.status(400).json({ place: resp });
        }

        //TODO: fazer data nao obrigatoria
        resp = !(date instanceof Date && !isNaN(date));
        if (resp || date < new Date()) {
            return res.status(400).json({ date: "Data da reunião inválida" });
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

        return res.status(201).json({ message: "Reunião criada com sucesso!!" })
    },
    
    async update (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.body || !req.params.id)
            return res.status(400).end();

        const { title, front, room, duration } = req.body;
        let date = req.body.date;

        if (!title || !front || !date || isNaN(room) || isNaN(duration))
            return res.status(400).json({ message: "Missing information" });

        try {
            date = new Date(date);
            if (Object.prototype.toString.call(date) !== "[object Date]" || date == "Invalid Date")
                return res.status(400).json({ meeting: "Invalid date" });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Invalid date" });
        }

        let now = new Date();
        now.setHours(now.getHours()-3);
        if (now > date)
            return res.status(400).json({ message: "Date not allowed" });


        let meeting = await SafeFindById(Meeting, req.params.id);
        if (!meeting)
            return res.status(404).json({ message: "Meeting not found" });

        let previousFront = await SafeFindById(Front, meeting.front);
        if (!previousFront)
            return res.status(404).json({ message: "Previous front not found" });

        let different = (previousFront.name != front);
        let nextFront = null;
        if (different) {
            nextFront = await SafeFindOne(Front, { name: front });
            if (!nextFront)
                return res.status(404).json({ message: "New front not found" });

            let index = previousFront.meetings.indexOf(meeting._id);
            if (index > -1)
                previousFront.meetings.splice(index, 1);
    
            nextFront.meetings.push(meeting._id);
            meeting.front = nextFront._id;
        }

        meeting.title = title;
        meeting.date = date;
        meeting.room = room;
        meeting.duration = duration;

        try {
            await meeting.save();
            if (different) {
                await nextFront.save();
                await previousFront.save();
            }
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    },

    async destroy (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.params.id)
            return res.status(400).end();

        let meeting = await SafeFindById(Meeting, req.params.id);
        if (!meeting)
            return res.status(404).end();

        let size = meeting.members.length;
        for (let i = 0; i < size; i++) {
            let user = await SafeFindById(User, meeting.members[i]);
            if (!user)
                continue;

            let index = user.meetings.indexOf(meeting._id);
            if (index > -1)
                user.meetings.splice(index, 1);

            try {
                await user.save();
            } catch (error) {
                console.log(error);
                return res.status(500).end();
            }
        }

        let front = await SafeFindById(Front, meeting.front);
        if (!front)
            return res.status(404).end();

        let index = front.meetings.indexOf(meeting._id);
        if (index > -1)
            front.meetings.splice(index, 1);

        try {
            await front.save();
            await SafeDeleteOne(Meeting, { _id: meeting._id });
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        
        return res.status(200).end();
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