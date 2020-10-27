const express = require('express');

const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const MeetingController = require('./controllers/MeetingController');
const ResetPasswordController = require('./controllers/ResetPasswordController');
const RequestUserController = require('./controllers/RequestUserController');
const privilegeMan = require('./services/privilege');
const passport = require('passport');
const { Router } = require('express');
const routes = express.Router();


routes.post('/register', RequestUserController.store);

routes.post('/validate', SessionController.isAuth, (req, res) => { res.status(200).end() });
routes.post('/authenticate', passport.authenticate('local'), (req, res) => res.status(200).end());
routes.post('/logout', SessionController.destroy);

routes.post('/acceptUser', privilegeMan.canAcceptRequestToJoin, RequestUserController.update);
routes.post('/rejectUser', privilegeMan.canAcceptRequestToJoin, RequestUserController.destroy);
routes.post('/rootAcceptUser', RequestUserController.update);
routes.post('/rootRejectUser', RequestUserController.destroy);

routes.post('/meeting', SessionController.isAuth, MeetingController.store);
routes.put('/meeting/:id', SessionController.isAuth, MeetingController.checkPresence);
routes.put('/meeting/change/:id', SessionController.isAuth, MeetingController.update);
routes.delete('/meeting/:id', SessionController.isAuth, MeetingController.destroy);
routes.get('/meeting', SessionController.isAuth, MeetingController.show);

routes.post('/forgotPassword', ResetPasswordController.store);
routes.post('/resetPassword/:token', ResetPasswordController.update);

routes.post('/promote/:username', privilegeMan.canChangeRole, privilegeMan.changeRole);
routes.post('/rootPromote/:username', privilegeMan.changeRole);



routes.get('*', (req, res) => {
    res.status(404).end();
});



module.exports = routes;