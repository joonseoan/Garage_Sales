const mongoose = require('mongoose');

exports.getImageList = async (args, req) => {
    // console.log('req.user in getCurrentUser: ', req.user)
    // console.log(req.user);
    try{
        const Images = mongoose.model('images');
        const images = await Images.find().exec();
        if(!images)
            throw new Error('Unable to get image list.');
        return images; 
    } catch(e) {
        throw new Error(e || 'Failed to fetch the image list.');
    }
}