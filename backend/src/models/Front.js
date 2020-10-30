const mongoose = require('mongoose');

const frontSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    imgStr: {
        type: String
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    meetings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'
    }],
    deleted: {
        type: Boolean
    }
});

module.exports = mongoose.model('Front', frontSchema);