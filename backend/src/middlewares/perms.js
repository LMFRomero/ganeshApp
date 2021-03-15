const User = require('../models/User');
const Front = require('../models/Front');

const roles = require('../utils/roles');
const { isCoordinator } = require('../utils/roles');

const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec'); 


module.exports = {
    isAuth (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else res.status(401).end();
    },

    async isCoordinator (req, res, next) {
        let resp = await isCoordinator(req.session?.passport?.user?.id);
        if (resp) {
            if (next) {
                next();
            }
            else {
                return true;
            }
        }
        else {
            if (next) {
                return res.status(401).end();
            }
            else {
                return false;
            }
        }
    },

    async canChangeRole (req, res, next) {
        let reqUser = await SafeFindById(User, req.session?.passport?.user?.id);
        if (!reqUser) {
            return (next) ? res.status(404).end() : false;
        }

        //if the request user is not a coordinator
        if (reqUser.roleInt >= 30) {
            return (next) ? res.status(401).end() : false;
        }
        
        let changedUser = await SafeFindOne(User, { email: req.body.email} );
        if (!changedUser || getRoleInt(req.body?.role) == -1) {
            return (next) ? res.status(400).end() : false;
        }

        //coordinator can't promote or demote coordinator
        if (reqUser.roleInt >= 20 && changedUser.roleInt < 30) {
            return (next) ? res.status(401).end() : false;
        }

        if (reqUser.roleInt > changedUser.roleInt) {
            return (next) ? res.status(401).end() : false;
        }
        
        //coodinator can't promote to a higher role than his own
        if (reqUser.roleInt > newRoleInt) {
            return (next) ? res.status(401).end() : false;
        }

        return (next) ? next() : true;
    },

    async isSelf (req, res, next) {
        if (req.session?.passport?.user?.id != req.params?.id) {
            if (next) {
                return res.status(401).end();
            }
            else {
                return false;
            }
        }
        else {
            if (next) {
                next();
            }
            else {
                return true;
            }
        }
    }
}