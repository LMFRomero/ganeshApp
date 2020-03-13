const LocalStrategy = require('passport-local');
const UserController = require('../controllers/UserController');
const User = require('../models/User');

module.exports = function (passport) {
    passport.serializeUser(function(user, done){
        done(null,user._id);
    });
 
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err,user){
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
        (username, password, done) => {
            UserController.verify(username, password).then((user => {
                if (!user) {
                    return done(null, false, { message: "Invalid authentication"});
                }
    
                else {
                    return done(null, user);
                }

            }));
        }
    ));
}