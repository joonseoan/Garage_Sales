const graphql = require('graphql');
const { GraphQLObjectType } = graphql;

const UserType = require('./user_type');

// Only things required to get in the authentication app are username(email) and password.
// no tokens to the client!
const RootQueryType = new GraphQLObjectType({
    // RootQueryName registers for GraphQL query
    name: 'RootQueryType',
    fields: () => ({
        // queryName
        user: {
            
            // RootQueryType's Target Schema( or Classs
            type : UserType,
            resolve(parentValue, args, req) {

                // simply return user in req.
                // if user in req is not available return 'null'
                return req.user;
            }
        }
    })
});

module.exports = RootQueryType;