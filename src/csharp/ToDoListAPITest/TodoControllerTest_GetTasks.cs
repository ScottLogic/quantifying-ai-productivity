namespace ToDoListAPITest;

public class TodoControllerTest_GetTasks
{
    [Fact]
    public void TestGetAllTasks()
    {
        // Arrange
        var mockToDoRepo = new Mock<IToDoRepository>();
        mockToDoRepo
            .Setup(x => x.GetAllTasks())
            .Returns(
                new List<ToDoTaskModel>()
                {
                    new ToDoTaskModel()
                    {
                        uuid = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa"),
                        name = "Walk the dog",
                        description = "Walk the dog for forty five minutes",
                        created = DateTime.Parse(
                            "2023-06-23T09:30:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        )
                    },
                    new ToDoTaskModel()
                    {
                        uuid = new Guid("fd5ff9df-f194-4c6e-966a-71b38f95e14f"),
                        name = "Mow the lawn",
                        description = "Mow the lawn in the back garden",
                        created = DateTime.Parse(
                            "2023-06-23T09:00:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        )
                    },
                    new ToDoTaskModel()
                    {
                        uuid = new Guid("5c3ec8bc-6099-4cd5-b6da-8e2956db3a34"),
                        name = "Test generative AI",
                        description = "Use generative AI technology to write a simple web service",
                        created = DateTime.Parse(
                            "2023-06-23T09:00:00Z",
                            null,
                            System.Globalization.DateTimeStyles.RoundtripKind
                        )
                    }
                }
            );
        var controller = new TodoController(mockToDoRepo.Object);
        // Act
        var objResult = controller.Get();
        // Assert
        Assert.NotNull(objResult);
        Assert.IsType<List<ToDoTaskModel>>(objResult);
    }
}
