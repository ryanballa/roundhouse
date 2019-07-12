/* eslint-disable import/order */
const users = require('express').Router();
/* istanbul ignore next */
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');

users.use(bodyParser.urlencoded({ extended: false }));
users.use(bodyParser.json());

users.get('/', (request, response) => {
  database('users')
    .select()
    .then(usersRes => {
      response.status(200).json(usersRes);
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

users.post('/', (request, response) => {
  const user = request.body;

  ['full_name'].forEach(requiredParameter => {
    if (!user[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { full_name: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  database('users')
    .insert(user, 'id')
    .then(userRes => {
      response.status(201).json({ id: userRes[0] });
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

module.exports = users;
