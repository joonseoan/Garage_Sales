const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = mongoose.model('users');

// const authenticate = require('./authenticate');

// The second step: Once Local Strategy is successful below,
//  'user of done(null, user)' is assigned to 'user' parameter
// Then, it stores 'user' on session (specifically, req.session.passport.user)
passport.serializeUser((user, done) => {

    // user: 
    /* 
        { _id: 5c63682ec1815c1df0bdb0da,
            email: 'json12@aaa.com',
            password:
            '$2a$10$4y9NgGy9pad/WIYYKtFQhePv.C3nOO8WWFADs64hwIOw3rzhzjx82',
        __v: 0 }
    */
    // console.log('user at serializeUser: ', user);

    // ********** it delivers user.id to the first parameter of deserializeUser******
    done(null, user.id);

});

// Third step : generates req.user
// The session storing 'user' in serializeUser is compared to document in MongoDB
//  whenever the request comes in.
passport.deserializeUser((id, done) => {

    // id: 5c63682ec1815c1df0bdb0da
    // console.log(id);

    // When this finds 'user' in MongoDB
    Users.findById(id, (err, user) => {

        // ******* At this spot, 'user' is assigned to 'req.user'*************8
        done(err, user); 
    });

});

// first step : login
// usernameField: when req.body comes in, req.body.eamil assigned to usernameField,
//  and then first 'email' parameter in callback gains the req.body.email field value.
// When we define 'passwordField' like usernameField to assign 'password' in 
//  'req.body.password' to the second parameter 'password'.
// However, we do not need to define 'passwordField' here. 
passport.use(new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {

    // User: find a document out of all documents.
    Users.findOne( { email: email.toLowerCase() }, (err, user) => {
    
        // an error of server processing
        if(err) return done(err);

        // 'Invalid Credentials' is provided to graphQL
        // It is from email validation assessment
        if(!user) return done(null, false, 'Invalid Credentials');
        
        // user:
        /* 
            { _id: 5c63682ec1815c1df0bdb0da,
                email: 'json12@aaa.com',
                password:
                '$2a$10$4y9NgGy9pad/WIYYKtFQhePv.C3nOO8WWFADs64hwIOw3rzhzjx82',
            __v: 0 }
        */
        // need to put jwt credentials here.
        user.comparePassword(password, (err, isMatch) => {
            
            // an error of server processing
            if(err) return done(err);

            // isMatch: true / false
            console.log('isMatch at LocalStrategy: ', isMatch);

            if(isMatch) {

                 /* 
                    { _id: 5c63682ec1815c1df0bdb0da,
                        email: 'json12@aaa.com',
                        password:
                        '$2a$10$4y9NgGy9pad/WIYYKtFQhePv.C3nOO8WWFADs64hwIOw3rzhzjx82',
                    __v: 0 }
                */
                // console.log('user at comparePassword in LocalStrategy: ', user);
                
                // 'user' is delivered to serializeUser as a parameter as shown above
                return done(null, user);
            }

            // null : error caused by server operation error. 
            //          it is used when faulure is 100% for sure from operation
            // false/true: when it is true, it defines return value 
            //          once it does not have any error
            // '' : when the password is invalid
            return done(null, false, 'Invadlid Credentials');

        });

    });

}));

exports.signup = require('./passport_signup');