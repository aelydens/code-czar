var bookshelf = require('../bookshelf');

var Exercise = bookshelf.Model.extend({
  tableName: 'exercises',
  tags: function() {
    return this.belongsToMany(Tag);
  }
});

module.exports = Exercise
