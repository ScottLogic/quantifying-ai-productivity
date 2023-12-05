const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

const writeEnable = false;

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
    const { complete } = req.query;

    // If 'complete' parameter is provided, filter tasks based on the value
    let filteredTasks = tasks;
    if (complete !== undefined) {
        const isComplete = complete.toLowerCase() === 'true';
        filteredTasks = tasks.filter(task => task.complete === isComplete);
    }

    res.json(filteredTasks);
});

const unknownTask = {
    uuid: "00000000-0000-0000-0000-000000000000",
    name: "Unknown Task",
    description: "Unknown Task",
    created: "1970-01-01T00:00:00.000Z",
    completed: null,
    complete: false
};

app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Validate if the provided UUID is valid
    if (!uuidValidate(uuid)) {
        const errorResponse = {
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.path
        };

        return res.status(400).json(errorResponse);
    }

    // Find the task with the specified UUID
    const task = tasks.find(task => task.uuid === uuid);

    if (task) {
        res.json(task);
    } else {
        // If the task is not found, return the unknownTask
        res.json(unknownTask);
    }
});

// New PUT endpoint to mark a task as complete using 'find' method
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;

    if (!uuidValidate(uuid)) {
        const errorResponse = {
            timestamp: new Date().toISOString(),
            status: 400,
            error: "Bad Request",
            path: req.path
        };

        return res.status(400).json(errorResponse);
    }

    const taskToComplete = tasks.find(task => task.uuid === uuid);

    if (taskToComplete) {
        // Check if the task is already marked as complete
        if (taskToComplete.complete) {
            return res.json({
                success: false,
                message: 'Task already marked complete.'
            });
        }

        // Mark the task as complete
        taskToComplete.completed = new Date().toISOString();
        taskToComplete.complete = true;

        // Save the updated tasks to the file if writeEnable is true
        if (writeEnable) {
            writeTasksToFile();
        }

        res.json({
            success: true,
            message: 'This task has now been completed.'
        });
    } else {
        // Return a 200 Success response indicating that the task was not found
        res.status(200).json({
            success: false,
            message: 'Task not found.'
        });
    }
});

// New POST endpoint to create a new task with query string parameters
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

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
        uuid: uuid.v4(),
        name,
        description,
        created: new Date().toISOString(),
        completed: null,
        complete: false
    };

    // Add the new task to the tasks array
    tasks.push(newTask);

    // Save the updated tasks to the file if writeEnable is true
    if (writeEnable) {
        writeTasksToFile();
    }

    res.status(201).json({
        message: `Task ${name} added successfully.`,
        taskId: newTask.uuid
    });
});

// Function to validate UUID
function uuidValidate(uuidString) {
    return uuid.validate(uuidString);
}

// Function to write tasks to the file
function writeTasksToFile() {
    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), (err) => {
        if (err) {
            console.error('Error writing tasks file:', err);
        }
    });
}

app.listen(8080, () => console.log('Example app listening on port 8080!'));