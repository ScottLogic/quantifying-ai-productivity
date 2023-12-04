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

// Get all tasks
// app.get('/todo', (req, res) => {
//     res.json(tasks);
// });

app.get('/todo', (req, res) => {
    const { complete } = req.query;

    // If 'complete' parameter is provided, filter tasks based on its value
    if (complete !== undefined) {
        const isComplete = JSON.parse(complete.toLowerCase()); // Convert to boolean
        const filteredTasks = tasks.filter(task => task.complete === isComplete);
        res.json(filteredTasks);
    } else {
        // If 'complete' parameter is not provided, return all tasks
        res.json(tasks);
    }
});

const UNKNOWN_TASK = {
    "uuid": "00000000-0000-0000-0000-000000000000",
    "name": "Unknown Task",
    "description": "Unknown Task",
    "created": "1970-01-01T00:00:00.000Z",
    "completed": null,
    "complete": false
};

// New GET endpoint to retrieve a specific task by UUID
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Validate the UUID format
    const uuidRegex = /^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i;
    if (!uuidRegex.test(uuid)) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.originalUrl
        });
    }

    // Find the task with the given UUID
    const task = tasks.find(task => task.uuid === uuid);

    if (task) {
        res.json(task);
    } else {
        res.json(UNKNOWN_TASK);
    }
});

// New PUT endpoint to mark a specific task as complete by UUID
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Validate the UUID format
    const uuidRegex = /^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i;
    if (!uuidRegex.test(uuid)) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.originalUrl
        });
    }

    // Find the task with the given UUID
    const taskIndex = tasks.findIndex(task => task.uuid === uuid);

    if (taskIndex !== -1) {
        // Check if the task is already marked as complete
        if (tasks[taskIndex].complete) {
            return res.json({
                success: false,
                message: "Task already marked complete."
            });
        }

        // Mark the task as complete
        tasks[taskIndex].completed = new Date().toISOString();
        tasks[taskIndex].complete = true;

        return res.json({
            success: true,
            message: "This task has now been completed."
        });
    } else {
        return res.json({
            success: false,
            message: "Task not found."
        });
    }
});

const { v4: uuidv4 } = require('uuid');

// New POST endpoint to create a new task with name and description parameters
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    // Validate if both name and description parameters are supplied
    if (!name || !description) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.originalUrl
        });
    }

    // Generate a new UUID for the task
    const newTaskId = uuidv4();

    // Create a new task object
    const newTask = {
        uuid: newTaskId,
        name: name,
        description: description,
        created: new Date().toISOString(),
        completed: null,
        complete: false
    };

    // Add the new task to the tasks array
    tasks.push(newTask);

    // Respond with the new task ID and a success message
    res.status(201).json({
        taskId: newTaskId,
        message: `Task ${name} added successfully.`
    });
});


app.listen(8080, () => console.log('Example app listening on port 8080!'));