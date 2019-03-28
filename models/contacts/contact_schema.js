const mongoose = require('mongoose');
// const validator = require('validator');

const { Schema } = mongoose;

const contactSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    streetNumber: {
        type: String,
        required: true,
        trim: true
    },
    streetName: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    // no need to trim because of the defined input size
    province: {
        type: String,
        required: true
    },
    // Need to validate
    postalCode: {
        type: String,
        required: true
    },
    // Need to validate
    telephone: {
        type: String,
        required: true
    },
    lat: Number,
    lng: Number
    
}, {
    timestamps: true
});

module.exports = contactSchema;