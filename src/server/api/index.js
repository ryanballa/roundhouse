const routes = require('express').Router();
const locomotives = require('./locomotives');
const photos = require('./photos');
const users = require('./users');

routes.use('/api/v1/locomotives', locomotives);
routes.use('/api/v1/photos', photos);
routes.use('/api/v1/users', users);

module.exports = routes;
