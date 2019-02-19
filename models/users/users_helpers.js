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

userSchema.methods.comparePassword = function(candidatePassword) {
    
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, res) => {
            if(res) {
                resolve(res);
            } else {
                reject(err);
            }
        });

    });

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
   
} 

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