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

    public bool CompleteTask(Guid id)
    {
        var task = _todoList.FirstOrDefault(t => t.Uuid == id);

        if (task.CompletedFlag)
        {
            return false;
        }

        task.CompletedFlag = true;
        task.CompletionDate = DateTime.Now;

        return true;
    }

    public IEnumerable<ToDoTaskModel> GetAllTasks(bool? completed)
    {
        if (completed == null)
        {
            return _todoList.AsEnumerable();
        }

        return _todoList.Where(t => t.CompletedFlag == completed);
    }

    public ToDoTaskModel GetById(Guid id)
    {
        return _todoList.FirstOrDefault(t => t.Uuid == id);
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
