const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
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
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    collegeID: {
        type: Number,
        unique: true,
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

    meetings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'
    }],

    fronts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Front'
    }],
    roleInt: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('User', UserSchema);