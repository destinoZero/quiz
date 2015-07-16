var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

// Página de entrada (home page)
router.get('/', function(req, res) {
	res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos -> :quizId y :commentId
router.param('quizId',    quizController.load); // autoload :quizId
router.param('commentId', commentController.load); // autoload :commentId

// Definición de rutas de sesión
router.get('/login',  sessionController.new); // Formulario login
router.post('/login', sessionController.create); // Crear sesión
router.get('/logout', sessionController.destroy); // Destruir sesión

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new); // Middlewares 
router.post('/quizes/create',              sessionController.loginRequired, quizController.create); // en serie.
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit); // Autorización
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update); // Autorización
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy); // Autorización

// Definición de rutas de /comments
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    commentController.create);
router.get(
	'/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', 
	sessionController.loginRequired, commentController.publish // Debe existir autorización para poder publicar
);

// Ruta /author
router.get('/author', quizController.author);

module.exports = router;
