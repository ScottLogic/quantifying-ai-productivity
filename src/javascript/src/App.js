const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

let tasks = [];

const UNKNOWN_TASK = {
    uuid: "00000000-0000-0000-0000-000000000000", 
    name: "Unknown Task",
    description: "Unknown Task",
    created: new Date(0).toISOString(),
    completed: null,
    complete: false
}

// Load tasks from the JSON file
const loadTasksFromFile = () => {
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading tasks file:', err);
            return;
        }
        try {
            tasks = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing tasks JSON:', error);
        }
    });
};

// Load tasks from the file when the server starts
loadTasksFromFile();

// Get all tasks
app.get('/todo', (req, res) => {
    res.json(tasks);
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));