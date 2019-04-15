const mongoose = require('mongoose');

exports.getCurrentUser = async function(args, req) {
    // console.log('req.user in getCurrentUser: ', req.user)
    console.log(req.user);
    // req.user.populate('contact')
    if(!req.user) return {};
    const Users = mongoose.model('users');

    try{

        const user = await Users.findById(req.user._id).populate('contact');    
        const { streetNumber, streetName, city, province, ...noA } = user.contact._doc;
    
        return user && { 
            ...user._doc,
            contact: noA,
            _id: user._id.toString(),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        }; 
    } catch(e) {
        throw new Error(e || 'Failed to fetch the curent user.');
    }
}