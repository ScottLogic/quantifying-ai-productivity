const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library for generating random UUIDs

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

// Get a task by UUID
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Validate UUID format
    const validUUID = /^\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/;
    if (!validUUID.test(uuid)) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            message: 'Invalid UUID format',
            path: req.path
        });
    }

    const task = tasks.find(task => task.uuid === uuid);

    if (task) {
        return res.status(200).json(task);
    } else {
        return res.status(200).json({
            "uuid": "00000000-0000-0000-0000-000000000000",
            "name": "Unknown Task",
            "description": "Unknown Task",
            "created": "1970-01-01T00:00:00.000Z",
            "completed": null,
            "complete": false
        });
    }
});

// Mark a task as complete by UUID
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Validate UUID format
    const validUUID = /^\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/;
    if (!validUUID.test(uuid)) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            message: 'Invalid UUID format',
            path: req.path
        });
    }

    const taskIndex = tasks.findIndex(task => task.uuid === uuid);

    if (taskIndex !== -1) {
        const task = tasks[taskIndex];

        if (task.complete) {
            return res.status(200).json({
                success: false,
                message: 'Task already marked complete.'
            });
        }

        // Mark the task as complete
        tasks[taskIndex] = {
            ...task,
            completed: new Date().toISOString(),
            complete: true
        };

        return res.status(200).json({
            success: true,
            message: 'This task has now been completed.'
        });
    } else {
        return res.status(200).json({
            success: false,
            message: 'Task not found.'
        });
    }
});

// Create a new task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    // Check if both name and description are provided
    if (!name || !description) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            message: 'Both name and description parameters are required.',
            path: req.path
        });
    }

    // Generate a random UUID for the new task
    const taskId = uuidv4();

    // Create a new task object
    const newTask = {
        uuid: taskId,
        name: name,
        description: description,
        created: new Date().toISOString(),
        completed: null,
        complete: false
    };

    // Add the new task to the tasks array
    tasks.push(newTask);

    return res.status(201).json({
        taskId: taskId,
        message: `Task ${name} added successfully.`
    });
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));