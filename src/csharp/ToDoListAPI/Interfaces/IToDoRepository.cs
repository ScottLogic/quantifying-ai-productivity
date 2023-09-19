using ToDoListAPI.Models;

namespace ToDoListAPI.Interfaces;

public interface IToDoRepository
{
    IEnumerable<ToDoTaskModel> GetAllTasks(bool? completed = null);

#nullable enable

    ToDoTaskModel? GetTask(Guid id);

    Guid AddTask(string name, string description);

    void UpdateTask(ToDoTaskModel task);

#nullable disable

}
