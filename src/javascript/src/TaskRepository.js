const UNKNOWN_TASK_ID = "00000000-0000-0000-0000-000000000000";
const UNKNOWN_TASK = {
  uuid: "00000000-0000-0000-0000-000000000000",
  name: "Unknown Task",
  description: "Unknown Task",
  created: "1970-01-01T00:00:00.000Z",
  completed: null,
  complete: false,
};

class TaskRepo {
  #tasks;

  constructor(tasks) {
    this.#tasks = tasks;
  }

  getAll() {
    return this.#tasks;
  }

  getById(id) {
    return this.#tasks.find((task) => task.uuid === id) ?? UNKNOWN_TASK;
  }

  getComplete(completeStatus) {
    return this.#tasks.filter((task) => task.complete === completeStatus);
  }

  completeTask(id) {
    this.#tasks = this.#tasks.map((task) => {
      if (task.uuid === id) {
        task.complete = true;
        task.completed = new Date().toISOString();
      }
      return task;
    });
  }

  createTask(taskDetails) {
    const newTask = {
      uuid: crypto.randomUUID(),
      created: new Date().toISOString(),
      completed: null,
      complete: false,
      name: taskDetails.name,
      description: taskDetails.description,
    };

    this.#tasks.push(newTask);
    return newTask;
  }
}

module.exports = {
  UNKNOWN_TASK_ID,
  TaskRepo,
};
