
exports.up = async function(knex, Promise) {
  if (! (await knex.schema.hasTable('users')) ) {
    await knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('full_name');

      table.timestamps(true, true);
    });
  }
};


exports.down = async function(knex, Promise) {
  await knex.schema.dropTable('users');
};
