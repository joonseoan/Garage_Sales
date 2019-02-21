
const express = require('express');
const mongoose = require('mongoose');

// model must be up before graphql schema.
//  Therefore, monsoose register for graphQL Schema.
require('./models/users/users_helpers');
const bodyPaerser = require('body-parser');
const hbs = require('express-handlebars'); 

// in order to 'config' session
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
mongoose.connection
.once('open', () => { console.log('Connected to MongoDB instance.')})
.on('error', e => { console.log(`Error connecting to MongoDB: ${e}`)});

const schema = require('./schema/schema');


// app.use(bodyPaerser.urlencoded({ extended: false }));
app.use(bodyPaerser.json());

// config session eventually to store the session data on mongodb
app.use(session({
    resave:true,
    saveUninitialized: true,
    secret: sessionSecret,
    // store session data in mongoDB
    store: new MongoStore({
        url: mongoURI,
        autoReconnect: true
    })
}));

// start passport
app.use(passport.initialize());

// connect passport to session
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

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

app.use(pageNotFound);

app.listen(4000, () => {
    console.log('Listening');
});