
exports.up = async function(knex) {
    await knex.schema.table('work_items', function(table) {
      table.text('notes');
    });
  };
  
  exports.down = async function(knex) {
    await knex.schema.table('work_items', function(table) {
      table.dropColumn('notes');
    });
  };
