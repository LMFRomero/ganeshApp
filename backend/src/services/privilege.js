const User = require('../models/User');
const Front = require('../models/Front');

const roles = require('../utils/roles');
const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec'); 

module.exports = {
    async changeRole (req, res) {
        if (!req.params.username || !req.body || !req.body.role)
            return res.status(400).end();

        let user = await SafeFindOne(User, { username: req.params.username });
        if (!user)
            return res.status(400).end();
        
        let roleInt = roles.getRoleInt(req.body.role);
        if (roleInt == -1)
            return res.status(400).end();

        user.roleInt = roleInt;
        try {
            await user.save();
        } catch (error) {
            console.log(error);
            return res.status(500).end();
        }

        return res.status(200).end();
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