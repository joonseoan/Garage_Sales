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
passport.deserializeUser( async (token, done) => {
    
    try {

        const user = await Users.findByToken(token);
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

        const token = await validPasswordUser.generateAuthToken();
        const loginSuccessUser = await Users.findByToken(token);

        return done(null, loginSuccessUser); 

    }

    return done(null, false, 'Invadlid Credentials');
    
}));


// async function signup ({email, password, req}) {

//     try {

//         // if(!email || !password) throw new Error();
//         if(!email || !password) throw new Error('You must provide an email and password');
//         const user = new Users({email, password});
        
//         const existingUser = await Users.findOne({ email });
        
//         // if(existingUser) throw new Error();
//         if(existingUser) throw new Error('Email in use.');

//         await user.save();
//         await user.generateAuthToken();

//         // if(user.tokens.length === 0) throw new Error();
//         if(user.tokens.length === 0) throw new Error('Token is not available');        
        
//         return new Promise((resolve, reject) => {

//             req.login(user, err => {
//                 if(err) reject(err);
//                 resolve(user);
//             });

//         });

//     } catch(e) {

//         throw new Error('Unable to get user with jwt and passport');
    
//     }
       
// }

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
            // step 4: if req.user is successfully created, it return user to the invocker
            req.login(user, () => resolve(user));
                  
      // step 1.: deliver email and password to local strategy
      })({ body: { email, password } });
    });
}



// module.exports = { signup, login };

exports.signup = require('./passport_signup');
// exports.login = require('./passport_login');
