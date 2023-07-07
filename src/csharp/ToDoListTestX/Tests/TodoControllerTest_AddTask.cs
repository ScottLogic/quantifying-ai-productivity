namespace ToDoListTestX;

public class TodoControllerTest_AddTask
{
    [Fact]
    public void TestAddTask()
    {
        // Arrange
        var mockToDoRepo = new Mock<IToDoRepository>();
        var taskName = "Walk the cat";
        var taskDescription = "This task is a mission impossible";
        mockToDoRepo
            .Setup(x => x.AddTask(It.IsAny<ToDoTaskModel>()))
            .Returns(
                new ToDoTaskModel() { TaskName = taskName, TaskDescription = taskDescription }
            );
        var controller = new TodoController(mockToDoRepo.Object);

        // Act
        var objResult = controller.AddTask(taskName, taskDescription) as ObjectResult;
        // Assert
        Assert.NotNull(objResult);
        Assert.NotNull(objResult.Value);
        Assert.Equal(200, objResult.StatusCode);
        Assert.IsType<ToDoTaskModel>(objResult.Value);
        ToDoTaskModel item = (ToDoTaskModel)objResult.Value;
        Assert.Equal(taskName, item.TaskName);
        Assert.Equal(taskDescription, item.TaskDescription);
    }
}
