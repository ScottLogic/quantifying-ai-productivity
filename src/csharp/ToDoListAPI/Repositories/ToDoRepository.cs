using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
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
        return _todoList.FirstOrDefault(t => t.Uuid == uuid, ToDoTaskModel.GetUnknownTask());
    }

    public bool UpdateTaskCompleted(ToDoTaskModel task)
    {
        if (task != null && _todoList.Contains(task))
        {
            _todoList.Remove(task);
            task.CompletedFlag = true;
            task.CompletionDate = DateTime.Now;
            _todoList.Add(task);
            return true;
        }
        return false;
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
