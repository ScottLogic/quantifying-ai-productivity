const UUID = require("./UUID.utility");
const Task = require("./Task.class");

module.exports = function (app, startUpTasks) {
  let tasks = startUpTasks.map((startUpTask) => new Task(startUpTask));

  const byUUIDMatch = (uuid) => (task) => task.uuid === uuid;

  const byComplete = (complete) => (task) => task.complete === complete;

  const markBadRequest = (res) =>
    res.status(400).json({ error: "Bad Request" });

  const markOKWithMessage = (res, success, message) =>
    res.status(200).json({ success, message });

  // GET all tasks, optionally filtered by completed state, using query param
  app.get("/todo", ({ query }, res) => {
    const { complete } = query;
    if (["true", "false"].includes(complete)) {
      const filteredTasks = tasks.filter(byComplete(JSON.parse(complete)));
      return res.status(200).json(filteredTasks);
    }
    res.json(tasks);
  });

  // GET a task using UUID from route params
  app.get("/todo/:uuid", ({ params }, res) => {
    const { uuid } = params;

    if (!UUID.isValid(uuid)) {
      return markBadRequest(res);
    }

    const task = tasks.find(byUUIDMatch(uuid));
    if (!task) {
      return res.status(200).json(Task.blankTask);
    }
    res.json(task);
  });

  // POST a new task
  app.post("/todo/addTask", ({ query }, res) => {
    const { name, description } = query;
    const newTask = new Task({ name, description });
    if (!newTask.isValid()) {
      return markBadRequest(res);
    }
    tasks.push(newTask);
    res.status(201).json({
      taskId: newTask.uuid,
      message: `Task ${name} added successfully.`,
    });
  });

  // PUT a task into a completed state
  app.put("/todo/completed/:uuid", ({ params }, res) => {
    const { uuid } = params;

    if (!UUID.isValid(uuid)) {
      return markBadRequest(res);
    }

    const task = tasks[tasks.findIndex(byUUIDMatch(uuid))];
    if (!task) {
      return markOKWithMessage(res, false, "Task not found.");
    }
    if (task.complete) {
      return markOKWithMessage(res, false, "Task already marked complete.");
    }
    task.markComplete();
    return markOKWithMessage(res, true, "This task has now been completed.");
  });
};
