using Microsoft.AspNetCore.Mvc;
using ToDoListAPI.Models;

namespace ToDoListAPI.Interfaces;

public interface IToDoRepository
{
    ToDoTaskModel AddTask(string name, string description);
    IEnumerable<ToDoTaskModel> GetAllTasks(bool? isComplete = null);
    ToDoTaskModel GetTaskByUuid(Guid uuid);
    void UpdateTask(ToDoTaskModel task);
}
