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

// Get complete tasks
app.get('/todo/:uuid', (req, res) => {
    let tasksToShow = tasks.find(task => task.uuid === (req.params.uuid))
    if (tasksToShow === undefined) {
        tasksToShow = unknownTask
    }
    res.json(tasksToShow);
});

app.get('/todo', (req, res) => {
    let tasksToShow = tasks

    if ('complete' in req.query) {
        let completeQuery = req.query.complete
        tasksToShow = tasksToShow.filter(task => task.complete === (completeQuery === 'true'))
        res.json(tasksToShow);
        return;
    }
    res.json(tasks);
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));