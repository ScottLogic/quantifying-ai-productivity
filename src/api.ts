// import express from 'express'
import express from 'express'
// import todos with assert type: json [copilot failed here]
import todos from './todos.json' assert { type: 'json' }

// Create a new express application instance
const app: express.Application = express()

// Define a route handler for getting all todos
app.get('/todo', (req, res) => {
	// Return all todos
	res.json(todos)
})

// Start the server on port 8080
app.listen(8080, () => {
	console.log('Server started on port 8080')
})
