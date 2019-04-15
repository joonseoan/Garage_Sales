const { buildSchema } = require('graphql');
const { authMessage } = require('./schemas/message_typ');
const products = require('./schemas/product_type');
const contacts = require('./schemas/contact_type');
const users = require('./schemas/user_type');

module.exports = buildSchema(`

        `.concat(
            authMessage,
            products,
            contacts,
            users,
        `
        type RootQuery {
            getCurrentUser: Users!
            getCoords: [Contacts!]!
        }

        type RootMutation {
            createProduct(productInput: ProductInput!): Products!
            createContact(contactInput: ContactInput!): Contacts!
            signup(userInput: UserInput!): AuthMessage!
            logout: AuthMessage!
            login: AuthMessage!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `   
    )
);