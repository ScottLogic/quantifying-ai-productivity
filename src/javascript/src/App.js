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

// Change the existing GET endpoint to accept an optional boolean parameter named complete. The returned list of tasks should be filtered based on the value given for the parameter, if supplied.
app.get('/todo', (req, res) => {
    const { complete } = req.query;
    if (complete === 'true' || complete === 'false') {
        const filteredTasks = tasks.filter(task => task.complete.toString() === complete);
        res.json(filteredTasks);
    } else {
        res.json(tasks);
    }
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));