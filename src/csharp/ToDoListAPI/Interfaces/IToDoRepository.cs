using ToDoListAPI.Models;

namespace ToDoListAPI.Interfaces;

public interface IToDoRepository
{
    IEnumerable<ToDoTaskModel> GetAllTasks();
    IEnumerable<ToDoTaskModel> ReadToDoFile();
}
