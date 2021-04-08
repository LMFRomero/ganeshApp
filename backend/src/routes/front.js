const express = require('express');
const routes = express.Router();


const FrontController = require('../controllers/FrontController');

const permsMiddlewares = require('../middlewares/perms');

//route: /api/front

routes.use(permsMiddlewares.isAuth);

routes.get('/', FrontController.show);
routes.get('/options', FrontController.showOptions);
routes.get('/:id', permsMiddlewares.isCoordinator, FrontController.show);
routes.post('/', permsMiddlewares.isCoordinator, FrontController.store);
routes.put('/:id', permsMiddlewares.isCoordinator, FrontController.update);
routes.delete('/:id', permsMiddlewares.isCoordinator, FrontController.destroy);
routes.post('/addUser/:slug', permsMiddlewares.isCoordOrIsSelf, FrontController.addUser);
routes.post('/removeUser/:slug', permsMiddlewares.isCoordOrIsSelf, FrontController.removeUser);

module.exports = routes;