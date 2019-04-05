const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

// when we would likd to tokens in UserType
// const TokenType = require('./token_type');
// const Users = mongoose.model('users');

// UserType: instance of GraphQLObjecType 
//  for javascript to export / import particularly here.
const UserType = new GraphQLObjectType({

    //'UserType' here for name stored in graphql's memory space
    name: 'UserType',

    // It defines which elements return when doing qury and mutation
    // Then the query and muation in front-end are able to narrowdown 
    //  the elements required again.

    // **************** must be identified with all or partly fields of mongoose schema
    //  which is a document of mongodb ***************************************

    // we should wrap field "value" when we use "GraphQLLIST" type
    fields: {

        id: { type: GraphQLID },
        email: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        alias: { type: GraphQLString },
        // ----------------------------- When we need to use populate -----------------------------
        // tokens:  { 
        //     // I thinK it is a main role of GraphQLList here "mpa()""
        //     type : new GraphQLList(TokenType),
        //     resolve(parentValue) {
        //         return Users.
        //                 findById(parentValue.id)
        //                 .populate('tokens')
        //                 .then(user => user.tokens)
        //                 .catch(e => { throw new Error('Unable to get token list.'); });
        //     }

        // }

    }

});

module.exports = UserType;