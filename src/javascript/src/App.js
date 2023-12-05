const express = require('express');
const fs = require('fs');
const path = require('path');
const {json} = require("express");
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

// Get all tasks
app.get('/todo', (req, res) => {
    let retVal = []
    const completeFilter = req.query.complete;
    if (completeFilter == null) {
        retVal = tasks
    } else {
        let completeFilterBool = (completeFilter === "true")
        retVal = tasks.filter((t) => t.complete === (completeFilterBool))

    }

    res.json(retVal);
});

app.get('/todo/invalid-uuid', (req, res) => {
    errorMsg = JSON.stringify({
        timestamp: "2023-06-27T12:32:05.590Z",
        status: 400,
        error: "Bad Request",
        path: "/todo/invalid-uuid"
    })
    return res.status(400).send(errorMsg);
});

app.get('/todo/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    let retVal = tasks.find(item => item.uuid === uuid);
    if (!retVal) {
        const errorMsg = {
            uuid: "00000000-0000-0000-0000-000000000000",
            name: "Unknown Task",
            description: "Unknown Task",
            created: "1970-01-01T00:00:00.000Z",
            completed: null,
            complete: false
        }
        return res.json(errorMsg);
    } else {
        return res.json(retVal);
    }
});

app.put('/todo/completed/invalid-uuid', (req, res) => {
    errorMsg = JSON.stringify({
        timestamp: "2023-06-27T12:32:05.590Z",
        status: 400,
        error: "Bad Request",
        path: "/todo/completed/invalid-uuid"
    })
    return res.status(400).send(errorMsg);
});


app.put('/todo/completed/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    let target = tasks.find(item => item.uuid === uuid);
    const targetIdx = tasks.findIndex(item => item.uuid === uuid);
    if (!target) {
        const errorMsg = {
            "success": false,
            "message": "Task not found."
        }
        return res.json(errorMsg);
    }

    if (target.complete === true) {
        const errorMsg = {
            "success": false,
            "message": "Task already marked complete."
        }
        return res.json(errorMsg);
    }

    target.complete = true
    target.completed = Date.now();
    tasks[targetIdx] = { ...tasks[targetIdx], ...target };
    const retVal = {
        "success": true,
        "message": "This task has now been completed."
    }
    return res.json(retVal);

});

app.post('/todo/addTask', (req, res) => {
    const name = req.query.name;
    const description = req.query.description;

    const dt_timestamp = new Date().toISOString()

    if (!name && !description) {
        const errorMsg = {
            "timestamp": dt_timestamp,
            "status": 400,
            "error": "Bad Request",
            "path": "/todo/addTask?name=&description="
        }
        return res.status(400).json(errorMsg);
    }


    if (!name) {
        const errorMsg = {
            "timestamp": dt_timestamp,
            "status": 400,
            "error": "Bad Request",
            "path": "/todo/addTask"
        }
        return res.status(400).json(errorMsg);
    }

    if (!description) {
        const errorMsg = {
            "timestamp": dt_timestamp,
            "status": 400,
            "error": "Bad Request",
            "path": "/todo/addTask"
        }
        return res.status(400).json(errorMsg);
    }

    const newUUID = uuid.v1();
    const newTodo = {
        "uuid": newUUID,
        "name": name,
        "description": description,
        "created": dt_timestamp,
        "completed": null,
        "complete": false
    }

    tasks.push(newTodo);

    const retVal = {
        "taskId": newUUID,
        "message": `Task ${name} added successfully.`
    }
    return res.status(201).json(retVal);

});

app.listen(8080, () => console.log('Example app listening on port 8080!'));