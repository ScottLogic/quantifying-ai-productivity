using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System.Threading.Tasks;
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


    [HttpGet("")]
    public IEnumerable<ToDoTaskModel> GetAllTasks([FromQuery(Name = "complete")] string complete = null)
    {
        if (complete == null)
        {
            return _todoRepository.GetAllTasks();
        }
        else
        {
            return _todoRepository.GetAllTasks().Where(x => x.CompletedFlag.ToString() == complete);
        }
    }

    [HttpGet("{uuid}")]
    public ActionResult<ToDoTaskModel> GetTaskByUuid(string uuid)
    {

        var isValid = Guid.TryParse(uuid, out Guid uuidGuid);

        if (!isValid)
        {
            return BadRequest();
        }
        else
        {
            return _todoRepository.GetTaskByUuid(uuidGuid);
        }
    }

    [HttpPut("completed/{uuid}")]
    public ActionResult<TaskCompletedModel> MarkTaskAsComplete(string uuid)
    {
        var isValid = Guid.TryParse(uuid, out Guid uuidGuid);

        if (!isValid)
        {
            return BadRequest();
        }
        else
        {
            var task = _todoRepository.GetTaskByUuid(uuidGuid);
            if (task.Uuid == Guid.Empty)
            {
                return new TaskCompletedModel()
                {
                    success = false,
                    message = "Task not found."
                };
            }
            else
            {
                if (task.CompletedFlag == true)
                {
                    return new TaskCompletedModel()
                    {
                        success = false,
                        message = "Task already marked complete."
                    };
                }
                else
                {
                    _todoRepository.MarkTaskAsComplete(uuidGuid);
                    return new TaskCompletedModel()
                    {
                        success = true,
                        message = "This task has now been completed."
                    };
                }
            }
        }
    }

    [HttpPost("addTask")]
    public IActionResult AddTask([FromQuery] string name, [FromQuery] string description)
    {
        if (string.IsNullOrWhiteSpace(name) || string.IsNullOrEmpty(description))
        {
            return BadRequest();
        }

        var newTask = new ToDoTaskModel
        {
            Uuid = Guid.NewGuid(),
            TaskName = name,
            TaskDescription = description,
            CreationDate = DateTime.UtcNow
        };

        _todoRepository.AddTask(newTask);

        return CreatedAtAction(null, new
        {
            TaskId = newTask.Uuid.ToString(),
            Message = $"Task {newTask.TaskName} added successfully."
        });
    }
}
