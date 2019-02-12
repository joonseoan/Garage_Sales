const mongoose = require('mongoose');

const User = mongoose.model('user');

module.exports = app => {

    app.get('/signup', (req, res) => {

        res.send('<h1>Working</h1>');

    });   

    app.post('/signup', (req, res) => {

        const { email, password } = req.body;

        const user = new User({email, password});
        user.save();

        // console.log(req.body)
        res.send(req.body);

    });

}