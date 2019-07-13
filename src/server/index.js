require('dotenv').config();

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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use('/', api);

app.use(express.static(path.join('dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/../../dist/index.html'));
});

/* istanbul ignore next */
const appPort = process.env.PORT || 5000;
const server = app.listen(environment === 'test' ? 0 : appPort, () => {});

module.exports = server;
