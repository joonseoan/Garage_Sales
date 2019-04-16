const validator = require('validator');
const mongoose = require('mongoose');

exports.createProduct = async function({
        productInput: {
            category,
            name,
            brand,
            model,
            price,
            description,
            imagePaths      
        }
    }, req) {
        
    // console.log('imagePaths: ', req.body)
    // const errors = [];
    // if(!validator.isEmail(email)) {
    //     errors.push({message: 'The email is invalid.'});
    // }
    // if(validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
    //     errors.push({ message: 'The password is too short!'});
    // }
    // if(validator.isEmpty(name)) {
    //     errors.push({ message: 'You must put your name.'});
    // }
    
    // // In graphql to use cental error control like rest/express srver,
    // //  async and await should be used
    // //  because the new error in "then" functio cant' get out of it and 
    // //  then reach out to the global object environemnt 
    // // Just bear in mind that we cannot use next() in the graphql env.
    // if(errors.length > 0) {
    //     const error = new Error('Invalid Input');
    //     error.data = errors;
    //     error.code = 422;
    //     throw error
    // }


    // need to refactoring with mongoose schema.
    try {

        const Products = mongoose.model('products');
        let product = await new Products({
            category,
            name,
            brand,
            model,
            price,
            description
        }).save();

        if(!product) throw new Error('Unable to initialize product storing');
    
        const Images = mongoose.model('images');
        const image = await new Images({
            productId: product._id,
            imagePaths
        }).save();

        if(!image) throw new Error('Unable to save images');
    
        product.images = image;
        product  = await product.save();
        if(!product) throw new Error('Unable to save images into product document');
    
        const newProduct = await Products.findById(product._id)
            .populate('images')
            .exec();
        
        if(!newProduct) throw new Error ('Unable to get new product.')
        console.log('newProduct: ', newProduct);
    
        return { 
            ...newProduct._doc,
            _id:  newProduct._id.toString(),
            createdAt: newProduct.createdAt.toISOString(),
            updatedAt: newProduct.updatedAt.toISOString(),
            imageNumbers: newProduct.images.imagePaths.length
         };
    } catch(e) {
        throw new Error('Unable to create product');
    }

}