
exports.up = async function(knex) {
    await knex.schema.table('locomotives', function (table) {
        table.string('thumbnail');
    })
};

exports.down = async function(knex) {
    await knex.schema.table('locomotives', function (table) {
        table.dropColumn('thumbnail');
    })
};
