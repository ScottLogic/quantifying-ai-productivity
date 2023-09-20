using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
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
    public IEnumerable<ToDoTaskModel> GetAllTasks([FromQuery] bool? complete)
    {
        return _todoRepository.GetAllTasks(complete);
    }

    [HttpGet("{id}")]
    public ToDoTaskModel GetTask(Guid id)
    {
        return _todoRepository.GetById(id) ?? ToDoTaskModel.GetUnknownTask();
    }

    [HttpPut("completed/{id}")]
    public CompleteTaskResponse MarkTaskCompleted(Guid id)
    {
        var task = _todoRepository.GetById(id);

        if (task == null)
        {
            return new CompleteTaskResponse { success = false, message = "Task not found."};
        }

        return _todoRepository.CompleteTask(id)
            ? new CompleteTaskResponse { success = true, message = "This task has now been completed." }
            : new CompleteTaskResponse { success = false, message = "Task already marked complete." };
    }

    [HttpPost("addTask")]
    public ActionResult CreateTask([Required] string name, [Required] string description)
    {
        var task = new ToDoTaskModel
        {
            Uuid = Guid.NewGuid(),
            TaskName = name,
            TaskDescription = description,
            CompletedFlag = false,
            CreationDate = DateTime.Now
        };

        _todoRepository.AddTask(task);

        return StatusCode(201, new TaskCreatedResponse
        {
            TaskId = task.Uuid,
            Message = $"Task {task.TaskName} added successfully."
        });
    }

}
