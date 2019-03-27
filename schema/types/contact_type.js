const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLFloat } = graphql;

const ContactType = new GraphQLObjectType({
    name: 'ContactType',
    fields: {
        streetNumber: { type: GraphQLString },
        streetName: { type: GraphQLString },
        city: { type: GraphQLString },
        province: { type: GraphQLString },
        postalCode: { type: GraphQLString },
        lat: { type: GraphQLFloat },
        lng: { type: GraphQLFloat }
    }
});

module.exports = ContactType;