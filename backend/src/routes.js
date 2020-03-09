const express = require('express');

const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const MeetingController = require('./controllers/MeetingController');

const routes = express.Router();

routes.post('/validate', SessionController.isAuth);

routes.post('/register', UserController.store);

routes.post('/logout', SessionController.destroy);

routes.post('/authenticate', SessionController.store);

routes.post('/newMeeting', MeetingController.store);


routes.get('*', (req, res) => {
    res.status(404).end();
});



module.exports = routes;