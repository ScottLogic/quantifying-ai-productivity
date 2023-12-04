const { timeStamp } = require('console');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

const uuidPattern = new RegExp('^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$', 'i');

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
    if (req.query.complete == undefined){
        res.json(tasks);
    } else {
        res.json(tasks.filter((task) => (task.complete).toString() == req.query.complete));
    }
});

app.get('/todo/:uuid?', (req, res) => {
    if (req.params.uuid == undefined || !uuidPattern.test(req.params.uuid)){
        res.status(400).json({ 
            timestamp: new Date().valueOf(),
            message: "Bad Request", 
            status: 400,
            path: "/todo/invalid-uuid"
          });
    } else {
        const requestedTask = tasks.filter((task) => task.uuid.toString() == req.params.uuid)
        if (requestedTask.length == 0) {
            res.status(200).json({
                uuid: "00000000-0000-0000-0000-000000000000",
                name: "Unknown Task",
                description: "Unknown Task",
                created: "1970-01-01T00:00:00.000Z",
                completed: null,
                complete: false
            }

            )
        }else {
            res.json(requestedTask)
        }
    }
});



app.listen(8080, () => console.log('Example app listening on port 8080!'));