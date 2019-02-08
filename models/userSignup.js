const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const userAuth = new Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validator: {
            validator: validator.isEmail,
            message: "Your {value} is not valid as an email"
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    }

});

module.exports = mongoose.model('userSignup', userAuth);