const { railcars } = require('../data');

exports.seed = (knex, Promise) => {
  return knex('railcars').insert(railcars);
};
