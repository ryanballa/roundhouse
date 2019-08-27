exports.up = async function(knex) {
  await knex.schema.table('traffic_generators', function (table) {
    table.integer('destination_id').unsigned();
    table.foreign('destination_id')
         .references('destinations.id');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('traffic_generators', function (table) {
    table.dropColumn('destination_id');
  })
};