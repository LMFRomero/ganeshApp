const mongoose = require('mongoose');

const frontSchema = new mongoose.Schema ({
    name: String,
    coordinator: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    meetings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'
    }],
    userPermissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        role: String,
        perms: {
			materialPerms: Number,
			meetingsPerms: Number,
			presentationPerms: Number,
        }
    }]
});

module.exports = mongoose.model('Front', frontSchema);