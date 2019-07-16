require('dotenv').config();
require('marko/node-require');

const express = require('express');

const app = express();
const path = require('path');
/* istanbul ignore next */
const environment = process.env.NODE_ENV || 'development';
const url =
  environment === 'development'
    ? 'http://localhost:3000'
    : 'https://roundhouseapp.herokuapp.com/';
const cloudinary = require('cloudinary');

const appPort = process.env.PORT || 3000;

const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const api = require('./api');

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.AUTH_STRING,
  }),
);

const oidc = new ExpressOIDC({
  appBaseUrl: url,
  issuer: `${process.env.OKTA_ORG}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: `${url}authorization-code/callback`,
  scope: 'openid profile',
});

app.use(oidc.router);

app.get('/', (req, res) => {
  if (req.userContext.userinfo) {
    res.send(`Hi ${req.userContext.userinfo.name}!`);
  } else {
    res.send('Hi!');
  }
});

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

app.use('/', api);

app.use(express.static(path.join('dist')));

app.get('/auth', (req, res) => {
  if (!req.userContext) {
    res.status(401).json({ error: 'User is not authorized.' });
  }
  return res.status(200).json({ user: req.userContext.userinfo });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../../dist/index.html`));
});

oidc.on('ready', () => {
  app.listen(environment === 'test' ? 0 : appPort, () => {});
});

oidc.on('error', err => {
  console.log('Unable to configure ExpressOIDC', err);
});

module.exports = app;

// let server;
// /* istanbul ignore next */
// oidc.on('ready', () => {
//   const appPort = process.env.PORT || 3000;
//   server = app.listen(environment === 'test' ? 0 : appPort, () => {});
// });

// oidc.on('error', err => {
//   console.log('Unable to configure ExpressOIDC', err);
// });

// module.exports = server;
