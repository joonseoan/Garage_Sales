// TODO

// added product id and user id

module.exports = `

    type Images {
        imagePath: String!
    }

    type Products {
        category: String!
        name: String!
        brand: String!
        model: String!
        price: Float!
        description: String!
        imagePaths: [Images!]!
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
        imagePaths: [ Images! ]!
    }
`;