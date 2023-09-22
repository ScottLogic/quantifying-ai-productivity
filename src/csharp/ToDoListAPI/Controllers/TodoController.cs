using System.ComponentModel;
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
    public IEnumerable<ToDoTaskModel> GetAllTasks([FromQuery(Name = "complete")] bool? isComplete = null)
    {
        return _todoRepository.GetAllTasks(isComplete);
    }

    [HttpGet("{uuid}")]
    public ActionResult<ToDoTaskModel> GetTaskByUuid(String uuid)
    {
        if (!Guid.TryParse(uuid, out Guid guid))
        {
            return BadRequest(new {
                timestamp = DateTime.Now,
                status = 400,
                error = "invalid uuid",
                path = "/todo/" + uuid
            });
        }
        var task = _todoRepository.GetTaskByUuid(guid);
        if (task == null)
        {
            return ToDoTaskModel.GetUnknownTask();
        }
        return task;
    }

    [HttpPut("completed/{uuid}")]
    public ActionResult MarkTaskComplete(string uuid)
    {
        if (!Guid.TryParse(uuid, out Guid guid))
        {
            return BadRequest(new {
                timestamp = DateTime.Now,
                status = 400,
                error = "invalid uuid",
                path = "/todo/completed/" + uuid
            });
        }
        var task = _todoRepository.GetTaskByUuid(guid);
        if (task == null)
        {
            return Ok(new {success = "false", message = "Task not found"});
        }
        if (task.CompletedFlag)
        {
            return Ok(new {success = "false", message = "Task already completed"});
        }
        task.CompletedFlag = true;
        task.CompletionDate = DateTime.Now;
        _todoRepository.UpdateTask(task);
        return Ok(new {success = "true", message = "This task has now been completed."});
    }

    [HttpPost("addTask")]
    public ActionResult AddTask([FromQuery] string name, [FromQuery] string description)
    {
        if (string.IsNullOrEmpty(name))
        {
            return BadRequest(new {
                timestamp = DateTime.Now,
                status = 400,
                error = "name is required",
                path = "/todo/addTask"
            });
        }
        if (string.IsNullOrEmpty(description))
        {
            return BadRequest(new {
                timestamp = DateTime.Now,
                status = 400,
                error = "description is required",
                path = "/todo/addTask"
            });
        }
        var task = _todoRepository.AddTask(name, description);
        return Ok(task);
    }
}
