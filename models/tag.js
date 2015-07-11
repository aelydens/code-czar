var bookshelf = require('../bookshelf');

var Tag = bookshelf.Model.extend({
  tableName: 'tags'
});

module.exports = Tag
