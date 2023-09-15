using ToDoListAPI.Models;

namespace ToDoListAPI.Interfaces;

public interface IToDoRepository
{
    IEnumerable<ToDoTaskModel> GetAllTasks();

    ToDoTaskModel GetTaskByUuid(Guid uuid);

    void MarkTaskAsComplete(Guid uuid);

    void AddTask(ToDoTaskModel task);
}
