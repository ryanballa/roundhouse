const fs = require('fs');
const locomotives = require('express').Router();
const { db } = require('../../../../pgAdaptor');
/* istanbul ignore next */
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../../knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary').v2;

// MULTER
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});

locomotives.use(bodyParser.urlencoded({ extended: false }));
locomotives.use(bodyParser.json());

locomotives.get('/', (request, response) => {
  const query = `SELECT * FROM locomotives`;
  return db
    .many(query)
    .then(res => {
      response.status(200).json(res);
    })
    .catch(
      /* istanbul ignore next */ error => {
        /* istanbul ignore next */
        response.status(500).json({ error });
      },
    );
  // database('locomotives')
  // .join('users', 'users.id', 'locomotives.user_id')
  // .join('photos', 'photos.id', 'locomotives.id')
  // .select('photos.path as photo', 'locomotives.* as locomotive')
  // .select('users.full_name as user', 'locomotives.* as locomotive')
  // .then((locomotives) => {
  //     response.status(200).json(locomotives);
  //   })
  //   .catch(/* istanbul ignore next */(error) => {
  //     /* istanbul ignore next */
  //     response.status(500).json({ error });
  //   });
});

locomotives.post('/', (request, response) => {
  const locomotive = request.body;

  for (const requiredParameter of ['road', 'location']) {
    if (!locomotive[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { location: <String>, road: <String> }. You're missing a "${requiredParameter}" property.`,
      });
    }
  }

  return database('locomotives')
    .insert(locomotive, 'id')
    .then(loco => {
      response.status(201).json({ id: loco[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

locomotives.get('/:locomotiveId', (request, response) => {
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
          response.status(200).json(result);
        })
        .catch(error => {
          response.status(500).json({ error });
        });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

function uploadToCloudinary(req, res) {
  const upload = multer({ storage }).single('file');
  upload(req, res, err => {
    if (err) {
      return res.send(err);
    }
    console.log(req.body.file);
    console.log(req.file);

    const path = req.file.path;
    const uniqueFilename = new Date().toISOString();

    cloudinary.uploader.upload(
      path,
      { public_id: `locomotives/${uniqueFilename}`, tags: `locomotive` }, // directory and tags are optional
      (err, image) => {
        if (err) return res.send(err);
        console.log('file uploaded to Cloudinary');
        // remove file from server
        fs.unlinkSync(path);
        // return image details
        console.log(image);
        //res.json(image)
        return database('photos')
          .insert(
            {
              path: image.url,
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
  });
}

locomotives.post('/upload', (req, res) => {
  uploadToCloudinary(req, res);
  // const upload = multer({ storage }).single('file');
  // upload(req, res, err => {
  //   if (err) {
  //     return res.send(err);
  //   }
  //   console.log(req.file);

  //   const path = req.file.path;
  //   const uniqueFilename = new Date().toISOString();

  //   cloudinary.uploader.upload(
  //     path,
  //     { public_id: `locomotives/${uniqueFilename}`, tags: `locomotive` }, // directory and tags are optional
  //     (err, image) => {
  //       if (err) return res.send(err);
  //       console.log('file uploaded to Cloudinary');
  //       // remove file from server
  //       fs.unlinkSync(path);
  //       // return image details
  //       console.log(image);
  //       //res.json(image)
  //       return database('photos')
  //         .insert(
  //           {
  //             path: image.url,
  //           },
  //           'id',
  //         )
  //         .then(photo => {
  //           res.status(201).json({ id: photo[0] });
  //         })
  //         .catch(error => {
  //           res.status(500).json({ error });
  //         });
  //     },
  //   );
  // });
});

locomotives.put('/:locomotiveId', (request, response) => {
  const id = request.params.locomotiveId;
  database('locomotives')
    .where('id', id)
    .update(request.body)
    .then(locomotive => {
      response.status(200).json(locomotive);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

locomotives.delete('/:locomotiveId', (request, response) => {
  const id = request.params.locomotiveId;
  database('locomotives')
    .where('id', id)
    .del()
    .then(locomotive => {
      response.status(200).json(locomotive);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

module.exports = locomotives;
