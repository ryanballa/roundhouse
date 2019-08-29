exports.up = async function(knex) {
  await knex.schema.dropTable('work_orders_destinations');
};

exports.down = async function(knex) {
  if (! (await knex.schema.hasTable('work_orders_destinations')) ) {
    await knex.schema.createTable('work_orders_destinations', function(table){
      table.increments('id').primary();
      table.integer('destination_id').references('destinations.id');
      table.integer('work_order_id').references('work_orders.id');
    });
  }
};