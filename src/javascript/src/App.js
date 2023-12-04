const { v4: uuidv4 } = require('uuid');
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
            path: req.originalUrl
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
            res.json(requestedTask[0])
        }
    }
});

app.put('/todo/completed/:uuid?', (req, res) => {
    if (req.params.uuid == undefined || !uuidPattern.test(req.params.uuid)){
        res.status(400).json({ 
            timestamp: new Date(),
            error: "Bad Request", 
            status: 400,
            path: req.originalUrl
          });
    } else {
        const taskCompletedIndex = tasks.findIndex((task) => task.uuid.toString() == req.params.uuid)
        if (taskCompletedIndex == -1) {
            res.status(200).json({
                success: false,
                message: "Task not found."
            })
        } else {
            if (tasks[taskCompletedIndex].complete == true){
                res.status(200).json({
                    success: false,
                    message: "Task already marked complete."
                })  
            }
            else {
                tasks[taskCompletedIndex].completed = new Date();
                tasks[taskCompletedIndex].complete = true;

                res.status(200).json({
                    success: true,
                    message: "This task has now been completed."
                })  
            }
        }
    }
});


app.post('/todo/addTask/', (req, res) => {

    if (req.query.name == undefined ||req.query.name == "" || req.query.description == undefined|| req.query.description == ""){
        res.status(400).json({
            timestamp: new Date(),
            status: 400,
            error: "Bad Request",
            path: req.originalUrl
        })
    } else {
        const newTask = {
            uuid: uuidv4(),
            name: req.query.name,
            description: req.query.description,
            created: new Date(),
            completed: null,
            complete: false
        }
        tasks.push(newTask);
        res.status(201).json({
            taskId: newTask.uuid,
            message: "Task " + newTask.name + " added successfully."
        })
    }

});


app.listen(8080, () => console.log('Example app listening on port 8080!'));