var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Habilita el uso de vistas parciales
app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname + '/public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz destinoZero'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos
app.use(function(req, res, next) {
  // Guardar path en session.redir para después de hacer login
  if(!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

// Middleware para la gestión del logout automático.
// Si no hay transacciones HTTP en 2 minutos la sesión finaliza automáticamente.
app.use(function(req, res, next) {
  var user = req.session.user;
  if(!user) {
    return next();
  }

  var lastAccess = req.session.user.lastAccess;
  var now = new Date().getTime();
  if((now - lastAccess) < 1000) {
    return next();
  }

  if((now - lastAccess) > 1000 * 60 * 2) {
    var sessionController = require('./controllers/session_controller');
    sessionController.destroy(req, res);
  }
  else {
    req.session.user.lastAccess = now;
  }
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
