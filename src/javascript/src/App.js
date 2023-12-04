const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
    // Retrieve the optional boolean parameter from the query string
    const isComplete = req.query.complete === 'true';

    if (isComplete) {
        res.json(tasks.filter(task => task.complete === true));
    } else {
        res.json(tasks);
    }
});

app.get('/todo/:uuid', (req, res) => {
    // Access the path parameter using req.params
    const uuid = req.params.uuid;
    
    const isValid = isValidUUID(uuid);

    if (isValid) {

        const filteredTasks = tasks.filter(task => task.uuid === uuid);

        if (filteredTasks.length > 0) {
            res.json(filteredTasks[0])
        } else {
            res.json({
                "uuid": "00000000-0000-0000-0000-000000000000",
                "name": "Unknown Task",
                "description": "Unknown Task",
                "created": "1970-01-01T00:00:00.000Z",
                "completed": null,
                "complete": false
            })
        }
    } else {
        res.status(400).json({
            "timestamp": new Date().toISOString,
            "status": 400,
            "error": "Bad Request",
            "path": "/todo/" + uuid 
        })
    }
});

app.put('/todo/completed/:uuid', (req, res) => {
    // Access the path parameter using req.params
    const uuid = req.params.uuid;
    
    const isValid = isValidUUID(uuid);
    
    if (isValid) {

        const index = tasks.findIndex(task => task.uuid === uuid);

        if (index !== -1) {
            if (tasks[index].complete === true) {
                res.json({
                    "success": false,
                    "message": "Task already marked complete."
                })
            } else {
                tasks[index].complete = true;
                tasks[index].completed = new Date().toISOString;
                
                res.json({
                    "success": true,
                    "message": "This task has now been completed."
                })
            }
        } else {
            console.log("in here")
            res.json({
                "success": false,
                "message": "Task not found."
            })
        }
    } else {
        res.status(400).json({
            "timestamp": new Date().toISOString,
            "status": 400,
            "error": "Bad Request",
            "path": "/todo/completed/" + uuid 
        })
    }
});

// POST endpoint to create a new task
app.post('/todo/addTask', (req, res) => {
  // Extract task name and description from the request body
  const { name, description } = req.query;
  const currentTime = new Date().toISOString();

  if (name && description) {
    // Generate a random UUID for the new task
    const taskId = uuidv4();

    // Get the current time

    // Create a new task object
    const newTask = {
        uuid: taskId,
        name: name,
        description: description,
        created: currentTime,
        completed: null,
        complete: false
    };

    // Add the new task to the tasks array
    tasks.push(newTask);

    // Response body
    const responseBody = {
        taskId: taskId,
        message: `Task ${name} added successfully.`
    };

    // Ssend the response with the new task UUID and a message
    res.status(201).json(responseBody);
  } else {
    res.status(400).json(
        {
            "timestamp": currentTime,
            "status": 400,
            "error": "Bad Request",
            "path": !name && !description ? "/todo/addTask?name=&description=" : req.path
        }
    )
  }
});

function isValidUUID(uuid) {
    const uuidPattern = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
  return uuidPattern.test(uuid);
}

app.listen(8080, () => console.log('Example app listening on port 8080!'));