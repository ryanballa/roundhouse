/* eslint-disable camelcase */
const routes = require('express').Router();
const destinations = require('./destinations');
const locomotives = require('./locomotives');
const photos = require('./photos');
const railcars = require('./railcars');
const trafficGenerators = require('./trafficGenerators');
const tasks = require('./tasks');
const users = require('./users');
const work_items = require('./work_items');
const work_order_groups = require('./work_order_groups');
const workOrders = require('./workOrders');

routes.use('/api/v1/destinations', destinations);
routes.use('/api/v1/locomotives', locomotives);
routes.use('/api/v1/photos', photos);
routes.use('/api/v1/railcars', railcars);
routes.use('/api/v1/tasks', tasks);
routes.use('/api/v1/trafficGenerators', trafficGenerators);
routes.use('/api/v1/users', users);
routes.use('/api/v1/work_items', work_items);
routes.use('/api/v1/work_order_groups', work_order_groups);
routes.use('/api/v1/workOrders', workOrders);

module.exports = routes;
