const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4, validate: isUuid } = require('uuid'); // Import the 'validate' function from 'uuid'


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


// Get all tasks or filtered tasks based on 'complete' query parameter
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
    const foundTask = tasks.find(task => task.uuid === uuid);

    if (!isUuid(uuid)) { // Check if the UUID is in a valid format
        return res.status(400).json({
            "timestamp": new Date().toISOString(),
            "status": 400,
            "error": "Bad Request",
            "path": `/todo/${uuid}`,
            "message": "Invalid UUID format."
        });
    }

    if (foundTask) {
        res.json(foundTask);
    } else {
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
    const { uuid } = req.params;
    const foundIndex = tasks.findIndex(task => task.uuid === uuid);

    if (!isUuid(uuid)) { // Check if the UUID is in a valid format
        return res.status(400).json({
            "timestamp": new Date().toISOString(),
            "status": 400,
            "error": "Bad Request",
            "path": `/todo/completed/${uuid}`,
            "message": "Invalid UUID format."
        });
    }

    if (foundIndex !== -1) {
        if (tasks[foundIndex].complete) {
            res.json({
                "success": false,
                "message": "Task already marked complete."
            });
        } else {
            tasks[foundIndex].completed = new Date().toISOString();
            tasks[foundIndex].complete = true;
            res.json({
                "success": true,
                "message": "This task has now been completed."
            });
            fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), err => {
                if (err) {
                    console.error('Error writing tasks file:', err);
                }
            });
        }
    } else {
        res.status(200).json({
            "success": false,
            "message": "Task not found."
        });
    }
});

// Create a new task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;
    if (!name || !description) {
        return res.status(400).json({
            "timestamp": new Date().toISOString(),
            "status": 400,
            "error": "Bad Request",
            "path": `/todo/addTask?${req._parsedUrl.query}`, // Include the query string from the request
            "message": "Both 'name' and 'description' parameters are required."
        });
    }

    const newTask = {
        "uuid": uuidv4(),
        "name": name,
        "description": description,
        "created": new Date().toISOString(),
        "completed": null,
        "complete": false
    };

    tasks.push(newTask);

    fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2), err => {
        if (err) {
            console.error('Error writing tasks file:', err);
        }
    });

    res.status(201).json({
        "taskId": newTask.uuid,
        "message": `Task ${name} added successfully.`
    });
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));