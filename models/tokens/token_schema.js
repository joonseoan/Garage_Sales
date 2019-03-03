const mongoose = require('mongoose');
const { Schema } = mongoose;
 
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

// tokenSchema.statics.getToken = async (token_id) => {

//     const Tokens = this;

//     try {

//         // over stack call? Please test it... and raise a question to steve!!!
//         // const Tokens = mongoose.model('tokens');

//         const TokenList = await Tokens.findById(token_id);
//         const { token } = TokenList;
        
//         return token;

//     } catch(e) {

//         throw new Error('Unable to find the token list.');

//     }
    
// }

tokenSchema.statics.findToken = function(userId, tokenId) {

    const Tokens = this;

    return Tokens
        // check out next or to toArray() ==> none of them is required.
        .find({ user: userId })
        .then(tokens => {

            return tokens.find(tokenData => {
                console.log(tokenData._id)
                console.log(tokenId)
              if(tokenData._id.toString() === tokenId.toString()) {
                  return tokenData.token;
              }
          });
        })
        .catch(e => { throw new Error('Unable to get token.'); });
  
}

mongoose.model('tokens', tokenSchema);
