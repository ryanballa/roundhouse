exports.up = async function(knex) {
  await knex.schema.table('work_orders', function(table) {
    table.text('complexity');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('work_orders', function(table) {
    table.dropColumn('complexity');
  });
};
