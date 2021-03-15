const express = require('express');
const routes = express.Router();


const RequestUserController = require('../controllers/RequestUserController');
const UserController = require('../controllers/UserController');
const ResetPasswordController = require('../controllers/ResetPasswordController');

const permsMiddlewares = require('../middlewares/perms');
const privilegeMan = require('../services/privilege');

//route: /api/user

routes.post('/register', RequestUserController.store);
routes.post('/forgotPassword', ResetPasswordController.store);
routes.post('/resetPassword/:token', ResetPasswordController.update);

//auth routes
routes.use(permsMiddlewares.isAuth);


routes.put('/:id', (req, res, next) => {
    if (permsMiddlewares.isCoordinator(req, res) || permsMiddlewares.isSelf(req, res)) {
        next();
    }
    else {
        return res.status(401).end();
    }
}, UserController.update);

routes.post('/acceptUser', permsMiddlewares.isCoordinator, RequestUserController.update);
routes.post('/rejectUser', permsMiddlewares.isCoordinator, RequestUserController.destroy);

// routes.post('/promote/:username', permsMiddlewares.canChangeRole, privilegeMan.changeRole);

module.exports = routes;



