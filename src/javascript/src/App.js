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

// Get all tasks with optional filtering by completion status
app.get('/todo', (req, res) => {
    const { complete } = req.query;
    if (complete !== undefined) {
        const filteredTasks = tasks.filter(task => task.complete === (complete === 'true'));
        res.json(filteredTasks);
    } else {
        res.json(tasks);
    }
});

// Get a task by uuid
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;
    if (!isValidUuid(uuid)) {
        res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.path,
            message: "Invalid UUID format."
        });
        return;
    }

    const task = tasks.find(task => task.uuid === uuid);
    if (!task) {
        res.status(200).json({
            "uuid": "00000000-0000-0000-0000-000000000000",
            "name": "Unknown Task",
            "description": "Unknown Task",
            "created": "1970-01-01T00:00:00.000Z",
            "completed": null,
            "complete": false
        });
        return;
    }

    res.json(task);
});

// Helper function to check if a string is a valid UUID
const isValidUuid = (uuid) => {
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    return uuidRegex.test(uuid);
};

// Mark a task as complete
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;
    if (!isValidUuid(uuid)) {
        res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.path,
            message: "Invalid UUID format."
        });
        return;
    }

    const taskIndex = tasks.findIndex(task => task.uuid === uuid);
    if (taskIndex !== -1) {
        if (!tasks[taskIndex].complete) {
            tasks[taskIndex].completed = new Date().toISOString();
            tasks[taskIndex].complete = true;
            res.json({
                success: true,
                message: "This task has now been completed."
            });
        } else {
            res.json({
                success: false,
                message: "Task already marked complete."
            });
        }
    } else {
        res.status(200).json({  // Change the status code to 200
            success: false,
            message: "Task not found."
        });
    }
});

// Add a new task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;
    if (!name || !description) {
        const fullPath = req.originalUrl; // Include the full request URL, including query parameters
        res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: fullPath,
            message: "Both name and description parameters are required."
        });
    } else {
        const newTask = {
            uuid: generateRandomUuid(),
            name,
            description,
            created: new Date().toISOString(),
            completed: null,
            complete: false
        };
        tasks.push(newTask);
        res.status(201).json({
            taskId: newTask.uuid,
            message: `Task ${name} added successfully.`
        });
    }
});

// Helper function to generate a random UUID
const generateRandomUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

app.listen(8080, () => console.log('Example app listening on port 8080!'));
