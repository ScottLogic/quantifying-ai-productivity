const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

let tasks = [];

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

// Get all tasks with optional 'complete' parameter
app.get('/todo', (req, res) => {
    const { complete } = req.query;

    if (complete !== undefined) {
        // Filter tasks based on the 'complete' parameter
        const isComplete = complete.toLowerCase() === 'true';
        const filteredTasks = tasks.filter(task => task.complete === isComplete);
        res.json(filteredTasks);
    } else {
        // If 'complete' parameter is not provided, return all tasks
        res.json(tasks);
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));