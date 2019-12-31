/* eslint-disable camelcase */
const work_order_groups = require('express').Router();
const bodyParser = require('body-parser');
const { db } = require('../../../../pgAdaptor');
const database = require('../../serverConnection');
const authHelpers = require('../../auth/_helpers');

work_order_groups.use(bodyParser.urlencoded({ extended: false }));
work_order_groups.use(bodyParser.json());

work_order_groups.get('/', authHelpers.loginRequired, (request, response) => {
  const query = `SELECT * FROM work_order_groups`;

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

work_order_groups.post('/', (request, response) => {
  const workOrderGroup = request.body;

  ['user_id'].forEach(requiredParameter => {
    if (!workOrderGroup[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { user_id: <Int> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  database('work_order_groups')
    .insert(workOrderGroup, 'id')
    .then(workGroupRes => {
      response.status(201).json({ id: workGroupRes[0] });
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

work_order_groups.put('/:workOrderGroupId', (request, response) => {
  const id = request.params.workOrderGroupId;
  if (request.user.id !== request.body.user_id) {
    response.status(403).json({});
  }
  database('work_order_groups')
    .where('id', id)
    .update(request.body)
    .then(workOrderGroupRes => {
      response.status(200).json(workOrderGroupRes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

work_order_groups.delete(
  '/:workOrderGroupId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.workOrderGroupId;
    database('work_order_groups')
      .where('id', id)
      .del()
      .then(workOrderGroupRes => {
        return response.status(200).json(workOrderGroupRes);
      })
      .catch(
        /* istanbul ignore next */ error => {
          /* istanbul ignore next */
          return response.status(500).json({ error });
        },
      );
  },
);

module.exports = work_order_groups;
