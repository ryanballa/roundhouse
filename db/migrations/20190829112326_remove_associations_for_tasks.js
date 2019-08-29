exports.up = async function(knex) {
  await knex.schema.table('tasks', function (table) {
    table.dropColumn('destination_id');
    table.dropColumn('work_order_id');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('tasks', function (table) {
    table.integer('destination_id').unsigned();
    table.foreign('destination_id')
      .references('destinations.id');
    table.integer('work_order_id').unsigned();
      table.foreign('work_order_id')
            .references('work_orders.id');
  })
};