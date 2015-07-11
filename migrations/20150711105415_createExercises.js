exports.up = function(knex, Promise) {
  return knex.schema.createTable('exercises', function (table) {
    table.increments();
    table.string('tag')
    table.integer('difficulty')
    table.integer('upvotes')
    table.string('title', {maxlength: 250, nullable: false, unique: true});
    table.string('description', {maxlength: 10000, fieldtype: 'medium' });
    table.string('link', {maxlength: 150, nullable: false});
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('exercises');
};
