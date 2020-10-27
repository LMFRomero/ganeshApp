const redisStore = require('../services/redis-store');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const transporter = require('../services/nodemailer-auth');
const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec');


module.exports = {
    //this function will store new Meetings into the database
    async store (req, res) {

        //verify if there is a body and if there is a session assigned to that request
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            return res.status(401).end();
        }

        const passportUser = req.session.passport.user;
        
        //find the user that will be defined as creator of the meeting request
        const user = await SafeFindById(User, passportUser.id);

        if (!user) {
            return res.status(401).end();
        }

        //get the attributes of the meeting from the front
        const { title, front, room } = req.body;
        const creator = user._id;
        const date = new Date(req.body.date);
        const now = new Date();

        //parse body params
        if (Object.prototype.toString.call(date) !== '[object Date]') {
            return res.status(400).end();
        }

        if (!title || !front || !abstract || isNaN(duration) || isNaN(room)) {
            return res.status(400).end();
        }

        if (now > date) {
            return res.status(400).json({ message: "Data Invalida" });
        }

        // //create a meeting in database
        let meeting = await SafeCreateObj(Meeting, {title, front, room, date, creator, "members": [] });

        if (!meeting) {
            return res.status(500).end();
        }

        return res.status(200).end();
    },
    
    async checkPresence (req, res) {
        //this function set presence of a member in a given meeting
        if (!req.session || !req.session.passaport || !req.session.passaport.user) {
            return res.status(401).end();
        }

        //find whether the given meeting exists or not
        const meeting = await SafeFindById(Meeting, req.params.id);

        if (!meeting) {
            return res.status(400).end();
        }

        //check if the presence can be set by comparing the dates (check if the meeting is taking place or note)
        const now = new Date();
        const meetingStart = new Date(meeting.date);
        let meetingFinish = meetingStart;
        meetingFinish.setHours(23);
        meetingFinish.setMinutes(59);
        meetingFinish.setSeconds(59);

        if (now < meetingStart || now > meetingFinish) {
            return res.status(400).end();
        }

        const user = await SafeFindById(User, session.passport.user.id);

        if (!user) {
            return res.status(401).end();
        }

        meeting.members.push(user._id);
        try {
            meeting.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        user.meetings.push(req.params.id);
        try {
            user.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    },

    async destroy (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            return res.status(401).end();
        }

        if (!req.params.id) {
            return res.status(400).end();
        }

        await SafeDeleteOne(Meeting, { "_id": req.params.id});
        
        return res.status(200).end();
    },

    async update (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            return res.status(401).end();
        }

        const { title, front} = req.body;
        const date = new Date(req.body.date);

        if (!req.params.id || !title || !front) {
            return res.status(400).end();
        }

        if (isNaN(room)) return res.status(400).end();

        if (Object.prototype.toString.call(date) !== '[object Date]') return res.status(400).end();

        await SafeUpdateOne(Meeting, { "_id": req.params.id }, { $set: { title, room, front, date} });

        return res.status(200).end();
    },

    async show (req, res) {
        const now = new Date();
        const objects = await SafeFind(Meeting, { date: { $gt: now } });

        return res.status(200).json(objects);
    },
}