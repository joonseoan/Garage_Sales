const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { Schema } = mongoose;

const User_JWT_Schema = new Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: "Your {value} is not valid as an email",
            isAsync: false
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    tokens: [
        {
            access: {
            type: String,
            required: true
            },
            token: {
                type: String,
                required: true
            }
        }    
    ]

});

// identify a valid password
User_JWT_Schema.method.comparePassword = function(candidatePassword) {
    
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, res) => {
            if(res) {
                console.log('res: ', res);
                resolve(res);
            } else {
                reject();
            }
        });

    });

}

// jwt and isEmail
User_JWT_Schema.method.generateAuthToken = function() {

    const user = this;

    const access = 'joon';
    
    const token = jwt
        .sign({ _id: user._id.toHexString(), access}, process.env.JWT_SECRET)
        .toString();

    user.tokens = user.tokens.concat([access, token]);

    return user.save().then(() => {
        return token;
    });

}

User_JWT_Schema.statics.findByToken = function(token) {
    
    const User = this;

    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch(e) {
        return Promise.reject();
    }

    return User_JWT_Schema.findOne({
        _id: decoded._id,
        "tokens.access": "joon", 
        "tokens.token": token
    });

} 

//.pre : it always runs before the data stores
User_JWT_Schema.pre('save', function(next){

    const user = this;

    // if password is not changed, maintain that password with defined bcrypt
    if(!user.isModified('password')) { 
        
        next();

        Promise.reject();

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
    })
});

module.exports = mongoose.model('user', User_JWT_Schema);