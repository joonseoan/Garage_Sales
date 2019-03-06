const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');

const tokenSchema = new Schema({
    
    token: {
        type: String
    },
    access: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        // confirm it is model name!!!!
        ref: 'users'
    }
});

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

    let decoded;

    try {

        decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userToken = await Tokens.findOne({
            token, 
            access: decoded.access,
            user: decoded._id 
        });

        const Users = mongoose.model('users');

        const user = await Users.findById(userToken.user);
        
        if(!user) throw new Error();

        return user;

    } catch(e) {

        throw new Error('Unable to find User by the token given.');

    }

}

mongoose.model('tokens', tokenSchema);