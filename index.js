const express = require('express');
const bodyPaerser = require('body-parser');
const hbs = require('express-handlebars'); 
const mongoose = require('mongoose');
const app = express();

const { mongoURI } = require('./config/dev');

if (!mongoURI) {
    throw new Error('You must provide a MongoLab URI');
}

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useCreateIndex: true, useNewUrlParser: true });

require('./models/userSignup');

// app.use(bodyPaerser.urlencoded({ extended: false }));
app.use(bodyPaerser.json());

app.engine('hbs', hbs({ extname: 'hbs' }))

app.set('view engine', 'hbs');
app.set('views', 'views');

app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1>');
});

require('./routes/auth/auth_jwt')(app);

app.use((req, res, next) => {
    res.status('404').render('pageNotFound', { pageTitle: '404 Error'});
});

app.listen(4000, () => {
    console.log('Listening');
});