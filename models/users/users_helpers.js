const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userSchema = require('./users_schema');

// to show data in console.
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

userSchema.statics.saveUser = async function(body) {

    const User = this;
    const { email, password, confirmPassword, firstName, lastName, street, city, province, postalFirst, postalSecond, telephone, alias } = body.variables;

    // console.log(email, password, firstName, lastName, street, postalFirst, postalSecond, telephone, alias )

    try {

        const user = new User({
            email,
            password,
            firstName,
            lastName,
            street,
            city, 
            province,
            postalCode: postalFirst + postalSecond,
            telephone,
            alias
        });

        return await user.save();
        // console.log(user)

        // const newUser =  await user.save();

        // console.log('newUser: ', newUser)

    } catch(e) {

        throw new Error('Unable to save a new user');

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
        
        const Tokens = mongoose.model('tokens');

        // Do not be confused with pure mongodb.
        // In MongoDB, we need to separately deal with class instance and database.
        //  However, in mongoose, we just need to manipulate class intance(Schema)
        //  then the schema will directly manage database.
        const newToken = await new Tokens({token, access, user: user._id }).save();

        user.tokens = [ ...user.tokens, newToken._id ];

        await user.save();
            
    } catch(e) {
        
        throw new Error('Unable to generate jwt and save the user.');

    } 
    
}


userSchema.pre('save', function(next) {

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