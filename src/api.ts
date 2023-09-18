import express from 'express'
import Todos from './data-store'

const isUuid = (() => {
	const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
	return (input: string) => uuidPattern.test(input)
})()

const api = express()
api.use(express.json())

api.get('/todo', (req, res) => {
	const { complete } = req.query
	const completeFlag = (complete === 'true' || complete === 'false')
		? complete === 'true'
		: undefined
	res.json(Todos.getAll(completeFlag))
})

api.get('/todo/:uuid', (req, res) => {
	const { uuid } = req.params
	if (!isUuid(uuid)) res.status(400).send('Invalid UUID')
	res.json(Todos.get(uuid))
})

api.put('/todo/completed/:uuid', (req, res) => {
	const { uuid } = req.params
	if (!isUuid(uuid)) res.status(400).send('Invalid UUID')
	res.json(Todos.put(uuid))
})

api.post('/todo/addTask', (req, res) => {
	const { name, description } = req.query
	if (!name) res.status(400).send('Name query parameter missing')
	if (!description) res.status(400).send('Description query parameter missing')

	const id = Todos.create(name as string, description as string)
	res.header('Location', `/todo/${id}`).status(201).json({
		taskId: id,
		message: `Task ${name} added successfully.`
	})
})

api.listen(8080, () => console.log('cwilton typescript app listening on port 8080!'))
