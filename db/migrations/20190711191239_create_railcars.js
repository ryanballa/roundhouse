
exports.up = async function(knex) {
  if (! (await knex.schema.hasTable('railcars')) ) {
    await knex.schema.createTable('railcars', function(table){
      table.increments('id').primary();
      table.string('road');
      table.integer('car_number');
      table.boolean('is_operational');
      table.string('location');
      table.date('purchased_on');
      table.integer('user_id').unsigned();
      table.foreign('user_id')
        .references('users.id');

      table.timestamps(true, true);
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTable('railcars');
};
