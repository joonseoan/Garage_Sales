/* 
[ Todo list]
1. validate - schema data
2. error handling - centralized error handling
*/


const express = require('express');
const app = express();

const mongoose = require('mongoose');
// const cors = require('cors');
// app.use(cors());

const bodyPaerser = require('body-parser');
const hbs = require('express-handlebars'); 


// to 'config' session
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const expressGraphQL = require('express-graphql');

// Not easily working: we should use proxy,*****************************
//  if the client and the server hosts are different.
// cors is not able to set-Cookie value in response.
//  because the client accesses to /graphql before the server 
// const cors = require('cors');

const { mongoURI, sessionSecret } = require('./config/dev');
const { pageNotFound } = require('./controllers/pageNotFound');

// When graphql
// app.use(cors());

// app.use(bodyPaerser.urlencoded({ extended: false }));
// app.use(bodyPaerser.json(), );

// model must be up before graphql schema.
//  Therefore, monsoose register for graphQL Schema.
// require('./models/users/users_helpers');

// will be removed...just for testing...
// require('./models/tokens/token_schema');

// model must be prior to Schema.
require('./models');



// activate passport
require('./services/passport_auth');

const schema = require('./schema/schema');

if (!mongoURI) {
    throw new Error('You must provide a MongoLab URI');
}


mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, { useCreateIndex: true, useNewUrlParser: true });
mongoose.connection
.once('open', () => {
    console.log('Connected to MongoDB instance.');
    app.listen(4000, () => {
        console.log('Listening to the client.');
    }); 
    
})
.on('error', e => { console.log(`Error connecting to MongoDB: ${e}`)});


app.use(bodyPaerser.json());

// // when restfulAPI without cors
app.use((req, res, next) => {
    // Access-Control-Allow-Origin: set up that client allows cross origin resource sharing
    //  "*":  any clients or we can specify like "codepen.io"
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
    // make the client set Content-Type and Authorization (to be discussed)
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
    


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

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}));

    


// app.engine('hbs', hbs({ extname: 'hbs' }))

// app.set('view engine', 'hbs');
// app.set('views', 'views');

// app.get('/', (req, res) => {
    //     res.send('<h1>Home Page</h1>');
    // });
    
    // app.use(pageNotFound);
    
    
    
    
        
        