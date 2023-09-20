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
    public IEnumerable<ToDoTaskModel> GetAllTasks(bool completed = false)
    {
        IEnumerable<ToDoTaskModel> tasks = _todoRepository.GetAllTasks();
        // if complete then filter out the incomplete tasks
        if (completed)
        {
            // log
            Console.WriteLine($"GetAllTasks: completed = {completed}");
            tasks = tasks.Where(t => t.CompletedFlag == true);
        }
        return tasks;
    }

    // get by task uuid
    [HttpGet("{uuid}")]
    public ToDoTaskModel GetTaskByUuid(Guid uuid)
    {
        return _todoRepository.GetTaskByUuid(uuid);
    }

    // put endpoint to update a task to complete and returns CompleteResponse
    [HttpPut("completed/{uuid}")]
    public CompleteResponse UpdateTaskComplete(Guid uuid)
    {
        var task = _todoRepository.GetTaskByUuid(uuid);
        if (task.Uuid.Equals(ToDoTaskModel.GetUnknownTask().Uuid))
        {
            Console.WriteLine($"not found: task = {task.Uuid}");
            return new CompleteResponse() { Success = false, Message = $"Task not found" };
        }
        else
        {
            if (task.CompletedFlag == false)
            {
                var success = _todoRepository.UpdateTaskCompleted(task);
                if (success)
                {
                    return new CompleteResponse()
                    {
                        Success = true,
                        Message = $"This task has now been completed."
                    };
                }
            }
            else
            {
                return new CompleteResponse()
                {
                    Success = false,
                    Message = $"Task already marked complete."
                };
            }
        }

        return new CompleteResponse() { Success = false, Message = $"Could not mark as complete." };
    }

    // post endpoint to add a new task
    [HttpPost("{addTask}")]
    public IActionResult AddTask(string name, string description)
    {
        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(description))
        {
            return BadRequest();
        }
        var newTask = new ToDoTaskModel()
        {
            Uuid = Guid.NewGuid(),
            TaskName = name,
            TaskDescription = description,
            CreationDate = DateTime.Now,
            CompletedFlag = false
        };
        // add the new task to the list
        _todoRepository.AddTask(newTask);

        return Ok(
            new AddResponse()
            {
                TaskId = newTask.Uuid,
                Message = $"Task {name} added successfully."
            }
        );
    }
}
