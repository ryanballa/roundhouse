exports.up = async function(knex) {
  await knex.schema.table('tasks', function (table) {
    table.integer('work_orders_destination_id').unsigned();
    table.foreign('work_orders_destination_id')
         .references('work_orders_destinations.id');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('tasks', function (table) {
    table.dropColumn('work_orders_destination_id');
  })
};