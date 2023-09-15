using ToDoListAPI.Models;

namespace ToDoListAPI.Interfaces;

public interface IToDoRepository
{
    IEnumerable<ToDoTaskModel> GetAllTasks();
    IEnumerable<ToDoTaskModel> GetTasksByCompletionStatus(bool complete);

    ToDoTaskModel GetTaskById(Guid id);

    UpdateResponse CompleteTaskById(Guid id);

    CreateResponse CreateTask(string name, string description);
}
