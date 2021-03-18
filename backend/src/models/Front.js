const mongoose = require('mongoose');

const frontSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 32,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 16,
    },
    frontType: {
        type: String,
        required: true,
    },
    membersOnly: {
        type: Boolean,
        required: true,
    },

    createdAt: {
        type: Date,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    meetings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
    }],
});

module.exports = mongoose.model('Front', frontSchema);