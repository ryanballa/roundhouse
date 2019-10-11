const users = require('express').Router();
const bodyParser = require('body-parser');
const database = require('../../serverConnection');
const authHelpers = require('../../auth/_helpers');

users.use(bodyParser.urlencoded({ extended: false }));
users.use(bodyParser.json());

users.get('/', authHelpers.loginRequired, (request, response) => {
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

users.put('/:userId', (request, response) => {
  const id = request.params.userId;
  if (!request.user || request.user.id !== request.body.id) {
    response.status(403).json({});
  } else {
    database('users')
      .where('id', id)
      .update(request.body)
      .then(user => {
        if (!response.headersSent) {
          response.status(200).json(user);
        }
      })
      .catch(error => {
        if (!response.headersSent) {
          response.status(500).json({ error });
        }
      });
  }
});

module.exports = users;
