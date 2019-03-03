const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = mongoose.model('users');

// ID BASE USER INFO IN SESSION
// only when signup/login, 'id' is stored in session
passport.serializeUser(({ id }, done) => {

    done(null, id);

});

// It is used only when using session / logginout
// first parameter "token / id from session storage 
//      which is stored in the serializeUser step when the user signed up / login
passport.deserializeUser( async (id, done) => {
    
    try {
        
        const user = await Users.findById(id);
        const { token } = user.tokens[user.tokens.length-1];
        const currentUser = await Users.findByToken(token);
        if(!currentUser) throw new Error();
        done(null, currentUser);

    } catch(e) {

        throw new Error('Unable to find you. Login again.');

    }

});

// not working in signup because no passport.authenticate() exists.
passport.use(new LocalStrategy({ usernameField: 'email'}, async (email, password, done) => {

    const validEmailuser = await Users.findOne({ email: email.toLowerCase() });
    if(!validEmailuser) return done(null, false, 'Invalid Credentials');
    
    const validPasswordUser = await validEmailuser.comparePassword(password);
    
    if(!validPasswordUser) return done(); 
    
    if(validPasswordUser) {

        await validPasswordUser.generateAuthToken();

        return done(null, validPasswordUser); 

    }

    return done(null, false, 'Invadlid Credentials');
    
}));

exports.login = function ({ email, password, req }) {

    return new Promise((resolve, reject) => {
        
        passport.authenticate('local', (err, user) => {
            
            // By using callback
            // step 2: if localStrategy analyze the email and password successully
            //  it returns 'user'
            // user: a value from LocalStrategy
            // console.log('user at Login: ', user);
            
            if (!user) { reject('Invalid credentials.'); }
 
            // step3 : delivering user to serializeUser to create User by using req.login()
            // step 4: if req.user is successfully created, it return user to the invocker
            req.login(user, () => resolve(user));
                  
      // step 1.: deliver email and password to local strategy
      })({ body: { email, password } });
    });
}



// module.exports = { signup, login };

exports.signup = require('./passport_signup');
// exports.login = require('./passport_login');
