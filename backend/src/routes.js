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
routes.post('/api/register', RequestUserController.store);
routes.post('/api/validate', SessionController.isAuth, (req, res) => { res.status(200).end() });
routes.post('/api/login', passport.authenticate('local'), UserController.getLoginInfo);
routes.post('/api/logout', SessionController.isAuth, SessionController.destroy);

//new users management
routes.post('/api/acceptUser', SessionController.isAuth, privilegeMan.canManageMembers, RequestUserController.update);
routes.post('/api/rejectUser', SessionController.isAuth, privilegeMan.canManageMembers, RequestUserController.destroy);
routes.post('/api/acceptUser/dev', RequestUserController.update);
routes.post('/api/rejectUser/dev', RequestUserController.destroy);

//reset password
routes.post('/api/forgotPassword', ResetPasswordController.store);
routes.post('/api/resetPassword/:token', ResetPasswordController.update);

//promote and demote members
routes.post('/api/promote/:username/dev', SessionController.isAuth, privilegeMan.changeRole);
routes.post('/api/promote/:username', SessionController.isAuth, privilegeMan.canChangeRole, privilegeMan.changeRole);

//meetings
routes.post('/api/meeting', SessionController.isAuth, MeetingController.store);
routes.put('/api/meeting/:id', SessionController.isAuth, MeetingController.update);
routes.delete('/api/meeting/:id', SessionController.isAuth, MeetingController.destroy);
routes.get('/api/meeting', SessionController.isAuth, MeetingController.show);
routes.post('/api/meeting/generate/:id', SessionController.isAuth, MeetingController.generateMeetingCode)
routes.post('/api/meeting/:code', SessionController.isAuth, MeetingController.checkTime, MeetingController.checkMemberFrequency);


//fronts
routes.post('/api/front', SessionController.isAuth, privilegeMan.canManageFront, FrontController.store);
routes.put('/api/front/:frontName', SessionController.isAuth, privilegeMan.canManageFront, FrontController.update);
routes.delete('/api/front/:frontName', SessionController.isAuth, privilegeMan.canManageFront, FrontController.destroy);
routes.post('/api/front/addUser/:frontName', SessionController.isAuth, privilegeMan.isSelf, FrontController.addUser);
routes.post('/api/front/addUser/:frontName/adm', SessionController.isAuth, privilegeMan.canManageMembers, FrontController.addUser);
routes.post('/api/front/removeUser/:frontName', SessionController.isAuth, privilegeMan.isSelf, FrontController.removeUser);
routes.post('/api/front/removeUser/:frontName/adm', SessionController.isAuth, privilegeMan.canManageMembers, FrontController.removeUser);
routes.post('/api/front/addMeeting/:frontName', SessionController.isAuth, FrontController.addMeeting);
routes.post('/api/front/removeMeeting/:frontName', SessionController.isAuth, privilegeMan.canManageFront, FrontController.removeMeeting);



routes.get('*', (req, res) => {
    res.status(404).end();
});


module.exports = routes;