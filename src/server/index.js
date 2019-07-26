require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

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
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
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
