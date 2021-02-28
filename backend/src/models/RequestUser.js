const mongoose = require('mongoose');

const RequestUserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    pingParticipant: {
        type: Boolean,
        required: true,
    },

    name: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true,
    },
    collegeID: {
        type: Number,
        required: true
    },
    course : {
        type: String,
        required: true
    },
    yearJoinCollege: {
        type: Number,
        required: true
    },
    yearJoinGanesh: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('RequestUser', RequestUserSchema);