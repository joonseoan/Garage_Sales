const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList } = graphql;
const mongoose = require('mongoose');

const UserType = require('./user_type');
const ContactType = require('./contact_type');

// Only things required to get in the authentication app are username(email) and password.
// no tokens to the client!
const RootQueryType = new GraphQLObjectType({
    // RootQueryName registers for GraphQL query
    name: 'RootQueryType',
    fields: () => ({
        // queryName
        getCurrentUser: {
            
            // RootQueryType's Target Schema( or Classs
            type : UserType,
            resolve(parentValue, args, req) {
                console.log(req.user)
                // simply return user in req.
                // if user in req is not available return 'null'
                return req.user;
            }
        },
        coords: {
            type: new GraphQLList(ContactType),
            resolve(parentValue) {
                const Contacts = mongoose.model('contacts');
                return Contacts.find()
                    .then(coords => {
                        if(!coords) throw new Error('Unable to get coordinate lists.');
                        const getAllCoords = coords.map(coord => {
                            const { lat, lng, userId } = coord;
                            return { userId, lat, lng };
                        }); 
                        console.log(getAllCoords);
                        return getAllCoords;
                    })
                    .catch(e => {
                        throw new Error(e);
                    });
            }
        }
    })
});

module.exports = RootQueryType;