var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');		// load sequalize , db model

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;


app.use(bodyParser.json());
/*
var todos = [{
	id: 1,
	description: 'Mom belle',
	completed: false
}, {
	id: 2,
	description: 'Dad belle',
	completed: false
}];
*/
app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	var query = req.query; // ?completed=true
	var where = {};

	// filter ?completed=true
	if (query.hasOwnProperty("completed") && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty("completed") && query.completed === 'false') {
		where.completed = false;
	}

	// filter &q=Dog
	if (query.hasOwnProperty("q") && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		} ;
	}

	console.log(where);

	// sequelize version
	db.todo.findAll({where : where}).then(function (todo) {
		if (!!todo) {
			res.json(todo);	
		} else {
			res.status(404).send();
		}
		
	}, function (e) {
		res.status(500).json(e);
	});

	/*   no sequalize version
	var queryParams = req.query; // ?completed=true

	var filteredTodos = todos;

	// ?completed=true
	if (queryParams.hasOwnProperty("completed")) {
		filteredTodos = _.where(filteredTodos, { completed: true });
	}

	// &q=Dog
	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function (todo) {
			return todo.indexOf(queryParams.q) > -1;
		});
	}

	res.json(filteredTodos);
	*/
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = req.params.id;

	// sequelize version
	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());	
		} else {
			res.status(404).send();
		}
		
	}, function (e) {
		res.status(500).json(e);
	});
	
	// underscore findWhere version
	//var matchedTodo = _.findWhere(todos, {id: todoId});
	//res.json (matchedTodo);

	/*
	// bovenstaande regels zorgen dat onderstaande
	// regels overbodig zijn

	todos.forEach(function (todo) {
		console.log(todo);
	});

	for (var key in todos) {
		if (todos[key].id == todoId) {
			res.json(todos[key]);
			console.log(todos[key]);
		}
	}
	*/
});

// POST /todos
app.post('/todos', function (req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	// db is overall functie voor db nu. 
	// 'body' is paar regels boven
	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(404).json(e);
	});


	/*
	if (!_.isBoolean(body.completed) || !_.isString(body.description.trim())) {
		return res.status(400).send();
	}

	body.description = body.description.trim();

	// add id field
	body.id = todoNextId++;

	// push body into array
	todos.push(body);

	res.json(body);
	*/
});

// add new user
app.post('/users', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	console.log(body);

	db.user.create(body).then(function (user) {
		res.json(user.toJSON());
	}, function (e) {
		res.status(404).json(e);
	});

});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	db.todo.destroy({ where : {id : todoId}, truncate: true}).then(function (rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).send();
		} else {
			res.status(204).send(); // OK, nothing to send back
		}
	}, function (e) {
		res.status(500).json(e);
	});

	/*

	if (!matchedTodo) {
		res.status(404).send();
	} else {
		var todosWithoutMatched = _.without(todos, matchedTodo);
		todos = todosWithoutMatched;
	
		res.json(todos);	
	}
	*/
	
});

// PUT (UPDATE) /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	// instance method first
	db.todo.findById(todoId).then (function (todo) {
		if (todo) {
			// continue chain
			todo.update(attributes).then (function (todo) {
				// success (todo.update)
				res.json(todo.toJSON());
			}, function (e) {
				// failure (todo.update)
				res.status(400).json(e);
			});     
		} else {
			res.status(404).send();
		}
	}, function () {
		// findById fails
		res.status(500).send();
	})


	//_.extend(matchedTodo, attributes);
	//res.json(matchedTodo); // let op! dit moet altijd!! 
	
	/*
	var matchedTodo = _.findWhere(todos, {id: todoId});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	// if no match id
	if (!matchedTodo) {
		return res.status(404).send();
	}


	//validation
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		// no boolean
		return res.status(400).send();
	} else {

	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		// no string
		return res.status(400).send();
	} else {
		
	}

	// updated
	_.extend(matchedTodo, validAttributes);

	res.json(matchedTodo); // let op! dit moet altijd!! 
	*/
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function() {
		console.log('Listening on port '+PORT);
	});
}); 

/*
app.listen(PORT, function () {
	console.log('Express listening on PORT ' + PORT);
});
*/