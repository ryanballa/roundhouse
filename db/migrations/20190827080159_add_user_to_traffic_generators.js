exports.up = async function(knex) {
  await knex.schema.table('traffic_generators', function (table) {
    table.integer('user_id').unsigned();
    table.foreign('user_id')
         .references('users.id');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('traffic_generators', function (table) {
    table.dropColumn('user_id');
  })
};