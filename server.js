var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = req.params.id;
	
	var matchedTodo = _.findWhere(todos, {id: todoId});
	res.json (matchedTodo);

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


	if (!_.isBoolean(body.completed) || !_.isString(body.description.trim())) {
		return res.status(400).send();
	}

	body.description = body.description.trim();

	// add id field
	body.id = todoNextId++;

	// push body into array
	todos.push(body);

	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	var todosWithoutMatched = _.without(todos, matchedTodo);
	todos = todosWithoutMatched;
	
	res.json(todos);
});

app.listen(PORT, function () {
	console.log('Express listening on PORT ' + PORT);
});