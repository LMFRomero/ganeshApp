const mongoose = require('mongoose');

const RequestUserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    username: String,
    collegeID: Number,
    yearJoinCollege: Number,
    yearJoinGanesh: Number,
});

module.exports = mongoose.model('RequestUser', RequestUserSchema);