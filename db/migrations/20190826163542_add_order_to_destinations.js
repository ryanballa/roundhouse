exports.up = async function(knex) {
  await knex.schema.table('destinations', function (table) {
    table.integer('order').unsigned();
  })
};

exports.down = async function(knex) {
  await knex.schema.table('destinations', function (table) {
    table.dropColumn('order');
  })
};