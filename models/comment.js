// Definición del modelo de comment con validación
module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		'Comment', // Nombre de tabla
		{ // Atributos de tabla
			texto: {
				type: DataTypes.STRING,
				validate: { notEmpty: { msg: "-> Falta comentario" } }
			},
			publicado: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{ // Opciones (Método que devuelve los campos 'publicado' que tengan valor 'false').
			classMethods: {
				countCommentedQuizes: function() {
					return this.aggregate("QuizId", "count", { distinct: true });
				}
			}
		}
	);
};