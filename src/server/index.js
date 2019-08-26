require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const express_graphql = require('express-graphql');
const { GraphQLSchema } = require('graphql');

const app = express();
const path = require('path');
/* istanbul ignore next */
const environment = process.env.NODE_ENV || 'development';
const cloudinary = require('cloudinary');

let appPort = process.env.PORT || 3000;
if (environment === 'test') {
  appPort = 4000;
}

const authRoutes = require('./auth');
const api = require('./api');

// Setup Sessions
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// uncomment if using express-session
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const { query } = require('./schemas/queries');
const { mutation } = require('./schemas/mutations');

const schema = new GraphQLSchema({
  mutation,
  query,
});

app.use(
  '/graphql',
  express_graphql({
    graphiql: true,
    schema,
  }),
);
app.listen(4000, () =>
  console.log('Express GraphQL Server Now Running On localhost:4000/graphql'),
);

app.use('/', api);
app.use('/', authRoutes);

app.use(express.static(path.join('dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../../dist/index.html`));
});

app.listen(appPort, () => {
  console.log(`Listenting on port ${appPort}`);
});

module.exports = app;
