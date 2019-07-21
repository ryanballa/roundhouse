
exports.up = async function(knex) {
  await knex.schema.table('locomotives', function (table) {
    table.decimal('value', 8, 2);
    table.decimal('purchase_price', 8, 2);
    table.text('notes');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('photos', function (table) {
    table.dropColumn('value');
    table.dropColumn('purchase_price');
    table.dropColumn('notes');
  })
};
