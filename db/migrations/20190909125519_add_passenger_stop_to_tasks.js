exports.up = async function(knex) {
  await knex.schema.table('tasks', function(table) {
    table.boolean('is_passenger_stop');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('tasks', function(table) {
    table.dropColumn('is_passenger_stop');
  });
};
