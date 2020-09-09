const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    username: String,
    collegeID: Number,
    yearJoinCollege: Number,
    yearJoinGanesh: Number,

    meetings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'
    }],

    roleInt: Number,
});

module.exports = mongoose.model('User', UserSchema);