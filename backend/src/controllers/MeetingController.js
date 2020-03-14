const redisStore = require('../services/redis-store');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const transporter = require('../services/nodemailer-auth');
const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec');


module.exports = {
    //this function will store new Meetings into the database
    async store (req, res) {
        //verify if there is a body and if there is a session assigned to that request
        if (!req.body || !req.body.sessionID) {
            return res.status(401).end();
        }

        try {
            //get the user attached to that session and create a meeting 
            redisStore.get(req.body.sessionID, async (error, session) => {
                if (error) {
                    console.log(error);
                    return;
                }

                const passportID = session.passport.user;
                
                //find the user that will be defined as creator of the meeting request
                const user = await SafeFindById(User, passportID);

                if (!user) {
                    return res.status(401).end();
                }

                //get the attributes of the meeting from the front
                const { title, front, duration, abstract, room } = req.body;
                const creator = user._id;
                const date = new Date(req.body.date);
                const now = new Date();

                //parse body params
                if (Object.prototype.toString.call(date) !== '[object Date]') {
                    console.log(1)
                    return res.status(400).end();
                }

                if (!title || !front || !abstract || isNaN(duration) || isNaN(room)) {
                    console.log(2);
                    return res.status(400).end();
                }

                if (now > date) {
                    console.log(3);
                    return res.status(400).json({ message: "Data Invalida" });
                }

                //create a meeting in database
                await SafeCreateObj(Meeting, {title, front, abstract, room, date, duration, creator, "members": [] });

                return res.status(200).end();
            });

        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }       
    },
    
    async update (req, res) {
        //this function set presence of a member in a given meeting
        if (!req.body || !req.body.sessionID) {
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
        meetingFinish.setHours(meetingStart.getHours()+duration);

        if (now < meetingStart || now > meetingFinish) {
            return res.status(400).end();
        }
        
        try {
            //checks if there is a session assigned to the user in redis and set his frequency in the meeting
            redisStore.get(req.body.sessionID, async (error, session) => {
                if (error) {
                    console.log(error);
                    return res.status(400).end();
                }

                const user = await SafeFindById(User, session.passport.user);

                if (!user) {
                    return res.status(401).end();
                }

                meeting.members.push(user._id);
                await meeting.save();

                user.meetings.push(req.params.id);
                await user.save();

                return res.status(200).end();
            });

        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }
    },

    async destroy (req, res) {
        if (!req.body || !req.body.sessionID) {
            return res.status(401).end();
        }

        if (!req.params.id) {
            return res.status(400).end();
        }

        await SafeDeleteOne(Meeting, { "_id": req.params.id});
        
        return res.status(200).end();
    },

    async changeMeeting (req, res) {
        if (!req.body || !req.body.sessionID) {
            return res.status(401).end();
        }

        const { title, front, abstract, duration } = req.body;
        const date = new Date(req.body.date);

        if (!req.params.id || !title || !front || !abstract) {
            return res.status(400).end();
        }

        if (isNaN(duration) || isNaN(room)) return res.status(400).end();

        if (Object.prototype.toString.call(date) !== '[object Date]') return res.status(400).end();

        await SafeUpdateOne(Meeting, { "_id": req.params.id }, { $set: { title, room, front, abstract, date, duration } });

        return res.status(200).end();
    },

    async show (req, res) {
        const now = new Date();
        const objects = await SafeFind(Meeting, { date: { $gt: now } });

        return res.status(200).json(objects);
    },
}