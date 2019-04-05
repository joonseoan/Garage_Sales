const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },    
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = imageSchema;