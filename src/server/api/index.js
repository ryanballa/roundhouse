const routes = require('express').Router();
const destinations = require('./destinations');
const locomotives = require('./locomotives');
const photos = require('./photos');
const railcars = require('./railcars');
const trafficGenerators = require('./trafficGenerators');
const tasks = require('./tasks');
const users = require('./users');
const workOrders = require('./workOrders');

routes.use('/api/v1/destinations', destinations);
routes.use('/api/v1/locomotives', locomotives);
routes.use('/api/v1/photos', photos);
routes.use('/api/v1/railcars', railcars);
routes.use('/api/v1/tasks', tasks);
routes.use('/api/v1/trafficGenerators', trafficGenerators);
routes.use('/api/v1/users', users);
routes.use('/api/v1/workOrders', workOrders);

module.exports = routes;
