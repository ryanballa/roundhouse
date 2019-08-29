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
  const task = request.body;

  task.user_id = request.user.id;
  // ['railcar_id'].forEach(requiredParameter => {
  //   if (!task[requiredParameter]) {
  //     return response.status(422).send({
  //       error: `Expected format: { railcar_id: <Int> }. You're missing a "${requiredParameter}" property.`,
  //     });
  //   }
  //   return null;
  // });

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
      // if (request.user.id !== task[0].user_id) {
      //   return response.status(403).json({});
      // }
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
