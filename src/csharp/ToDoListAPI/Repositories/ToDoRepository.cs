using System.Text.Json;
using ToDoListAPI.Interfaces;
using ToDoListAPI.Models;

namespace ToDoListAPI.Repositories;

public class ToDoRepository : IToDoRepository
{
    static List<ToDoTaskModel> _todoList;
    private readonly string _fileName = @"..\..\static_data\ToDoList.json";

    public ToDoRepository(string fileName = null)
    {
        if (_todoList == null)
        {
            _todoList = ReadToDoFile().ToList();
        }
        if (!string.IsNullOrEmpty(fileName))
        {
            _fileName = fileName;
        }
    }

    public void AddTask(ToDoTaskModel task)
    {
        _todoList.Add(task);
    }

    public IEnumerable<ToDoTaskModel> GetAllTasks()
    {
        return _todoList.AsEnumerable();
    }

    public ToDoTaskModel GetTaskByUuid(Guid uuid)
    {
        return _todoList.FirstOrDefault(x => x.Uuid == uuid) ?? ToDoTaskModel.GetUnknownTask();
    }

    public void MarkTaskAsComplete(Guid uuid)
    {
        var task = _todoList.FirstOrDefault(x => x.Uuid == uuid);
        if (task != null) 
        {
            task.CompletedFlag = true;
            task.CompletionDate = DateTime.Now;
        }
    }

    private IEnumerable<ToDoTaskModel> ReadToDoFile()
    {
        IEnumerable<ToDoTaskModel> readToDoList = null;
        string jsonString = File.ReadAllText(_fileName);
        if (!String.IsNullOrEmpty(jsonString))
        {
            readToDoList = JsonSerializer.Deserialize<IEnumerable<ToDoTaskModel>>(jsonString);
        }
        return readToDoList;
    }
}
