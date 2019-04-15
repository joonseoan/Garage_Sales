const mongoose = require('mongoose');
const { Schema } = mongoose;

const imageSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'products'
    },    
    imagePaths: [{ 
        type: String,
        required: true
    }] 
});

module.exports = imageSchema;