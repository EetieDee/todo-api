// load all the modules to sequelize

// we have our sequalize db
var Sequelize = require('sequelize');

// DB description
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'
});

// create new obj
var db = {};

// load all sequalized models

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;