using Microsoft.AspNetCore.Mvc;

namespace ToDoListAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class TodoController : ControllerBase
{
    private static List<ToDoTaskModel> todoTaskList = new List<ToDoTaskModel>
    {
        new ToDoTaskModel
        {
            uuid = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa"),
            name = "Walk the dog",
            description = "Walk the dog for forty five minutes",
            created = new DateTime(2023, 06, 23, 9, 30, 0),
            complete = null,
            completed = false
        },
        new ToDoTaskModel
        {
            uuid = new Guid("fd5ff9df-f194-4c6e-966a-71b38f95e14f"),
            name = "Mow the lawn",
            description = "Mow the lawn in the back garden",
            created = new DateTime(2023, 06, 23, 9, 0, 0),
            complete = null,
            completed = false
        },
        new ToDoTaskModel
        {
            uuid = new Guid("5c3ec8bc-6099-4cd5-b6da-8e2956db3a34"),
            name = "Test generative AI",
            description = "Use generative AI technology to write a simple web service",
            created = new DateTime(2023, 06, 23, 9, 0, 0),
            complete = null,
            completed = false
        }
    };
    private static ToDoTaskModel unknownTodoTask = new ToDoTaskModel()
    {
        uuid = Guid.Empty,
        name = "Unknown Task",
        description = "Walk the dog for forty five minutes",
        created = new DateTime(2023, 06, 23, 9, 30, 0),
        complete = null,
        completed = false
    };

    [HttpGet]
    public IEnumerable<ToDoTaskModel> Get(bool? complete = null)
    {
        if (complete != null)
        {
            return todoTaskList.FindAll(t => t.completed == complete);
        }
        return todoTaskList;
    }

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var todo = todoTaskList.Find(t => t.uuid == id);
        if (todo == null)
            return Ok(unknownTodoTask);

        return Ok(todo);
    }

    [HttpPost("addTask")]
    public IActionResult Post(string name, string description)
    {
        if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(description))
        {
            return BadRequest(unknownTodoTask);
        }
        var todo = new ToDoTaskModel()
        {
            uuid = Guid.NewGuid(),
            name = name,
            description = description,
            created = DateTime.Now
        };
        todoTaskList.Add(todo);
        return CreatedAtAction(nameof(GetById), new { id = todo.uuid }, todo);
    }

    [HttpPut("completed/{id}")]
    public IActionResult Put(Guid id)
    {
        var todo = todoTaskList.Find(t => t.uuid == id);
        if (todo == null)
        {
            return BadRequest("Task not found");
        }
        if (todo.completed)
        {
            return BadRequest("Task already marked complete");
        }

        todo.complete = DateTime.Now;
        todo.completed = true;
        return Ok("This task has now been completed");
    }
}
