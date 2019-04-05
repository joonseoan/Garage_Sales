const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLFloat, GraphQLList } = graphql;

const ContactType = new GraphQLObjectType({
    name: 'ContactType',
    fields: {
        userId: { type: GraphQLID },
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