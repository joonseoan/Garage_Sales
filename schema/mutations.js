const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString } = graphql;

const UserType = require('./types/user_type');
const ContactType = require('./types/contact_type');
const ProductType = require('./types/product_type');
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
            resolve(parentValue, args, req) {

                const { streetNumber, streetName, city, province, postalFirst, postalSecond, telephone } = req.body.variables.contact
                if(!req.user) throw new Error('The user must login.');
                
                const Contacts = mongoose.model('contacts');
                const contact = new Contacts({
                    userId: req.user._id,
                    streetNumber,
                    streetName,
                    city,
                    province,
                    postalCode: postalFirst + ' ' + postalSecond,
                    telephone
                });

                return contact.createCoordinates()
                    .then(address => {
                        if(!address) throw new Error('Unagle to find Google address.');
                        console.log(address);
                        return address;
                    })
                    .catch(e => {
                        throw new Error(e);
                    });
            }
        },
        createProduct: {
            type: ProductType,
            // args: { },
            resolve(parentValue, args, req) {
                const { category, name, brand, model, price, description, imagePath, imagePreview, } = req.body.variables;
                if(!req.user) throw new Error('The user must login.');

                const Products = mongoose.model('products');
                const product = new Products({
                    userId: req.user._id,
                    category,
                    name,
                    brand,
                    model,
                    price,
                    description
                });

                return product.saveProduct(imagePath || imagePreview)
                    .then(result => {
                        console.log(result || 'successfully saved');
                    })
                    .catch(e => {
                        throw new Error(e || 'Unable to store product.');
                    });
                
            }

        }
    }
});

module.exports = mutation;