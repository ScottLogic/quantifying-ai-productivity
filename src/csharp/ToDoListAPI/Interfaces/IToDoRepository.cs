using Microsoft.AspNetCore.Mvc;
using ToDoListAPI.Models;

namespace ToDoListAPI.Interfaces;

public interface IToDoRepository
{
    IEnumerable<ToDoTaskModel> GetAllTasks();

    ToDoTaskModel GetTaskByUuid(Guid uuid);

    bool UpdateTaskCompleted(ToDoTaskModel task);

    void AddTask(ToDoTaskModel task);
}
