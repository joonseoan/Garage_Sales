const mongoose = require('mongoose');
const Users = mongoose.model('users');

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function.  This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!

module.exports = function ({email, password, req}) {

    const user = new Users({email, password});

    if(!email || !password) throw new Error('You must provide an email and password');

    return Users.findOne({ email })
        .then(existingUser => {

            if(existingUser) throw new Error('Email in use');
            
            return user.save().then(() => {  
                return user.generateAuthToken();
            }).then(() => {
                return user;
            });

        })
        .then(user => {
            
            if(!user.tokens.length === 0) throw new Error('Token is not available');
            
            const token = user.tokens[user.tokens.length-1].token;

            // const ddd = User.findByToken(token, (newUser => {
            //     if(!newUser) return Promise.reject();
            //     return newUser;
            // }))                

            return Users.findByToken(token)
                .then((newUser) => {

                    if(newUser) {

                        console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn: ', newUser)

                        return new Promise((resolve, reject) => {
    
                            req.login(user, err => {
                                if(err) reject(err);
                                resolve(user);
                            });
            
                        });
                    }

                });

        });
        
}