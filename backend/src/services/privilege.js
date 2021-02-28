const User = require('../models/User');
const Front = require('../models/Front');

const roles = require('../utils/roles');
const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec'); 

module.exports = {
    async changeRole (req, res) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();
        
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

    async canManageMembers (req, res, next) {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            return res.status(401).end();
        }

        let user = await SafeFindById(User, req.session.passport.user.id);
        if (!user) {
            return res.status(401).end();
        }
        
        if (user.roleInt >= 30) {
            return res.status(403).end();
        }
        
        next();
    },

    async canChangeRole (req, res, next) {
        if (!req.session || !req.session.passport || !req.session.passport.user)
            return res.status(401).end();

        if (!req.params.username || !req.body || !req.body.role)
            return res.status(400).end();

        let user = await SafeFindById(User, req.session.passport.user.id);
        if (!user) {
            return res.status(401).end();
        }

        if (user.roleInt > 30) {
            return res.status(403).end();
        }
        
        let changedUser = await SafeFindOne(User, { username: req.params.username} );
        if (!changedUser) {
            return res.status(400).end();
        }

        //coordinator can't promote or demote coordinator
        if (user.roleInt > 20 && changedUser.roleInt < 30) {
            return res.status(403).end();
        }

        if (changedUser.roleInt <= user.roleInt) {
            return res.status(403).end();
        }

        newRoleInt = getRoleInt(req.body.role);
        if (newRoleInt == -1) {
            return res.status(400).end();
        }
        
        if (newRoleInt <= user.roleInt) {
            return res.status(403).end();
        }

        next();
    },

    async canManageFront (req, res, next) {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            return res.status(401).end();
        }

        let user = await SafeFindById(User, req.session.passport.user.id);
        if (!user) {
            return res.status(401).end();
        }

        if (user.roleInt > 30) {
            return res.status(403).end();
        }

        next();
    },

    async isSelf (req, res, next) {
        if (!req.session || !req.session.passport || !req.session.passport.user) {
            return res.status(401).end();
        }

        if (!req.body || !req.body.name) {
            return res.status(400).end();
        }

        if (req.session.passport.user.name != req.body.name) {
            return res.status(403).end();
        }

        next();
    }
}