const express = require("express");
const fs = require("fs");
const path = require("path");

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

// Get all tasks
app.get("/todo", (req, res) => {
  res.json(tasks);
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
