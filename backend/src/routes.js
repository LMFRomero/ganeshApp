const express = require('express');

const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const MeetingController = require('./controllers/MeetingController');

const routes = express.Router();
const qrcode = require('./services/qrcode');

routes.post('/validate', SessionController.isAuth, (req, res) => {
    res.status(200).end();
});

routes.post('/register', UserController.store);

routes.post('/logout', SessionController.destroy);

routes.post('/authenticate', SessionController.store);

routes.post('/meeting/', SessionController.isAuth, MeetingController.store);

routes.put('/meeting/:id', SessionController.isAuth, MeetingController.update);

routes.delete('/meeting/:id', SessionController.isAuth, MeetingController.destroy);

routes.post('/meeting/:id/changeFront', SessionController.isAuth, MeetingController.changeFront);

routes.post('/meeting/:id/changeTitle', SessionController.isAuth, MeetingController.changeTitle);

routes.post('/meeting/:id/changeAbstract', SessionController.isAuth, MeetingController.changeAbstract);

routes.post('/meeting/:id/changePresenter', SessionController.isAuth, MeetingController.changePresenter);

routes.post('/meeting/:id/changeDate', SessionController.isAuth, MeetingController.changeDate);

routes.post('/meeting/:id/changeDuration', SessionController.isAuth, MeetingController.changeDuration);

routes.get('/teste', qrcode);




routes.get('*', (req, res) => {
    res.status(404).end();
});



module.exports = routes;