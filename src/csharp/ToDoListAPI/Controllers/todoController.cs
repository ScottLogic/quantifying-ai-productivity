using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ToDoListAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class todoController : ControllerBase
{
    private readonly IToDoService _todoService;
    static List<ToDoModel> todoList = null;

    public todoController(IToDoService todoService)
    {
        _todoService = todoService;
        if (todoList == null)
        {
            todoList = _todoService.ReadToDoFile();
        }
    }

    [HttpGet]
    public List<ToDoModel> GetAllTasks(bool? complete = null)
    {
        return _todoService.GetAllTasks(complete);
    }

    [HttpGet("{uuid}")]
    public ToDoModel GetTasksByUUID(Guid uuid)
    {
        return _todoService.GetTasksByUUID(uuid);
    }

    [HttpPost("addtask")]
    public IActionResult AddTask(string name, string description)
    {
        if (String.IsNullOrEmpty(name) || String.IsNullOrEmpty(description))
        {
            return StatusCode(400, ToDoModel.GetUnknownTask());
        }
        return StatusCode(
            200,
            _todoService.AddTask(new ToDoModel() { taskName = name, taskDescription = description })
        );
    }

    [HttpPut("completed/{uuid}")]
    public IActionResult CompleteTask(Guid uuid)
    {
        var task = _todoService.GetTasksByUUID(uuid);
        if (task != null && task.uuid != Guid.Empty)
        {
            if (!task.completedFlag)
            {
                return StatusCode(
                    200,
                    _todoService.CompleteTask(uuid)
                        ? new { Message = "This task has now been completed", Updated = true }
                        : new { Message = "This task cannot be completed", Updated = false }
                );
            }
            else
            {
                return StatusCode(
                    204,
                    new { Message = "Task already marked complete.", Updated = false }
                );
            }
        }
        else
        {
            return StatusCode(204, ToDoModel.GetUnknownTask());
        }
    }
}
