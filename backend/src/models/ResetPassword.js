const mongoose = require('mongoose');
const ttl = require('mongoose-ttl');

const resetPasswordSchema = new mongoose.Schema ({
    name: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        unique: true,
        required: true
    }
});

resetPasswordSchema.plugin(ttl, { ttl: 3600*1000 });

module.exports = mongoose.model('resetPassword', resetPasswordSchema);