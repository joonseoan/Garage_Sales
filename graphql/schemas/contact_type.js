module.exports = `
    type Contacts {
        userId: ID!
        telephone: String!
        lat: Float!
        lng: Float!
        googleAddress: String!
        createdAt: String!
    }

    input ContactInput {
        streetNumber: String
        streetName: String
        city: String
        province: String
        telephone: String
    }
`;