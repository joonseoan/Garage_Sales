const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = mongoose.model('users');

// only when signup/login, token is stored in session
passport.serializeUser((user, done) => {

    console.log('token at user: ', user);
    const { token } = user.tokens[user.tokens.length-1];

    done(null, token);

});

// only when using session
// first parameter "token / id when it uses 'id' " is from session storage 
//      which is stored in serializeUser when the user signed up
passport.deserializeUser((token, done) => {
    
    // console.log('token in deserializer: ', token);

    try {

        Users.findByToken(token)
            .then((user) => {
    
                if(!user) throw new Error();
                
                done(null, user);

            });

    } catch(e) {

        throw new Error('Unable to finish deserializeUser.');

    }

    // 1) 
    // Then token in parameters is compared to token stored in database. 

    // Users.findById(user._id, (err, user) => {


    //     // generates req.user
    //     done(err, user); 
    // });

});

// not working in signup because no passport.auth
passport.use(new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {

    Users.findOne( { email: email.toLowerCase() }, (err, user) => {
                
        if(err) return done(err);
        
        if(!user) return done(null, false, 'Invalid Credentials');
        
        // By using Promise
        user.comparePassword(password)
            .then(async (user) => {
                
                if(!user) return done();
                
                if(user) {

                    const token = await user.generateAuthToken();
                    const loginUser = await Users.findByToken(token);

                    return done(null, loginUser); 
                }

                return done(null, false, 'Invadlid Credentials');
            });

        // By using callback
        // user.comparePassword(password, (err, isMatch) => {
        //     console.log('user at localStrategy: ', user)
        //     console.log(isMatch);
        //     if(err) return done(err);

        //     if(isMatch) {

        //         console.log(user, 'isMatch')
        //         return done(null, user);
        //     }

        //     return done(null, false, 'Invadlid Credentials');

        // });

    });

}));


async function signup ({email, password, req}) {

    try {

        // if(!email || !password) throw new Error();
        if(!email || !password) throw new Error('You must provide an email and password');
        const user = new Users({email, password});
        
        const existingUser = await Users.findOne({ email });
        
        // if(existingUser) throw new Error();
        if(existingUser) throw new Error('Email in use.');

        await user.save();
        await user.generateAuthToken();

        // if(user.tokens.length === 0) throw new Error();
        if(user.tokens.length === 0) throw new Error('Token is not available');        
        
        // const token = await user.tokens[user.tokens.length-1].token;
        // const newUser = await Users.findByToken(token);

        // need to modify await later on
        // if(newUser) {
        return new Promise((resolve, reject) => {

            req.login(user, err => {
                if(err) reject(err);
                resolve(user);
            });

        });

    } catch(e) {

        throw new Error('Unable to get user with jwt and passport');
    
    }
       
}

// const mongoose = require('mongoose');
// const Users = mongoose.model('users');

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its indended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.

/******************** ********************************************************888
  Authenticate
  Authenticating requests is as simple as calling passport.authenticate() 
  and specifying which strategy to employ. authenticate()'s function signature
  is standard Connect middleware, 
  which makes it convenient to use as route middleware in Express applications.

  (Strategy is a local here)!

  app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect('/users/' + req.user.username);
    });

  By default, if authentication fails, Passport will respond with a 401 Unauthorized status, 
  and any additional route handlers will not be invoked. 
  If authentication succeeds, the next handler will be invoked and the req.user property will be 
  set to the authenticated user.

Note: Strategies must be configured prior to using them in a route. Continue reading the chapter on configuration for details.

*/

// It can be replaced with express (/login);
// custom callback of passport.authenticate() : (err, user => {})(req, res, next) ****************
//    At this function, req only is used. res and next are null.
function login({ email, password, req }) {

    return new Promise((resolve, reject) => {
        
        passport.authenticate('local', (err, user) => {
            
            // By using callback
            // step 2: if localStrategy analyze the email and password successully
            //  it returns 'user'
            // user: a value from LocalStrategy
            // console.log('user at Login: ', user);
            
            if (!user) { reject('Invalid credentials.') }

            // ------------------
            // const { _id, email, password}
            // Users.findById(user._id).then(loginUser => {

            //     loginUser.generateAuthToken();

            // })
            // --------------------
            
            // step3 : delivering user to serializeUser to create User by using req.login()
            // step 4: if req.user is successfully created, it return user to the invocker
            req.login(user, () => resolve(user));
                  
      // step 1.: deliver email and password to local strategy
      })({ body: { email, password } });
    });
}

module.exports = { signup, login };

// exports.login = require('./passport_login');
// exports.signup = require('./passport_signup');