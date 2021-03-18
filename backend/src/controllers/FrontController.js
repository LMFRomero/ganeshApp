const Front = require('../models/Front');
const User = require('../models/User');
const Meeting = require('../models/Meeting');
const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec');
const { validateString } = require('../utils/str');


module.exports = {
    async store (req, res) {
        let name = (req.body?.name)?.toString()?.trim();
        let slug = (req.body?.slug)?.toString()?.trim();
        let description = (req.body?.description)?.toString()?.trim();
        let type = (req.body?.type)?.toString()?.trim();
        let membersOnly = ((req.body?.membersOnly)?.toString()?.trim() == 'true');

        const frontTypes = ["study", "special", "internal"];

        const regexp = {
            slugName: "/[a-zA-Z0-9-]*$/g",
            alpha: "/[a-zA-Z]*$/g",
            alNum: "/[a-zA-Z0-9]*$/g"
        }

        let resp = validateString(name, "name", 32, regexp.alNum);
        if (resp) {
            return res.status(400).json({ name: resp });
        }

        let front = await SafeFindOne(Front, { name });
        if (front) {
            return res.status(400).end({ name: "Nome já usado" });
        }

        resp = validateString(slug, "slug", 16, regexp.slugName);
        if (resp) {
            return res.status(400).json({ slug: resp });
        }
        if (slug.length < 3) {
            return res.status(400).json({ slug: 'O campo slug só aceita no mínimo 3 caracteres'});
        }

        resp = validateString(description, "description", 512, regexp.alNum);
        if (resp) {
            return res.status(400).json({ description: resp });
        }

        resp = validateString(type, "type", 512, regexp.alNum);
        if (resp) {
            return res.status(400).json({ type: resp });
        }

        if (!(type in frontTypes)) {
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
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.body || !req.params.frontName)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        if (front.deleted)
            return res.status(200).end();

        let size = front.members.length;
        for (let i = 0; i < size; i++) {
            let userId = front.members[i];
            let user = await SafeFindById(User, userId);
            if (!user)
                continue;

            let index = user.fronts.indexOf(user._id);
            if (index > -1)
                user.fronts.splice(index, 1);
            
            try {
                await user.save();
            } catch (error) {
                console.log(error);
                return res.status(500).end();
            }
        }

        front.deleted = true;

        try {
            await front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
        
        return res.status(200).end();
    },

    async update (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.body || !req.body.name || !req.params.frontName)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        front.name = req.body.name;
        front.imgStr = req.body.imgStr;

        try {
            await front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    },

    async addUser (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.params.frontName || !req.body || !req.body.name)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        let user = await SafeFindOne(User, { name: req.body.name });
        if (!user)
            return res.status(404).end();

        if (user.fronts.indexOf(front._id) == -1)
            user.fronts.push(front._id);
        if (front.members.indexOf(user._id) == -1)
            front.members.push(user._id);

        try {
            await user.save();
            await front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    },

    async removeUser (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
        return res.status(401).end();

        if (!req.params.frontName || !req.body || !req.body.name)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        let user = await SafeFindOne(User, { name: req.body.name });
        if (!user)
            return res.status(404).end();


        let index = user.fronts.indexOf(front._id);
        if (index > -1)
            user.fronts.splice(index, 1);

        index = front.members.indexOf(user._id);
        if (index > -1)
            front.members.splice(index, 1);

            
        try {
            await user.save();
            await front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
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