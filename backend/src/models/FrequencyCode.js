const mongoose = require('mongoose');
const ttl = require('mongoose-ttl');

const frequencyCode = new mongoose.Schema ({
    code: {
        type: Number,
        required: true,
        unique: true,
    },
    meeting: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting',
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    createdAt: {
        type: Date,
        required: true,
    }
});

frequencyCode.plugin(ttl);

module.exports = mongoose.model('FrequencyCode', frequencyCode);