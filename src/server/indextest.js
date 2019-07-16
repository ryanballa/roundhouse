require('dotenv').config();

const express = require('express');

const app = express();

const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: process.env.AUTH_STRING,
  }),
);

// const oidc = new ExpressOIDC({
//   issuer: `${process.env.OKTA_ORG}/oauth2/default`,
//   client_id: process.env.OKTA_CLIENT_ID,
//   client_secret: process.env.OKTA_CLIENT_SECRET,
//   appBaseUrl: 'http://localhost:3000',
//   redirect_uri: 'http://localhost:3000/users/callback/',
//   scope: 'openid profile',
//   routes: {
//     login: {
//       path: 'http://localhost:3000/users/login',
//     },
//     callback: {
//       path: '/users/callback',
//       defaultRedirect: '/locomotives',
//     },
//   },
// });
const oidc = new ExpressOIDC({
  appBaseUrl: 'http://localhost:3000',
  issuer: `${process.env.OKTA_ORG}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: 'http://localhost:3000/authorization-code/callback',
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

oidc.on('ready', () => {
  app.listen(3000, () => console.log(`Started!`));
});

oidc.on('error', err => {
  console.log('Unable to configure ExpressOIDC', err);
});

module.exports = app;
