using System.Text.Json.Serialization;

namespace ToDoListAPI.Models
{
    public class TaskCreationResult
    {
        [JsonPropertyName("taskId")]
        public Guid TaskId { get; set; }

        [JsonPropertyName("message")]
        public string Message { get; set; }
    }
}