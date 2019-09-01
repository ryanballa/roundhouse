const destinations = require('express').Router();
const bodyParser = require('body-parser');
const { db } = require('../../../../pgAdaptor');
const database = require('../../serverConnection');
const authHelpers = require('../../auth/_helpers');

destinations.use(bodyParser.urlencoded({ extended: false }));
destinations.use(bodyParser.json());

destinations.get('/', authHelpers.loginRequired, (request, response) => {
  const user = request.user.id;
  const query = `SELECT * FROM destinations WHERE user_id=${user}`;

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

destinations.get(
  '/:destinationId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.destinationId;
    database('destinations')
      .where('id', id)
      .then(destinationRes => {
        response.status(200).json(destinationRes);
      })
      .catch(error => {
        console.log(error);
        response.status(500).json({ error });
      });
  },
);

destinations.post('/', (request, response) => {
  const destination = request.body;

  ['name'].forEach(requiredParameter => {
    if (!destination[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  database('destinations')
    .insert(destination, 'id')
    .then(destinationRes => {
      response.status(201).json({ id: destinationRes[0] });
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

destinations.post(
  '/:destinationId/work-order/:workOrderId',
  authHelpers.loginRequired,
  (request, response) => {
    const { destinationId, workOrderId } = request.params;

    database('work_orders_destinations')
      .insert({
        destination_id: destinationId,
        order: request.body.order,
        task_id: request.body.task_id,
        work_order_id: workOrderId,
      })
      .then(destinationRes => {
        response.status(201).json({ id: destinationRes[0] });
      })
      .catch(
        /* istanbul ignore next */ error => {
          /* istanbul ignore next */
          response.status(500).json({ error });
        },
      );
  },
);

destinations.get(
  '/:destinationId/work-order/:workOrderId',
  authHelpers.loginRequired,
  (request, response) => {
    const { destinationId, workOrderId } = request.params;

    database('work_orders_destinations')
      .where({ destination_id: destinationId, work_order_id: workOrderId })
      .then(destinationRes => {
        response.status(201).json(destinationRes);
      })
      .catch(
        /* istanbul ignore next */ error => {
          /* istanbul ignore next */
          response.status(500).json({ error });
        },
      );
  },
);

destinations.delete(
  '/:destinationId/work-order/:workOrderId/:destinationWorkOrderId',
  authHelpers.loginRequired,
  (request, response) => {
    const { destinationWorkOrderId } = request.params;

    database('work_orders_destinations')
      .where('id', destinationWorkOrderId)
      .del()
      .then(res => {
        return response.status(200).json(res);
      })
      .catch(
        /* istanbul ignore next */ errorRes => {
          /* istanbul ignore next */
          return response.status(500).json({ errorRes });
        },
      );
  },
);

destinations.put(
  '/:destinationId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.destinationId;
    if (request.user.id !== request.body.user_id) {
      response.status(403).json({});
    }
    database('destinations')
      .where('id', id)
      .update(request.body)
      .then(destinationRes => {
        response.status(200).json(destinationRes);
      })
      .catch(error => {
        response.status(500).json({ error });
      });
  },
);

module.exports = destinations;
