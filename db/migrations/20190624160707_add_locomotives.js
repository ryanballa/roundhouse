
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('locomotives', function(table) {
      table.increments('id').primary();
      table.string('road');
      table.integer('engine_number');
      table.integer('dcc_number');
      table.boolean('is_operational');
      table.boolean('is_dcc');
      table.string('location');
      table.date('purchased_on');
      table.integer('user_id').unsigned();
      table.foreign('user_id')
        .references('users.id');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('full_name');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('locomotives')
  ]);
};
