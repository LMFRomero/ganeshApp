const express = require('express');
const UserController = require('./controllers/UserController');
const SessionController = require('./controllers/SessionController');
const passport = require('passport');
require('./services/passaport')(passport);

const routes = express.Router();


routes.post('/validate', SessionController.isAuth);

routes.post('/register', UserController.store);

routes.post('/logout', SessionController.destroy);

routes.post('/authenticate', (req, res, next) => {
    // TODO: treat a lot of sessions request on redis
    passport.authenticate('local', 
    (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            return res.status(403).end();
        }

        else {
            req.logIn(user, (err) => {
                if (err) return next(err);
                return res.status(200).json({sessionID: req.session.id});
            });
        } 
    })(req, res, next);
});




routes.get('*', (req, res) => {
    res.status(404).end();
});



module.exports = routes;