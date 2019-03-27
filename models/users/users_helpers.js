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

    // because we put only id information, **************************************
    //  it does not show the entire and detail token document
    /* 
        this  { tokens: [ 5c965ca686c89e360c094979 ],
        [0]   _id: 5c965ca686c89e360c094978,
        [0]   email: 'aaa@aaa.com',
        [0]   password:
        [0]    '$2a$10$3FjeLALbteXrGzaP8C1NB.nw2YHz3LVbTccgatJRuOS6Qbi5af8C6',
        [0]   firstName: 'James',
        [0]   lastName: 'Dolley',
        [0]   alias: 'af',
        [0]   __v: 1 }
    */    
    console.log('this ', this);

    const user = this;

    try {

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (isMatch) {
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
    
    try {

        const access = 'xxxx';
        const token = await jwt
            .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
            // must not use catch!!!
            .toString();
        
        const Tokens = mongoose.model('tokens');

        // Do not be confused with pure mongodb.
        // In MongoDB, we need to separately deal with class instance and database.
        //  However, in mongoose, we just need to manipulate class intance(Schema)
        //  then the schema will directly manage database.
        const newToken = new Tokens({token, access, user: user._id });
        if(!newToken) throw new Error('Unable to generatea a new token');

        await newToken.save();

        user.tokens = [ ...user.tokens, newToken._id ];

        return token;
            
    } catch(e) {
        throw new Error(e || 'Unable to generate jwt and save the user.');
    } 
    
}

userSchema.pre('save', function(next) {

    const user = this;

    try {

        if(!user.isModified('password')) { 
            next();
            throw new Error('Password is modified.');
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
        throw new Error(e || 'Unable to encode the password.');
    }

});

mongoose.model('users', userSchema);