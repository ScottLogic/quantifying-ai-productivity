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

const unknownTask = {
    "uuid": "00000000-0000-0000-0000-000000000000",
    "name": "Unknown Task",
    "description": "Unknown Task",
    "created": "1970-01-01T00:00:00.000Z",
    "completed": null,
    "complete": false
}

const generateUuid = () => {
    const characters ='abcdefghijklmnopqrstuvwxyz0123456789';
    function generateString(length) {
        let result = '';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result;
    }
    return generateString(8)+'-'+generateString(4)+'-'+generateString(4)+'-'+generateString(4)+'-'+generateString(12)
}

//todo api
app.get('/todo/:uuid', (req, res) => {
    const re = /^([a-z0-9]{8}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{12})$/;
    if (!re.exec(req.params.uuid)){
        return res.status(400).send({
            "timestamp": new Date(Date.now()),
            "status": 400,
            "error": "Bad Request",
            "path": req.url
        })
    }

    let task = tasks.find(task => task.uuid === (req.params.uuid))
    if (task === undefined) {
        task = unknownTask
    }
    res.json(task);
});

app.get('/todo', (req, res) => {
    let tasksToShow = tasks

    if ('complete' in req.query) {
        let completeQuery = req.query.complete
        tasksToShow = tasksToShow.filter(task => task.complete === (completeQuery === 'true'))
        return res.json(tasksToShow);
    }
    res.json(tasks);
});

app.put('/todo/completed/:uuid', (req,res) => {
    const re = /^([a-z0-9]{8}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{12})$/;
    if (!re.exec(req.params.uuid)){
        return res.status(400).send({
            "timestamp": new Date(Date.now()),
            "status": 400,
            "error": "Bad Request",
            "path": req.url
        })
    }
    let task = tasks.find(task => task.uuid === (req.params.uuid))
    if (task === undefined) {
        return res.json({
            "success": false,
            "message": "Task not found."
        })
    }
    if (task.complete){
        return res.json({
            "success": false,
            "message": "Task already marked complete."
        })
    }
    task.complete = true
    task.completed = new Date(Date.now())
    res.json({
        "success": true,
        "message": "This task has now been completed."
    })
})

app.post('/todo/addTask', (req,res) => {
    if (!('name' in req.query) || !('description' in req.query)) {
        return res.status(400).send({
            "timestamp": new Date(Date.now()),
            "status": 400,
            "error": "Bad Request",
            "path": req.url
        })
    }

    if ((req.query.name.length === 0) || (req.query.description.length === 0)) {
        return res.status(400).send({
            "timestamp": new Date(Date.now()),
            "status": 400,
            "error": "Bad Request",
            "path": req.url
        })
    }

    const randomUuid = generateUuid()
    tasks.push({
        "uuid": randomUuid,
        "name": req.query.name,
        "description": req.query.description,
        "created": new Date(Date.now()),
        "completed": null,
        "complete": false
    })

    res.status(201).send({
        "taskId": randomUuid,
        "message": `Task ${req.query.name} added successfully.`
    })
})

app.listen(8080, () => console.log('Example app listening on port 8080!'));