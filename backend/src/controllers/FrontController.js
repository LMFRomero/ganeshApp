const Front = require('../models/Front');
const User = require('../models/User');
const Meeting = require('../models/Meeting');
const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec');


module.exports = {
    async store (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();
        
        if (!req.body || !req.body.name)
            return res.status(400).end();

        let front = await SafeCreateObj(Front, { name: req.body.name });
        if (!front)
            return res.status(500).end();
        
        return res.status(201).end();
    },

    async destroy (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.body || !req.params.frontName)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        for (let i = 0; i < front.members.length; i++) {
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
            }
        }

        let ans = await SafeDeleteOne(Front, { name: req.params.frontName });
        if (!ans)
            return res.status(404).end();
        
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