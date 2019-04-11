const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

exports.createContact = async function({ 
    contactInput: {
        streetNumber,
        streetName,
        city,
        province,
        telephone
    }
}, req) {

        // if(!req.user) throw new Error('The user must login.');
        const Contacts = mongoose.model('contacts');
        const contact = new Contacts({
            // userId: req.user._id,
            streetNumber,
            streetName,
            city,
            province,
            telephone
        });

        let userContact;
        try{
            userContact = await contact.createCoordinates();
            if(!userContact) throw new Error('Unable to get Goole data.');
        } catch(e) {
            throw new Error(e || 'Failed to get user contact. ');
        }
        
        return _.pick(userContact._doc, 'telephone', 'lat', 'lng', 'googleAddress');   
}