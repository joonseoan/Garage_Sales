const validator = require('validator');

exports.createProduct = async function({
        productInput: {
            category,
            name,
            brand,
            model,
            price,
            description,
            imagePath            
        }
    }, req) {

        console.log('wwwwwwwwwwwwwwwwwww')
        // const errors = [];
        // if(!validator.isEmail(email)) {
        //     errors.push({message: 'The email is invalid.'});
        // }
        // if(validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
        //     errors.push({ message: 'The password is too short!'});
        // }
        // if(validator.isEmpty(name)) {
        //     errors.push({ message: 'You must put your name.'});
        // }
        
        // // In graphql to use cental error control like rest/express srver,
        // //  async and await should be used
        // //  because the new error in "then" functio cant' get out of it and 
        // //  then reach out to the global object environemnt 
        // // Just bear in mind that we cannot use next() in the graphql env.
        // if(errors.length > 0) {
        //     const error = new Error('Invalid Input');
        //     error.data = errors;
        //     error.code = 422;
        //     throw error
        // }
    
        // const existingUser = await User.findOne({ email });

        // if(existingUser) {
        //     const error = new Error('User exists already!');
        //     throw error;
        // }
        // const hashedPassword = await bcrypt.hash(password, 12);
        
        // const user = new User({
        //     email,
        //     password: hashedPassword,
        //     name
        // });

        // const createdUser = await user.save();
        // console.log(createdUser)
        
        // // just to change "_id" object to String
        // // by the way, why _doc?
        // return { ...createdUser._doc, _id: createdUser._id.toString() }

        //console.log(name, brand, model, price, ' ====================> working?')
        
        // 이걸로 받아야 하나?
        console.log(req.body);

        return { name, description };


    // // 2) es6
    //  createUser({ userInput }, req) {
    //      const email = userInput.email;
    // 1)
    // createUser(args, req) {
    //     const email = args.userInput.email;
    
}