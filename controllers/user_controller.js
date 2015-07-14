// En un portal real crearíamos una tabla en la DB para la gestión de los usuarios
var users = {
	admin: { id: 1, username: 'admin', password: 'yosoyeladministrador' },
	pepe: { id: 2, username: 'pepe', password: '5678' }
};

// Comprueba si el usuario está registrado en users
// Si la autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback) {
	if(users[login]) {
		if(password === users[login].password) {
			callback(null, users[login]);
		}
		else {
			callback(new Error('Password erróneo'));
		}
	}
	else {
		callback(new Error('No existe el usuario'));
	}
};