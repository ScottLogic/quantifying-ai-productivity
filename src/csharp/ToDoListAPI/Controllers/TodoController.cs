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

    // return invalid uuid response body if uuid is not a valid guid
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
}
