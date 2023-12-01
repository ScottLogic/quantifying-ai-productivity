const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

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

// GET endpoint to retrieve tasks
app.get('/todo', (req, res) => {
    const { complete } = req.query;
  
    if (complete === undefined) {
        res.status(200).json(tasks);
    } else {
        const filteredTasks = tasks.filter(task => task.complete === (complete === 'true'));
        res.status(200).json(filteredTasks);
    }
});
  
// GET endpoint to retrieve a task by uuid
app.get('/todo/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Check if the UUID is valid
    if (!uuid || !uuid.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
        return res.status(400).json({
            "timestamp": new Date().toISOString(),
            "status": 400,
            "error": "Bad Request",
            "path": `/todo/${uuid}`
        });
    }

    const task = tasks.find(task => task.uuid === uuid);

    if (task) {
        res.status(200).json(task);
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
  
// PUT endpoint to mark a task as complete
app.put('/todo/completed/:uuid', (req, res) => {
    const { uuid } = req.params;

    // Check if the UUID is valid
    if (!uuid || !uuid.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
        return res.status(400).json({
            "timestamp": new Date().toISOString(),
            "status": 400,
            "error": "Bad Request",
            "path": `/todo/completed/${uuid}`
        });
    }
    
    const taskIndex = tasks.findIndex(task => task.uuid === uuid);

    if (taskIndex !== -1) {
        if (tasks[taskIndex].complete) {
        res.status(200).json({ "success": false, "message": "Task already marked complete." });
        } else {
        tasks[taskIndex].completed = new Date().toISOString();
        tasks[taskIndex].complete = true;
        res.status(200).json({ "success": true, "message": "This task has now been completed." });
        }
    } else {
        res.status(200).json({ "success": false, "message": "Task not found." });
    }
});
  
// POST endpoint to create a new task
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    if (!name || !description) {
        res.status(400).json({
        "timestamp": new Date().toISOString(),
        "status": 400,
        "error": "Bad Request",
        "path": `${req.baseUrl}${req.path}?${req.originalUrl.split('?')[1]}`      
        });
    } else {
        const newTask = {
        "uuid": uuid.v4(),
        "name": name,
        "description": description,
        "created": new Date().toISOString(),
        "completed": null,
        "complete": false
        };

        tasks.push(newTask);

        res.status(201).json({
        "taskId": newTask.uuid,
        "message": `Task ${name} added successfully.`
        });
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));