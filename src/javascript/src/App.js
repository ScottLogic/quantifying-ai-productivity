const express = require("express");
const fs = require("fs");
const path = require("path");
const { z } = require("zod");

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

function filterCompleteTasks(tasks, isComplete) {
  const completeAsBool = isComplete === "true" ? true : false;
  return tasks.filter((task) => task.complete === completeAsBool);
}

// Get all tasks
app.get("/todo", (req, res) => {
  const complete_value = req.query.complete;

  if (complete_value === "false" || complete_value === "true") {
    res.json(filterCompleteTasks(tasks, complete_value));
  } else {
    res.json(tasks);
  }
});

const UNKNOWN_TASK = {
  uuid: "00000000-0000-0000-0000-000000000000",
  name: "Unknown Task",
  description: "Unknown Task",
  created: "1970-01-01T00:00:00.000Z",
  completed: null,
  complete: false,
};

const uuidSchema = z.string().uuid();

function findTask(tasks, id) {
  console.log({ tasks, id });
  return tasks.find((task) => task.uuid === id) ?? UNKNOWN_TASK;
}

app.get("/todo/:id", (req, res) => {
  const id = req.params.id;
  const result = uuidSchema.safeParse(id);
  if (result.success) {
    const task = findTask(tasks, id);

    res.json(task);
  } else {
    res.status(400).json({
      timestamp: new Date().toISOString(),
      status: 400,
      error: "Bad Request",
      path: req.path,
    });
  }
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
