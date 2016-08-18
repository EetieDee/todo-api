// new model

// sequalize.import(__dirname + '/models/todo.js'); (db.js) heeft twee
// params nodig, te weten 'sequalize' en 'DataTypes'. zodoende.

module.exports = function(sequelize, DataTypes) { 
	return sequelize.define('todo', {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [1, 250], // > 1 en < 250 tekens
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	})
};