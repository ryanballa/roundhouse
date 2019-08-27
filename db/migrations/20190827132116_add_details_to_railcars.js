exports.up = async function(knex) {
  await knex.schema.table('railcars', function (table) {
    table.text('type');
    table.integer('length');
    table.string('color');
    table.string('reporting_marks')
  })
};

exports.down = async function(knex) {
  await knex.schema.table('railcars', function (table) {
    table.dropColumn('type');
    table.dropColumn('length');
    table.dropColumn('color');
    table.dropColumn('reporting_marks');
  })
};