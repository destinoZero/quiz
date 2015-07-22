var models = require('../models/models.js');

var statistics = {
		quizes: 0,
		comments: 0,
		commentedQuizes: 0
};

var errors = [];

exports.calculate = function(req, res, next) {
	models.Quiz.count()
		.then(function(numQuizes) {
			statistics.quizes = numQuizes;
			return models.Comment.count();
		})
		.then(function(numComments) {
			statistics.comments = numComments;
			return models.Comment.countCommentedQuizes();
		})
		.then(function(numCommented) {
			statistics.commentedQuizes = numCommented;
		})
		.catch(function(err) {
			errors.push(err);
		})
		.finally(function() {
			next();
		});
};

// GET /quizes/statistics
exports.show = function(req, res) {
	res.render('statistics/show', { statistics: statistics, errors: errors });
};