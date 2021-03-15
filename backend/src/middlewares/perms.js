const User = require('../models/User');
const Front = require('../models/Front');

const roles = require('../utils/roles');

const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec'); 

let isCoordinator = async function (req, res, next) {
    let user = await SafeFindById(User, req.session?.passport?.user?.id);
    if (!user) {
        return (next) ? res.status(404).end() : false;
    }

    if (user < 30) {
        return (next) ? next() : true;
    }
    else {
        return (next) ? res.status(401).end() : false;
    }
}

let isSelf = function (req, res, next) {
    if (req.session?.passport?.user?.id != req.params?.id) {
        return (next) ? res.status(401).end() : false;
    }
    else {
        return (next) ? next() : true;
    }
}


module.exports = {
    isAuth (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else res.status(401).end();
    },

    isCoordinator,

    isSelf,

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

    async isCoordOrIsSelf (req, res, next) {
        if (await isCoordinator(req, res) || isSelf(req, res)) {
            next();
        }
        else {
            return res.status(401).end();
        }
    }
}