using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ToDoListAPI.Models;

public class ToDoTaskModel
{
    [Required]
    [JsonPropertyName("uuid")]
    public Guid Uuid { get; set; }

    [Required]
    [StringLength(64, MinimumLength = 1)]
    [JsonPropertyName("name")]
    public string TaskName { get; set; }

    [Required]
    [StringLength(256, MinimumLength = 1)]
    [JsonPropertyName("description")]
    public string TaskDescription { get; set; }

    [JsonPropertyName("created")]
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("completed")]
    public DateTime? CompletionDate { get; set; }

    [JsonPropertyName("complete")]
    public bool CompletedFlag { get; set; }

    public static ToDoTaskModel GetUnknownTask()
    {
        return new ToDoTaskModel()
        {
            Uuid = Guid.Empty,
            TaskName = "Unknown Task",
            TaskDescription = "Unknown Task",
            CreationDate = DateTime.Parse(
                "1970-01-01T00:00:00Z",
                null,
                System.Globalization.DateTimeStyles.RoundtripKind
            )
        };
    }
}
