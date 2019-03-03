// const mongoose = require('mongoose');
// const Users = mongoose.model('users');
// const graphql = require('graphql');
// const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList } = graphql;

// // UserType: instance of GraphQLObjecType for javascript
// const UserType = new GraphQLObjectType({

//     //'UserType' here for name stored in graphql's memory space
//     name: 'UserType',

//     // It defines which elements return when doing qury and mutation
//     // Then the query and muation are able to narrowdown the elements required
//     //  again.
//     fields: () => ({

//         id: { type: GraphQLID },
//         email: { type: GraphQLString },
//         password: { type: GraphQLString }
//         // tokens : {
//         //     type : { },
//         //     resolve({id}) {
//         //         return Users.findById(id)
//         //             .then(user => {
//         //                 return user.tokens;
//         //             });
//         //     }
//         // }
//         // tokens:  { type : new GraphQLList() }
    
//     })

// });

// module.exports = UserType;