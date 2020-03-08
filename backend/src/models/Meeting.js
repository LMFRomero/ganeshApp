const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    front: String,
    date: Date,
    abstract: String,
    members: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Meeting', meetingSchema);