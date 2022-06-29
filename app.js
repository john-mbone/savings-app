var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
const Redis = require('ioredis');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const client = new Redis()
client.set('redis-1','Tested','ex',10)
const cache = (req, res, next) => {
  const id = 'redis-1';
  client.get(id, (error, result) => { 
    if (error) throw error;
    if (result !== null) {
      return res.send(result);
    } else {
      return next();
    }
  });
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());

// We need access to post data::configure body parser
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', cache, indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
