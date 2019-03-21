const mongoose = require('mongoose');
const { Schema } = mongoose;

const tokenSchema = new Schema({
    
    token: {
        type: String
    },
    access: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        // confirm it is model name!!!!
        ref: 'users'
    }
});

module.exports = tokenSchema;
