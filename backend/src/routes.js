const express = require('express');

const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const MeetingController = require('./controllers/MeetingController');
const ResetPasswordController = require('./controllers/ResetPasswordController');

const routes = express.Router();
const qrcode = require('./services/qrcode');

routes.post('/validate', SessionController.isAuth, (req, res) => {
    res.status(200).end();
});

routes.post('/register', UserController.store);

routes.post('/logout', SessionController.destroy);

routes.post('/authenticate', SessionController.store);

routes.post('/meeting ', SessionController.isAuth, MeetingController.store);

routes.put('/meeting/:id', SessionController.isAuth, MeetingController.update);

routes.put('/meeting/change/:id', SessionController.isAuth, MeetingController.changeMeeting);

routes.delete('/meeting/:id', SessionController.isAuth, MeetingController.destroy);

routes.post('/forgot-password', ResetPasswordController.store);

routes.put('/reset-password/', ResetPasswordController.update);


routes.get('*', (req, res) => {
    res.status(404).end();
});



module.exports = routes;