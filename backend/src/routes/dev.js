const express = require('express');
const routes = express.Router();

const UserController = require('../controllers/UserController');
const ResetPasswordController = require('../controllers/ResetPasswordController');

routes.put('/user/:id', UserController.update);
routes.post('/user/acceptUser', UserController.acceptUser);
routes.post('/user/rejectUser', UserController.rejectUser);

routes.post('/user/promoteUser', UserController.promoteUser);


module.exports = routes;

