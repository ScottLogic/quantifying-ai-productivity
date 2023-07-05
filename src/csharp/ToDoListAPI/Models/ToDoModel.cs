using System.ComponentModel.DataAnnotations;
using System.Text.Json;

public class ToDoModel
{
    [Required]
    public Guid uuid { get; set; }

    [Required]
    [StringLength(64, MinimumLength = 1)]
    public string taskName { get; set; }

    [Required]
    [StringLength(256, MinimumLength = 1)]
    public string taskDescription { get; set; }
    public DateTime creationDate { get; set; } = DateTime.Now;
    public DateTime? completionDate { get; set; }
    public bool completedFlag { get; set; }

    public static string ToJson(List<ToDoModel> models) => JsonSerializer.Serialize(models);

    public static List<ToDoModel> FromJson(string json) =>
        JsonSerializer.Deserialize<List<ToDoModel>>(json);

    public ToDoModel() { }

    public static ToDoModel GetUnknownTask()
    {
        return new ToDoModel()
        {
            uuid = Guid.Empty,
            taskName = "Unknown Task",
            taskDescription = "Unknown Task",
            creationDate = DateTime.Parse(
                "1970-01-01T00:00:00Z",
                null,
                System.Globalization.DateTimeStyles.RoundtripKind
            )
        };
    }

    public static List<ToDoModel> GetInitToDoStaticList()
    {
        return new List<ToDoModel>()
        {
            new ToDoModel()
            {
                uuid = new Guid("f360ba09-4682-448b-b32f-0a9e538502fa"),
                taskName = "Walk the dog",
                taskDescription = "Walk the dog for forty five minutes",
                creationDate = DateTime.Parse(
                    "2023-06-23T09:30:00Z",
                    null,
                    System.Globalization.DateTimeStyles.RoundtripKind
                )
            },
            new ToDoModel()
            {
                uuid = new Guid("fd5ff9df-f194-4c6e-966a-71b38f95e14f"),
                taskName = "Mow the lawn",
                taskDescription = "Mow the lawn in the back garden",
                creationDate = DateTime.Parse(
                    "2023-06-23T09:00:00Z",
                    null,
                    System.Globalization.DateTimeStyles.RoundtripKind
                )
            },
            new ToDoModel()
            {
                uuid = new Guid("5c3ec8bc-6099-4cd5-b6da-8e2956db3a34"),
                taskName = "Test generative AI",
                taskDescription = "Use generative AI technology to write a simple web service",
                creationDate = DateTime.Parse(
                    "2023-06-23T09:00:00Z",
                    null,
                    System.Globalization.DateTimeStyles.RoundtripKind
                )
            }
        };
    }
}
