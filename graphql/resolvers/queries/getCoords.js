const mongoose = require('mongoose');

exports.getCoords = async function(args, req) {
    // if(!req.user) throw new Error('You are not authenticated user.');
    try {
        const Contacts = mongoose.model('contacts');
        const contacts = await Contacts.find();
        if(!contacts) throw new Error('Unable to find contact list.');
        
        return contacts.map(contact => {
            return {
                ...contact._doc,
                _id: contact._id.toString(),
                createdAt: contact.createdAt.toISOString()
            };
        });
    } catch(e) {
        throw new Error(e || 'Failed to fetch catact data.');
    }
}