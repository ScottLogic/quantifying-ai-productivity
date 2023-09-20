using ToDoListAPI.Models;

namespace ToDoListAPI.Interfaces;

public interface IToDoRepository
{
    IEnumerable<ToDoTaskModel> GetAllTasks();
    IEnumerable<ToDoTaskModel> GetCompleteTasks();
    IEnumerable<ToDoTaskModel> GetIncompleteTasks();

    ToDoTaskModel GetTaskById(Guid id);

    // set task as complete 
    bool? SetTaskComplete(Guid id);
}
