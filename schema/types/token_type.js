
// const mongoose = require('mongoose');
// const Users = mongoose.model('users');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;

const TokenType = new GraphQLObjectType({

    name: 'TokenType',
    fields: {
        token: { type: GraphQLString },
        access: { type: GraphQLString },
        user: { type: GraphQLID }
    }

});

module.exports = TokenType;
