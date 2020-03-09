const express = require('express');

const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const MeetingController = require('./controllers/MeetingController');

const routes = express.Router();

routes.post('/validate', SessionController.isAuth, (req, res) => {
    res.status(200).end();
});

routes.post('/register', UserController.store);

routes.post('/logout', SessionController.destroy);

routes.post('/authenticate', SessionController.store);

routes.post('/meeting/', SessionController.isAuth, MeetingController.store);

routes.put('/meeting/:id', SessionController.isAuth, MeetingController.update);

routes.delete('/meeting/:id', SessionController.isAuth, MeetingController.destroy);


routes.get('*', (req, res) => {
    res.status(404).end();
});



module.exports = routes;