using ToDoListAPI.Models;

namespace ToDoListAPI.Interfaces;

public interface IToDoRepository
{
    IEnumerable<ToDoTaskModel> GetAllTasks(bool? completed);

    ToDoTaskModel GetById(Guid id);

    void AddTask(ToDoTaskModel task);

    bool CompleteTask(Guid id);
}
