exports.up = async function(knex, Promise) {
  if (! (await knex.schema.hasTable('locomotives')) ) {
    await knex.schema.createTable('locomotives', function(table) {
         table.increments('id').primary();
         table.string('road');
         table.integer('engine_number');
         table.integer('dcc_number');
         table.boolean('is_operational');
         table.boolean('is_dcc');
         table.string('location');
         table.date('purchased_on');
         table.integer('user_id').unsigned();
         table.foreign('user_id')
           .references('users.id');

         table.timestamps(true, true);
      });
    };
};

exports.down = async function(knex) {
  await knex.schema.dropTable('locomotives');
};
