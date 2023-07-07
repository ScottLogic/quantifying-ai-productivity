using Microsoft.AspNetCore.Mvc;

namespace ToDoListAPI.Controllers;

[ApiController]
[Route("[controller]")]
public class TodoController : ControllerBase
{
    private static List<Todo> todoList = new List<Todo>
    {
        new Todo
        {
            Uuid = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa"),
            Name = "Walk the dog",
            Description = "Walk the dog for forty five minutes",
            Created = new DateTime(2023, 06, 23, 9, 30, 0),
            Complete = null,
            Completed = false
        },
        new Todo
        {
            Uuid = new Guid("fd5ff9df-f194-4c6e-966a-71b38f95e14f"),
            Name = "Mow the lawn",
            Description = "Mow the lawn in the back garden",
            Created = new DateTime(2023, 06, 23, 9, 0, 0),
            Complete = null,
            Completed = false
        }
    };

    private readonly ILogger<TodoController> _logger;

    public TodoController(ILogger<TodoController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IEnumerable<Todo> Get()
    {
        return todoList;
    }

    [HttpGet("{id}")]
    public IActionResult GetById(Guid id)
    {
        var todo = todoList.Find(t => t.Uuid == id);
        if (todo == null)
            return NotFound();

        return Ok(todo);
    }

    [HttpPost]
    public IActionResult Post([FromBody] Todo todo)
    {
        todo.Created = DateTime.Now;
        todoList.Add(todo);
        return CreatedAtAction(nameof(GetById), new { id = todo.Uuid }, todo);
    }

    [HttpPut("completed/{id}")]
    public IActionResult Put(Guid id)
    {
        var todo = todoList.Find(t => t.Uuid == id);
        if (todo == null)
            return NotFound();

        todo.Complete = DateTime.Now;
        todo.Completed = true;
        return Ok(todo);
    }
}
