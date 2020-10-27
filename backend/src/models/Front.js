const mongoose = require('mongoose');

const frontSchema = new mongoose.Schema ({
    name: {
        type: String,
        unique: true,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    meetings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'
    }],
});

module.exports = mongoose.model('Front', frontSchema);