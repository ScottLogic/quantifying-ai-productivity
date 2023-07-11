namespace ToDoListAPITest;

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
                new ToDoTaskModel()
                {
                    Uuid = Guid.NewGuid(),
                    TaskName = taskName,
                    TaskDescription = taskDescription,
                    CreationDate = DateTime.Now
                }
            );
        var controller = new TodoController(mockToDoRepo.Object);

        // Act
        var objResult = controller.AddTask(taskName, taskDescription) as ObjectResult;
        // Assert
        Assert.NotNull(objResult);
        Assert.NotNull(objResult.Value);
        Assert.Equal(201, objResult.StatusCode);
        var resultValObj = objResult.Value as object;
        var taskId = resultValObj.GetType()?.GetProperty("taskId")?.GetValue(resultValObj);
        Assert.IsType<Guid>(taskId);
        Assert.NotEqual(Guid.Empty, taskId);
    }
}
