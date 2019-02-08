const mongoose = require('mongoose');

const Signup = mongoose.model('userSignup');

module.exports = app => {

    app.get('/signup', (req, res) => {

        res.send('<h1>Working</h1>');

    });   

    app.post('/signup', (req, res) => {

        const { email, password } = req.body;

        const signup = new Signup({email, password});
        signup.save();

        // console.log(req.body)
        res.send(req.body);

    });

}