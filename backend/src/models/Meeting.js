const { mongo } = require('mongoose');
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: Date,
    room: Number,
    front: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Front'
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Meeting', meetingSchema);