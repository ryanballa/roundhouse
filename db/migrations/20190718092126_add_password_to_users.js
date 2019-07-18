
exports.up = async function(knex) {
  await knex.schema.table('users', function (table) {
    table.string('username').unique().notNullable();
    table.string('password').notNullable();
    table.boolean('admin').notNullable().defaultTo(false);
  })
};

exports.down = async function(knex) {
  await knex.schema.table('users', function (table) {
    table.dropColumn('username');
    table.dropColumn('password');
    table.dropColumn('admin');
  })
};
