using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ToDoListAPI.Models;

public class ToDoTaskModel
{
    [Required]
    [JsonPropertyName("uuid")]
    public Guid uuid { get; set; }

    [Required]
    [StringLength(64, MinimumLength = 1)]
    [JsonPropertyName("name")]
    public string taskName { get; set; }

    [Required]
    [StringLength(256, MinimumLength = 1)]
    [JsonPropertyName("description")]
    public string taskDescription { get; set; }

    [JsonPropertyName("created")]
    public DateTime creationDate { get; set; } = DateTime.Now;

    [JsonPropertyName("completed")]
    public DateTime? completionDate { get; set; }

    [JsonPropertyName("complete")]
    public bool completedFlag { get; set; }

    public static string ToJson(IEnumerable<ToDoTaskModel> models) => JsonSerializer.Serialize(models);

    public static IEnumerable<ToDoTaskModel> FromJson(string json) =>
        JsonSerializer.Deserialize<IEnumerable<ToDoTaskModel>>(json);

    public static ToDoTaskModel GetUnknownTask()
    {
        return new ToDoTaskModel()
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
}
