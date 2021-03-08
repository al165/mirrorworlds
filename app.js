//var createError = require('http-errors');
var express = require('express');
var cors = require("cors");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  pingInterval: 5000,
  pingTimeout: 5000
});

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api')(io);

PORT = 3000;

app.use(express.json({limit: "5mb"}));
app.use(express.urlencoded({limit: "5mb"}));

//app.set('view_engine', 'ejs');
//app.set('views', '../views');
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cors());

const mainPath = path.resolve(path.join(__dirname, 'client/dist'));
app.use('/public', express.static('public'));
app.use('/game', express.static(mainPath));
app.use('/api', apiRouter);
//app.use(express.static(mainPath));
app.use(express.static(mainPath));
app.use('/*', indexRouter);

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  next(createError(404));
//});
//
//// error handler
//app.use(function(err, req, res, next) {
//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});

http.listen(PORT, ()=>{
  console.log('Server listening on PORT', PORT);
});

module.exports = app;
