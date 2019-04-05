const mongoose = require('mongoose');
// const Products = mongoose.model('products');
const Images = mongoose.model('images');

const productSchema = require('./products_schema');

productSchema.methods.saveProduct = function(imageUrl) {
    const product = this;

    const image = new Images({
        product: product._id,
        imageUrl
    });

    const updatedImages = [ ... product.images, imageUrl ];
    product.images = updatedImages;

    return Promise.all([image.save(), product.save()])
      // if [lyric, song] exists, return song only 
        .then(([image, product]) => product);
}

mongoose.model('products', productSchema);