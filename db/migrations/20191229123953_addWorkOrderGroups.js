exports.up = async function(knex) {
  if (!(await knex.schema.hasTable('work_order_groups'))) {
    await knex.schema.createTable('work_order_groups', function(table) {
      table.increments('id').primary();
      table.text('name').unsigned();
      table.text('description').unsigned();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.timestamps(true, true);
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTable('work_order_groups');
};
