const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4, validate: isUuidValid } = require("uuid");

const app = express();
app.use(express.json());

const tasksFilePath = path.join(
  __dirname,
  "../../static_data",
  "ToDoList.json"
);

let tasks = [];

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

// Get all tasks with optional "complete" parameter
app.get("/todo", (req, res) => {
  // Retrieve the value of the "complete" parameter from query parameters
  const { complete } = req.query;

  // Check if the "complete" parameter exists
  if (complete !== undefined) {
    // If "complete" parameter is provided, filter tasks based on its value
    const filteredTasks = tasks.filter(
      (task) => task.complete === (complete.toLowerCase() === "true")
    );
    res.json(filteredTasks);
  } else {
    // If "complete" parameter is not provided, return all tasks
    res.json(tasks);
  }
});

// Get a task by ID
app.get("/todo/:taskId", (req, res) => {
  const taskId = req.params.taskId;

  if (!isUuidValid(taskId)) {
    return res.status(400).json({ error: "Bad Request" });
  }

  // Find the task with the specified ID
  const task = tasks.find((task) => task.uuid === taskId);

  if (task) {
    // If the task is found, send it in the response
    res.json(task);
  } else {
    // If the task is not found, send a 404 Not Found response
    const defaultTask = {
      uuid: "00000000-0000-0000-0000-000000000000",
      name: "Unknown Task",
      description: "Unknown Task",
      created: "1970-01-01T00:00:00.000Z",
      completed: null,
      complete: false,
    };

    res.json(defaultTask);
  }
});

// PUT endpoint to mark a task as complete by ID
app.put("/todo/completed/:uuid", (req, res) => {
  const uuid = req.params.uuid;

  // Check if the provided ID is a valid UUID
  if (!isUuidValid(uuid)) {
    return res.status(400).json({ success: false, message: "Bad Request" });
  }

  // Find the task with the specified ID
  const taskIndex = tasks.findIndex((task) => task.uuid === uuid);

  if (taskIndex !== -1) {
    if (tasks[taskIndex].complete) {
      return res.json({
        success: false,
        message: "Task already marked complete.",
      });
    }

    // Update the task to mark it as complete
    tasks[taskIndex].completed = new Date().toISOString();
    tasks[taskIndex].complete = true;

    // Send a success response
    res.json({ success: true, message: "This task has now been completed." });
  } else {
    // If the task is not found, send an error response
    res.status(200).json({ success: false, message: "Task not found." });
  }
});

// POST endpoint to create a new task
app.post("/todo/addTask", (req, res) => {
  const { name, description } = req.query;

  // Check if both name and description are provided
  if (!name || !description) {
    return res.status(400).json({ error: "Bad Request" });
  }

  // Create a new task with a random UUID
  const newTask = {
    uuid: uuidv4(),
    name: name,
    description: description,
    created: new Date().toISOString(),
    completed: null,
    complete: false,
  };

  // Add the new task to the array
  tasks.push(newTask);

  // Send a success response with the new task's UUID
  res.status(201).json({
    taskId: newTask.uuid,
    message: `Task ${name} added successfully.`,
  });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
