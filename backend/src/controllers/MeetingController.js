redisStore = require('../services/redis-store');
Meeting = require('../models/Meeting');
User = require('../models/User');
const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj } = require('../services/safe-exec');
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
                const { title, front, date, duration, abstract } = req.body;
                const creator = user._id;
                const now = new Date();

                //parse body params
                if (Object.prototype.toString.call(date) !== '[object Date]') {
                    return res.status(400).end();
                }

                if (!title || !front || !abstract || isNaN(duration)) {
                    return res.status(400).end();
                }

                if (now > date) {
                    return res.status(400).end();
                }

                //create a meeting in database
                await SafeCreateObj(Meeting, {title, front, abstract, date, duration, creator, "members": [] });
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
        const meetingStart = meeting.date;
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

        const { title, front, abstract, date, duration } = req.body;

        if (!req.params.id || !title || !front || !abstract) {
            return res.status(400).end();
        }

        if (isNaN(duration) == true) return res.status(400).end();

        if (Object.prototype.toString.call(date) !== '[object Date]') return res.status(400).end();

        await SafeUpdateOne(Meeting, { "_id": req.params.id }, { $set: { title, front, abstract, date, duration } });

        return res.status(200).end();
    },
}