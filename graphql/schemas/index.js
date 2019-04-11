const { buildSchema } = require('graphql');
const products = require('./product_type');
const contacts = require('./contact_type');

module.exports = buildSchema(`

        `.concat(
            products,
            contacts,
        `
        type RootQuery {
            hello: String!
        }

        type RootMutation {
            createProduct(productInput: ProductInput!): Products!
            createContact(contactInput: ContactInput!): Contacts
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `   
    )
);