const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    username: String,
    NUSP: Number,
    anoIngressoUSP: Number,
    anoIngressoGanesh: Number,

    meetings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'
    }],

    roleInt: Number,
    globalPermission: {
        materialPerms: Number,
        meetingsPerms: Number,
        presentationPerms: Number,
        accoutPerms: Number,
    }
});

module.exports = mongoose.model('User', UserSchema);