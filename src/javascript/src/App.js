const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");

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

// return a boolean indicating validity of uuid
function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
}

const defaultUUID = "00000000-0000-0000-0000-000000000000";

// Load tasks from the file when the server starts
loadTasksFromFile();

// GET endpoint to filter tasks based on the 'complete' query parameter
app.get("/todo", (req, res) => {
  const { complete } = req.query;

  // Check if the 'complete' query parameter is provided and is a valid boolean
  if (complete !== undefined && (complete === "true" || complete === "false")) {
    const isComplete = JSON.parse(complete);
    const filteredTasks = tasks.filter((task) => task.complete === isComplete);
    res.status(200).json(filteredTasks);
  } else {
    // If 'complete' query parameter is not provided or invalid, return all tasks
    res.json(tasks);
  }
});

// Get tasks by id
app.get("/todo/:id", (req, res) => {
  const { id } = req.params;

  if (isValidUUID(id)) {
    // If id is provided, find the task with the specified id
    const task = tasks.find((task) => task.uuid === id);

    if (task) {
      res.json(task);
    } else {
      res.status(200).json({
        uuid: defaultUUID,
        name: "Unknown Task",
        created: new Date(0).getTime(),
        description: "Unknown Task",
        completed: null,
        complete: false,
      });
    }
  } else {
    res.status(400).json({ error: "Bad Request" });
  }
});

// POST endpoint to add a task
app.post("/todo/addTask", (req, res) => {
  const { name, description } = req.query;

  // Validate that the required parameters are present
  if (!name || !description) {
    return res.status(400).json({
      error: "Bad Request",
    });
  }

  const newTask = {
    uuid: v4(),
    name,
    description,
    created: new Date().toISOString(),
    completed: null,
    complete: false,
  };

  // Add the new task to the tasks array
  tasks.push(newTask);

  // Respond with the updated tasks array
  res.status(201).json({
    taskId: newTask.uuid,
    message: `Task ${name} added successfully.`,
  });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));

// PUT endpoint to update the complete status of a task by UUID
app.put("/todo/completed/:uuid", (req, res) => {
  const { uuid } = req.params;

  if (!isValidUUID(uuid)) {
    res.status(400).json({ error: "Bad Request" });
    return;
  }

  // Find the task with the specified UUID
  const taskIndex = tasks.findIndex((task) => task.uuid === uuid);

  if (taskIndex !== -1) {
    if (tasks[taskIndex].complete) {
      res
        .status(200)
        .json({ success: false, message: "Task already marked complete." });
    } else {
      // Update the complete status of the task
      tasks[taskIndex].complete = true;
      tasks[taskIndex].completed = new Date().toISOString();
      res
        .status(200)
        .json({ success: true, message: "This task has now been completed." });
    }
  } else {
    res.status(200).json({ success: false, message: "Task not found." });
  }
});
