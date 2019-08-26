exports.up = async function(knex) {
  if (! (await knex.schema.hasTable('work_orders')) ) {
    await knex.schema.createTable('work_orders', function(table){
      table.increments('id').primary();
      table.string('name');


      table.timestamps(true, true);
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTable('work_orders');
};