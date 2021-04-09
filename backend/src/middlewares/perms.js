const User = require('../models/User');
const Front = require('../models/Front');

const roles = require('../utils/roles');

const { SafeFindOne, SafeDeleteOne, SafeUpdateOne, SafeFindById, SafeCreateObj, SafeFind } = require('../services/safe-exec'); 

let isCoordinator = function (req, res, next) {
    if (req.user?.role <= 30) {
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

    isMember (req, res, next) {
        if (req.user?.role <= 80) {
            return (next) ? next() : true;
        }
        else {
            return (next) ? res.status(401).end() : false;
        }
    },

    isCoordinator,

    isSelf,

    async canChangeRole (req, res, next) {
        let reqUser = req.user?.role;
        if (!reqUser) {
            return (next) ? res.status(404).end() : false;
        }

        //if the request user is not a coordinator
        if (reqUser.role >= 30) {
            return (next) ? res.status(401).end() : false;
        }
        
        let changedUser = await SafeFindById(User, req.params.id);
        let newRole = parseInt(req.body?.role);
        if (!changedUser || newRole == -1) {
            return (next) ? res.status(400).end() : false;
        }

        //coordinator can't promote or demote coordinator
        if (reqUser.role >= 20 && changedUser.role < 30) {
            return (next) ? res.status(401).end() : false;
        }

        if (reqUser.role > changedUser.role) {
            return (next) ? res.status(401).end() : false;
        }
        
        //coodinator can't promote to a higher role than his own
        if (reqUser.role > newRole) {
            return (next) ? res.status(401).end() : false;
        }

        return (next) ? next() : true;
    },

    async isCoordOrIsSelf (req, res, next) {
        if (isCoordinator(req, res) || isSelf(req, res)) {
            next();
        }
        else {
            return res.status(401).end();
        }
    }
}