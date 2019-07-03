
exports.up = async function(knex) {
  if (! (await knex.schema.hasTable('locomotives_photos')) ) {
    await knex.schema.createTable('locomotives_photos', function(table){
      table.increments('id').primary();
      table.integer('locomotive_id').references('locomotives.id');
      table.integer('photo_id').references('photos.id');
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTable('locomotives_photos');
};
