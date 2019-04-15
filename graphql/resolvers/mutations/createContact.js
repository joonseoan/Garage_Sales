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
        if(!req.user) throw new Error('You are not log-in user.');
        if(req.user.contact) throw new Error('Your address already exists.');
        // need to create address update also.
        const Contacts = mongoose.model('contacts');
        const contact = new Contacts({
            userId: req.user,
            streetNumber,
            streetName,
            city,
            province,
            telephone
        });

        try{
            const userContact = await contact.createCoordinates();
            // need to confirm google Address. Yes => save, No => input window again.
            if(!userContact) throw new Error('Unable to get Goole data.');
            return _.pick(userContact._doc, 'telephone', 'lat', 'lng', 'googleAddress');   
        } catch(e) {
            throw new Error(e || 'Failed to get user contact. ');
        }
}