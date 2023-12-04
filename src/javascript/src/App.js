const express = require("express");
const fs = require("fs");
const path = require("path");
const { z } = require("zod");

const app = express();
app.use(express.json());

const { TaskRepo, UNKNOWN_TASK_ID } = require("./TaskRepository");

/// Init
const tasksFilePath = path.join(
  __dirname,
  "../../static_data",
  "ToDoList.json"
);

// Load tasks from the JSON file
const loadTasksFromFile = () => {
  return JSON.parse(fs.readFileSync(tasksFilePath, "utf8"));
};

// Load tasks from the file when the server starts
const taskRepo = new TaskRepo(loadTasksFromFile());

/// Routes
// Get all tasks
app.get("/todo", (req, res) => {
  const complete = req.query.complete;

  if (complete === "false" || complete === "true") {
    const completeAsBool = complete === "true";
    res.json(taskRepo.getComplete(completeAsBool));
  } else {
    res.json(taskRepo.getAll());
  }
});

app.get("/todo/:id", (req, res) => {
  const result = uuidSchema.safeParse(req.params.id);
  if (!result.success) {
    return errorResponse(res, 400, req.originalUrl);
  }

  const task = taskRepo.getById(result.data);
  return res.json(task);
});

app.put("/todo/completed/:id", (req, res) => {
  const result = uuidSchema.safeParse(req.params.id);
  if (!result.success) {
    return errorResponse(res, 400, req.originalUrl);
  }

  const uuid = result.data;
  const task = taskRepo.getById(uuid);

  if (task.uuid === UNKNOWN_TASK_ID) {
    return res.json(createCompletedResponse(false, "Task not found."));
  }

  if (task.complete) {
    return res.json(
      createCompletedResponse(false, "Task already marked complete.")
    );
  } else {
    taskRepo.completeTask(uuid);
    return res.json(
      createCompletedResponse(true, "This task has now been completed.")
    );
  }
});

app.post("/todo/addTask", (req, res) => {
  const result = addTaskSchema.safeParse(req.query);

  if (!result.success) {
    return errorResponse(res, 400, req.originalUrl);
  }

  const task = taskRepo.createTask(result.data);

  res.status(201).json({
    taskId: task.uuid,
    message: `Task ${task.name} added successfully.`,
  });
});

/// Schemas
const uuidSchema = z.string().uuid();
const addTaskSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

/// response helpers
function createCompletedResponse(success, message) {
  return {
    success: success,
    message,
  };
}

function errorResponse(res, statusCode, path) {
  return res.status(statusCode).json({
    timestamp: new Date().toISOString(),
    status: statusCode,
    error: "Bad Request",
    path: path,
  });
}

app.listen(8080, () => console.log("Example app listening on port 8080!"));
