const mongoose = require('mongoose');
const { Schema } = mongoose;


const productSchema = new Schema({

    user: { 
        type: Schema.Types.ObjectId,
        ref: 'users' 
    },
    category: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    imageUrls: [{
        type: String
    }]


}, {
    timestamps: true
});

module.exports = productSchema;

