const express = require('express');
const routes = express.Router();

const RequestUserController = require('../controllers/RequestUserController');
const UserController = require('../controllers/UserController');
const ResetPasswordController = require('../controllers/ResetPasswordController');

routes.put('/user/:id', UserController.update);
routes.post('/user/acceptUser', RequestUserController.update);
routes.post('/user/rejectUser', RequestUserController.destroy);


module.exports = routes;

