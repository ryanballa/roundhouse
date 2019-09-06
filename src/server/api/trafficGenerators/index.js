const trafficGenerators = require('express').Router();
const bodyParser = require('body-parser');
const { db } = require('../../../../pgAdaptor');
const database = require('../../serverConnection');
const authHelpers = require('../../auth/_helpers');

trafficGenerators.use(bodyParser.urlencoded({ extended: false }));
trafficGenerators.use(bodyParser.json());

trafficGenerators.get('/', authHelpers.loginRequired, (request, response) => {
  const user = request.user.id;
  const query = `SELECT * FROM traffic_generators WHERE user_id=${user}`;

  return db
    .manyOrNone(query)
    .then(res => {
      /* istanbul ignore next */
      if (!response.headersSent) {
        response.status(200).json(res);
      }
    })
    .catch(
      /* istanbul ignore next */ error => {
        console.log(error);
        /* istanbul ignore next */
        if (!response.headersSent) {
          response.status(500).json({ error });
        }
      },
    );
});

trafficGenerators.get(
  '/:trafficGeneratorId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.trafficGeneratorId;
    database('traffic_generators')
      .where('id', id)
      .then(trafficGeneratorRes => {
        response.status(200).json(trafficGeneratorRes);
      })
      .catch(error => {
        console.log(error);
        response.status(500).json({ error });
      });
  },
);

trafficGenerators.post('/', authHelpers.loginRequired, (request, response) => {
  const trafficGenerator = request.body;

  ['name'].forEach(requiredParameter => {
    if (!trafficGenerator[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  database('traffic_generators')
    .insert(trafficGenerator, 'id')
    .then(trafficGeneratorRes => {
      response.status(201).json({ id: trafficGeneratorRes[0] });
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

trafficGenerators.put(
  '/:trafficGeneratorId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.trafficGeneratorId;
    if (request.user.id !== request.body.user_id) {
      response.status(403).json({});
    }
    database('traffic_generators')
      .where('id', id)
      .update(request.body)
      .then(trafficGeneratorRes => {
        response.status(200).json(trafficGeneratorRes);
      })
      .catch(error => {
        response.status(500).json({ error });
      });
  },
);

trafficGenerators.get(
  '/:trafficGeneratorId/railcars',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.trafficGeneratorId;
    database('railcars')
      .where('traffic_generator_id', id)
      .then(trafficGeneratorRes => {
        response.status(200).json(trafficGeneratorRes);
      })
      .catch(error => {
        console.log(error);
        response.status(500).json({ error });
      });
  },
);

trafficGenerators.delete(
  '/:trafficGeneratorId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.trafficGeneratorId;
    database('traffic_generators')
      .where('id', id)
      .then(trafficGenerator => {
        if (request.user.id !== trafficGenerator[0].user_id) {
          return response.status(403).json({});
        }
        database('traffic_generators')
          .where('id', id)
          .del()
          .then(trafficGeneratorRes => {
            return response.status(200).json(trafficGeneratorRes);
          })
          .catch(
            /* istanbul ignore next */ error => {
              /* istanbul ignore next */
              return response.status(500).json({ error });
            },
          );
      })
      .catch(
        /* istanbul ignore next */ error => {
          /* istanbul ignore next */
          return response.status(500).json({ error });
        },
      );
  },
);

module.exports = trafficGenerators;
