import crypto from 'node:crypto'

export type Todo = {
	uuid: string
	name: string
	description: string
	created: string
	completed: string | null
	complete: boolean
}

type Result = {
	success: boolean
	message: string
}

const todos: Array<Todo> = [
	{
		uuid: 'f360ba09-4682-448b-b32f-0a9e538502fa',
		name: 'Walk the dog',
		description: 'Walk the dog for forty five minutes',
		created: '2023-06-23T09:30:00Z',
		completed: null,
		complete: false
	},
	{
		uuid: 'fd5ff9df-f194-4c6e-966a-71b38f95e14f',
		name: 'Mow the lawn',
		description: 'Mow the lawn in the back garden',
		created: '2023-06-23T09:00:00Z',
		completed: null,
		complete: false
	},
	{
		uuid: '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34',
		name: 'Test generative AI',
		description: 'Use generative AI technology to write a simple web service',
		created: '2023-06-23T09:00:00Z',
		completed: null,
		complete: false
	}
]

const unknownTodo: Todo = {
	uuid: '00000000-0000-0000-0000-000000000000',
	name: 'Unknown Task',
	description: 'Unknown Task',
	created: '1970-01-01T00:00:00.000Z',
	completed: null,
	complete: false
}

export default {
	getAll: (complete?: boolean) =>
		complete === undefined ? todos : todos.filter(todo => todo.complete === complete),
	get: (id: string): Todo => todos.find(({ uuid }) => uuid === id) || unknownTodo,
	put: (id: string): Result => {
		const todo = todos.find(({ uuid }) => uuid === id)
		if (!todo) return { success: false, message: 'Task not found.' }
		if (todo.complete) return { success: false, message: 'Task already marked complete.' }

		todo.complete = true
		todo.completed = new Date().toISOString()
		return { success: true, message: 'This task has now been completed.' }
	},
	create: (name: string, description: string) => {
		const todo: Todo = {
			uuid: crypto.randomUUID(),
			name,
			description,
			created: new Date().toISOString(),
			completed: null,
			complete: false
		}
		todos.push(todo)
		return todo.uuid
	}
}
