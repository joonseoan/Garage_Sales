const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const axios = require('axios');

const contactSchema = require('./contact_schema');
const { googleGeoKey } = require('../../config/keys');

contactSchema.methods.createCoordinates = async function() {

    // ********************************************
    /* 
        // ref : user
         In database, just user ID is available.
         However, when we retreive the data, user's detail information is tagging along with the user ID
         this:  { _id: 5c965ca686c89e360c09497a,
        [0]   user:
        [0]    { tokens: [ 5c965ca686c89e360c094979 ],
        [0]      _id: 5c965ca686c89e360c094978,
        [0]      email: 'aaa@aaa.com',
        [0]      password:
        [0]       '$2a$10$3FjeLALbteXrGzaP8C1NB.nw2YHz3LVbTccgatJRuOS6Qbi5af8C6',
        [0]      firstName: 'James',
        [0]      lastName: 'Dolley',
        [0]      alias: 'af',
        [0]      __v: 1 },
        [0]   streetNumber: '11',
        [0]   streetName: 'ST Clair',
        [0]   city: 'Toronto',
        [0]   province: 'ON',
        [0]   postalCode: '222FDD',
        [0]   telephone: 'DFAFDASF',
        [0]   __v: 0 }
    
    */
    
    const contact = this;
    const { streetNumber, streetName, city, province, postalCode, userId } = contact;

    try {

        const response = await axios(`https://maps.googleapis.com/maps/api/geocode/json?key=${ googleGeoKey }
            &address=${ streetNumber }+${ streetName }+${ city }+${ province }+${ postalCode }+canada`);
     
        if(response.data.status === 'ZERO_RESULTS') throw new Error('Invalid Address');

        // for me....I need to remove this one at the production state
        if(response.data.status === 'OVER_QUERY_LIMIT') throw new Error(response.data.message);

        contact.lat = response.data.results[0].geometry.location.lat;
        contact.lng = response.data.results[0].geometry.location.lng;
 
        const updatedContact = await contact.save();
        if(!updatedContact) throw new Error('Unable to save contact Info.');

        const Users = mongoose.model('users');
        const user = await Users.findById(userId);
        user.contact = updatedContact._id;

        const updatedUser = await user.save();
        if(!updatedUser) throw new Error('Unable to add contact to the user.');
        
        // To double check the address with user
        return response.data.results[0].formatted_address;

    } catch(e) {
        throw new Error(e || 'Unable to finish having geocode data.');
    }

}

mongoose.model('contacts', contactSchema);