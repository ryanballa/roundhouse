exports.up = async function(knex) {
  await knex.schema.table('tasks', function (table) {
    table.integer('work_item_id').unsigned();
    table.foreign('work_item_id')
         .references('work_items.id');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('tasks', function (table) {
    table.dropColumn('work_item_id');
  })
};