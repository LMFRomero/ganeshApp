const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: String,
    front: String,
    date: Date,
    room: Number,
    creator: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Meeting', meetingSchema);