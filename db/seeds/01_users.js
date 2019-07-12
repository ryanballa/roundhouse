const { users } = require('../data');

exports.seed = (knex, Promise) => {
  return knex('railcars').del()
  .then(() => {
    return knex('locomotives').del();
  })
  .then(() => {
    return knex('users')
      .del()
      .then(() => knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE'))
      .then(() => knex('users').insert(users));
  })
};
