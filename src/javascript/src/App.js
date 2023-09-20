const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
    if(req.query.complete === 'true') {
        res.json(tasks.filter(task => task.complete === true));
    }
    else if(req.query.complete === 'false') {
        res.json(tasks.filter(task => task.complete === false));
    }
    else {
        res.json(tasks);
    }

});

// GET endpoint to retrieve a task by UUID
app.get('/todo/:uuid', (req, res) => {
    const requestedUuid = req.params.uuid;

    // Check if the requested UUID is in a valid format
    if (!isValidUUID(requestedUuid)) {
        return res.status(400).json({
            "timestamp": new Date().toISOString(),
            "status": 400,
            "error": "Bad Request",
            "message": "Invalid UUID format",
            "path": req.path
        });
    }

    // Find the task with the specified UUID in the 'tasks' array
    const task = tasks.find(task => task.uuid === requestedUuid);

    if (!task) {
        // If the task is not found, return a fixed UNKNOWN_TASK with status 200
        return res.status(200).json({
            "uuid": "00000000-0000-0000-0000-000000000000",
            "name": "Unknown Task",
            "description": "Unknown Task",
            "created": "1970-01-01T00:00:00.000Z",
            "completed": null,
            "complete": false
        });
    }

    // If the task is found, return it with status 200
    res.status(200).json(task);
});

// PUT endpoint to mark a task as complete by UUID
app.put('/todo/completed/:uuid', (req, res) => {
    const requestedUuid = req.params.uuid;

    // Check if the requested UUID is in a valid format
    if (!isValidUUID(requestedUuid)) {
        return res.status(400).json({
            "timestamp": new Date().toISOString(),
            "status": 400,
            "error": "Bad Request",
            "message": "Invalid UUID format"
        });
    }

    // Find the task with the specified UUID in the 'tasks' array
    const task = tasks.find(task => task.uuid === requestedUuid);

    if (!task) {
        // If the task is not found, return a 404 Not Found response
        return res.json({
            "success": false,
            "message": "Task not found."
        });
    }

    // Check if the task is already marked as complete
    if (task.complete) {
        return res.status(200).json({
            "success": false,
            "message": "Task already marked complete."
        });
    }

    // Mark the task as complete by setting 'completed' and 'complete' fields
    task.completed = new Date().toISOString();
    task.complete = true;

    // Return a success response
    res.status(200).json({
        "success": true,
        "message": "This task has now been completed."
    });
});

// POST endpoint to create a new task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    // Check if both 'name' and 'description' parameters are supplied
    if (!name || !description) {
        return res.status(400).json({
            "timestamp": new Date().toISOString(),
            "status": 400,
            "error": "Bad Request",
            "message": "Both 'name' and 'description' parameters are required.",
        });
    }

    // Generate a random UUID for the new task
    const taskId = uuidv4();

    // Create a new task object with the provided name and description
    const newTask = {
        uuid: taskId,
        name,
        description,
        created: new Date().toISOString(),
        completed: null,
        complete: false
    };

    // Add the new task to the 'tasks' array
    tasks.push(newTask);

    // Return a success response with the UUID of the new task
    res.status(201).json({
        "taskId": taskId,
        "message": `Task ${name} added successfully.`
    });
});



// Function to check if a string is a valid UUID
function isValidUUID(uuid) {
    const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidPattern.test(uuid);
}

app.listen(8080, () => console.log('Example app listening on port 8080!'));