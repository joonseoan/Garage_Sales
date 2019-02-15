const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { Schema } = mongoose;

const userSchema = new Schema({

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

userSchema.methods.toJSON = function() {

    console.log("toJSON user: ", this);

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
                console.log('res: ', res);
                resolve(res);
            } else {
                reject();
            }
        });

    });

}


// jwt and isEmail
userSchema.methods.generateAuthToken = function () {

    const user = this;
    
    const access = 'xxxx';

    let token;
    
    try {

        token = jwt
        .sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET)
        .toString();
         
        // it is like 'this.tokens'. It can be added and modified anywhere in a class.
        // Do not confused. 
        console.log('user at gnerateAuthToken: ', user);
        this.tokens = user.tokens.concat([{access, token}]);
        
        return user.save().then(() => {
            return token;
        });

    } catch(e) {
        
        return Promise.reject();
    } 

}

userSchema.statics.findByToken = function(token, callback) {
    
    const User = this;

    let decoded;

    try {
        
        decoded = jwt.verify(token, process.env.JWT_SECRET);

    } catch(e) {

        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        "tokens.access": decoded.access, 
        "tokens.token": token
    }, (err, user) => {
        
        console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk : ', user);
        callback(user);
        
        if(err) throw new Error('Operation error occurred.');

    });

} 

//.pre : it always runs before the data stores
userSchema.pre('save', function(next){

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

module.exports = mongoose.model('user', userSchema);