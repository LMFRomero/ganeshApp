const express = require('express');
const routes = express.Router();


const MeetingController = require('../controllers/MeetingController');

const permsMiddlewares = require('../middlewares/perms');

//route: /api/meeting

routes.use((req, res, next) => { permsMiddlewares.isAuth });

routes.get('/', MeetingController.show);
routes.post('/', MeetingController.store);
routes.put('/:id', MeetingController.update);
routes.delete('/:id', MeetingController.destroy);
routes.post('/generate/:id', MeetingController.generateMeetingCode)
routes.post('/:code', MeetingController.checkTime, MeetingController.checkMemberFrequency);

module.exports = routes;