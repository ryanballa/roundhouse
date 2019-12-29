exports.up = async function(knex) {
  await knex.schema.table('work_orders', function(table) {
    table.integer('work_orders_group_id').unsigned();
    table.foreign('work_orders_group_id').references('work_order_groups.id');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('work_orders', function(table) {
    table.dropColumn('work_orders_group_id');
  });
};
