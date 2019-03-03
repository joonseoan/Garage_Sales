// const mongoose = require('mongoose');
const _ = require('lodash');

const { signup, login } = require('../../services/passport_auth');
// const Users = mongoose.model('users');

module.exports = app => {

    app.post('/signup', async (req, res) => {

        /* 
        
            1. SerializeUser Only: it stores jwt into session after signup and login
        
        */

        try {

            // Option 1) using graphQL only
            const result =  await signup({email: req.body.email, password: req.body.password, req});

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

    app.get('/logout', (req, res) => {

        /*
            1. deserializeUser : 
                1) find and get jwt from the session and compares that jwt to the one from database.
                2) Then, find the user and logout: which means that delete cookie's value(token)
            2.  If the logged in user is not available, generate error
        
        
        */
        try {

            const user = req.user;
            if(!user) throw new Error('You did not sign in.');
            req.logout();
            res.send(user);

        } catch(e) {

            res.status('400').send();
        
        }

    });

    app.post('/login', async (req, res) => {

        /* 
        
            1. LocalStrategdy : 
                1) compare email from user 
                2) and then if the user is available, compare password put by the user 
                    and the enrypted password fetched from the database
                3) Then, it returns user as a parameter of passport.authenticate()
            2. serializeUser : by using req.login() in authenticate, it deliver user to serialzieUser
                1) creating session data 
                2) created req.user
        
        */

        const { email, password } = req.body;

        // 2)
        try {

            const result = await login({ email, password, req });
    
            res.send(result);

        } catch(e) {
            
            throw new Error('Unable to login in express');
        }

        // 1)
        // login({ email, password, req})
        //     .then(result => {
        //         res.send(result);
        //     })
        
    });

}