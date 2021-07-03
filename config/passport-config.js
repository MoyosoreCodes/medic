const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const userDb = require('../database/userDB');
const jwt = require('jsonwebtokens');
const RSA = require('node-rsa');
const bcrypt = require('bcrypt');

let PUBLIC_IBM_RSA_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm7zLYIG3tunId4XgJW0lYHfK/llz0KzTMO2zE9OqTneK0/HJDvmDNrJKFZE2SmKsW3UKaJEy19CaKgY8Ldl7z4wRwPn2qLJIyUk4gqPrEFcofTmoHHjOQqmLx5rYYnPytPJRQkdtMLjzeZmMS/4IU2n0yxDFl7c807j47LO9MrAwsTT29IVPJZaoz6/X/sBS9Q1ssFhUZxCj0JKNvjNIfCSWxOPAVOERlRowCfKwnJGCyXXv+sibA0s1zlgBaYyFy9P5C6ls3doS4s9Kj1mWaNA/iR7sWgksznF+Sgel0BaJ0prfRZbDcmUS4OMIZUlIAhgjH++MNxIsfKF+s8yqJQIDAQAB";

const rsa_key = new RSA(PUBLIC_IBM_RSA_KEY);

const jwtSignIn = () => {
    
} 

passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, 
        async function( req, username, password, done) {
            const email = username;
            const user = await userDb.User.findOne({email});
            if (!user) {
                console.log("User Doesn't Exist");
                return done(null, false, req.flash('error', "User Doesn't Exist"));
            }
            const match = await user.validatePassword(password)
            if(match == 'password does not match'){
                console.log('Incorrect password');
                return done(null, false, req.flash('error', "Incorrect password"));
            }

            return done(null, user);
        }
    )
)

passport.serializeUser((user, done) => {
    console.log('Serialized: ',user._id );
    done(null, user._id)
})

passport.deserializeUser((user, done) => {
    console.log('De-Serialized');
    done(null, user)
})

module.exports = passport