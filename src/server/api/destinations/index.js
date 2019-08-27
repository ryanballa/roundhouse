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

// workOrders.get('/:workOrderId', (request, response) => {
//   const workOrder = request.params.workOrderId;
//   const query = `SELECT * FROM destinations LEFT JOIN work_orders_destinations ON work_orders_destinations.destination_id = destinations.id WHERE work_order_id = ${workOrder}`;

//   const fetchDestinations = () => {
//     return db.manyOrNone(query);
//   };

//   const fetchTasks = () => {
//     return database('tasks').where('work_order_id', workOrder);
//   };

//   const fetchWorkOrders = () => {
//     return database('work_orders').where('id', workOrder);
//   };

//   // TODO: Add error handling
//   const fetchItems = async () => {
//     const [destinations, tasks, workOrdersResults] = await Promise.all([
//       fetchDestinations(),
//       fetchTasks(),
//       fetchWorkOrders(),
//     ]);
//     if (!response.headersSent) {
//       response.status(200).json({ destinations, tasks, workOrdersResults });
//     }
//   };

//   fetchItems();
// });

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

// workOrders.put('/:workOrderId', (request, response) => {
//   const id = request.params.workOrderId;
//   if (request.user.id !== request.body.user_id) {
//     response.status(403).json({});
//   }
//   database('work_orders')
//     .where('id', id)
//     .update(request.body)
//     .then(workOrderRes => {
//       response.status(200).json(workOrderRes);
//     })
//     .catch(error => {
//       response.status(500).json({ error });
//     });
// });

module.exports = destinations;
