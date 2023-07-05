using Microsoft.AspNetCore.Mvc;
using ToDoListAPI.Controllers;

namespace ToDoListTestX;

public class ToDoTests
{
    private readonly todoController _controller;
    private readonly IToDoService _todoService;

    public ToDoTests()
    {
        _todoService = new ToDoService();
        _controller = new todoController(_todoService);
    }

    [Fact]
    public void TestGetAllTasks()
    {
        // Act
        var objResult = _controller.GetAllTasks();
        // Assert
        Assert.NotNull(objResult);
        Assert.IsType<List<ToDoModel>>(objResult);
    }

    [Fact]
    public void TestGetTasksByFlags()
    {
        Guid testUUID = new Guid("5c3ec8bc-6099-4cd5-b6da-8e2956db3a34");
        // Act
        var updResult = _controller.CompleteTask(testUUID);
        var objResultTrue = _controller.GetAllTasks(true);
        var objResultFalse = _controller.GetAllTasks(false);
        // Assert
        Assert.NotNull(objResultTrue);
        Assert.IsType<List<ToDoModel>>(objResultTrue);
        Assert.All(objResultTrue, item => Assert.Equal(true, item.completedFlag));

        Assert.NotNull(objResultFalse);
        Assert.IsType<List<ToDoModel>>(objResultFalse);
        Assert.All(objResultFalse, item => Assert.Equal(false, item.completedFlag));
    }

    [Fact]
    public void TestGetTasksByUUID()
    {
        Guid testUUID = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa");
        // Act
        var objResult = _controller.GetTasksByUUID(testUUID);
        var objResultNotfound = _controller.GetTasksByUUID(Guid.NewGuid());
        // Assert
        Assert.NotNull(objResult);
        Assert.IsType<ToDoModel>(objResult);
        ToDoModel item = (ToDoModel)objResult;
        Assert.Equal(testUUID, item.uuid);

        Assert.NotNull(objResultNotfound);
        Assert.IsType<ToDoModel>(objResultNotfound);
        ToDoModel itemNotfound = (ToDoModel)objResultNotfound;
        Assert.Equivalent(itemNotfound, ToDoModel.GetUnknownTask());
    }

    [Fact]
    public void TestCompleteTask()
    {
        Guid testUUID = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa");
        // Act
        var objResult = _controller.CompleteTask(testUUID) as ObjectResult;
        // Assert
        Assert.NotNull(objResult);
        Assert.NotNull(objResult.Value);
        Assert.Equal(200, objResult.StatusCode);
    }

    [Fact]
    public void TestAddTask()
    {
        var taskName = "Walk the cat";
        var taskDescription = "This task is a mission impossible";

        // Act
        var objResult = _controller.AddTask(taskName, taskDescription) as ObjectResult;
        // Assert
        Assert.NotNull(objResult);
        Assert.NotNull(objResult.Value);
        Assert.Equal(200, objResult.StatusCode);
        Assert.IsType<ToDoModel>(objResult.Value);
        ToDoModel item = (ToDoModel)objResult.Value;
        Assert.Equal(taskName, item.taskName);
        Assert.Equal(taskDescription, item.taskDescription);
    }
}
