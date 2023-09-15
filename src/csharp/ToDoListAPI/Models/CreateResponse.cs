using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ToDoListAPI.Models
{
    public class CreateResponse
    {
        [Required]
        [JsonPropertyName("taskId")]
        public Guid TaskId { get; set; }

        [Required]
        [JsonPropertyName("message")]
        public string Message { get; set; }
    }
}
