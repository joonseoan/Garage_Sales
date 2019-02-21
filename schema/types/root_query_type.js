const graphql = require('graphql');
const { GraphQLObjectType } = graphql;

const UserType = require('./user_type');

// Only things required to get in the authentication app are username(email) and password.
// no tokens to the client!
const RootQueryType = new GraphQLObjectType({

    name: 'RootQueryType',
    fields: {
        // queryName
        user: {
            
            // RootQueryType's Target Schema( or Class)
            type : UserType,
            resolve(parentValue, args, req) {

                return req.user;
            }

        }
    }

});

module.exports = RootQueryType;