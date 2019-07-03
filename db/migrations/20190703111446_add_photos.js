
exports.up = async function(knex, Promise) {
  if (! (await knex.schema.hasTable('photos')) ) {
    await knex.schema.createTable('photos', function(table){
      table.increments('id').primary();
      table.string('path');
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTable('photos');
};
