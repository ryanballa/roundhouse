const photos = require('express').Router();
const bodyParser = require('body-parser');
const database = require('../../serverConnection');

photos.use(bodyParser.urlencoded({ extended: false }));
photos.use(bodyParser.json());

photos.get('/', (request, response) => {
  database('photos')
    .select()
    .then(photoResults => {
      response.status(200).json(photoResults);
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

photos.post('/', (request, response) => {
  const photo = request.body;

  ['path'].forEach(requiredParameter => {
    if (!photo[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { path: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  database('photos')
    .insert(photo, 'id')
    .then(photoResult => {
      response.status(201).json({ id: photoResult[0] });
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
});

photos.put('/', (request, response) => {
  const photo = request.body;

  ['path'].forEach(requiredParameter => {
    if (!photo[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { path: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  database('photos')
    .where('id', photo.id)
    .update(request.body)
    .then(photoRes => {
      response.status(200).json(photoRes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

photos.delete('/:photoId', (request, response) => {
  const id = request.params.photoId;
  database('photos')
    .where('id', id)
    .del()
    .then(() => {
      database('photos')
        .where('id', id)
        .del()
        .then(photo => {
          response.status(200).json(photo);
        });
    })
    .catch(error => {
      /* istanbul ignore next */
      response.status(500).json({ error });
    });
});

module.exports = photos;
