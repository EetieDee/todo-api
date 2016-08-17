var Sequelize = require('sequelize');

// DB description
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

// CREATE table
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250],  // > 1 en < 250 tekens
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

// INSERT INTO 
// let op force:true, anders pas created als niet bestaat
sequelize.sync({force: true}).then(function() {
	console.log("everything is synced");

	Todo.findById(1).then(function (todo) {
		if (todo) {
			console.log(todo.toJSON());
		} else {
			console.log('no');
		}
	});

	/*

	Todo.create({
		description: 'walking my dog',
		completed: false
	}).then(function (todo) {
		console.log(todos.toJSON());
		Todo.findAll({
			where: {
				completed: false
				
				// of dit:
				//description: {
				//	$like: '%Office%'
				//}
			}
		});
		var todo = Todo.findById(1);

		todos.forEach(function (todo) {
			console.log(todo.toJSON());
		})
		console.log('Finished!');
		console.log();
	}).catch(function (e) {
		console.log(e);
	});
	*/
});
