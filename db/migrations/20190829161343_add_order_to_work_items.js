exports.up = async function(knex) {
  await knex.schema.table('work_items', function (table) {
    table.integer('order');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('work_items', function (table) {
    table.dropColumn('order');
  })
};