const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const tasksFilePath = path.join(
    __dirname,
    "../../static_data",
    "ToDoList.json"
);

let todos = [];

// Load tasks from the JSON file
const loadTasksFromFile = () => {
    fs.readFile(tasksFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading tasks file:", err);
            return;
        }
        try {
            todos = JSON.parse(data);
        } catch (error) {
            console.error("Error parsing tasks JSON:", error);
        }
    });
};

// Load tasks from the file when the server starts
loadTasksFromFile();

// GET request to get all tasks
app.get("/todos", (req, res) => {
    let completeParam = req.query.complete;
    let filteredTodos;
    if (completeParam === "true") {
        filteredTodos = todos.filter((todo) => todo.complete === true);
    } else if (completeParam === "false") {
        filteredTodos = todos.filter((todo) => todo.complete === false);
    } else {
        filteredTodos = todos;
    }
    res.json(filteredTodos);
});

// GET request to get a task with a specific id
app.get("/todos/:id", (req, res) => {
    const todoId = req.params.id;
    const foundTodo = todos.find((todo) => todo.uuid === todoId);
    if (foundTodo) {
        res.json(foundTodo);
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

// PUT request to update a task
app.put("/todos/:id", (req, res) => {
    const todoId = req.params.id;
    const foundTodo = todos.find((todo) => todo.id === todoId);
    if (foundTodo) {
        foundTodo.complete = req.body.complete;
        res.json({ message: "Task updated" });
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

// POST request to add a new task
app.post("/todos", (req, res) => {
    const newTodo = {
        name: req.body.name,
        description: req.body.description,
        complete: false,
        uuid: uuid(),
    };
    todos.push(newTodo);
    res.json({ message: "Task added" });
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
