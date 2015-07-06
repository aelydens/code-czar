exports.up = function(knex, Promise) {
  return knex.schema.createTable('questions', function (table) {
    table.increments();
    table.string('content');
    table.string('link');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('questions');
};
