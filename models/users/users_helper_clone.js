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

// identify a valid password
userSchema.methods.comparePassword = function(candidatePassword) {
    
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, res) => {
            if(res) {
               //  console.log('res: ', res);
                resolve(res);
            } else {
                reject(err);
            }
        });

    });

}


// jwt and isEmail
userSchema.methods.generateAuthToken = async function () {

    const user = this;
    
    const access = 'xxxx';

    let token;
    
    try {

        token = await jwt
        .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
        .toString();
         
        // it is like 'this.tokens'. It can be added and modified anywhere in a class.
        // Do not confused. 
        // console.log('user at gnerateAuthToken: ', user);
        // this.tokens = user.tokens.concat([{access, token}]);
        user.tokens = await user.tokens.concat([{access, token}]);

        await user.save();
        
        return token;
    
    } catch(e) {
        
        throw new Error('Unable to generate jwt and save the user.');

    } 
    
}

userSchema.statics.findByToken = async function(token) {
    
    const Users = this;

    let decoded;

    try {
        
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await Users.findOne({
            _id: decoded._id,
            "tokens.access": decoded.access, 
            "tokens.token": token
        });

        return user;
        
    } catch(e) {
        
        throw new Error('Unable to find the identified token.');
    }
    
    // return User.findOne({
    //     _id: decoded._id,
    //     "tokens.access": decoded.access, 
    //     "tokens.token": token
    // }).then(user => {

    //     return user;

    // });
    
} 

userSchema.statics.findByCredentials = function(email) {

    const Users = this;

    try {

        return Users.findeOne({ email, password }).then(user => {
            if(!user) throw new Error();
            return user;
        });

    } catch(e) {
        throw new Error('Unable to find a user with the given credentials.');
    }

}

//.pre : it always runs before the data gets stored
userSchema.pre('save', function(next){

    const user = this;

    try {

        // if password is not changed, maintain that password with defined bcrypt
        if(!user.isModified('password')) { 
            
            next();
    
            // Promise.reject('');
            throw new Error();

        }
        
        // if "password" property inside of this is modified
        // Also, it works even when the user is created.
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