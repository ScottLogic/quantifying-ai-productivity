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

    public IEnumerable<ToDoTaskModel> GetTasksByCompletionStatus(bool complete)
    {
        return _todoList.Where(t => t.CompletedFlag == complete).AsEnumerable();
    }

    public ToDoTaskModel GetTaskById(Guid id)
    {
        var task = _todoList.FirstOrDefault(t => t.Uuid == id);
        task ??= ToDoTaskModel.GetUnknownTask();
        return task;
    }

    public UpdateResponse CompleteTaskById(Guid id)
    {
        var task = _todoList.FirstOrDefault(t => t.Uuid == id);
        if (task != null && task.CompletedFlag != true)
        {
            task.CompletedFlag = true;
            task.CompletionDate = DateTime.Now;
            return new UpdateResponse()
            {
                Success = true,
                Message = "This task has now been completed."
            };
        }
        else if (task != null && task.CompletedFlag == true)
        {
            return new UpdateResponse()
            {
                Success = false,
                Message = "Task already marked complete."
            };
        }

        return new UpdateResponse() { Success = false, Message = "Task not found." };
    }

    public CreateResponse CreateTask(string name, string description)
    {
        var newTask = new ToDoTaskModel()
        {
            Uuid = Guid.NewGuid(),
            TaskName = name,
            TaskDescription = description,
            CompletedFlag = false
        };
        _todoList.Add(newTask);
        return new CreateResponse()
        {
            TaskId = newTask.Uuid,
            Message = $"Task {newTask.TaskName} added successfully.",
        };
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
