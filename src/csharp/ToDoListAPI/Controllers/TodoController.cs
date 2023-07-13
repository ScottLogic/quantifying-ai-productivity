using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
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
    public IEnumerable<ToDoTaskModel> GetAllTasks(bool? complete = null)
    {
        return _todoRepository.GetAllTasks(complete);
    }

    [HttpGet("{id}")]
    public ToDoTaskModel GetTasksById(Guid id)
    {
        return _todoRepository.GetTasksById(id);
    }

    [HttpPost("addtask")]
    public IActionResult AddTask([BindRequired] string name, [BindRequired] string description)
    {
        var newTodoTask = _todoRepository.AddTask(
            new ToDoTaskModel() { TaskName = name, TaskDescription = description }
        );
        if (newTodoTask == null)
        {
            return StatusCode((int)HttpStatusCode.BadRequest, "Could not create the task.");
        }
        return StatusCode(
            (int)HttpStatusCode.Created,
            new
            {
                taskId = newTodoTask.Uuid,
                message = $"Task {newTodoTask.TaskName} added successfully."
            }
        );
    }

    [HttpPut("completed/{id}")]
    public IActionResult CompleteTask(Guid id)
    {
        var todoItem = _todoRepository.GetTasksById(id);
        if (todoItem == null || todoItem.Uuid == Guid.Empty)
        {
            return StatusCode(
                (int)HttpStatusCode.OK,
                new { success = false, message = "Task not found." }
            );
        }
        if (todoItem.CompletedFlag)
        {
            return StatusCode(
                (int)HttpStatusCode.OK,
                new { success = false, message = "Task already marked complete." }
            );
        }
        if (!_todoRepository.CompleteTask(id))
        {
            return StatusCode((int)HttpStatusCode.BadRequest, "This task cannot be completed.");
        }
        return StatusCode(
            (int)HttpStatusCode.OK,
            new { success = true, message = "This task has now been completed." }
        );
    }
}
