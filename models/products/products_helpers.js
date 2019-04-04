const mongoose = require('mongoose');


const productSchema = require('./products_schema');

mongoose('products', productSchema);