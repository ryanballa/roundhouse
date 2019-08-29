/* eslint-disable camelcase */
const work_items = require('express').Router();
const bodyParser = require('body-parser');
const { db } = require('../../../../pgAdaptor');
const database = require('../../serverConnection');
const authHelpers = require('../../auth/_helpers');

work_items.use(bodyParser.urlencoded({ extended: false }));
work_items.use(bodyParser.json());

work_items.get('/', authHelpers.loginRequired, (request, response) => {
  // const user = request.user.id;
  const query = `SELECT * FROM work_items`;

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

work_items.post('/', (request, response) => {
  const workItem = request.body;

  ['work_order_id'].forEach(requiredParameter => {
    if (!workItem[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { work_order_id: <Int> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  database('work_items')
    .insert(workItem, 'id')
    .then(workItemRes => {
      response.status(201).json({ id: workItemRes[0] });
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

work_items.put('/:workItemId', (request, response) => {
  const id = request.params.workItemId;
  // if (request.user.id !== request.body.user_id) {
  //   response.status(403).json({});
  // }
  database('work_items')
    .where('id', id)
    .update(request.body)
    .then(workItemRes => {
      response.status(200).json(workItemRes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

module.exports = work_items;