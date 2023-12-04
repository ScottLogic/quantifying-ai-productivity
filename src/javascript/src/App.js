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

// Get tasks with optional filtering by completion status
app.get('/todo', (req, res) => {
    const { complete } = req.query;

    if (complete === undefined) {
        // If no 'complete' parameter is provided, return all tasks
        res.json(tasks);
    } else {
        // Filter tasks based on the 'complete' parameter
        const filteredTasks = tasks.filter(task => task.complete === (complete === 'true'));
        // Always return an array, even if it's empty
        res.json(filteredTasks || []);
    }
});

// Get a task by uuid
app.get('/todo/:uuid', (req, res) => {
    const requestedUuid = req.params.uuid;

    // Validate the UUID format
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    if (!uuidRegex.test(requestedUuid)) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.path
        });
    }

    // Find the task with the given UUID
    const foundTask = tasks.find(task => task.uuid === requestedUuid);

if (foundTask) {
    // If the task is found, return it
    res.json(foundTask);
} else {
    // If the task is not found, return the fixed UNKNOWN_TASK with HTTP status 200
    res.status(200).json({
        "uuid": "00000000-0000-0000-0000-000000000000",
        "name": "Unknown Task",
        "description": "Unknown Task",
        "created": "1970-01-01T00:00:00.000Z",
        "completed": null,
        "complete": false
    });
}
});

// Mark a task as complete by uuid
app.put('/todo/completed/:uuid', (req, res) => {
    const requestedUuid = req.params.uuid;

    // Validate the UUID format
    const uuidRegex = /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
    if (!uuidRegex.test(requestedUuid)) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.path
        });
    }

    // Find the task with the given UUID
    const taskIndex = tasks.findIndex(task => task.uuid === requestedUuid);

    if (taskIndex !== -1) {
        // If the task is found, check if it's already marked as complete
        if (tasks[taskIndex].complete) {
            return res.json({
                success: false,
                message: 'Task already marked complete.'
            });
        }

        // Mark the task as complete
        tasks[taskIndex].complete = true;
        tasks[taskIndex].completed = new Date().toISOString();

        // Save the updated tasks to the file (if persistence is needed)
        fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
            if (err) {
                console.error('Error writing tasks file:', err);
            }
        });

        res.json({
            success: true,
            message: 'This task has now been completed.'
        });
    } else {
        // If the task is not found, return a 404 error
        res.json({
            success: false,
            message: 'Task not found.'
        });
    }
});

const { v4: uuidv4 } = require('uuid');

// Create a new task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    // Check if both name and description parameters are provided
    if (!name || !description) {
        return res.status(400).json({
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
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

    // Add the new task to the list
    tasks.push(newTask);

    // Save the updated tasks to the file (if persistence is needed)
    fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
        if (err) {
            console.error('Error writing tasks file:', err);
        }
    });

    // Return a response with the new task's UUID and a success message
    res.status(201).json({
        taskId: newTaskId,
        message: `Task ${name} added successfully.`
    });
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));
