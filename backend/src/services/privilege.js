const User = require('../models/User');
const Front = require('../models/Front');

const roles = require('../utils/roles');
const perms = require('../utils/perms');
const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec'); 

module.exports = {
    async setGlobalRole (id, role) {
        const user = await SafeFindById(User, id);
        if (!user) return null;
        
        const roleTemplate = roles.getGlobalTemplate(role);
        if (!roleTemplate) return null;

        user.roleInt = roleTemplate.roleInt;

        try {
            user.save();
        } catch (error) {
            console.log(error);
            return 500;
        }

        return true;
    },

    async hasPerm (req, res, next) {
        let id
    }
}