const mongoose = require('mongoose');
const imageSchema = require('./images_schema');
mongoose.model('images', imageSchema);