const mongoose = require('mongoose');
const validator = require('validator');

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
    // need to validate with "confirmPassword"
    password: {
        type: String,
        required: true,
        trim: true,
        min: 4
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    // no need to strict because if it is not available,
    // will use "user!"
    alias: String,
    // must be object type inside of an array
    // It will not assign another object field inside of the object in this arry**********
    tokens: [{
        type: Schema.Types.ObjectId,
        ref: 'tokens'
    }],
    contact: {
        type: Schema.Types.ObjectId,
        ref: 'contacts'
    }
}, {
    timestamps: true
});

module.exports = userSchema;