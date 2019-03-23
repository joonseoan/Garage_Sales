const mongoose = require('mongoose');

const Users = mongoose.model('users');
const Contacts = mongoose.model('contacts');

module.exports = async function ({ email, password, req }) {

    const { 
        user: { firstName, lastName, alias }, 
        contact: {
            streetNumber, streetName, city, province, postalFirst, postalSecond, telephone
        } 
    } = req.body.variables;
    // const { streetNumber, streetName, city, province, postalFirst, postalSecond, telephone } = contact;
    
    try {

       

        const newUserContact = await new Contacts({ 
            // ref:  DB shows only id
            //  but when pulling out the data, it shows detail doc info
            //  because of assigning all user data here.
            // user,
            streetNumber,
            streetName,
            city,
            province,
            postalCode: postalFirst + postalSecond,
            telephone
        }).save();

        if(!newUserContact) throw new Error('Unable to create contact information.');

        await newUserContact.createCoordinates();

        //  // if(!email || !password) throw new Error();
        //  if(!email || !password) throw new Error('You must provide an email and a password');
        
        //  const existingUser = await Users.findOne({ email });
     
        //  // if(existingUser) throw new Error();
        //  if(existingUser) throw new Error('The email already exists.');

        // // need to find a way not to save it fails
        // const user = new Users({
        //     email, 
        //     password,
        //     firstName,
        //     lastName, 
        //     alias: alias || 'Neighbor'
        // }).save();

        // if(!user) throw new Error('Unable to save user.');

        // //use token model
        // await user.generateAuthToken();

        // // must use Promise to send 'user' to serializeUser
        // // It is defined by passport
        // return new Promise((resolve, reject) => {
        //      req.login(user, err => {
        //         if(err) reject(err);
        //         resolve(user);
        //     });
        // });

    } catch(e) {
        throw new Error(e);
    }
       
}