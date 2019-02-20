const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userSchema = require('./users_schema');

userSchema.methods.toJSON = function() {

    const user = this;

    const backToUser = user.toObject();

    return _.pick(backToUser, ["_id", "email"]);

};

// password from user's input which is not encrypted
// user.password from database which is encrypted by bicrypt
userSchema.methods.comparePassword = function(password) {

    const user = this;

    try {

        // By using callback 
        // bcrypt.compare(password, user.password, (err, isMatch) => {
            
        //     callback(err, isMatch);
            
        // });

        // 2) Promise
        return new Promise((resolve, reject) => {

            bcrypt.compare(password, user.password, (err, isMatch) => {
                
                if(isMatch) {
                    resolve(user);
                } else {
                    reject();
                }       
                    
             });

        });

    } catch(e) {

        throw new Error('Unable to identify the password.');

    }

}

userSchema.methods.generateAuthToken = async function () {

    const user = this;
    
    const access = 'xxxx';

    let token;
    
    try {

        token = await jwt
        .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
        .toString();
        
        user.tokens = await user.tokens.concat([{access, token}]);

        await user.save();
        
        return token;
    
    } catch(e) {
        
        throw new Error('Unable to generate jwt and save the user.');

    } 
    
}

userSchema.statics.findByToken = async function(token) {

    // console.log('token at userSchema: ', token)
    
    const Users = this;

    let decoded;

    try {
        
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await Users.findOne({
            _id: decoded._id,
            "tokens.access": decoded.access, 
            "tokens.token": token
        });

        if(!user) throw new Error();
        // console.log('user return at findByToken: ', user);

        return user;
        
    } catch(e) {
        
        throw new Error('Unable to find the identified token.');
    }
   
} 

// userSchema.statics.findByEmail = async function(email) {

//     const Users = this;

//     try {

//         const user = await Users.findOne({ email });
//         if(!user) throw new Error();
        
//         return user;

//     } catch(e) {

//         throw new Error('Unable to find the user by email.');

//     }


// }

userSchema.pre('save', function(next){

    const user = this;

    try {

        if(!user.isModified('password')) { 
            
            next();
    
            throw new Error();

        }
        
        bcrypt.genSalt(10, (err, salt) => {

            if(err) return next(err);
            
            bcrypt.hash(user.password, salt, (err, hash) => {
            
                if(err) return next(err);
                user.password = hash;
                next();

            });

        });

    } catch(e) {

        throw new Error('Unable to encode the password.');

    }

});

mongoose.model('users', userSchema);