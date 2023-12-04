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

// Returns tasks filtered on "complete" property. Argument defines if true or false
const returnTaskWithComplete = (bool) => {
    let completedTasks = [];
    for (i in tasks) {
        if ('complete' in tasks[i] && tasks[i].complete === bool) {
            completedTasks.push(tasks[i]);
        }
    }
    return completedTasks;
};

// Get tasks. Handles ?complete parameter
app.get('/todo', (req, res) => {
    switch(req.query.complete) {
        case "true":
            console.log("was true");
            res.json(returnTaskWithComplete(true));
            break;
        case "false":
            console.log("was false");
            res.json(returnTaskWithComplete(false));
            break;
        default:
            console.log("was nada");
            res.json(tasks);
            break;
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));