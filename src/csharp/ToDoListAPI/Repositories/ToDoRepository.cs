using System.Text.Json;
using ToDoListAPI.Interfaces;
using ToDoListAPI.Models;

namespace ToDoListAPI.Repositories;

public class ToDoRepository : IToDoRepository
{
    private static List<ToDoTaskModel> _todoList;
    private readonly string _fileName = @"..\..\static_data\ToDoList.json";

    public ToDoRepository(string fileName = null)
    {
        if (!string.IsNullOrEmpty(fileName))
        {
            _fileName = fileName;
        }

        _todoList ??= ReadToDoFile().ToList();
    }

    public Guid AddTask(string name, string description)
    {
        var task = new ToDoTaskModel()
        {
            Uuid = Guid.NewGuid(),
            TaskName = name,
            TaskDescription = description          
        };

        _todoList.Add(task);

        return task.Uuid;
    }

    public IEnumerable<ToDoTaskModel> GetAllTasks(bool? completed = null)
    {
        if (completed != null)
        {
            return _todoList.Where(t => t.CompletedFlag == completed);
        }

        return _todoList.AsEnumerable();
    }

    public ToDoTaskModel GetTask(Guid id)
    {
        return _todoList.FirstOrDefault(t => t.Uuid == id);
    }

    public void UpdateTask(ToDoTaskModel task)
    {
        _todoList.RemoveAll(t => t.Uuid == task.Uuid);

        _todoList.Add(task);
    }

    private IEnumerable<ToDoTaskModel> ReadToDoFile()
    {
        IEnumerable<ToDoTaskModel> readToDoList = null;
        string jsonString = File.ReadAllText(_fileName);
        if (!string.IsNullOrEmpty(jsonString))
        {
            readToDoList = JsonSerializer.Deserialize<IEnumerable<ToDoTaskModel>>(jsonString);
        }
        return readToDoList;
    }
}
