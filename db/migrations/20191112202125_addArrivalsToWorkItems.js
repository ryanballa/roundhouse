exports.up = async function(knex) {
  await knex.schema.table('work_items', function(table) {
    table.text('arrival_time');
  });
};

exports.down = async function(knex) {
  await knex.schema.table('work_items', function(table) {
    table.dropColumn('arrival_time');
  });
};
