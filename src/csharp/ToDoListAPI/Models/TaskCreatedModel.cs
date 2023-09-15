using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ToDoListAPI.Models
{
    public class TaskCreatedModel
    {
        [Required]
        [JsonPropertyName("taskId")]
        public string TaskId { get; set; }

        [Required]
        [JsonPropertyName("message")]
        public string Message { get; set; }
    }
}
