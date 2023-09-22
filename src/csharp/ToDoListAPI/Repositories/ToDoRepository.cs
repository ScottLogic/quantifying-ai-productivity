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

    public IEnumerable<ToDoTaskModel> GetAllTasks(bool? isComplete = null)
    {
        var todoList =  _todoList.AsEnumerable();
        if (isComplete.HasValue)
        {
            todoList = todoList.Where(x => x.CompletedFlag == isComplete.Value);
        }

        return todoList;
    }

    public ToDoTaskModel GetTaskByUuid(Guid uuid)
    {
        return _todoList.FirstOrDefault(x => x.Uuid == uuid);
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
