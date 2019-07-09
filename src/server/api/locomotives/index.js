const locomotives = require('express').Router();
const { db } = require('../../../../pgAdaptor');
/* istanbul ignore next */
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');

locomotives.use(bodyParser.urlencoded({ extended: false }));
locomotives.use(bodyParser.json());

locomotives.get('/', (request, response) => {
  const query = `SELECT * FROM locomotives`;
  return db
    .many(query)
    .then(res => {
      response.status(200).json(res);
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
  // database('locomotives')
  // .join('users', 'users.id', 'locomotives.user_id')
  // .join('photos', 'photos.id', 'locomotives.id')
  // .select('photos.path as photo', 'locomotives.* as locomotive')
  // .select('users.full_name as user', 'locomotives.* as locomotive')
  // .then((locomotives) => {
  //     response.status(200).json(locomotives);
  //   })
  //   .catch(/* istanbul ignore next */(error) => {
  //     /* istanbul ignore next */
  //     response.status(500).json({ error });
  //   });
});

locomotives.post('/', (request, response) => {
  const locomotive = request.body;

  for (const requiredParameter of ['road', 'location']) {
    if (!locomotive[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { location: <String>, road: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
  }

  return database('locomotives')
    .insert(locomotive, 'id')
    .then(loco => {
      response.status(201).json({ id: loco[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

locomotives.get('/:locomotiveId', (request, response) => {
  const id = request.params.locomotiveId;
  database('locomotives')
    .where('id', id)
    .then(locomotive => {
      db.any(
        'SELECT * FROM photos LEFT JOIN locomotives_photos ON locomotives_photos.photo_id = photos.id WHERE locomotive_id = ${id}',
        {
          id,
        },
      )
        .then(photos => {
          const result = {
            locomotive,
            photos,
          };
          response.status(200).json(result);
        })
        .catch(error => {
          response.status(500).json({ error });
        });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

locomotives.put('/:locomotiveId', (request, response) => {
  const id = request.params.locomotiveId;
  database('locomotives')
    .where('id', id)
    .update(request.body)
    .then(locomotive => {
      response.status(200).json(locomotive);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

locomotives.delete('/:locomotiveId', (request, response) => {
  const id = request.params.locomotiveId;
  database('locomotives')
    .where('id', id)
    .del()
    .then(locomotive => {
      response.status(200).json(locomotive);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

module.exports = locomotives;
