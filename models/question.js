var bookshelf = require('../bookshelf');

var Question = bookshelf.Model.extend({
  tableName: 'questions'
});

module.exports = Question
