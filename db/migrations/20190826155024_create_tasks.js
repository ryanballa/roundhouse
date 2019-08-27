exports.up = async function(knex) {
  if (! (await knex.schema.hasTable('tasks')) ) {
    await knex.schema.createTable('tasks', function(table){
      table.increments('id').primary();
      table.string('type');
      table.string('business');
      table.integer('weight').unsigned();
      table.integer('order').unsigned();
      table.integer('destination_id').unsigned();
      table.foreign('destination_id')
        .references('destinations.id');
      table.integer('railcar_id').unsigned();
      table.foreign('railcar_id')
        .references('railcars.id');
      table.integer('work_order_id').unsigned();
      table.foreign('work_order_id')
          .references('work_orders.id');

      table.timestamps(true, true);
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTable('tasks');
};