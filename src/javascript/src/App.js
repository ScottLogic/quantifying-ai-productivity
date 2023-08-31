const express = require("express");
const fs = require("fs");
const path = require("path");
const { validate: validateUuid, v4: uuidv4 } = require("uuid");

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

// Get all tasks
app.get("/todo", (req, res) => {
  // Check if the 'complete' query parameter is present and has a value of 'true' or 'false'
  if (req.query.complete === "true" || req.query.complete === "false") {
    const completeValue = req.query.complete === "true";
    // Filter tasks based on the complete value
    const filteredTasks = tasks.filter(
      (task) => task.complete === completeValue
    );
    res.json(filteredTasks);
  } else {
    res.json(tasks);
  }
});

app.get("/todo/:uuid", (req, res) => {
  const requestedUuid = req.params.uuid;

  // Validate the UUID format
  if (!validateUuid(requestedUuid)) {
    return res
      .status(400)
      .json({ error: "Bad Request", path: "/todo/invalid-uuid" });
  }

  // Find the task with the requested uuid
  const task = tasks.find((task) => task.uuid === requestedUuid);

  if (task) {
    res.json(task);
  } else {
    res.json({
      id: "UNKNOWN_TASK",
      name: "Unknown Task",
      description: "Unknown Task",
      complete: false,
      completed: null,
      uuid: "00000000-0000-0000-0000-000000000000",
      created: "1970-01-01T00:00:00.000Z",
    });
  }
});

app.put("/todo/completed/:uuid", (req, res) => {
  const requestedUuid = req.params.uuid;

  if (!validateUuid(requestedUuid)) {
    return res.status(400).json({ success: false, message: "Malformed UUID" });
  }

  const task = tasks.find((task) => task.uuid === requestedUuid);

  if (!task) {
    return res.status(200).json({
      success: false,
      message: "Task not found.",
    });
  }

  if (task.complete) {
    return res.json({
      success: false,
      message: "Task already marked complete.",
    });
  }

  task.complete = true;
  task.completed = new Date().toISOString();
  res.json({ success: true, message: "This task has now been completed." });
});

app.post("/todo/addTask", (req, res) => {
  const { name, description } = req.query;

  if (!name || !description) {
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: "Bad Request",
      path: "/todo/addTask?name=Name",
    });
  }

  const newTask = {
    uuid: uuidv4(),
    name: name,
    description: description,
    complete: false,
    completed: null,
    created: new Date().toISOString(),
  };

  tasks.push(newTask);

  res.status(201).json({
    taskId: newTask.uuid,
    message: `Task ${name} added successfully.`,
  });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
