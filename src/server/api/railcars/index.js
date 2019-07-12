/* eslint-disable import/order */
/* eslint-disable no-template-curly-in-string */
const railcars = require('express').Router();
const { db } = require('../../../../pgAdaptor');
/* istanbul ignore next */
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');

railcars.use(bodyParser.urlencoded({ extended: false }));
railcars.use(bodyParser.json());

railcars.get('/', (request, response) => {
  const query = `SELECT * FROM railcars`;
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

railcars.post('/', (request, response) => {
  const locomotive = request.body;

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
      response.status(201).json({ id: loco[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

railcars.get('/:railcarId', (request, response) => {
  const id = request.params.railcarId;
  database('railcars')
    .where('id', id)
    .then(railCar => {
      response.status(200).json(railCar);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

railcars.put('/:railcarId', (request, response) => {
  const id = request.params.railcarId;
  database('railcars')
    .where('id', id)
    .update(request.body)
    .then(railCar => {
      response.status(200).json(railCar);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

railcars.delete('/:railcarId', (request, response) => {
  const id = request.params.railcarId;
  database('railcars')
    .where('id', id)
    .del()
    .then(railCar => {
      response.status(200).json(railCar);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

module.exports = railcars;
