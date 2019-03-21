const mongoose = require('mongoose');

const Users = mongoose.model('users');

module.exports = async function ({ email, password, req }) {

    try {

        // if(!email || !password) throw new Error();
        if(!email || !password) throw new Error('You must provide an email and a password');
        
        const existingUser = await Users.findOne({ email });
        // console.log(req.body);
        console.log(existingUser)
        // if(existingUser) throw new Error();
        if(existingUser) throw new Error('The email already exists.');

        const user = await Users.saveUser(req.body);
        
        // use token model
        await user.generateAuthToken();

        if(user.tokens.length === 0) return new Promise.reject('You failed to create your first session.');
        
        // must use Promise to send 'user' to serializeUser
        // It is defined by passport
        return new Promise((resolve, reject) => {

             req.login(user, err => {
                if(err) reject(err);
                resolve(user);
            });

        });

    } catch(e) {

        throw new Error(e);
    
    }
       
}