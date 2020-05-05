const layouts = require('express').Router();
const bodyParser = require('body-parser');
const { db } = require('../../../../pgAdaptor');
const database = require('../../serverConnection');
const authHelpers = require('../../auth/_helpers');

layouts.use(bodyParser.urlencoded({ extended: false }));
layouts.use(bodyParser.json());

layouts.get('/', authHelpers.loginRequired, (request, response) => {
  const user = request.user.id;
  const query = `SELECT * FROM layouts WHERE user_id=${user}`;

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

layouts.post('/', authHelpers.loginRequired, (request, response) => {
  const layout = request.body;

  ['name'].forEach(requiredParameter => {
    if (!layout[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  database('layouts')
    .insert(layout, 'id')
    .then(layoutRes => {
      response.status(201).json({ id: layoutRes[0] });
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

layouts.put('/:layoutId', authHelpers.loginRequired, (request, response) => {
  const id = request.params.layoutId;
  if (request.user.id !== request.body.user_id) {
    response.status(403).json({});
  }
  database('layouts')
    .where('id', id)
    .update(request.body)
    .then(layoutRes => {
      response.status(200).json(layoutRes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

module.exports = layouts;
