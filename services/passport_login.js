const mongoose = require('mongoose');
const Users = mongoose.model('users');

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its indended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.

/*
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
// custom callback of passport.authenticate() : (err, user => {})(req, res, next)
//    At this function, req only is used. res and next are null.

module.exports = function({ email, password, req }) {

    return new Promise((resolve, reject) => {

        Users.findByCredentials(email).then(user => {
            return user.generateAuthToken();
        });
        
        passport.authenticate('local', (err, user) => {
            if(!user) { reject('Invalid credentials.')};
            
            req.login(user, () => {
                resolve(user);
            })
        })({body: { email, password }});

    });

}