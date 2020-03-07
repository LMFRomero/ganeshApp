const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    username: String,
    NUSP: Number,
    anoIngressoUSP: Number,
    anoIngressoGanesh: Number,
    privilege: Number,
});

module.exports = mongoose.model('User', UserSchema);