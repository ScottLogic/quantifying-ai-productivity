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
    public IEnumerable<ToDoTaskModel> GetAllTasks([FromQuery]bool? complete = null)
    {
        return _todoRepository.GetAllTasks(complete);
    }

    [HttpGet("{id}")]
    public ActionResult<ToDoTaskModel> GetTask(Guid id)
    {
        var task = _todoRepository.GetTask(id);

        if (task is null)
        {
            return Ok(ToDoTaskModel.GetUnknownTask());
        }

        return task;
    }

    [HttpPut("completed/{id}")]
    public ActionResult<SuccessModel> CompleteTask(Guid id)
    {
        var task = _todoRepository.GetTask(id);

        if (task is null)
        {
            return Ok(new SuccessModel()
            {
                Success = false,
                Message = "Task not found."
            });
        }

        if(task.CompletedFlag)
        {
            return Ok(new SuccessModel()
            {
                Success = false,
                Message = "Task already marked complete."
            });
        }

        task.CompletedFlag = true;
        task.CompletionDate = DateTime.Now;

        _todoRepository.UpdateTask(task);

        return Ok(new SuccessModel()
        {
            Success = true,
            Message = "This task has now been completed."
        });
    }

    [HttpPost("addTask")]
    public IActionResult AddTask(string name = null, string description = null)
    {
        if(string.IsNullOrWhiteSpace(name))
        {
            return BadRequest(new ErrorResponse()
            {
                Timestamp = DateTime.UtcNow,
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = $"{nameof(name)} is required to add a task",
                Path = Request.Path.Value
            });
        }

        if (string.IsNullOrWhiteSpace(description))
        {
            return BadRequest(new ErrorResponse()
            {
                Timestamp = DateTime.UtcNow,
                StatusCode = StatusCodes.Status400BadRequest,
                ErrorMessage = $"{nameof(description)} is required to add a task",
                Path = Request.Path.Value
            });
        }

        var result = _todoRepository.AddTask(name, description);

        return StatusCode(StatusCodes.Status201Created, new TaskCreationResult()
        {
            TaskId = result,
            Message = $"Task {name} added successfully."
        });
    }
}
