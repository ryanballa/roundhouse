const { photos } = require('../data');

exports.seed = (knex) => {
  return knex('photos')
    .del()
    .then(() => knex.raw('TRUNCATE TABLE photos RESTART IDENTITY CASCADE'))
      .then(() => knex('photos').insert(photos));
};
