const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = mongoose.model('users');

passport.serializeUser((user, done) => {

    done(null, user.id);

});

passport.deserializeUser((id, done) => {

    Users.findById(id, (err, user) => {

        done(err, user); 
    });

});

passport.use(new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {

    Users.findOne( { email: email.toLowerCase() }, (err, user) => {
    
        if(err) return done(err);

        if(!user) return done(null, false, 'Invalid Credentials');
        
        user.comparePassword(password, (err, isMatch) => {
            
            if(err) return done(err);

            if(isMatch) {

                return done(null, user);
            }

            return done(null, false, 'Invadlid Credentials');

        });

    });

}));

exports.signup = require('./passport_signup');
exports.login = require('./passport_login');