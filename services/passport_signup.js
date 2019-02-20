const mongoose = require('mongoose');
const Users = mongoose.model('users');

module.exports = async function ({email, password, req}) {

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