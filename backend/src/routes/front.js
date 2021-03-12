const express = require('express');
const routes = express.Router();


const FrontController = require('../controllers/FrontController');

const permsMiddlewares = require('../middlewares/perms');

//route: /api/front

routes.post('/', permsMiddlewares.canManageFront, FrontController.store);
routes.put('/:frontName', permsMiddlewares.canManageFront, FrontController.update);
routes.delete('/:frontName', permsMiddlewares.canManageFront, FrontController.destroy);
routes.post('/addUser/:frontName', permsMiddlewares.isSelf, FrontController.addUser);
routes.post('/removeUser/:frontName', permsMiddlewares.isSelf, FrontController.removeUser);
routes.post('/addMeeting/:frontName', FrontController.addMeeting);
routes.post('/removeMeeting/:frontName', permsMiddlewares.canManageFront, FrontController.removeMeeting);

module.exports = routes;