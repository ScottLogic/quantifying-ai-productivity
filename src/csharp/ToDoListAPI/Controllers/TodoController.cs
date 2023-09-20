using Microsoft.AspNetCore.Mvc;
using ToDoListAPI.Interfaces;
using ToDoListAPI.Models;

namespace ToDoListAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class TodoController : ControllerBase
{
    private readonly IToDoRepository _todoRepository;

    public TodoController(IToDoRepository todoRepository)
    {
        _todoRepository = todoRepository ?? throw new ArgumentNullException(nameof(todoRepository));
    }

    [HttpGet]
    public IEnumerable<ToDoTaskModel> GetAllTasks(bool? complete)
    {
        if (complete == null) {
            return _todoRepository.GetAllTasks();
        } else if (complete == true) {
            return _todoRepository.GetCompleteTasks();
        } else {
            return _todoRepository.GetIncompleteTasks();
        }
    }

    // GET endpoint to get tasks by UUID
    [HttpGet("{id}")]
    public ActionResult<ToDoTaskModel> GetTaskById(Guid id)
    {
        var task = _todoRepository.GetTaskById(id);
        if (task == null)
        {
            // return an unknown task
            task = new ToDoTaskModel();
            task.TaskName = "Unknown Task";
            task.TaskDescription = "Unknown Task";
            // set epoch as creation date
            task.CreationDate = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        }
        return task;
    }

    // PUT endpoint to set task as complete
    [HttpPut("completed/{id}")]
    public ActionResult<SetTaskCompleteResponse> SetTaskComplete(Guid id)
    {
        SetTaskCompleteResponse response = new SetTaskCompleteResponse();
        bool? res = _todoRepository.SetTaskComplete(id);
        if (res == null)
        {
            response.success = false;
            response.message = "Task not found.";
        } else if (res == false) {
            response.success = false;
            response.message = "Task already marked complete.";
        } else {
            response.success = true;
            response.message = "This task has now been completed.";
        } 
        return response;
    }

    // POST endpoint to add a task
    [HttpPost("addTask")]
    public ActionResult<AddTaskResponse> AddTask(string name, string description) {
        // make sure name and description are not null
        if (name == null || description == null) {
            return BadRequest("Task name and description are required.");
        } 
        AddTaskResponse response = new AddTaskResponse();
        Guid taskId = _todoRepository.AddTask(name, description);
        response.taskId = taskId;
        response.message = "Task " + name + " added successfully.";
        // return code 201
        return CreatedAtAction(nameof(GetTaskById), new { id = taskId }, response);
    }
}
