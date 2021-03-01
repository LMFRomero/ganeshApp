const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true
    },
    collegeID: {
        type: Number,
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