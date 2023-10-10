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

// Get all tasks with optional 'complete' filter
app.get('/todo', (req, res) => {
    const { complete } = req.query;
    
    if (complete === 'true' || complete === 'false') {
        const filteredTasks = tasks.filter(task => task.complete === (complete === 'true'));
        res.json(filteredTasks);
    } else {
        res.json(tasks);
    }
});

const { v4: uuidv4, validate: validateUUID } = require('uuid');

// Assuming 'tasks' is an array of tasks

// GET endpoint to get a specific task by UUID
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Check if the UUID is valid
    if (!validateUUID(uuid)) {
        return res.status(400).json({ error: 'Invalid UUID format.' });
    }

    // Find the task with the given UUID
    const task = tasks.find(task => task.uuid === uuid);

    if (task) {
        // Task with the given UUID found
        res.json(task);
    } else {
        // Task with the given UUID not found
        res.status(404).json({ message: 'UNKNOWN_TASK' });
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));