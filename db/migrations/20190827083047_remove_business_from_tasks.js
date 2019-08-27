exports.up = async function(knex) {
  await knex.schema.table('tasks', function (table) {
    table.dropColumn('business');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('tasks', function (table) {
    table.string('business');
  })
};