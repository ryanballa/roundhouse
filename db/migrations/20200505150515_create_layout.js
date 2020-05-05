exports.up = async function(knex) {
  if (!(await knex.schema.hasTable('layouts'))) {
    await knex.schema.createTable('layouts', function(table) {
      table.increments('id').primary();
      table.text('name');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users .id');
      table.timestamps(true, true);
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTable('layouts');
};
