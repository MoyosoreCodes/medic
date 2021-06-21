const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const userDb = require('../database/userDB');

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, 
        async function(username, password, done) {
            const email = username;

            const user = await userDb.User.findOne({email});

            if (!user) {
                return done(null, false, req.flash('login_error', "User Doesn't Exist"));
            }

            if(!user.validatePassword(password)){
                return done(null, false, req.flash('login_error', "Incorrect password"));
            }
            
            return done(null, user);
        }
    )
)

module.exports = passport