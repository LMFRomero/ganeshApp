const express = require('express');

const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const MeetingController = require('./controllers/MeetingController');
const ResetPasswordController = require('./controllers/ResetPasswordController');
const RequestUserController = require('./controllers/RequestUserController');
const FrontController = require('./controllers/FrontController');

const privilegeMan = require('./services/privilege');

const passport = require('passport');
const { Router } = require('express');
const routes = express.Router();


//register and login
routes.post('/register', RequestUserController.store);
routes.post('/validate', SessionController.isAuth, (req, res) => { res.status(200).end() });
routes.post('/login', passport.authenticate('local'), (req, res) => res.status(200).end());
routes.post('/logout', SessionController.isAuth, SessionController.destroy);

//new users management
routes.post('/acceptUser', SessionController.isAuth, privilegeMan.canManageMembers, RequestUserController.update);
routes.post('/rejectUser', SessionController.isAuth, privilegeMan.canManageMembers, RequestUserController.destroy);
routes.post('/acceptUser/dev', SessionController.isAuth, RequestUserController.update);
routes.post('/rejectUser/dev', SessionController.isAuth, RequestUserController.destroy);

//reset password
routes.post('/forgotPassword', ResetPasswordController.store);
routes.post('/resetPassword/:token', ResetPasswordController.update);

//promote and demote members
routes.post('/promote/:username/dev', SessionController.isAuth, privilegeMan.changeRole);
routes.post('/promote/:username', SessionController.isAuth, privilegeMan.canChangeRole, privilegeMan.changeRole);

//meetings
routes.post('/meeting', SessionController.isAuth, MeetingController.store);
routes.put('/meeting/change/:id', SessionController.isAuth, MeetingController.update);
routes.put('/meeting/:id', SessionController.isAuth, MeetingController.checkPresence);
routes.delete('/meeting/:id', SessionController.isAuth, MeetingController.destroy);
routes.get('/meeting', SessionController.isAuth, MeetingController.show);

//fronts
routes.post('/front', SessionController.isAuth, privilegeMan.canManageFront, FrontController.store);
routes.put('/front/:frontName', SessionController.isAuth, privilegeMan.canManageFront, FrontController.update);
routes.delete('/front/:frontName', SessionController.isAuth, privilegeMan.canManageFront, FrontController.destroy);
routes.post('/front/addUser/:frontName', SessionController.isAuth, privilegeMan.isSelf, FrontController.addUser);
routes.post('/front/addUser/:frontName/adm', SessionController.isAuth, privilegeMan.canManageMembers, FrontController.addUser);
routes.post('/front/removeUser/:frontName', SessionController.isAuth, privilegeMan.isSelf, FrontController.removeUser);
routes.post('/front/removeUser/:frontName/adm', SessionController.isAuth, privilegeMan.canManageMembers, FrontController.removeUser);
routes.post('/front/addMeeting/:frontName', SessionController.isAuth, FrontController.addMeeting);
routes.post('/front/removeMeeting/:frontName', SessionController.isAuth, privilegeMan.canManageFront, FrontController.removeMeeting);



routes.get('*', (req, res) => {
    res.status(404).end();
});


module.exports = routes;