const LocalStrategy = require('passport-local');
const UserController = require('../controllers/UserController');
const User = require('../models/User');

module.exports = function (passport) {
    passport.serializeUser(function(user, done){
        done(null, {
            id: user._id,
            name: user.name,
            roleInt: user.roleInt
        });
    });
 
    passport.deserializeUser(function(obj, done){
        User.findById(obj.id, function(err,user){
            done(err, user);    
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        (username, password, done) => {
            UserController.verify(username, password).then((user => {

                //'done' is a function that returns to a function that uses LocalStrategy (e.g. passport.authenticate('local', callback) )
                //'done' is a function of 3 parameters: (err, user, info)
                if (user === -1) {
                    return done(503, null, { message: "MongoDB is unavailable at the moment" })
                }

                if (!user) {
                    return done(null, null, { message: "Invalid authentication"});
                }
    
                else {
                    return done(null, user, { message: "ok" });
                }
            }));
        }
    ));
}