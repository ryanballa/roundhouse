require('dotenv').config();
require('marko/node-require');

const express = require('express');
const api = require('./api');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
/* istanbul ignore next */
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);
const cloudinary = require('cloudinary');
const markoExpress = require('marko/express');

const createError = require('http-errors');
const logger = require('morgan');
const session = require('express-session');
const okta = require('@okta/okta-sdk-nodejs');
const ExpressOIDC = require('@okta/oidc-middleware').ExpressOIDC;

const oktaClient = new okta.Client({
  orgUrl: process.env.OKTA_ORG,
  token: process.env.OKTA_TOKEN_VALUE,
});
const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  appBaseUrl: 'http://localhost:3000',
  redirect_uri: 'http://localhost:3000/users/callback',
  scope: 'openid profile',
  routes: {
    login: {
      path: '/users/login',
    },
    callback: {
      path: '/users/callback',
      defaultRedirect: '/locomotives',
    },
  },
});

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

app.use('/', api);

function loginRequired(req, res, next) {
  if (!req.user) {
    return res.status(401);
  }
  return next();
}

// app.use(express.static(path.join('dist')));
app.use(markoExpress()); // enable res.marko(template, data)

const template = require('./template.marko');

app.get('*', (req, res) => {
  res.marko(template);
});

/* app.get('*', (req, res, next) => {
  loginRequired(req, res, next);
  res.sendFile(path.join(__dirname + '/../../dist/index.html'));
}); */

/* istanbul ignore next */
const appPort = process.env.PORT || 5000;
const server = app.listen(environment === 'test' ? 0 : appPort, () => {});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.AUTH_STRING,
  }),
);
app.use(oidc.router);

app.use((req, res, next) => {
  if (!req.userinfo) {
    return next();
  }

  oktaClient
    .getUser(req.userinfo.sub)
    .then(user => {
      req.user = user;
      res.locals.user = user;
      next();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = server;
