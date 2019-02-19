// const mongoose = require('mongoose');
const _ = require('lodash');

const { signup, login } = require('../../services/passport_auth');
// const Users = mongoose.model('users');

module.exports = app => {

    app.get('/signup', (req, res) => {

        res.send('<h1>Working</h1>');

    });   

    app.post('/signup', async (req, res) => {

        try {

            // Option 1) using graphQL only
            const result =  await signup({email: req.body.email, password:req.body.password, req})
            res.send(result);
                    
        } catch(e) {

            res.status('400').send();

        }

            
        // Option 2) using graphql and express router togeter 
        // --------------------------------------------------------------------
        // const body = _.pick(req.body, ['email', 'password']); 

        // const user = new User(body);

        // try {

        //     // [ES7]
        //     await user.save();
        //     const token = await user.generateAuthToken();
        //     await res.header('x-auth', token).send(user);

        //     // [ES5]
        //     // return user.save().then(() => {
        //     //     return user.generateAuthToken();     
        //     // }).then(token => {
        //     //     res.header('x-auth', token).send(user);
        //     // });


        // } catch(e) {

        //     res.status('400').send('Error code: 400');
        // }
        // ---------------------------------------------------------------------

    });

    app.post('/login', async (req, res) => {

        const { email, password } = req.body;

        try {

            const result = await login({ email, password, req});
            res.send(result);

        } catch(e) {

            res.status('400').send();

        }

    });

}