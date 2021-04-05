const express = require('express');
const routes = express.Router();


const MeetingController = require('../controllers/MeetingController');

const permsMiddlewares = require('../middlewares/perms');

//route: /api/meeting

routes.use(permsMiddlewares.isAuth);

routes.get('/:id', MeetingController.show);
routes.get('/', MeetingController.show);
routes.post('/', permsMiddlewares.isCoordinator, MeetingController.store);
routes.put('/:id', MeetingController.update);
routes.delete('/:id', MeetingController.destroy);
routes.post('/generate/:id', MeetingController.generateMeetingCode)
routes.post('/:code', MeetingController.checkTime, MeetingController.checkMemberFrequency);

module.exports = routes;