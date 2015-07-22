// Middleware para autologout
var defaultTime = 2 * 60 * 1000; // Tiempo por defecto

module.exports = function(t) {

  var logoutTime = t || defaultTime;

  return function(req, res, next) {
    var now = new Date().getTime();

    // Recuperamos la hora de la última petición
    var lastReqTime = req.session.reqTime || now;

    // Si hay un usuario registrado y ha sobrepasado el logoutTime
    if (req.session.user && (now - lastReqTime > logoutTime)) {
      delete req.session.user; // Eliminamos la sesión
    }

    // Actualizamos la hora para la siguiente petición
    req.session.reqTime = now;

    // Pasamos al siguiente middleware
    next();
  };
};