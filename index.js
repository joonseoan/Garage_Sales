const express = require('express');
const bodyPaerser = require('body-parser');
const hbs = require('express-handlebars'); 
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const expressGraphQL = require('express-graphql');
const app = express();

const { mongoURI, sessionSecret } = require('./config/dev');
const { pageNotFound } = require('./controllers/pageNotFound');

if (!mongoURI) {
    throw new Error('You must provide a MongoLab URI');
}

mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useCreateIndex: true, useNewUrlParser: true });

require('./models/user_jwt');

// app.use(bodyPaerser.urlencoded({ extended: false }));
app.use(bodyPaerser.json());

// store id and compare ids only?
app.use(session({
    resave:true,
    saveUninitialized: true,
    secret: sessionSecret,
    store: new MongoStore({
        url: mongoURI,
        autoReconnect: true
    })
}));

app.use(passport.initialize());
app.use(passport.session());

// app.use('/graphql', expressGraphQL({
    
// }));

app.engine('hbs', hbs({ extname: 'hbs' }))

app.set('view engine', 'hbs');
app.set('views', 'views');

app.get('/', (req, res) => {
    res.send('<h1>Home Page</h1>');
});

require('./routes/auth/auth_jwt')(app);

app.use(pageNotFound);

app.listen(4000, () => {
    console.log('Listening');
});