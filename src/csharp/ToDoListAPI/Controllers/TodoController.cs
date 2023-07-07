using System.Net;
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
    public IActionResult AddTask(string name, string description)
    {
        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(description))
        {
            return StatusCode((int)HttpStatusCode.BadRequest, ToDoTaskModel.GetUnknownTask());
        }
        var newTodoTask = _todoRepository.AddTask(
            new ToDoTaskModel() { TaskName = name, TaskDescription = description }
        );
        if (newTodoTask == null)
        {
            return StatusCode((int)HttpStatusCode.BadRequest, "Could not create the task");
        }
        return StatusCode((int)HttpStatusCode.OK, newTodoTask);
    }

    [HttpPut("completed/{id}")]
    public IActionResult CompleteTask(Guid id)
    {
        var todoItem = _todoRepository.GetTasksById(id);
        if (todoItem == null || todoItem.Uuid == Guid.Empty)
        {
            return StatusCode(
                (int)HttpStatusCode.OK,
                new { Message = $"Task {id} is not found", Body = ToDoTaskModel.GetUnknownTask() }
            );
        }
        if (todoItem.CompletedFlag)
        {
            return StatusCode((int)HttpStatusCode.NoContent, "Task already marked complete.");
        }
        if (!_todoRepository.CompleteTask(id))
        {
            return StatusCode((int)HttpStatusCode.BadRequest, "This task cannot be completed");
        }
        return StatusCode((int)HttpStatusCode.OK, "This task has now been completed");
    }
}
