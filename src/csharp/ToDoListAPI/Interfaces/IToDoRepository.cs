using ToDoListAPI.Models;

namespace ToDoListAPI.Interfaces;

public interface IToDoRepository
{
    IEnumerable<ToDoTaskModel> GetAllTasks(bool? completedFlag = null);
    IEnumerable<ToDoTaskModel> GetTasksByCompletedFlag(bool? completedFlag = null);
    ToDoTaskModel GetTasksById(Guid id);
    ToDoTaskModel AddTask(ToDoTaskModel newTodoTask);
    bool CompleteTask(Guid id);
    IEnumerable<ToDoTaskModel> ReadToDoFile();
}
