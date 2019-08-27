exports.up = async function(knex) {
  if (! (await knex.schema.hasTable('traffic_generators')) ) {
    await knex.schema.createTable('traffic_generators', function(table){
      table.increments('id').primary();
      table.string('name');
      table.string('type');

      table.timestamps(true, true);
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTable('traffic_generators');
};