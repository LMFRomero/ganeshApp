const express = require('express');
const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const jwt = require('./services/token');

const routes = express.Router();

routes.post('/register', UserController.store);
routes.post('/logout', SessionController.destroy);
routes.post('/authenticate', SessionController.store);

routes.post('/teste', jwt.verifyJWT, (req, res) => {
    return res.status(200).json({ ok: true });
});

routes.get('*', (req, res) => {
    res.status(404).end();
});



module.exports = routes;