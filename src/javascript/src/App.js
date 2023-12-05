const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');
const { v4: uuidv4, validate: isUuidValid } = require('uuid');

let tasks = [];

const UNKNOWN_TASK = {
    uuid: '00000000-0000-0000-0000-000000000000',
    name: 'Unknown Task',
    description: 'Unknown Task',
    created: '1970-01-01T00:00:00.000Z',
    completed: null,
    complete: false
};

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

const getAllTasks = (req, res) => {
    const { complete } = req.query;

    // Filter tasks based on the 'complete' query parameter
    if (complete === 'true') {
        const completedTasks = tasks.filter(task => task.complete);
        return res.json(completedTasks);
    } else {
        return res.json(tasks);
    }
};

// Get a task by UUID
const getTaskByUuid = async (req, res) => {
    const requestedUuid = req.params.uuid;

    // Validate the UUID
    if (!isUuidValid(requestedUuid)) {
        const errorResponse = {
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.path
        };
        return res.status(400).json(errorResponse);
    }

    try {
        const task = tasks.find(task => task.uuid === requestedUuid);

        if (task) {
            return res.status(200).json(task);
        } else {
            // Return a fixed value for unknown tasks
            return res.status(200).json(UNKNOWN_TASK);
        }
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
};

// Mark a task as complete by UUID
const markTaskAsComplete = async (req, res) => {
    const requestedUuid = req.params.uuid;

    // Validate the UUID
    if (!isUuidValid(requestedUuid)) {
        // Return a formatted error response for invalid UUID
        const errorResponse = {
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.path
        };
        return res.status(400).json(errorResponse);
    }

    try {
        const task = tasks.find(task => task.uuid === requestedUuid);

        if (task) {
            // Check if the task is already marked as complete
            if (task.complete) {
                return res.status(200).json({ success: false, message: 'Task already marked complete.' });
            }

            // Mark the task as complete
            task.completed = new Date().toISOString();
            task.complete = true;

            // Save the updated tasks
            const taskIndex = tasks.findIndex(task => task.uuid === requestedUuid);
            tasks[taskIndex] = task

            return res.status(200).json({ success: true, message: 'This task has now been completed.' });
        } else {
            // Return the specified JSON object for unknown tasks
            return res.status(200).json({ success: false, message: 'Task not found.' });
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

// Create a new task
const addTask = (req, res) => {
    const { name, description } = req.query;

    // Validate if both name and description parameters are supplied
    if (!name || !description) {
        const errorResponse = {
            timestamp: new Date().toISOString(),
            status: 400,
            error: 'Bad Request',
            path: req.originalUrl
        };
        return res.status(400).json(errorResponse);
    }

    // Create a new task
    const newTask = {
        uuid: uuidv4(),
        name: name,
        description: description,
        created: new Date().toISOString(),
        completed: null,
        complete: false
    };

    // Add the new task to the in-memory tasks array
    tasks.push(newTask);

    // Return the response
    const response = {
        taskId: newTask.uuid,
        message: `Task ${name} added successfully.`
    };

    return res.status(201).json(response);
};

app.get('/todo', getAllTasks);
app.get('/todo/:uuid', getTaskByUuid);
app.put('/todo/completed/:uuid', markTaskAsComplete);
app.post('/todo/addTask', addTask);

app.listen(8080, () => console.log('Example app listening on port 8080!'));