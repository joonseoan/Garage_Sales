module.exports = `
    type Contacts {
        userId: String
        telephone: String!
        lat: Float!
        lng: Float!
        googleAddress: String!
    }

    input ContactInput {
        streetNumber: String!
        streetName: String!
        city: String!
        province: String!
        telephone: String!
    }
`;

/* 
streetNumber: String!
        streetName: String!
        city: String!
        province: String!

*/