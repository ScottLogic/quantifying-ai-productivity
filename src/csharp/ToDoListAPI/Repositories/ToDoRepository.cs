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

    public ToDoTaskModel AddTask(string name, string description)
    {
        var newTask = new ToDoTaskModel
        {
            Uuid = Guid.NewGuid(),
            TaskName = name,
            TaskDescription = description,
            CreationDate = DateTime.Now,
            CompletionDate = null,
            CompletedFlag = false
        };
        _todoList.Add(newTask);
        // maybe write out to file for persistence
        // WriteToDoFile();
        return newTask;
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

    public void UpdateTask(ToDoTaskModel task)
    {
        var existingTask = _todoList.FirstOrDefault(x => x.Uuid == task.Uuid);
        if (existingTask != null)
        {
            existingTask.TaskName = task.TaskName;
            existingTask.TaskDescription = task.TaskDescription;
            existingTask.CreationDate = task.CreationDate;
            existingTask.CompletionDate = task.CompletionDate;
            existingTask.CompletedFlag = task.CompletedFlag;
        }
        else
        {
            throw new Exception("Task not found");
        }
        // maybe write out to file for persistence
        // WriteToDoFile();
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
