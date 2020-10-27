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
                user.save();
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
        try {
            front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    },

    async addUser (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.params.frontName)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        let user = SafeFindById(User, req.session.passport.user.id);
        if (!user)
            return res.status(404).end();

        user.fronts.push_back(front._id);
        front.members.push_back(user._id);

        try {
            user.save();
            front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    },

    async removeUser (res, req) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
        return res.status(401).end();

        if (!req.params.frontName)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        let user = SafeFindById(User, req.session.passport.user.id);
        if (!user)
            return res.status(404).end();

        let index = user.fronts.indexOf(front._id);
        if (index > -1)
            user.fronts.splice(index, 1);

        index = front.members.indexOf(user._id);
        if (index > -1)
            front.members.splice(index, 1);

        try {
            user.save();
            front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    },

    async addMeeting (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.body || !req.body.meeting || !req.params.frontName)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        let meeting = SafeFindById(Meeting, req.body.meeting);
        if (!meeting)
            return res.status(404).end();

        meeting.front = front._id;
        front.meetings.push_back(meeting._id);

        try {
            meeting.save();
            front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    },

    async removeMeeting (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
        return res.status(401).end();

        if (!req.body || !req.body.meeting || !req.params.frontName)
            return res.status(400).end();

        let front = await SafeFindOne(Front, { name: req.params.frontName });
        if (!front)
            return res.status(404).end();

        let meeting = SafeFindById(Meeting, req.body.meeting);
        if (!meeting)
            return res.status(404).end();

        meeting.front = "";

        index = front.meetings.indexOf(meeting._id);
        if (index > -1)
            front.meetings.splice(index, 1);

        try {
            meeting.save();
            front.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    }
};