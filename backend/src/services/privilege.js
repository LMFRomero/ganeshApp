const User = require('../models/User');
const Front = require('../models/Front');

const roles = require('../utils/roles');
const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec'); 

module.exports = {
    changeRole (user, role) {
        if (!user) {
            return false;
        }
        
        let roleInt = roles.getRoleInt(role);
        if (roleInt == -1) {
            return false
        }

        user.roleInt = roleInt;

        return true;
    },

    async setGlobalRole (id, role) {
        const user = await SafeFindById(User, id);
        if (!user) {
            return false;
        }
        
        const roleInt = roles.getRoleInt(role);
        if (roleInt == -1)  {
            return false;
        }

        user.roleInt = roleInt;

        try {
            await user.save();
        } catch (error) {
            console.log(error);
            return false;
        }

        return true;
    },

    async isCoordinator (id) {
        let user = await SafeFindById(User, id);
        if (!user) {
            return false;
        }

        return (user.roleInt < 30);
    },
}