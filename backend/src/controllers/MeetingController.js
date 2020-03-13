redisStore = require('../services/redis-store');
Meeting = require('../models/Meeting');
User = require('../models/User');

module.exports = {
    async store (req, res) {
        let passportID;

        if (!req.body || !req.body.sessionID) return res.status(401).end();

        
        redisStore.get(req.body.sessionID, async (error, session) => {
            if (error) {
                console.log(error);
                return;
            }

            passportID = session.passport.user;
            
            let user = await User.findOne({ "_id": passportID });
            
            if (!user) return res.status(401).end();
    
            const { title, front, date, duration, abstract } = req.body;
            const creator = user._id;
            const now = new Date();

            if (Object.prototype.toString.call(date) !== '[object Date]') return res.status(400).end();
    
            if (!title || !front || !abstract || isNaN(duration)) return res.status(400).end();
    
            if (now > date) return res.status(400).json({ "message": "Date not allowed"});
    
            const meeting = await Meeting.create({title, front, abstract, date, duration, creator, "members": [] });

            return res.status(200).end();
        });
    },
    
    async update (req, res) {
        let user;

        if (!req.body || !req.body.sessionID) {
            return res.status(401).end();
        }

        redisStore.get(req.body.sessionID, async (error, session) => {
            if (error) {
                console.log(error);
                return res.status(400).end();
            }

            user = await User.findOne({ "_id": session.passport.user });

            if (!user) return res.status(401).end();
            
            const meeting = await Meeting.findOne({ "_id": req.params.id });

            meeting.members.push(user._id);

            console.log(meeting.members);
    
            await meeting.save();

            return res.status(200).end();
        });

    },

    async destroy (req, res) {
        if (!req.body || !req.body.sessionID) {
            return res.status(401).end();
        }

        if (!req.params.id) {
            return res.status(400).end();
        }

        await Meeting.deleteOne({ "_id": req.params.id});

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
        
        const meeting = await Meeting.updateOne({ "_id": req.params.id }, { $set: { title, front, abstract, date, duration } });

        return res.status(200).end();
    },
}