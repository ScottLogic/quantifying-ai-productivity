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
    public IEnumerable<ToDoTaskModel> GetTasks(bool? complete)
    {
        if (complete != null && complete == true)
        {
            return _todoRepository.GetTasksByCompletionStatus(true);
        }
        else if (complete != null)
        {
            return _todoRepository.GetTasksByCompletionStatus(false);
        }
        return _todoRepository.GetAllTasks();
    }

    [HttpGet("{id}")]
    public ToDoTaskModel GetTaskById(Guid id)
    {
        return _todoRepository.GetTaskById(id);
    }

    [HttpPut("completed/{id}")]
    public IActionResult CompleteTaskById(Guid id)
    {
        return Ok(_todoRepository.CompleteTaskById(id));
    }

    [HttpPost("addTask")]
    public IActionResult CreateTask(string name, string description)
    {
        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(description))
        {
            return BadRequest(
                new ErrorResponse()
                {
                    Status = 400,
                    Error = "Bad Request",
                    Path = Request.Path.Value + Request.QueryString.Value
                }
            );
        }
        return StatusCode(201, _todoRepository.CreateTask(name, description));
    }
}
