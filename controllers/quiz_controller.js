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
		res.render('quizes/index', { quizes: quizes });
	}).catch(function(error) {
		next(error);
	});
};

// GET /quizes/:id
exports.show = function(req, res) {
	res.render('quizes/show', { quiz: req.quiz });
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if(req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};

// GET /author
exports.author = function(req, res) {
	res.render('author', {});
};