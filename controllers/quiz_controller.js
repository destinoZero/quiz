var models = require('../models/models.js');

// Variable que guardará el momento de la última transacción HTTP para el auto-logout
var lastAccess = new Date().getTime();

// Autoload -> Factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(
		{
			where: { id: Number(quizId) },
			include: [{ model: models.Comment }]
		}
	).then(function(quiz) {
		if(quiz) {
			req.quiz = quiz;
			next();
		}
		else {
			next(new Error('No existe quizId=' + quizId));
		}
	}).catch(function(error) {
		next(error);
	});
};

// GET /quizes
exports.index = function(req, res) {
	var query = { order: 'pregunta ASC' };

	// Si el usuario hace una búsqueda articulamos el query
	if(req.query.search) {
		var search = req.query.search;
		search = search.replace(' ', '%');
		search = '%' + search + '%';

		query = {
			where: [ "pregunta like ?", search ],
			order: 'pregunta ASC'
		};
	}
	models.Quiz.findAll(query).then(function(quizes) {
		res.render('quizes/index', { quizes: quizes, lastAccess: lastAccess, errors: [] });
	}).catch(function(error) {
		next(error);
	});
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz, tema: req.quiz.tema, lastAccess: lastAccess, errors: [] });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, lastAccess: lastAccess, errors: [] });
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // Crea objeto quiz (no persistente)
		{ pregunta: 'Pregunta', respuesta: 'Respuesta', tema: 'tema' }
	);

	res.render('quizes/new', { quiz: quiz, lastAccess: lastAccess, errors: [] });
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	
	quiz.validate().then(function(err) {
		if(err) {
			res.render('quizes/new', { quiz: quiz, lastAccess: lastAccess, errors: err.errors });
		}
		else {
			// Guarda en DB los campos 'pregunta' y 'respuesta' de quiz
			quiz.save({ fields: ['pregunta', 'respuesta', 'tema'] }).then(function() {
				res.redirect('/quizes', { lastAccess: lastAccess }); // Redirección HTTP (URL relativo) a lista de preguntas
			});
		}
	});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', { quiz: quiz, lastAccess: lastAccess, errors: [] });
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta  = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema      = req.body.quiz.tema;

	req.quiz.validate().then(function(err) {
		if(err) {
			res.render('quizes/edit', { quiz: req.quiz, lastAccess: lastAccess, errors: err.errors });
		}
		else {
			req.quiz.save({ fields: [ 'pregunta', 'respuesta', 'tema' ] }).then(function() {
				res.redirect('/quizes', { lastAccess: lastAccess }); // Redirección HTTP a la lista de preguntas (URL relativo)
			});
		}
	});
};

//  DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes', { lastAccess: lastAccess });
	}).catch(function(error) {
		next(error);
	});
};

// GET /author
exports.author = function(req, res) {	
	res.render('author', { lastAccess: lastAccess, errors: [] });
};