namespace ToDoListAPITest;

public class TodoControllerTest_GetTasks
{
    [Fact]
    public void TestGetAllTasks()
    {
        // Arrange
        var mockToDoRepo = new Mock<IToDoRepository>();
        mockToDoRepo
            .Setup(x => x.GetAllTasks(It.IsAny<bool?>()))
            .Returns(
                new List<ToDoTaskModel>()
                {
                    new ToDoTaskModel()
                    {
                        Uuid = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa"),
                        TaskName = "Walk the dog",
                        TaskDescription = "Walk the dog for forty five minutes",
                        CreationDate = DateTime.Parse(
                            "2023-06-23T09:30:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        )
                    },
                    new ToDoTaskModel()
                    {
                        Uuid = new Guid("fd5ff9df-f194-4c6e-966a-71b38f95e14f"),
                        TaskName = "Mow the lawn",
                        TaskDescription = "Mow the lawn in the back garden",
                        CreationDate = DateTime.Parse(
                            "2023-06-23T09:00:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        )
                    },
                    new ToDoTaskModel()
                    {
                        Uuid = new Guid("5c3ec8bc-6099-4cd5-b6da-8e2956db3a34"),
                        TaskName = "Test generative AI",
                        TaskDescription =
                            "Use generative AI technology to write a simple web service",
                        CreationDate = DateTime.Parse(
                            "2023-06-23T09:00:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        )
                    }
                }
            );
        var controller = new TodoController(mockToDoRepo.Object);
        // Act
        var objResult = controller.GetAllTasks();
        // Assert
        Assert.NotNull(objResult);
        Assert.IsType<List<ToDoTaskModel>>(objResult);
    }

    [Fact]
    public void TestGetTasksCompleted()
    {
        // Arrange
        var mockToDoRepo = new Mock<IToDoRepository>();
        mockToDoRepo
            .Setup(x => x.GetAllTasks(It.IsAny<bool?>()))
            .Returns(
                new List<ToDoTaskModel>()
                {
                    new ToDoTaskModel()
                    {
                        Uuid = new Guid("fd5ff9df-f194-4c6e-966a-71b38f95e14f"),
                        TaskName = "Mow the lawn",
                        TaskDescription = "Mow the lawn in the back garden",
                        CreationDate = DateTime.Parse(
                            "2023-06-23T09:00:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        ),
                        CompletionDate = DateTime.Parse(
                            "2023-07-23T09:00:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        ),
                        CompletedFlag = true
                    },
                    new ToDoTaskModel()
                    {
                        Uuid = new Guid("5c3ec8bc-6099-4cd5-b6da-8e2956db3a34"),
                        TaskName = "Test generative AI",
                        TaskDescription =
                            "Use generative AI technology to write a simple web service",
                        CreationDate = DateTime.Parse(
                            "2023-06-23T09:00:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        ),
                        CompletionDate = DateTime.Parse(
                            "2023-07-23T09:00:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        ),
                        CompletedFlag = true
                    }
                }
            );
        var controller = new TodoController(mockToDoRepo.Object);
        // Act
        var objResult = controller.GetAllTasks(true);
        // Assert
        Assert.NotNull(objResult);
        Assert.All(objResult, item => Assert.True(item.CompletedFlag));
    }

    [Fact]
    public void TestGetTasksNotCompleted()
    {
        // Arrange
        var mockToDoRepo = new Mock<IToDoRepository>();
        mockToDoRepo
            .Setup(x => x.GetAllTasks(It.IsAny<bool?>()))
            .Returns(
                new List<ToDoTaskModel>()
                {
                    new ToDoTaskModel()
                    {
                        Uuid = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa"),
                        TaskName = "Walk the dog",
                        TaskDescription = "Walk the dog for forty five minutes",
                        CreationDate = DateTime.Parse(
                            "2023-06-23T09:30:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        )
                    },
                    new ToDoTaskModel()
                    {
                        Uuid = new Guid("fd5ff9df-f194-4c6e-966a-71b38f95e14f"),
                        TaskName = "Mow the lawn",
                        TaskDescription = "Mow the lawn in the back garden",
                        CreationDate = DateTime.Parse(
                            "2023-06-23T09:00:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        )
                    }
                }
            );
        var controller = new TodoController(mockToDoRepo.Object);
        // Act
        var objResult = controller.GetAllTasks(false);
        // Assert
        Assert.NotNull(objResult);
        Assert.All(objResult, item => Assert.False(item.CompletedFlag));
    }

    [Fact]
    public void TestGetTasksById()
    {
        // Arrange
        Guid testUUID = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa");
        var mockToDoRepo = new Mock<IToDoRepository>();
        mockToDoRepo
            .Setup(x => x.GetTasksById(It.IsAny<Guid>()))
            .Returns(
                new ToDoTaskModel()
                {
                    Uuid = testUUID,
                    TaskName = "Walk the dog",
                    TaskDescription = "Walk the dog for forty five minutes",
                    CreationDate = DateTime.Parse(
                        "2023-06-23T09:30:00Z",
                        null,
                        System.Globalization.DateTimeStyles.RoundtripKind
                    )
                }
            );
        var controller = new TodoController(mockToDoRepo.Object);
        // Act
        var objResult = controller.GetTasksById(testUUID);
        // Assert
        Assert.NotNull(objResult);
        Assert.IsType<ToDoTaskModel>(objResult);
        ToDoTaskModel item = (ToDoTaskModel)objResult;
        Assert.Equal(testUUID, item.Uuid);
    }
}
