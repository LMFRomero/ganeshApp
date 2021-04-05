const { mongo } = require('mongoose');
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 64,
        required: true
    },
    content: {
        type: String,
        maxlength: 1024,
    },
    front: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Front'
    },
    date: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        maxlength: 64,
    },
    place: {
        type: String,
        maxlength: 64,
    },
    membersOnly: {
        type: Boolean,
        required: true,
    },

    frequencyCode: {
        type: Number,
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    isDeleted: {
        type: Boolean,
        required: true,
    }
});

module.exports = mongoose.model('Meeting', meetingSchema);