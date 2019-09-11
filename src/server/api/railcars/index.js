/* eslint-disable import/order */
/* eslint-disable no-template-curly-in-string */
const railcars = require('express').Router();
const { db } = require('../../../../pgAdaptor');
/* istanbul ignore next */
const database = require('../../serverConnection');
const bodyParser = require('body-parser');
const authHelpers = require('../../auth/_helpers');
const { loginRequired } = require('../../utils/loginRequired');

railcars.use(bodyParser.urlencoded({ extended: false }));
railcars.use(bodyParser.json());
railcars.use((req, res, next) => {
  loginRequired(req, res, next);
});

railcars.get('/', authHelpers.loginRequired, (request, response) => {
  const user = request.user ? request.user.id : 0;
  const query = `SELECT * FROM railcars WHERE user_id=${user}`;
  return db
    .manyOrNone(query)
    .then(res => {
      response.status(200).json(res);
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

railcars.post('/', authHelpers.loginRequired, (request, response) => {
  const locomotive = request.body;

  if (request.user.id !== request.body.user_id) {
    return response.status(403).json({});
  }

  ['car_number', 'road', 'location'].forEach(requiredParameter => {
    if (!locomotive[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { car_number: <String>, location: <String>, road: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  return database('railcars')
    .insert(locomotive, 'id')
    .then(loco => {
      /* istanbul ignore next */
      if (!response.headersSent) {
        response.status(201).json({ id: loco[0] });
      }
    })
    .catch(error => {
      /* istanbul ignore next */
      if (!response.headersSent) {
        response.status(500).json({ error });
      }
    });
});

railcars.get('/:railcarId', authHelpers.loginRequired, (request, response) => {
  const id = request.params.railcarId;
  database('railcars')
    .where('id', id)
    .then(railCar => {
      if (request.user.id !== railCar[0].user_id) {
        response.status(403).json({});
      }
      response.status(200).json(railCar);
    })
    .catch(error => {
      /* istanbul ignore next */
      if (!response.headersSent) {
        response.status(500).json({ error });
      }
    });
});

railcars.put('/:railcarId', authHelpers.loginRequired, (request, response) => {
  const id = request.params.railcarId;
  if (request.user.id !== request.body.user_id) {
    return response.status(403).json({});
  }
  database('railcars')
    .where('id', id)
    .update(request.body)
    .then(railCar => {
      response.status(200).json(railCar);
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
  return response.status(500);
});

railcars.delete(
  '/:railcarId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.railcarId;
    database('railcars')
      .where('id', id)
      .then(railCar => {
        if (request.user.id !== railCar[0].user_id) {
          return response.status(403).json({});
        }
        database('railcars')
          .where('id', id)
          .del()
          .then(railCarRes => {
            return response.status(200).json(railCarRes);
          })
          .catch(
            /* istanbul ignore next */ error => {
              /* istanbul ignore next */
              return response.status(500).json({ error });
            },
          );
        return response.status(500);
      })
      .catch(
        /* istanbul ignore next */ error => {
          /* istanbul ignore next */
          return response.status(500).json({ error });
        },
      );
  },
);

module.exports = railcars;
