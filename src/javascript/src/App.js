const { randomUUID } = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, "../../static_data", "ToDoList.json");

let tasks = [];

function isUUID(uuid) {
	return /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/i.test(uuid);
}

// Load tasks from the JSON file
const loadTasksFromFile = () => {
	fs.readFile(tasksFilePath, "utf8", (err, data) => {
		if (err) {
			console.error("Error reading tasks file:", err);
			return;
		}
		try {
			tasks = JSON.parse(data);
		} catch (error) {
			console.error("Error parsing tasks JSON:", error);
		}
	});
};

// Load tasks from the file when the server starts
loadTasksFromFile();

//Get all tasks
app.get("/todo", (req, res) => {
	const { complete } = req.query;
	if (complete) {
		res.json(
			tasks.filter((task) => {
				return task.complete === (complete === "true");
			})
		);
		return;
	}
	res.json(tasks);
});

app.get("/todo/:uuid", (req, res) => {
	if (!isUUID(req.params.uuid)) {
		res.status(400).json({
			timestamp: new Date(),
			status: 400,
			error: "Bad Request",
			path: "/todo/invalid-uuid",
		});
		return;
	}

	const task = tasks.find((task) => {
		return task.uuid === req.params.uuid;
	});

	if (task) {
		res.json(task);
		return;
	}
	res.json({
		uuid: "00000000-0000-0000-0000-000000000000",
		name: "Unknown Task",
		description: "Unknown Task",
		created: "1970-01-01T00:00:00.000Z",
		completed: null,
		complete: false,
	});
});

app.put("/todo/completed/:uuid", (req, res) => {
	if (!isUUID(req.params.uuid)) {
		res.status(400).json({
			timestamp: new Date(),
			status: 400,
			error: "Bad Request",
			path: "/todo/completed/invalid-uuid",
		});
		return;
	}

	const taskIndex = tasks.findIndex((task) => {
		return task.uuid === req.params.uuid;
	});

	if (taskIndex === -1) {
		res.json({
			success: false,
			message: "Task not found.",
		});
		return;
	}

	if (tasks[taskIndex].complete === true) {
		res.json({
			success: false,
			message: "Task already marked complete.",
		});
		return;
	}
	tasks[taskIndex] = {
		...tasks[taskIndex],
		completed: new Date(),
		complete: true,
	};

	res.json({
		success: true,
		message: "This task has now been completed.",
	});
});

app.post("/todo/addTask", (req, res) => {
	const { name, description } = req.query;
	if (!name || !description) {
		res.status(400).json({
			timestamp: new Date(),
			status: 400,
			error: "Bad Request",
			path: req.originalUrl,
		});
		return;
	}
	const uuid = randomUUID();
	tasks.push({
		uuid: uuid,
		name: name,
		description: description,
		created: new Date(),
		completed: null,
		complete: false,
	});
	res.status(201).json({
		taskId: uuid,
		message: "Task " + name + " added successfully.",
	});
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
