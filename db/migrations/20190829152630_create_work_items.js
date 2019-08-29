exports.up = async function(knex) {
  if (! (await knex.schema.hasTable('work_items')) ) {
    await knex.schema.createTable('work_items', function(table){
      table.increments('id').primary();
      table.integer('work_order_id').unsigned();
      table.foreign('work_order_id')
        .references('work_orders.id');
      table.integer('destination_id').unsigned();
      table.foreign('destination_id')
          .references('destinations.id');
      table.timestamps(true, true);
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTable('work_items');
};