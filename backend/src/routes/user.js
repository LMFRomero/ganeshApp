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
routes.use(permsMiddlewares.isAuth);

routes.get('/', permsMiddlewares.isCoordOrIsSelf, UserController.show);
routes.get('/:id', permsMiddlewares.isCoordOrIsSelf, UserController.show);
routes.put('/:id', permsMiddlewares.isCoordOrIsSelf, UserController.update);

routes.post('/acceptUser', permsMiddlewares.isCoordinator, RequestUserController.update);
routes.post('/rejectUser', permsMiddlewares.isCoordinator, RequestUserController.destroy);


module.exports = routes;



