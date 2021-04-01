const express = require('express');
const routes = express.Router();


const FrontController = require('../controllers/FrontController');

const permsMiddlewares = require('../middlewares/perms');

//route: /api/front

routes.use(permsMiddlewares.isAuth);

routes.get('/', FrontController.show);
routes.get('/:id', FrontController.show);
routes.post('/', permsMiddlewares.isCoordinator, FrontController.store);
routes.put('/:slug', permsMiddlewares.isCoordinator, FrontController.update);
routes.delete('/:slug', permsMiddlewares.isCoordinator, FrontController.destroy);
routes.post('/addUser/:slug', permsMiddlewares.isCoordOrIsSelf, FrontController.addUser);
routes.post('/removeUser/:slug', permsMiddlewares.isCoordOrIsSelf, FrontController.removeUser);
routes.post('/addMeeting/:slug', FrontController.addMeeting);
routes.post('/removeMeeting/:slug', permsMiddlewares.isCoordinator, FrontController.removeMeeting);

module.exports = routes;