redisStore = require('../services/redis-store');
Meeting = require('../models/Meeting');
User = require('../models/User');

module.exports = {
    async store (req, res) {
        let user = null;

        if (!req.body || !req.body.sessionID) return res.status(400).end();

        redisStore.get(req.body.sessionID, async (error, session) => {
            if (error) console.log(error);

            user = await User.findOne({ "_id": session.passport.user });
        });

        if (!user) return res.status(400).end();

        const { title, front, date, duration, abstract } = req.body;
        const creator = user._id;

        const now = new Date();

        if (!title || !front || !abstract || !date || isNaN(duration)) return res.status(400).end();

        if (now > date) return res.status(400).json({ "message": "Date not allowed"});

        const meeting = await Meeting.create({title, front, abstract, date, duration, creator, "members": [] });
    }
}