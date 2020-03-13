const mongoose = require('mongoose');
const ttl = require('mongoose-ttl');

const resetPasswordSchema = new mongoose.Schema ({
    name: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

resetPasswordSchema.plugin(ttl, { ttl: 3600000 });

module.exports = mongoose.model('resetPassword', resetPasswordSchema);