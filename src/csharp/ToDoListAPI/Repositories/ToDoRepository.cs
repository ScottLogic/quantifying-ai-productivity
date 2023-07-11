using System.Text.Json;
using ToDoListAPI.Interfaces;
using ToDoListAPI.Models;

namespace ToDoListAPI.Repositories;

public class ToDoRepository : IToDoRepository
{
    static List<ToDoTaskModel> todoList;
    private readonly string fileName = @"..\..\static_data\ToDoList.json";

    public ToDoRepository(string fileName = null)
    {
        if (todoList == null)
        {
            todoList = ReadToDoFile().ToList();
        }
        if (!string.IsNullOrEmpty(fileName))
        {
            this.fileName = fileName;
        }
    }

    public IEnumerable<ToDoTaskModel> GetAllTasks()
    {
        return todoList.AsEnumerable();
    }

    public IEnumerable<ToDoTaskModel> ReadToDoFile()
    {
        IEnumerable<ToDoTaskModel> readToDoList = null;
        string jsonString = File.ReadAllText(fileName);
        if (!String.IsNullOrEmpty(jsonString))
        {
            readToDoList = JsonSerializer.Deserialize<IEnumerable<ToDoTaskModel>>(jsonString);
        }
        return readToDoList;
    }
}
