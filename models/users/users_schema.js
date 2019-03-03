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
    password: {
        type: String,
        required: true,
        trim: true
        // will add this later on
        // min: 8
    },
    // must be object type inside of an array
    tokens: [
        {
            type: Schema.Types.ObjectId,
            ref: 'tokens'
        }    
    ]

});

module.exports = userSchema;