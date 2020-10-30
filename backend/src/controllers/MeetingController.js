const redis = require('redis');
const redisClient = redis.createClient();
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const Front = require('../models/Front');
const transporter = require('../services/nodemailer-auth');

const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec');



module.exports = {
    //this function will store new Meetings into the database
    async store (req, res) {
        //verify if there is a body and if there is a session assigned to that request
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        const passportUser = req.session.passport.user;
        
        //find the user that will be defined as creator of the meeting request
        const user = await SafeFindById(User, passportUser.id);
        if (!user)
            return res.status(401).end();

        //get the attributes of the meeting from the front
        const { title, front, room } = req.body;
        const creator = user._id;
        let date = req.body.date;
        const now = new Date();
        
        //parse body params
        if (!title || !front || isNaN(room) || !date)
            return res.status(400).json({ message: "Missing information"});
        
        try {
                date = new Date(date);
                if (Object.prototype.toString.call(date) !== "[object Date]" || date == "Invalid Date")
                    return res.status(400).json({ meeting: "Invalid date" });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Invalid date" });
        }

        if (now > date)
            return res.status(400).json({ message: "Date not allowed" });
        
        let front_obj = await SafeFindOne(Front, { name: front });
        if (!front_obj)
            return res.status(400).json({ message: "Invalid front" });

        let tmp = await SafeFindOne(Meeting, { title: title });
        if (tmp)
            return res.status(400).json({ message: "Meeting already exists" });

        // create a meeting in database
        let meeting = await SafeCreateObj(Meeting, {title: title, front: front_obj._id, room: room, date: date, creator: creator });
        if (!meeting)
            return res.status(500).end();
            
        front_obj.meetings.push(meeting._id);
        
        try {
            await front_obj.save()
        } catch (error) {
            console.log(error)
            return res.status(500).end();
        }

        return res.status(200).end();
    },
    
    async update (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.body || !req.params.id)
            return res.status(400).end();

        const { title, front, room } = req.body;
        let date = req.body.date;

        if (!title || !front || !date || isNaN (room))
            return res.status(400).json({ message: "Missing information" });

        try {
            date = new Date(date);
            if (Object.prototype.toString.call(date) !== "[object Date]" || date == "Invalid Date")
                return res.status(400).json({ meeting: "Invalid date" });
        } catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Invalid date" });
        }

        let meeting = await SafeFindById(Meeting, req.params.id);
        if (!meeting)
            return res.status(404).json({ message: "Meeting not found" });

        let nextFront = await SafeFindOne(Front, { name: front });
        if (!nextFront)
            return res.status(404).json({ message: "New front not found" });

        let previousFront = await SafeFindById(Front, meeting.front);
        if (!previousFront)
            return res.status(404).json({ message: "Previous front not found" });

        let index = previousFront.meetings.indexOf(meeting._id);
        if (index > -1)
            previousFront.meetings.splice(index, 1);

        nextFront.meetings.push(meeting._id);

        meeting.title = title;
        meeting.date = date;
        meeting.room = room;
        meeting.front = nextFront._id;

        try {
            await meeting.save();
            await nextFront.save();
            await previousFront.save();
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
            await meeting.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        user.meetings.push(req.params.id);
        try {
            await user.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
    },



    async show (req, res) {
        const now = new Date();
        const objects = await SafeFind(Meeting, { date: { $gt: now } });

        return res.status(200).json(objects);
    },
}