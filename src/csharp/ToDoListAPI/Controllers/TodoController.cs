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
    public IEnumerable<ToDoTaskModel> GetAllTasks(bool? complete)
    {
        if (complete == null) {
            return _todoRepository.GetAllTasks();
        } else if (complete == true) {
            return _todoRepository.GetCompleteTasks();
        } else {
            return _todoRepository.GetIncompleteTasks();
        }
    }
}
