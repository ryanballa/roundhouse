exports.up = async function(knex) {
  await knex.schema.table('work_orders_destinations', function (table) {
    table.integer('order');
    table.integer('task_id').unsigned();
    table.foreign('task_id')
         .references('tasks.id');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('work_orders_destinations', function (table) {
    table.dropColumn('order');
    table.dropColumn('task_id');
  })
};