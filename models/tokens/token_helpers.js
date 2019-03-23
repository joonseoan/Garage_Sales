const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const tokenSchema = require('./token_schema');

tokenSchema.statics.findToken = async function(userId, tokenId) {

    const Tokens = this;

    try {
        const tokens = await Tokens.find({ user: userId });
        return tokens.find(tokenData => {
            if(tokenData._id.toString() === tokenId.toString())
            return tokenData.token;
        });
    } catch(e) {
        throw new Error('Unable to get your token.');
    }

}

tokenSchema.statics.findUserByToken = async function(token) {

    const Tokens = this;

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userToken = await Tokens.findOne({
            token, 
            access: decoded.access,
            user: decoded._id
        });

        const Users = mongoose.model('users');
        const user = await Users.findById(userToken.user);
        if(!user) throw new Error('Unable to find User by the token given.');

        return user;

    } catch(e) {
        throw new Error(e || 'Failed to fid the user.');
    }
}

mongoose.model('tokens', tokenSchema);
