const { buildSchema } = require('graphql');
const { authMessage } = require('./message_typ');
const products = require('./product_type');
const contacts = require('./contact_type');
const users = require('./user_type');

module.exports = buildSchema(`

        `.concat(
            authMessage,
            products,
            contacts,
            users,
        `
        type RootQuery {
            getCurrentUser: Users
            getCoords: [Contacts!]!
            getImageList: [Images!]!
        }

        type RootMutation {
            createProduct(productInput: ProductInput!): Products!
            createContact(contactInput: ContactInput!): Contacts
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