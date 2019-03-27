const mongoose = require('mongoose');

const Users = mongoose.model('users');
const Contacts = mongoose.model('contacts');

module.exports = async function ({ email, password, req }) {

    const { firstName, lastName, alias} = req.body.variables;
    
    try {

         // if(!email || !password) throw new Error();
         if(!email || !password || !firstName || !lastName) 
            throw new Error('You must provide an email and a password');
        
         const existingUser = await Users.findOne({ email });
     
         // if(existingUser) throw new Error();
         if(existingUser) throw new Error('The email already exists.');

        // need to find a way not to save it fails
        const user = new Users({
            email, 
            password,
            firstName,
            lastName, 
            alias: alias || 'Neighbor'
        });

        // if(!user) throw new Error('Unable to save user.');

        //use token model
        const token = await user.generateAuthToken();

        if(!token) throw new Error('Unable to get the new token.');

        await user.save();

        // must use Promise to send 'user' to serializeUser
        // It is defined by passport
        return new Promise((resolve, reject) => {
             req.login(user, err => {
                if(err) reject(err);
                resolve(user);
            });
        });

    } catch(e) {
        throw new Error(e);
    }


    
// contact
// --------------------------------------------------------------------------------------------------
        // const contact = await new Contacts({ 
        //     // ref:  DB shows only id
        //     //  but when pulling out the data, it shows detail doc info
        //     //  because of assigning all user data here.

        //     // next time when build this data just use id, not the entire document data.
        //     // just when fetch the data, use execute.
        //     // user,
        //     streetNumber,
        //     streetName,
        //     city,
        //     province,
        //     postalCode: postalFirst + postalSecond,
        //     telephone
        // })

        // const googleAddress = await contact.createCoordinates();

        // // It must be sent to the client to double check with the user.
        // // The user must answer yes or not
        // console.log(googleAddress)

        // // if(!googleAddress) throw new Error('Unable to find your address.');

        // console.log('It must not work when google geocode error..')

        // // in case the user answer no ==> signup page again .
        
        // // "yes" or "no" message to the server
        // 1) we can use req.variable for the client to send "yes!!!" or no return....
        // 2) or app.use((req, res, next))
        // 3) or process.env.yes/no 
        // const userContact = await contact.save();

        // if(!userContact) throw new Error('Unable to create contact information.');

// ----------------------------------------------------------------------------------------------------
       
}