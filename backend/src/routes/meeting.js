const express = require('express');
const routes = express.Router();


const MeetingController = require('../controllers/MeetingController');
const FrequencyCodeController = require('../controllers/FrequencyCodeController');


const permsMiddlewares = require('../middlewares/perms');

//route: /api/meeting

routes.use(permsMiddlewares.isAuth);


routes.get('/:id', MeetingController.show);
routes.get('/', MeetingController.show);
routes.post('/', MeetingController.store);
routes.put('/:id', MeetingController.update);
routes.delete('/:id', permsMiddlewares.isMember, MeetingController.destroy);
routes.post('/generate/:id', FrequencyCodeController.store);
routes.post('/:code', MeetingController.checkTime, MeetingController.checkMemberFrequency);

module.exports = routes;