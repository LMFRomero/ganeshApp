const express = require('express');
const routes = express.Router();


const RequestUserController = require('../controllers/RequestUserController');
const UserController = require('../controllers/UserController');
const ResetPasswordController = require('../controllers/ResetPasswordController');

const permsMiddlewares = require('../middlewares/perms');

//route: /api/user

routes.post('/register', RequestUserController.store);
routes.post('/forgotPassword', ResetPasswordController.store);
routes.post('/resetPassword/:token', ResetPasswordController.update);

//auth routes
routes.use((req, res, next) => { permsMiddlewares.isAuth });

routes.put('/:id', UserController.update);

routes.post('/acceptUser', permsMiddlewares.canManageMembers, RequestUserController.update);
routes.post('/rejectUser', permsMiddlewares.canManageMembers, RequestUserController.destroy);

// routes.post('/promote/:username', permsMiddlewares.canChangeRole, privilegeMan.changeRole);

module.exports = routes;



