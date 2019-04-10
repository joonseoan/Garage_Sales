const mongoose = require('mongoose');
const Images = mongoose.model('images');

const productSchema = require('./products_schema');

// productSchema.methods.saveProduct = function() {
//     const product = this;
//     const image = new Images({
//         product: product._id,
//         imagePath: imagePath
//     });

//     const updatedImagePaths = [ ... product.imagePaths, imagePath ];
//     product.imagePaths = updatedImagePaths;

//     return Promise.all([image.save(), product.save()])
//         .then(([image, product]) => product);
// }

mongoose.model('products', productSchema);