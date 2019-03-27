const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString } = graphql;

const UserType = require('./types/user_type');
const ContactType = require('./types/contact_type');
const { signup, login } = require('../services/passport_auth');

// resolve return value is all user instance 
//  mongoose schema has

// UserType === instance of 'users' model
const mutation = new GraphQLObjectType({
    name: 'Mutation',

    fields: {
        // add data
        signup: {
            // Mutation's target schema (or class)
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
    
            // req: it is same as request from the client.
            
            // 2) es2016
            resolve(parentValue, { email, password }, req) {
            
            // 1) es5 
            // resolve(parentValue, args, req) {
            
                return signup({ email, password, req }); 
            }
        },
        logout: {
            type: UserType,
            // not necessary to use args
            // because passport's a set of req.logout() in req
            resolve(parentValue, args, req) {
                const { user } = req;
                req.logout();
                return user;
            }
        },
        login: {
            type: UserType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parentValue, { email, password }, req) {
                return login({ email, password, req });
            }
        },
        createContact: {
            type: ContactType,
            resolve(parentValue, req) {

                console.log(req)

                // const { streetNumber, streetName, city, province, postalFirst, postalSecond, telephone } = req.body.variables

                // // console.log('req.user at createContact', req.user);
                // const Contacts = mongoose.model('contacts');

                // const contact = new Contacts({

                //     // user: req.user._id,
                //     streetNumber,
                //     streetName,
                //     city,
                //     province,
                //     postalCode: postalFirst + ' ' + postalSecond,
                //     telephone

                // });

                // console.log('googleAddress: ', contact.createCoordinates());
                // return contact.createCoordinates();

            }
        }
    }
});

module.exports = mutation;