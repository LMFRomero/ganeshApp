const express = require('express');
const routes = express.Router();


const RequestUserController = require('../controllers/RequestUserController');
const UserController = require('../controllers/UserController');
const ResetPasswordController = require('../controllers/ResetPasswordController');

const permsMiddlewares = require('../middlewares/perms');

//route: /api/user

routes.post('/register', UserController.store);
routes.post('/forgotPassword', ResetPasswordController.store);
routes.post('/resetPassword/:token', ResetPasswordController.update);

//auth routes
routes.use(permsMiddlewares.isAuth);

routes.get('/', permsMiddlewares.isCoordOrIsSelf, UserController.show);
routes.get('/:id', permsMiddlewares.isCoordOrIsSelf, UserController.show);
routes.put('/:id', permsMiddlewares.isCoordOrIsSelf, UserController.update);
routes.put('/:id/changePassword', permsMiddlewares.isSelf, UserController.updatePassword);
routes.delete('/:id', permsMiddlewares.isCoordOrIsSelf, UserController.destroy);

routes.get('/requestUser', permsMiddlewares.isCoordinator, RequestUserController.show);
routes.post('/requestUser/acceptUser', permsMiddlewares.isCoordinator, RequestUserController.update);
routes.post('/requestUser/rejectUser', permsMiddlewares.isCoordinator, RequestUserController.destroy);


module.exports = routes;



