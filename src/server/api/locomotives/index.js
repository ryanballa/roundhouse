/* eslint-disable no-template-curly-in-string */
const fs = require('fs');
const locomotives = require('express').Router();
const { db } = require('../../../../pgAdaptor');
const database = require('../../serverConnection');

const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;
const { loginRequired } = require('../../utils/loginRequired');
const authHelpers = require('../../auth/_helpers');

// MULTER
const multer = require('multer');

/* istanbul ignore next */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

locomotives.use(bodyParser.urlencoded({ extended: false }));
locomotives.use(bodyParser.json());
locomotives.use((req, res, next) => {
  loginRequired(req, res, next);
});

locomotives.get('/', authHelpers.loginRequired, (request, response) => {
  const user = request.user.id;
  const query = `SELECT * FROM locomotives WHERE user_id=${user}`;
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

locomotives.post('/', authHelpers.loginRequired, (request, response) => {
  const locomotive = request.body;

  if (request.user.id !== request.body.user_id) {
    /* istanbul ignore next */
    if (!response.headersSent) {
      response.status(403).json({});
    }
  }

  ['road', 'location', 'user_id'].forEach(requiredParameter => {
    if (!locomotive[requiredParameter] && !response.headersSent) {
      return response.status(422).send({
        error: `Expected format: { location: <String>, road: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
    return null;
  });

  return database('locomotives')
    .insert(locomotive, 'id')
    .then(loco => {
      response.status(201).json({ id: loco[0] });
    })
    .catch(error => {
      if (!response.headersSent) {
        response.status(500).json({ error });
      }
    });
});

locomotives.get(
  '/:locomotiveId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.locomotiveId;
    database('locomotives')
      .where('id', id)
      .then(locomotive => {
        db.any(
          'SELECT * FROM photos LEFT JOIN locomotives_photos ON locomotives_photos.photo_id = photos.id WHERE locomotive_id = ${id}',
          {
            id,
          },
        )
          .then(photos => {
            const result = {
              locomotive,
              photos,
            };
            if (request.user.id !== locomotive[0].user_id) {
              return response.status(403).json({});
            }
            response.status(200).json(result);
          })
          .catch(error => {
            response.status(500).json({ error });
          });
      })
      .catch(
        /* istanbul ignore next */ error => {
          /* istanbul ignore next */ response.status(500).json({ error });
        },
      );
  },
);

// Easier to test in E2E
/* istanbul ignore next */
function uploadToCloudinary(req, res) {
  const upload = multer({ storage }).single('file');
  upload(req, res, uploadErr => {
    if (uploadErr) {
      return res.send(uploadErr);
    }
    const { path } = req.file;
    const uniqueFilename = new Date().toISOString();

    cloudinary.uploader.upload(
      path,
      { public_id: `locomotives/${uniqueFilename}`, tags: `locomotive` }, // directory and tags are optional
      (err, image) => {
        if (err) return res.send(err);
        // remove file from server
        fs.unlinkSync(path);
        return database('photos')
          .insert(
            {
              path: image.url,
              user_id: req.user.id,
            },
            'id',
          )
          .then(photo => {
            res.status(201).json({ id: photo[0] });
          })
          .catch(error => {
            res.status(500).json({ error });
          });
      },
    );
    return null;
  });
}
/* istanbul ignore next */
locomotives.post('/upload', authHelpers.loginRequired, (req, res) => {
  /* istanbul ignore next */
  uploadToCloudinary(req, res);
});

locomotives.put(
  '/:locomotiveId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.locomotiveId;
    if (request.user.id !== request.body.user_id) {
      response.status(403).json({});
    }
    database('locomotives')
      .where('id', id)
      .update(request.body)
      .then(locomotive => {
        if (!response.headersSent) {
          response.status(200).json(locomotive);
        }
      })
      .catch(
        /* istanbul ignore next */ error => {
          /* istanbul ignore next */
          response.status(500).json({ error });
        },
      );
  },
);

locomotives.delete(
  '/:locomotiveId',
  authHelpers.loginRequired,
  (request, response) => {
    const id = request.params.locomotiveId;
    database('locomotives')
      .where('id', id)
      .then(locomotive => {
        if (!locomotive[0]) {
          return response.status(403).json({});
        }
        if (locomotive && request.user.id !== locomotive[0].user_id) {
          return response.status(403).json({});
        }
        database('locomotives')
          .where('id', id)
          .del()
          .then(locomotiveRes => {
            return response.status(200).json(locomotiveRes);
          })
          .catch(
            /* istanbul ignore next */ errorRes => {
              /* istanbul ignore next */
              return response.status(500).json({ errorRes });
            },
          );
      });
  },
);

module.exports = locomotives;
