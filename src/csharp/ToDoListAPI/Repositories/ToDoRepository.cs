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

    public IEnumerable<ToDoTaskModel> GetAllTasks()
    {
        return _todoList.AsEnumerable();
    }

    public IEnumerable<ToDoTaskModel> GetCompleteTasks()
    {
        // filter the list for complete tasks
        return _todoList.Where(t => t.CompletedFlag).AsEnumerable();
    }

    public IEnumerable<ToDoTaskModel> GetIncompleteTasks()
    {
        // filter the list for incomplete tasks
        return _todoList.Where(t => !t.CompletedFlag).AsEnumerable();
    }

    public ToDoTaskModel GetTaskById(Guid id)
    {
        // find the task in the list
        return _todoList.FirstOrDefault(t => t.Uuid == id);
    }

    public bool? SetTaskComplete(Guid id)
    {
        // find the task in the list
        var task = _todoList.FirstOrDefault(t => t.Uuid == id);
        if (task != null)
        {
            if (task.CompletedFlag)
            {
                // task already complete
                return false;
            } else {
                // set the task as complete
                task.CompletedFlag = true;
                task.CompletionDate = DateTime.Now;
                return true;
            }
        }
        // task not found
        return null;
    }

    public Guid AddTask(string name, string description)
    {
        Guid newGuid = Guid.NewGuid();
        // create a new task
        ToDoTaskModel newTask = new ToDoTaskModel()
        {
            Uuid = newGuid,
            TaskName = name,
            TaskDescription = description,
            CreationDate = DateTime.Now,
            CompletedFlag = false
        };
        // add the task to the list
        _todoList.Add(newTask);
        return newGuid;
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
