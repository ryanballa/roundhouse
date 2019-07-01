const { locomotives } = require('../data');

exports.seed = (knex, Promise) => {
  return knex('locomotives').insert(locomotives);
};
