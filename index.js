const express = require('express');
const app = express();
const path = require('path');

const mongoose = require('mongoose');
// const cors = require('cors');
// app.use(cors());

const bodyPaerser = require('body-parser');
// const hbs = require('express-handlebars'); 

// to 'config' session
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const uuidv4 = require('uuid/v4');
const multer = require('multer');

const expressGraphQL = require('express-graphql');

// Not easily working: we should use proxy,*****************************
//  if the client and the server hosts are different.
// cors is not able to set-Cookie value in response.
//  because the client accesses to /graphql before the server 
// const cors = require('cors');

const { mongoURI, sessionSecret } = require('./config/dev');
// const { pageNotFound } = require('./controllers/pageNotFound');

// When using cors()
// But it is not recommended.
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

// [ cunstructor ]
// const schema = require('./schema/schema'); 

// [ buildSchema ]
const schemas = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');

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
// app.use((req, res, next) => {
//     // Access-Control-Allow-Origin: set up that client allows cross origin resource sharing
//     //  "*":  any clients or we can specify like "codepen.io"
//     // res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, PUT, PATCH, POST, DELETE');
//     // make the client set Content-Type and Authorization (to be discussed)
//     // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });

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

app.use('/images', express.static(path.join(__dirname, 'images')));

// [ GraphQLObjectType Base ]
// app.use('/graphql', expressGraphQL({
//     schema,
//     graphiql: true
// }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('file: ', file)
        cb(null, 'images');
    },
    filename: (req, files, cb) => {
        cb(null, uuidv4());
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(null, false);
      }
};
// "product" : body.append('product', this.state.imagePaht)
const upload = multer({ storage, fileFilter}).array('productImages', 4);
app.put('/uploadImages', (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          throw new Error ('Error during uploading files. By any chande, did you put more than 4 files?');
        } else if (err) {
          throw new Error('Failed to upload files');
        }
        return res.status(200).json({
            message: 'successfully uploaded.',
            filePaths: req.files.map(file => file.path.replace('\\', '/'))
        });
      })
});

// [ GraphQL String Base ]
app.use('/graphql', expressGraphQL({
    schema : schemas,
    rootValue: resolvers,
    graphiql: true,
  
    // Control Errors like app.use((error, req, res, next) => {})
    // formatError(err) {
    //   // error made by the user
    //   if(!err.originalError) {
    //     // error generated by graphql
    //     return err;
    //   }
    //   console.log('err: ', err)
    //   // data: an array contains user's error message
    //   const data = err.originalError.data;
    //   // invalid email
    //   const message = err.message || 'An error occurred.';
    //   const code = err.originalError.code || 500;
  
    //   // return to the client through json({})
    //   return { message, status: code, data };
    // }
  }));

// Only in restful api or legacy routes
// app.use((error, req, res, next) => {
//     console.log(error);
//     const status = error.statusCode || 500;
//     const message = error.message;
//     res.status(status).json({ message });
// });
    
// app.engine('hbs', hbs({ extname: 'hbs' }))

// app.set('view engine', 'hbs');
// app.set('views', 'views');

// app.get('/', (req, res) => {
    //     res.send('<h1>Home Page</h1>');
    // });
    
    // app.use(pageNotFound);
    
    
    
    
        
        