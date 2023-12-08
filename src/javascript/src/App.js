const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require("body-parser")
const {  v4: uuidv4, validate: isUuid } = require('uuid');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const tasksFilePath = path.join(__dirname, '../../static_data', 'ToDoList.json');

let todos = [];

// Load tasks from the JSON file
const loadTasksFromFile = () => {
    fs.readFile(tasksFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading tasks file:', err);
            return;
        }
        try {
            todos = JSON.parse(data);
        } catch (error) {
            console.error('Error parsing tasks JSON:', error);
        }
    });
};

const UNKOWN_TASK = {
    "uuid": "00000000-0000-0000-0000-000000000000",
    "name": "Unknown Task",
    "description": "Unknown Task",
    "created": "1970-01-01T00:00:00.000Z",
    "completed": null,
    "complete": false
}

// Load tasks from the file when the server starts
loadTasksFromFile();

// Middleware to validate UUID format
const validateUuid = (req, res, next) => {
    const { uuid } = req.params;
  
    if (!isUuid(uuid)) {
      return res.status(400).json({ error: 'Bad Request' });
    }
  
    next();
  };
  
  // Get all todos filterable by an optional complete property
  app.get('/todo', (req, res) => {
    const { complete } = req.query;
  
    if (complete !== undefined) {
      const filteredTodos = todos.filter(todo => todo.complete === (complete === 'true'));
      return res.json(filteredTodos);
    }
  
    res.json(todos);
  });
  
  // Get a single todo by its UUID
  app.get('/todo/:uuid', validateUuid, (req, res) => {
    const { uuid } = req.params;
    const todo = todos.find(todo => todo.uuid === uuid);
  
    if (!todo) {
      return res.status(200).json(UNKOWN_TASK);
    }
  
    res.json(todo);
  });
  
  // Update the complete property on a todo
  app.put('/todo/completed/:uuid', validateUuid, (req, res) => {
    const { uuid } = req.params;
    const updatedTodo = req.body;
  
    const todo = todos.find(todo => todo.uuid === uuid)
    if (!todo) {
        return res.status(200).json({
            "success": false,
            "message": "Task not found."
        });
    }

    if (todo.completed) {
        return res.status(200).json({
            "success": false,
            "message": "Task already marked complete."
        })
    }

    todos = todos.map(todo => (todo.uuid === uuid ? { ...todo, complete: true, completed:  (new Date()).toISOString()} : todo));
  
    res.json({ "success": true, message: 'This task has now been completed.' });
  });

  // Create a new todo with auto-generated UUID
app.post('/todo/addTask', (req, res) => {
    const { name, description } = req.query;

    if ((name ?? "") === "" || (description ?? "") === "") {
        return res.status(400).json({ error: 'Bad Request' });
    }

    const newTodo = { uuid: uuidv4(), name, description, created: (new Date()).toISOString(), complete: false, completed: null };
  
    todos.push(newTodo);
  
    res.status(201).json({
        taskId: newTodo.uuid,
        message: `Task ${newTodo.name} added successfully.`
    });
  });

app.listen(8080, () => console.log('Example app listening on port 8080!'));