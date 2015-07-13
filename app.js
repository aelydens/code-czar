process.env.DATABASE_URL || require("./.env")

var express = require('express.io');
var http = require('http');
var path = require('path');
var bookshelf = require('./bookshelf');
var Exercise = require('./models/exercise.js')
var localStorage = require('localStorage');

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

// realtime routes
app.io.route('ready', function (req) {
  req.io.join(req.data.room);
  req.io.room(req.data.room).broadcast('announce', {
    message: req.data.username + ' just joined. ',
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

// regular routes
app.get('/', function (req, res) {
  res.render('welcome', { title: 'Code Czar' });
});

app.get('/index', function (req, res) {
  res.render('index', { title: 'Code Czar' });
});

app.get('/questions/new', function(req, res, next) {
  res.render('questions/new', { title: 'Code Czar' });
});

app.get('/frame', function(req, res, next) {
  res.render('questions/frame', { title: 'Code Czar' });
});

app.get('/questions', function(req, res, next) {
  Exercise.collection().fetch().then(function(exercises) {
    res.render('questions/index', {exercises: exercises.toJSON()});
  }).catch(function(error) {
    console.log(error);
    res.send('An error occurred');
  });
});

app.post('/questions', function(req, res, next) {
  Exercise.forge({
    title: req.body['exercise']['title'],
    description: req.body['exercise']['description'],
    link: req.body['exercise']['link'],
    tag_id: req.body['exercise']['tag_id'],
    upvotes: '0'
  })
  .save()
  .then(function(exercise) {
    res.redirect('/questions');
  })
  .catch(function(err) {
    return console.error(err);
  });
});

app.get('/questions/:id', function (req, res) {
  new Exercise({id: req.params.id})
  .fetch()
  .then(function(exercise) {
    res.render('questions/show', {exercise: exercise.toJSON()});
  });
});

app.get('/workspace/(:id)', function(req, res) {
  res.render('wildcard');
});

//shareJS
var connect = require('connect'),
    sharejs = require('share').server;

var options = {db: {type: 'none'}}

var server = app.use(
  connect.logger(),
  connect.static(__dirname + '/public')
);

sharejs.attach(server, options);

app.listen(app.get('port'));
