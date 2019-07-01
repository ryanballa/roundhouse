const users = require('express').Router();
/* istanbul ignore next */
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../../knexfile')[environment]
const database = require('knex')(configuration);
const bodyParser = require('body-parser');

users.use(bodyParser.urlencoded({ extended: false }));
users.use(bodyParser.json());

users.get('/', (request, response) => {
  database('users').select()
    .then((users) => {
      response.status(200).json(users);
    })
    .catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */
      response.status(500).json({ error });
    });
});

users.post('/', (request, response) => {
  const user = request.body;

  for (let requiredParameter of ['full_name']) {
    if (!user[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { full_name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('users').insert(user, 'id')
    .then(user => {
      response.status(201).json({ id: user[0] })
    })
    .catch(  /* istanbul ignore next */error => {
      /* istanbul ignore next */
      response.status(500).json({ error });
    });
});

module.exports = users;
