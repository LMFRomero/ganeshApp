const { frequencyClient } = require('../services/redis-store');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const Front = require('../models/Front');
const transporter = require('../services/nodemailer-auth');

const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec');

function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max));
}

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
        const { title, front, room, duration } = req.body;
        const creator = user._id;
        let date = req.body.date;
        let now = new Date();
        now.setHours(now.getHours()-3);
        
        //parse body params
        if (!title || !front || isNaN(room) || !date || isNaN(duration))
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
        let meeting = await SafeCreateObj(Meeting, {title: title, front: front_obj._id, room: room, date: date, creator: creator, duration: duration });
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

    async show (req, res) {
        const now = new Date();
        const objects = await SafeFind(Meeting, { date: { $gt: now } });

        return res.status(200).json(objects);
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

            console.log(req.body.name)

            const user = await SafeFindOne(User, { name: req.body.name });
            if (!user)
                return res.status(400).end();

            console.log(1)

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

        let code = getRandomInt(9000)+1000;
        //TODO: while true until unused code
        frequencyClient.exists(code, (err, reply) => {
            if (err) {
                console.log(err);
                return res.status(500).end();
            }

            if (!reply) {
                frequencyClient.set(code, req.params.id);
                frequencyClient.expire(code, 60 * 60 * 12);
                return res.status(200).end();
            }

            else {
                return res.status(500).end();
            }
        })

    }
}