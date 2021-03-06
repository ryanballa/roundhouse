const workOrders = require('express').Router();
const bodyParser = require('body-parser');
const { db } = require('../../../../pgAdaptor');
const database = require('../../serverConnection');
const authHelpers = require('../../auth/_helpers');

workOrders.use(bodyParser.urlencoded({ extended: false }));
workOrders.use(bodyParser.json());

workOrders.get('/', authHelpers.loginRequired, (request, response) => {
  const user = request.user.id;
  const query = `SELECT * FROM work_orders WHERE user_id=${user}`;

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

workOrders.get('/user/:userId', (request, response) => {
  const user = request.params.userId;
  const query = `SELECT * FROM work_orders WHERE user_id=${user}`;

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

workOrders.get(
  '/:workOrderId',
  authHelpers.loginRequired,
  (request, response) => {
    const workOrder = request.params.workOrderId;
    const workItemsQuery = `SELECT work_items.id, work_items.order, work_items.arrival_time, work_items.depature_time, work_items.notes, destinations.name AS destinationname, destinations.id AS destinationid from work_items INNER JOIN destinations ON (work_items.destination_id = destinations.id) WHERE work_order_id = ${workOrder}`;
    const tasksQuery = `SELECT work_items.id as workitemid, traffic_generators.name, tasks.railcar_id, tasks.weight, tasks.id, tasks.type AS tasksType, railcars.road, railcars.type AS railcartype, railcars.reporting_marks, railcars.car_number, railcars.length, railcars.color, railcars.type, tasks.traffic_generator_id FROM tasks INNER JOIN work_items ON (tasks.work_item_id = work_items.id) INNER JOIN railcars ON (tasks.railcar_id = railcars.id) INNER JOIN traffic_generators ON (tasks.traffic_generator_id = traffic_generators.id) WHERE work_items.work_order_id = ${workOrder}`;
    const passengerTasksQuery = `SELECT work_items.id as workitemid, traffic_generators.name, tasks.is_passenger_stop, tasks.railcar_id, tasks.weight, tasks.id, tasks.type AS tasksType, tasks.traffic_generator_id FROM tasks INNER JOIN work_items ON (tasks.work_item_id = work_items.id) INNER JOIN traffic_generators ON (tasks.traffic_generator_id = traffic_generators.id) WHERE work_items.work_order_id = ${workOrder} AND tasks.is_passenger_stop = true`;

    const fetchDestinations = () => {
      return database('destinations').where('user_id', request.user.id);
    };

    const fetchTasks = () => {
      return db.manyOrNone(tasksQuery);
    };

    const fetchPassengerTasks = () => {
      return db.manyOrNone(passengerTasksQuery);
    };

    const fetchWorkItems = () => {
      return db.manyOrNone(workItemsQuery);
    };

    const fetchTrafficGenerators = () => {
      return database('traffic_generators').where('user_id', request.user.id);
    };

    const fetchWorkOrders = () => {
      return database('work_orders')
        .where('id', workOrder)
        .then(res => {
          return res;
        });
    };

    const fetchRailcars = () => {
      return database('railcars').where('user_id', request.user.id);
    };

    const sortWorkItemsByOrder = workItems => {
      return workItems.sort((a, b) => (a.order > b.order ? 1 : -1));
    };

    const filterTasksByWorkItem = (tasks, workItems) => {
      if (workItems.length) {
        const adjustedWorkItems = workItems.map(workItem => {
          const filterdTasks = tasks.filter(
            task => task.workitemid === workItem.id,
          );
          return { ...workItem, tasks: filterdTasks };
        });
        return adjustedWorkItems;
      }
      return workItems;
    };

    // TODO: Add error handling
    const fetchItems = async () => {
      const [
        destinations,
        trafficGenerators,
        workOrdersResults,
        railcars,
        workItems,
        tasks,
        passengerTasks,
      ] = await Promise.all([
        fetchDestinations(),
        fetchTrafficGenerators(),
        fetchWorkOrders(),
        fetchRailcars(),
        fetchWorkItems(),
        fetchTasks(),
        fetchPassengerTasks(),
      ]).catch(error => {
        response.status(500).json({ error });
      });

      if (!response.headersSent) {
        const sorted = sortWorkItemsByOrder(workItems);
        response.status(200).json({
          destinations,
          railcars,
          tasks: tasks.concat(passengerTasks),
          trafficGenerators,
          workItems: filterTasksByWorkItem(
            tasks.concat(passengerTasks),
            sorted,
          ),
          workOrdersResults,
        });
      }
    };

    fetchItems();
  },
);

workOrders.post('/', (request, response) => {
  const workOrder = request.body;

  ['name'].forEach(requiredParameter => {
    if (!workOrder[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  database('work_orders')
    .insert(workOrder, 'id')
    .then(workOrderRes => {
      response.status(201).json({ id: workOrderRes[0] });
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

workOrders.put('/:workOrderId', (request, response) => {
  const id = request.params.workOrderId;
  if (request.user && request.user.id !== request.body.user_id) {
    response.status(403).json({});
  }
  database('work_orders')
    .where('id', id)
    .update(request.body)
    .then(workOrderRes => {
      response.status(200).json(workOrderRes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

workOrders.delete(
  '/:workOrderId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.workOrderId;
    database('work_orders')
      .where('id', id)
      .then(workOrder => {
        if (request.user.id !== workOrder[0].user_id) {
          return response.status(403).json({});
        }
        database('work_orders')
          .where('id', id)
          .del()
          .then(workOrderRes => {
            return response.status(200).json(workOrderRes);
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

module.exports = workOrders;
