const locomotives = require('express').Router();
/* istanbul ignore next */
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../../../../knexfile')[environment]
const database = require('knex')(configuration);
const bodyParser = require('body-parser');

locomotives.use(bodyParser.urlencoded({ extended: false }));
locomotives.use(bodyParser.json());

locomotives.get('/', (request, response) => {
  database('locomotives')
  .join('users', 'users.id', 'locomotives.user_id')
  .select('users.full_name as user', 'locomotives.* as locomotive')
  .then((locomotives) => {
      response.status(200).json(locomotives);
    })
    .catch(/* istanbul ignore next */(error) => {
      /* istanbul ignore next */
      response.status(500).json({ error });
    });
});

locomotives.post('/', (request, response) => {
  const locomotive = request.body;

  for (let requiredParameter of ['road', 'location']) {
    if (!locomotive[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { location: <String>, road: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('locomotives').insert(locomotive, 'id')
    .then(locomotive => {
      response.status(201).json({ id: locomotive[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

locomotives.get('/:locomotiveId', (request, response) => {
  const id = request.params.locomotiveId;
  database('locomotives').where('id', id)
    .then((locomotive) => {
      response.status(200).json(locomotive);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

locomotives.put('/:locomotiveId', (request, response) => {
  const id = request.params.locomotiveId;
  database('locomotives').where('id', id)
    .update(request.body)
    .then((locomotive) => {
      response.status(200).json(locomotive);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

locomotives.delete('/:locomotiveId', (request, response) => {
  const id = request.params.locomotiveId;
  database('locomotives').where('id', id).del()
    .then((locomotive) => {
      response.status(200).json(locomotive);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});


module.exports = locomotives;
