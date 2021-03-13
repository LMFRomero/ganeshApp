const express = require('express');
const routes = express.Router();

const passport = require('passport');
require('../services/passport')(passport);

const UserController = require('../controllers/UserController');

const permsMiddlewares = require('../middlewares/perms');

//route: /api/session

//session routes
routes.post('/validate', permsMiddlewares.isAuth, (req, res) => { res.status(200).end() });
routes.post('/login', passport.authenticate('local'), UserController.getLoginInfo);
routes.post('/logout', permsMiddlewares.isAuth, (req, res) => { req.logOut(); return res.status(200).end() });

module.exports = routes;
