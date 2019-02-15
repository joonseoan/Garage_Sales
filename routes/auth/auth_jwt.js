const mongoose = require('mongoose');
const _ = require('lodash');

const { signup } = require('../../services/passport_auth');
const User = mongoose.model('user');

module.exports = app => {

    app.get('/signup', (req, res) => {

        res.send('<h1>Working</h1>');

    });   

    app.post('/signup', async (req, res) => {

        // Option 1) using graphQL only
        return signup({email: req.body.email, password:req.body.password, req})
            .then(result => {
                console.log('result: ^^^^^^^^^^^^^^^^^', result);
                res.send(result);
            });

            
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

}