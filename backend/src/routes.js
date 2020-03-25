const express = require('express');

const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const MeetingController = require('./controllers/MeetingController');
const ResetPasswordController = require('./controllers/ResetPasswordController');
const passport = require('passport');


const routes = express.Router();


routes.post('/register', UserController.store);

routes.post('/validate', SessionController.isAuth, (req, res) => {
    res.status(200).end();
});

routes.post('/authenticate', passport.authenticate('local'), (req, res) => res.status(200).end());
routes.post('/logout', SessionController.destroy);

routes.post('/meeting', SessionController.isAuth, MeetingController.store);
routes.put('/meeting/:id', SessionController.isAuth, MeetingController.update);
routes.put('/meeting/change/:id', SessionController.isAuth, MeetingController.changeMeeting);
routes.delete('/meeting/:id', SessionController.isAuth, MeetingController.destroy);
routes.get('/meeting', SessionController.isAuth, MeetingController.show);

routes.post('/forgot-password', ResetPasswordController.store);
routes.post('/reset-password', ResetPasswordController.update);



routes.get('*', (req, res) => {
    res.status(404).end();
});



module.exports = routes;