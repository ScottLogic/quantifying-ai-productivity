// import express from 'express'
import express from 'express'
// import todos with assert type: json [copilot failed here]
import todosJson from './todos.json' assert { type: 'json' }
import * as crypto from 'crypto';

const todos = todosJson as Array<{
	uuid: string,
	name: string,
	description: string,
	created: string,
	complete: boolean,
	completed: string | null
}>

// Create a new express application instance
const app: express.Application = express()

// Define a route handler for getting all todos
app.get('/todo', (req, res) => {
	// query params completed destructure
	const { complete } = req.query
	// filter todos by complete if complete equals 'true' or 'false'
	const filteredTodos = todos.filter((todo) => {
		if (complete === 'true' || complete === 'false') {
			return todo.complete === JSON.parse(complete)
		}
		return todo
	})
	// return filtered todos
	res.send(filteredTodos)
})

// Define a route handler for getting a specific todo
app.get('/todo/:id', (req, res) => {
	// params id destructure
	const { id } = req.params
	// check if id is a valid uuid
	if (!/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) {
		res.status(400).send('Invalid id')
		return
	}
	// find todo by id
	const todo = todos.find((todo) => todo.uuid === id)
	// return todo if found else return dummy todo with zeroes uuid
	res.send(todo || {
		uuid: '00000000-0000-0000-0000-000000000000',
		// created iso timestamp epoch
		created: '1970-01-01T00:00:00.000Z',
		complete: false,
		completed: null,
		name: 'Unknown Task',
		description: 'Unknown Task'
	})
})

// Define a route handler for creating todos
app.post('/todo/addTask', (req, res) => {
	// query params name and description destructure
	const { name, description } = req.query
	// check if name and description are missing
	if (!name || !description) {
		res.status(400).send('Missing name or description')
		return
	}
	// create new todo
	const todo = {
		// generate uuid v4 crypto
		uuid: crypto.randomUUID(),
		// name as string
		name: name as string,
		// description as string
		description: description as string,
		// created iso timestamp now
		created: new Date().toISOString(),
		complete: false,
		completed: null
	}
	// add todo to todos
	todos.push(todo)
	// return 201 with todo id and success message
	res.status(201).send({
		taskId: todo.uuid,
		message: `Task ${todo.name} added successfully.`
	})
})

// Define a route handler for completing a todo (as put)
app.put('/todo/completed/:id', (req, res) => {
	// params id destructure
	const { id } = req.params
	// check if id is a valid uuid
	if (!/^[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) {
		res.status(400).send('Invalid id')
		return
	}
	// find todo by id
	const todo = todos.find((todo) => todo.uuid === id)
	// check if todo was found
	if (!todo) {
		res.status(200).send({
			success: false,
			message: 'Task not found.'
		})
		return
	}
	// check if todo is already complete
	if (todo.complete) {
		res.status(200).send({
			success: false,
			message: 'Task already marked complete.'
		})
		return
	}
	// update todo
	todo.complete = true
	todo.completed = new Date().toISOString()
	// return 200 with success message
	res.status(200).send({
		success: true,
		message: `This task has now been completed.`
	})
})

// Start the server on port 8080
app.listen(8080, () => {
	console.log('Server started on port 8080')
})
