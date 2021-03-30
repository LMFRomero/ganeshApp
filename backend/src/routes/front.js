const express = require('express');
const routes = express.Router();


const FrontController = require('../controllers/FrontController');

const permsMiddlewares = require('../middlewares/perms');

//route: /api/front

routes.use(permsMiddlewares.isAuth);

routes.get('/', FrontController.show);
routes.get('/:id', FrontController.show);
routes.post('/', permsMiddlewares.isCoordinator, FrontController.store);
routes.put('/:frontName', permsMiddlewares.isCoordinator, FrontController.update);
routes.delete('/:frontName', permsMiddlewares.isCoordinator, FrontController.destroy);
routes.post('/addUser/:frontName', permsMiddlewares.isSelf, FrontController.addUser);
routes.post('/removeUser/:frontName', permsMiddlewares.isSelf, FrontController.removeUser);
routes.post('/addMeeting/:frontName', FrontController.addMeeting);
routes.post('/removeMeeting/:frontName', permsMiddlewares.isCoordinator, FrontController.removeMeeting);

module.exports = routes;