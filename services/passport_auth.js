const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = mongoose.model('users');
const Tokens = mongoose.model('tokens');

// only when signup/login, token is stored in session
passport.serializeUser(async (user, done) => {

    const tokenId = user.tokens[user.tokens.length-1];

    const Tokens = mongoose.model('tokens');
    
    const { token } = await Tokens.findToken(user._id, tokenId);
    
    done(null, token);

});

// only when using session authentication and logout
// first parameter "token / id when it uses 'id' " is from session storage 
//      which is stored in serializeUser when the user signed up
passport.deserializeUser( async (token, done) => {
    
    try {

        const user = await Tokens.findUserByToken(token);
        if(!user) throw new Error();
        done(null, user);

    } catch(e) {

        throw new Error('Unable to finish deserializeUser.');

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

        // it returns validPasswordUser to passport.authenticate's call parameter
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
            
            if (!user) { reject('Invalid credentials.') }
 
            // step3 : delivering user to serializeUser to create User by using req.login()
            // step 4: if req.user is successfully stored in serializeuser, it return user to the invocker
            req.login(user, () => resolve(user));
                  
      // step 1.: deliver email and password to local strategy
      })({ body: { email, password } });
    });
}



// module.exports = { signup, login };

exports.signup = require('./passport_signup');
// exports.login = require('./passport_login');
