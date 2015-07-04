var models = require('../models/models.js');

// Autoload -> Factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(function(quiz) {
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
	var query = {};

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
		res.render('quizes/index', { quizes: quizes, errors: [] });
	}).catch(function(error) {
		next(error);
	});
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz, errors: [] });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: [] });
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // Crea objeto quiz (no persistente)
		{ pregunta: 'Pregunta', respuesta: 'Respuesta' }
	);
	res.render('quizes/new', { quiz: quiz, errors: [] });
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err) {
		if(err) {
			res.render('quizes/new', { quiz: quiz, errors: err.errors });
		}
		else {
			// Guarda en DB los campos 'pregunta' y 'respuesta' de quiz
			quiz.save({ fields: ['pregunta', 'respuesta'] }).then(function() {
				res.redirect('/quizes'); // Redirección HTTP (URL relativo) a lista de preguntas
			});
		}
	});
};

// GET /author
exports.author = function(req, res) {
	res.render('author', { errors: [] });
};