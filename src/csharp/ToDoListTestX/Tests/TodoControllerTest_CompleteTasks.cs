namespace ToDoListTestX;

public class TodoControllerTest_CompleteTasks
{
    [Fact]
    public void TestCompleteTask()
    {
        // Arrange
        Guid testUUID = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa");
        var mockToDoRepo = new Mock<IToDoRepository>();
        mockToDoRepo
            .Setup(x => x.GetTasksById(It.IsAny<Guid>()))
            .Returns(
                new ToDoTaskModel()
                {
                    uuid = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa"),
                    taskName = "Walk the dog",
                    taskDescription = "Walk the dog for forty five minutes",
                    creationDate = DateTime.Parse(
                        "2023-06-23T09:30:00Z",
                        null,
                        System.Globalization.DateTimeStyles.RoundtripKind
                    )
                }
            );

        mockToDoRepo.Setup(x => x.CompleteTask(It.IsAny<Guid>())).Returns(true);

        var controller = new TodoController(mockToDoRepo.Object);

        // Act
        var objResult = controller.CompleteTask(testUUID) as ObjectResult;

        // Assert
        Assert.NotNull(objResult);
        Assert.NotNull(objResult.Value);
        Assert.Equal(200, objResult.StatusCode);
    }
}
