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

    public IEnumerable<ToDoTaskModel> GetAllTasks(bool? completedFlag = null)
    {
        if (completedFlag != null)
        {
            return GetTasksByCompletedFlag(completedFlag);
        }
        return _todoList.AsEnumerable();
    }

    public IEnumerable<ToDoTaskModel> GetTasksByCompletedFlag(bool? completedFlag = null)
    {
        return (
            (completedFlag == null)
                ? _todoList.AsEnumerable()
                : (_todoList.FindAll(x => x.CompletedFlag == (bool)completedFlag).AsEnumerable())
        );
    }

    public ToDoTaskModel GetTasksById(Guid id)
    {
        var todoItem = _todoList.Find(x => x.Uuid == id);
        todoItem = todoItem ?? ToDoTaskModel.GetUnknownTask();
        return todoItem;
    }

    public ToDoTaskModel AddTask(ToDoTaskModel newTodoTask)
    {
        if (newTodoTask != null)
        {
            newTodoTask.Uuid = Guid.NewGuid();
            _todoList.Add(newTodoTask);
            var createdTask = GetTasksById(newTodoTask.Uuid);
            return createdTask;
        }
        return newTodoTask;
    }

    public bool CompleteTask(Guid id)
    {
        var todoItem = _todoList.Find(x => x.Uuid == id);
        if (todoItem != null)
        {
            todoItem.CompletedFlag = true;
            todoItem.CompletionDate = DateTime.Now;
            return todoItem.CompletedFlag;
        }
        return false;
    }

    public IEnumerable<ToDoTaskModel> ReadToDoFile()
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
