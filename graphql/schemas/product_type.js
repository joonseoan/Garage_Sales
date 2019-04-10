const { buildSchema } = require('graphql');

// TODO

// added product id and user id
// Products : test it again in removing "s"

module.exports = `

    type Images {
        productId: String!
        imagePath: String!
    }

    type Products {
        category: String!
        name: String!
        brand: String!
        model: String!
        price: Float!
        description: String!
        imagePaths: [Images]
        createdAt: String!
        updatedAt: String!
    }

    input ProductInput {
        category: String!
        name: String!
        brand: String!
        model: String!
        price: Float!
        description: String!
        imagePath: String
    }
`;