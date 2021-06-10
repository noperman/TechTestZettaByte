require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

/** Connecting to mongoDB */
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true,useUnifiedTopology: true})
const db = mongoose.connection
db.on('error',(err) => console.error(err))
db.on('open',() => console.error('Connected to Database'))
/** Connecting to mongoDB */ 

var indexRouter = require('./routes/index');

var app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "Origin, If-None-Match, Referer, User-Agent, X-Requested-With, Host, Cache-Control, Connection, Content-Type, Accept, Accept-Encoding, Accept-Language, Authorization, Range");
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
  res.header('Access-Control-Expose-Headers', 'Content-Length,Content-Range');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
