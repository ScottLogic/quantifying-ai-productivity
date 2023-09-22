const express = require("express");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

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
  const { complete } = req.query;
  if (complete === undefined) {
    res.status(200).json(tasks);
    return;
  }

  const filteredTasks = tasks.filter(
    (task) => task.complete.toString() === complete
  );
  res.status(200).json(filteredTasks);
});

const UNKNOWN_TASK = {
  uuid: "00000000-0000-0000-0000-000000000000",
  name: "Unknown Task",
  description: "Unknown Task",
  created: "1970-01-01T00:00:00.000Z",
  completed: null,
  complete: false,
};

app.get("/todo/:id", (req, res) => {
  const { id } = req.params;

  if (!uuid.validate(id)) {
    res.status(400).send({
      timestamp: new Date(),
      status: 400,
      error: "Bad Request",
      path: "/todo/invalid-uuid",
    });
    return;
  }

  const task = tasks.find((task) => task.uuid === id) ?? UNKNOWN_TASK;
  res.status(200).json(task);
});

app.put("/todo/completed/:id", (req, res) => {
  const { id } = req.params;

  if (!uuid.validate(id)) {
    res.status(400).send({
      timestamp: new Date(),
      status: 400,
      error: "Bad Request",
      path: "/todo/completed/invalid-uuid",
    });
    return;
  }

  const task = tasks.find((task) => task.uuid === id);

  if (!task) {
    res.status(200).send({
      success: false,
      message: "Task not found.",
    });
    return;
  }

  if (task.complete) {
    res.status(200).send({
      success: false,
      message: "Task already marked complete.",
    });
    return;
  }

  tasks = tasks.map((task) =>
    task.uuid === id ? { ...task, complete: true, completed: new Date() } : task
  );
  res.status(200).send({
    success: true,
    message: "This task has now been completed.",
  });
});

app.post("/todo/addTask", (req, res) => {
  const { name, description } = req.query;

  if (!name) {
    res.status(400).send({
      timestamp: new Date(),
      status: 400,
      error: "Bad Request",
      message: "Missing name query parameter.",
    });
    return;
  }

  if (!description) {
    res.status(400).send({
      timestamp: new Date(),
      status: 400,
      error: "Bad Request",
      message: "Missing description query parameter.",
    });
    return;
  }

  const newTask = {
    complete: false,
    completed: null,
    created: new Date(),
    description,
    name,
    uuid: uuid.v4(),
  };

  tasks.push(newTask);
  res.status(201).send({
    taskId: newTask.uuid,
    message: `Task ${name} added successfully.`,
  });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
