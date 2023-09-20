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

// Get complete tasks
app.get('/todo', (req, res) => {
    
    if (req.query.complete === undefined) {
        res.json(tasks);
        return;
    }
    tasksToShow = tasks.filter(task => task.complete === (req.query.complete === 'true'))
    res.json(tasksToShow);
});

app.listen(8080, () => console.log('Example app listening on port 8080!'));