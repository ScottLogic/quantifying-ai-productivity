const appTasks = require("./App.tasks.function");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const tasksFilePath = path.join(
  __dirname,
  "../../static_data",
  "ToDoList.json"
);

let tasks = [];

const initialiseApp = () => {
  appTasks(app, tasks);
  app.listen(8080, () => console.log("Example app listening on port 8080!"));
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
    initialiseApp();
  });
};

// Load tasks from the file when the server starts
loadTasksFromFile();
