const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString } = graphql;

const ImageType = new GraphQLObjectType({
    name: 'ImageType',
    fields: {
        product: { type: GraphQLID },
        imageUrl: { type: GraphQLString }
    }
})

module.exports = ImageType;