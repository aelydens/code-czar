exports.up = function(knex, Promise) {
  return knex.schema.createTable('tags', function (table) {
    table.increments();
    table.string('slug', {maxlength: 150, nullable: false, unique: true});
    table.string('name', {maxlength: 150, nullable: false});
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tags');
};
