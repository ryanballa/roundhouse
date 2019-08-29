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

workOrders.get(
  '/:workOrderId',
  authHelpers.loginRequired,
  (request, response) => {
    const workOrder = request.params.workOrderId;
    const destinationsQuery = `SELECT * FROM destinations LEFT JOIN work_orders_destinations ON work_orders_destinations.destination_id = destinations.id WHERE work_order_id = ${workOrder}`;
    const tasksQuery = `SELECT tasks.id, tasks.type AS tasksType, tasks.traffic_generator_id, tasks.destination_id, railcars.road, railcars.type, railcars.car_number, railcars.length, railcars.color FROM tasks INNER JOIN railcars ON (tasks.railcar_id = railcars.id) WHERE work_order_id = ${workOrder}`;

    const fetchDestinations = () => {
      return db.manyOrNone(destinationsQuery);
    };

    const fetchTasks = () => {
      return db.manyOrNone(tasksQuery);
    };

    const fetchTrafficGenerators = () => {
      return database('traffic_generators').where('user_id', request.user.id);
    };

    const fetchWorkOrders = () => {
      return database('work_orders').where('id', workOrder);
    };

    const fetchRailcars = () => {
      return database('railcars').where('user_id', request.user.id);
    };

    const tasksForDestination = (tasks, destination) => {
      return tasks.filter(task => task.destination_id === destination.id);
    };

    const taskTrafficGeneratorName = (tasks, filteredTrafficGenerators) => {
      return tasks.map(task => {
        const trafficGenerator = filteredTrafficGenerators.filter(
          tg => tg.id === task.traffic_generator_id,
        );
        return {
          ...task,
          destinationName: trafficGenerator[0] ? trafficGenerator[0].name : '',
        };
      });
    };

    const trafficGeneratorsPerDestination = (
      trafficGenerators,
      destinations,
      tasks,
    ) => {
      return destinations.map(destination => {
        const filteredTrafficGenerators = trafficGenerators.filter(
          tg => tg.destination_id === destination.id,
        );
        const filterdTasks = tasksForDestination(tasks, destination);
        const tasksWithDestinationNames = taskTrafficGeneratorName(
          filterdTasks,
          filteredTrafficGenerators,
        );
        return {
          destination,
          filteredTrafficGenerators,
          tasks: tasksWithDestinationNames,
        };
      });
    };

    // TODO: Add error handling
    const fetchItems = async () => {
      const [
        destinations,
        tasks,
        trafficGenerators,
        workOrdersResults,
        railcars,
      ] = await Promise.all([
        fetchDestinations(),
        fetchTasks(),
        fetchTrafficGenerators(),
        fetchWorkOrders(),
        fetchRailcars(),
      ]);
      if (!response.headersSent) {
        const transformedTraffic = trafficGeneratorsPerDestination(
          trafficGenerators,
          destinations,
          tasks,
        );
        response.status(200).json({
          destinations,
          railcars,
          tasks,
          traffic: transformedTraffic,
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
  if (request.user.id !== request.body.user_id) {
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

module.exports = workOrders;
