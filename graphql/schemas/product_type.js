// TODO

// added product id and user id

module.exports = `
    type Images {
        productId: String!
        imagePaths: [String!]!
    }

    type Products {
        _id: ID!
        category: String!
        name: String!
        brand: String!
        model: String!
        price: Float!
        description: String!
        images: Images!
        createdAt: String!
        updatedAt: String!
        imageNumbers: Int!
    }

    input ProductInput {
        category: String!
        name: String!
        brand: String!
        model: String!
        price: Float!
        description: String!
        imagePaths: [String!]!
    }
`;