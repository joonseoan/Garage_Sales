const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = mongoose.model('user');

passport.serializeUser((user, done) => {

    console.log('user at serializeUser: ', user);
    done(null, user.id);

});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
    User.findOne( { email: email.toLowerCase() }, (err, user) => {
        if(err) return done(err);

        // 'Invalid Credentials' is provided to graphQL
        // It is from email validation assessment
        if(!user) return done(null, false, 'Invalid Credentials');
        
        console.log('user at LocalStragegy: ', user);

        // need to put jwt credentials here.
        return user.comparePassword(password, (err, isMatch) => {
            
            if(err) return done(err);

            if(isMatch) {

                console.log('user at comparePassword in LocalStrategy: ', user);
                return done(null, user);
            }

            // It is from password validation assessment
            return done(null, false, 'Invadlid Credentials');
        });

    });

}))
