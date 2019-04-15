module.exports = `
    type Users {
        _id: ID
        email: String
        firstName: String
        lastName: String
        alias: String
        contact: Contacts
        createdAt: String
        updatedAt: String
    }

    input UserInput {
        email: String!
        password: String!
    }
`;