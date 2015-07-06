process.env.DATABASE_URL || require("./.env")


var express = require('express.io');
var http = require('http');
var path = require('path');
var bookshelf = require('./bookshelf');
var Question = require('./models/question.js')

var app = express();
app.http().io()

// all
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// dev
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.io.route('ready', function (req) {
  req.io.join(req.data.room);
  req.io.room(req.data.room).broadcast('announce', {
    message: req.data.username + ' just joined the room. ',
    username: req.data.username
  });
});

app.io.route('sendMessage', function (req) {
  req.io.join(req.data.room);
  req.io.room(req.data.room).broadcast('newMessage', {
    message: req.data.message,
    username: req.data.username
  })
});

app.get('/', function (req, res) {
  res.render('welcome', { title: 'Code Czar' });
});

app.get('/index', function (req, res) {
  res.render('index', { title: 'Code Czar' });
});

app.get('/questions', function(req, res, next) {
  Question.collection().fetch().then(function(questions) {
    res.render('questions/index', {questions: questions.toJSON()});
  })
});

app.get('/questions/:id', function (req, res) {
  res.render('question', { title : req.params.id, username : req.query.username });
});

app.get('/rooms/:id', function (req, res) {
  res.render('room', { title : req.params.id, username : req.query.username });
});

app.get('/battle', function (req, res) {
  res.render('battle', { title : 'Code Czar'});
});

app.listen(app.get('port'));
