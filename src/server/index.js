const express = require('express')
const api = require('./api');
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
  /* istanbul ignore next */
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../knexfile')[environment]
const database = require('knex')(configuration)

app.use('/', api);

app.use(express.static(path.join('dist')))

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/../../dist/index.html'));
});

  /* istanbul ignore next */
const server = app.listen(environment === 'test' ? 0 : 3000, () => {});

module.exports = server;
