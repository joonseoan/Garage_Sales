const { buildSchema } = require('graphql');
const products = require('./product_type');

module.exports = buildSchema(`

        `.concat(
            products,
        `
        type RootQuery {
            hello: String!
        }

        type RootMutation {
            createProduct(productInput: ProductInput!): Products!
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `   
    )
);