
exports.up = async function(knex) {
  await knex.schema.table('railcars', function (table) {
      table.string('thumbnail');
  })
};

exports.down = async function(knex) {
  await knex.schema.table('railcars', function (table) {
      table.dropColumn('thumbnail');
  })
};
