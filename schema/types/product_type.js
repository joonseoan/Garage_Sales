const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLFloat, GraphQLID, GraphQLString, GraphQLList } = graphql;

const ImageType = require('./image_type');
const Products = mongoose.model('products');

const ProductType = new GraphQLObjectType({
    name: 'ProductType',
    fields: () => ({
        id : { type: GraphQLID },
        userId: { type: GraphQLID },
        category: { type: GraphQLString },
        name: { type: GraphQLString },
        brand: { type: GraphQLString },
        model: { type: GraphQLString },
        price: { type: GraphQLFloat },
        description: { type: GraphQLString },
        images: { 
            type: new GraphQLList(ImageType) //,
            // resolve(parentValue, args, req) {

            //     return ;
            // }
        }
    })
});



module.exports = ProductType;

