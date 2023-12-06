const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4, validate: uuidValidate } = require("uuid");

const app = express();
app.use(express.json());

// const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

// let tasks = [];

// // Load tasks from the JSON file
// const loadTasksFromFile = () => {
//     fs.readFile(tasksFilePath, 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading tasks file:', err);
//             return;
//         }
//         try {
//             tasks = JSON.parse(data);
//         } catch (error) {
//             console.error('Error parsing tasks JSON:', error);
//         }
//     });
// };

// // Load tasks from the file when the server starts
// loadTasksFromFile();

let tasks = [
  {
    uuid: "f360ba09-4682-448b-b32f-0a9e538502fa",
    name: "Walk the dog",
    description: "Walk the dog for forty five minutes",
    created: "2023-06-23T09:30:00Z",
    completed: null,
    complete: false,
  },
  {
    uuid: "fd5ff9df-f194-4c6e-966a-71b38f95e14f",
    name: "Mow the lawn",
    description: "Mow the lawn in the back garden",
    created: "2023-06-23T09:00:00Z",
    completed: null,
    complete: false,
  },
  {
    uuid: "5c3ec8bc-6099-4cd5-b6da-8e2956db3a34",
    name: "Test generative AI",
    description: "Use generative AI technology to write a simple web service",
    created: "2023-06-23T09:00:00Z",
    completed: null,
    complete: false,
  },
];

// Get all tasks or filter by completion status
app.get("/todo", (req, res) => {
  const { complete } = req.query;

  // If complete parameter is provided
  if (complete !== undefined) {
    const iscomplete = complete.toLowerCase() === "true"; // Check if complete parameter is 'true'

    const filteredTasks = tasks.filter((task) => task.complete === iscomplete);
    res.json(filteredTasks);
  } else {
    // If complete parameter is not provided, return all tasks
    res.json(tasks);
  }
});

// Get a task by UUID or return error for invalid UUID
app.get("/todo/:uuid", (req, res) => {
  const { uuid } = req.params;

  // Validate the UUID format
  if (!uuidValidate(uuid)) {
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: "Bad Request",
      path: `/todo/${uuid}`,
    });
  }

  // Find the task with the specified UUID
  const foundTask = tasks.find((task) => task.uuid === uuid);

  if (foundTask) {
    res.json(foundTask);
  } else {
    // Return a pre-defined task if the supplied UUID is not found
    const unknownTask = {
      uuid: "00000000-0000-0000-0000-000000000000",
      name: "Unknown Task",
      description: "Unknown Task",
      created: "1970-01-01T00:00:00.000Z",
      completed: null,
      complete: false,
    };
    res.json(unknownTask);
  }
});

// PUT endpoint to mark task as completed by UUID
app.put("/todo/completed/:uuid", (req, res) => {
  const { uuid } = req.params;

  // Validate the UUID format
  if (!uuidValidate(uuid)) {
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: "Bad Request",
      path: `/todo/completed/${uuid}`,
    });
  }

  // Find the task with the specified UUID
  const foundTaskIndex = tasks.findIndex((task) => task.uuid === uuid);

  if (foundTaskIndex !== -1) {
    // Check if the task is already completed
    if (tasks[foundTaskIndex].complete) {
      return res.status(200).json({
        success: false,
        message: "Task already marked complete.",
      });
    }

    // Update the task as completed
    tasks[foundTaskIndex].complete = true;
    tasks[foundTaskIndex].completed = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: "This task has now been completed.",
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "Task not found.",
    });
  }
});

// POST endpoint to add a new task
app.post("/todo/addTask", (req, res) => {
  const { name, description } = req.query;

  // Check if either name and description are not provided
  if (!name || !description) {
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: "Bad Request",
      message: "Please provide both name and description parameters.",
    });
  }

  // Generate a new UUID for the task
  const newTaskUUID = uuidv4();

  // Create a new task object
  const newTask = {
    uuid: newTaskUUID,
    name: name || "Unnamed Task",
    description: description || "No description provided",
    created: new Date().toISOString(),
    completed: null,
    complete: false,
  };

  // Add the new task to the tasks array
  tasks.push(newTask);

  res.status(201).json({
    taskId: newTaskUUID,
    message: `Task ${name || "Unnamed Task"} added successfully.`,
  });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
