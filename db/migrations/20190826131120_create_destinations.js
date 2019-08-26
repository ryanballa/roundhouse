exports.up = async function(knex) {
  if (! (await knex.schema.hasTable('destinations')) ) {
    await knex.schema.createTable('destinations', function(table){
      table.increments('id').primary();
      table.string('name');


      table.timestamps(true, true);
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTable('destinations');
};
