const { users } = require('../data');

exports.seed = (knex, Promise) => {
  return knex('tasks')
    .del()
    .then(() => {
      return knex('railcars').del();
    })
    .then(() => {
      return knex('work_items').del();
    })
    .then(() => {
      return knex('traffic_generators').del();
    })
    .then(() => {
      return knex('destinations').del();
    })
    .then(() => {
      return knex('locomotives').del();
    })
    .then(() => {
      return knex('work_orders').del();
    })
    .then(() => {
      return knex('users')
        .del()
        .then(() => knex.raw('TRUNCATE TABLE users RESTART IDENTITY CASCADE'))
        .then(() => knex('users').insert(users));
    });
};
