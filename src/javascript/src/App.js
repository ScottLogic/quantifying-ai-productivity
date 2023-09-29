const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4, validate: uuidValidate} = require('uuid');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

let tasks = [];

let UNKNOWN_TASK = {
    "uuid": "00000000-0000-0000-0000-000000000000",
    "name": "Unknown Task",
    "description": "Unknown Task",
    "created": new Date(0).toISOString(),
    "completed": null,
    "complete": false
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

// Get all tasks
app.get('/todo', (req, res) => {
    const { complete } = req.query;
    
    if(complete === undefined) {
        res.json(tasks);
    } else {
        const isComplete = complete === 'true';
        res.json(tasks.filter((task) => { return task.complete === isComplete }));
    }
});

// Get task by uuid
app.get('/todo/:uuid', (req, res) => {
    const uuid = req.params.uuid;

    if (uuidValidate(uuid)) {
        const index = tasks.findIndex((task) => task.uuid === uuid);
        if (index === -1) {
            res.status(200).json(UNKNOWN_TASK);
        } else {
            res.status(200).json(tasks[index]);
        }
        return res;
    }
    res.status(400).json({
        "timestamp": new Date().toISOString(),
        "status": 400,
        "error": "Bad Request",
        "path": req.path
    });
});

// Put to mark task as complete
app.put('/todo/completed/:uuid', (req, res) => {
    const uuid = req.params.uuid;

    if (uuidValidate(uuid)) {
        const index = tasks.findIndex((task) => task.uuid === uuid);
        if (index === -1) {
            res.status(200).json({
                "success": false,
                "message": "Task not found."
            });
        } else {
            if (tasks[index].complete === true) {
                res.status(200).json({
                    "success": false,
                    "message": "Task already marked complete."
                });
            } else {
                tasks[index].complete = true;
                tasks[index].completed = new Date().toISOString();
                res.status(200).json({
                    "success": true,
                    "message": "This task has now been completed."
                });
            }
        }
        return res;
    }
    res.status(400).json({
        "timestamp": new Date().toISOString(),
        "status": 400,
        "error": "Bad Request",
        "path": req.path
    });
});

//Post to add a new task to the list
app.post("/todo/addTask", (req, res) => {
    const { name, description } = req.query;

    if (!name || !description) {
        res.status(400).json({
            "timestamp": new Date().toISOString(),
            "status": 400,
            "error": "Bad Request",
            "path": req.url
        });
        return;
    } else {
        let uuid = uuidv4();
        console.log ("new uuid = " + uuid);
        let task = {
            "uuid": uuid,
            "name": name,
            "description": description,
            "created": new Date().toISOString(),
            "completed": null,
            "complete": false
        }
        tasks.push(task);
        res.status(201).json({
            "taskId": uuid,
            "message": "Task " + name + " added successfully."
        });
    }
});


app.listen(8080, () => console.log('Example app listening on port 8080!'));