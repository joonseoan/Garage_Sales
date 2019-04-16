const mongoose = require('mongoose');

exports.getImageList = async function(args, req) {
    // console.log('req.user in getCurrentUser: ', req.user)
    // console.log(req.user);
    try{
        const Images = mongoose.model('images');
        const images = await Images.find();
        console.log(images)
        return images; 
    } catch(e) {
        throw new Error(e || 'Failed to fetch the image list.');
    }
}