exports.up = async function(knex) {
  await knex.schema.table('railcars', function (table) {
    table.integer('traffic_generator_id').unsigned();
    table.foreign('traffic_generator_id')
      .references('traffic_generators.id');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('railcars', function (table) {
    table.dropColumn('traffic_generator_id');
  })
};