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
app.get('/todo', (req, res) => {
    const complete = req.query.complete === 'true';
    const filteredTasks = tasks.filter(task => {
        if (complete !== undefined) {
            return task.complete === complete;
        }
        return true; 
    });
    res.json(filteredTasks);
});

const { v4: uuidv4 } = require('uuid'); // Import the uuid library for generating valid UUIDs

app.get('/todo/:uuid', (req, res) => {
    const requestedUuid = req.params.uuid;

    // Validate the UUID format
    const uuidRegex = /^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i;
    if (!uuidRegex.test(requestedUuid)) {
        // Invalid UUID format
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.path
        });
    }

    // Find the task with the specified UUID
    const task = tasks.find(task => task.uuid === requestedUuid);

    if (task) {
        res.json(task);
    } else {
        const unknownTask = {
            uuid: "00000000-0000-0000-0000-000000000000",
            name: "Unknown Task",
            description: "Unknown Task",
            created: "1970-01-01T00:00:00.000Z",
            completed: null,
            complete: false
        };
        res.json(unknownTask);
    }
});

app.put('/todo/completed/:uuid', (req, res) => {
    const requestedUuid = req.params.uuid;

    // Validate the UUID format
    const uuidRegex = /^[a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}$/i;
    if (!uuidRegex.test(requestedUuid)) {
        // Invalid UUID format
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.path
        });
    }

    // Find the task with the specified UUID
    const taskIndex = tasks.findIndex(task => task.uuid === requestedUuid);

    if (taskIndex !== -1) {
        const task = tasks[taskIndex];

        // Check if the task is already marked as complete
        if (task.complete) {
            return res.status(200).json({
                success: false,
                message: 'Task already marked complete.'
            });
        }

        // Mark the task as complete
        task.completed = new Date().toISOString();
        task.complete = true;

        // Update the task in the tasks array
        tasks[taskIndex] = task;

        // Respond with success message
        return res.status(200).json({
            success: true,
            message: 'This task has now been completed.'
        });
    } else {
        // Task not found
        return res.status(200).json({
            success: false,
            message: 'Task not found.'
        });
    }
});




app.listen(8080, () => console.log('Example app listening on port 8080!'));