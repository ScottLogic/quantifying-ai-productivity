const express = require("express");
const fs = require("fs");
const path = require("path");
const { compileFunction } = require("vm");

const app = express();
app.use(express.json());

const tasksFilePath = path.join(
  __dirname,
  "../../static_data",
  "ToDoList.json"
);

let tasks = [];

let unknown_task = {
  uuid: "00000000-0000-0000-0000-000000000000",
  name: "Unknown Task",
  description: "Unknown Task",
  created: "1970-01-01T00:00:00Z",
  completed: null,
  complete: false,
};

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

// GET - all tasks
app.get("/todo", (req, res) => {
  complete = req.query["complete"];
  if (complete != undefined) {
    if (complete === "true") complete = true;
    if (complete === "false") complete = false;
    var filtered = tasks.filter((task) => task.complete === complete);
    res.json(filtered);
  } else {
    res.json(tasks);
  }
});

// GET - Invalid UUID
app.get("/todo/invalid-uuid", (req, res) => {
  res.sendStatus(400);
});

// GET - a task by UUID
app.get("/todo/:uuid", (req, res) => {
  var uuid = req.params["uuid"];
  var found = tasks.filter((task) => task.uuid === uuid);
  if (found.length == 1) res.json(found[0]);
  else res.json(unknown_task);
});

// PUT - Invalid UUID
app.put("/todo/completed/invalid-uuid", (req, res) => {
  res.sendStatus(400);
});

// PUT - Complete task
app.put("/todo/completed/:uuid", (req, res) => {
  var uuid = req.params["uuid"];
  var found = false;
  tasks.forEach((task) => {
    if (task.uuid == uuid) {
      found = true;
      if (task.completed) {
        res.json({ success: false, message: "Task already marked complete." });
      } else {
        task.complete = true;
        task.completed = Date.now();
        res.json({
          success: true,
          message: "This task has now been completed.",
        });
      }
    }
  });
  if (!found) res.json({ success: false, message: "Task not found." });
});

// POST - Create new task
app.post("/todo/addTask", (req, res) => {
  var task = {
    uuid: crypto.randomUUID(),
    name: req.query["name"],
    description: req.query["description"],
    created: Date.now(),
    completed: null,
    complete: false,
  };
  if (!task.name || !task.description) {
    res.sendStatus(400);
  } else {
    tasks.push(task);
    res.status(201).json({
      taskId: task.uuid,
      message: "Task " + task.name + " added successfully.",
    });
  }
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
