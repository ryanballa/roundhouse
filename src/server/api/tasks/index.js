const tasks = require('express').Router();
const bodyParser = require('body-parser');
const { db } = require('../../../../pgAdaptor');
const database = require('../../serverConnection');
const authHelpers = require('../../auth/_helpers');

tasks.use(bodyParser.urlencoded({ extended: false }));
tasks.use(bodyParser.json());

tasks.get('/', authHelpers.loginRequired, (request, response) => {
  return database('tasks')
    .then(tasksRes => {
      response.status(200).json(tasksRes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

tasks.get('/work-item/:workItemId', (request, response) => {
  const workItem = request.params.workItemId;
  const tasksQuery = `SELECT work_items.work_order_id as workitemid, traffic_generators.name, tasks.railcar_id, tasks.id, tasks.type AS tasksType, railcars.road, railcars.type AS railcartype, railcars.car_number, railcars.length, railcars.color, tasks.traffic_generator_id FROM tasks INNER JOIN work_items ON (tasks.work_item_id = work_items.id) INNER JOIN railcars ON (tasks.railcar_id = railcars.id) INNER JOIN traffic_generators ON (tasks.traffic_generator_id = traffic_generators.id) WHERE work_items.work_order_id = ${workItem}`;

  return db
    .manyOrNone(tasksQuery)
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

tasks.get('/:taskId', authHelpers.loginRequired, (request, response) => {
  const id = request.params.taskId;

  return database('tasks')
    .where('id', id)
    .then(tasksRes => {
      response.status(200).json(tasksRes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

tasks.post('/', (request, response) => {
  console.log(request.body);
  const task = request.body;

  task.user_id = request.user.id;

  database('tasks')
    .insert(task, 'id')
    .then(taskRes => {
      response.status(201).json({ id: taskRes[0] });
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

tasks.put('/:taskId', (request, response) => {
  const id = request.params.taskId;
  if (request.user.id !== request.body.user_id) {
    response.status(403).json({});
  }
  database('tasks')
    .where('id', id)
    .update(request.body)
    .then(taskRes => {
      response.status(200).json(taskRes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

tasks.delete('/:taskId', authHelpers.loginRequired, (request, response) => {
  const id = request.params.taskId;
  database('tasks')
    .where('id', id)
    .then(task => {
      if (request.user.id !== task[0].user_id) {
        return response.status(403).json({});
      }
      database('tasks')
        .where('id', id)
        .del()
        .then(taskRes => {
          return response.status(200).json(taskRes);
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
});

module.exports = tasks;
