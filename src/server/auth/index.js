const routes = require('express').Router();
const router = require('./router');

routes.use('/auth', router);

module.exports = routes;
