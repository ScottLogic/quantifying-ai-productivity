using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ToDoListAPI.Models
{
    public class UpdateResponse
    {
        [Required]
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [Required]
        [JsonPropertyName("message")]
        public string Message { get; set; }
    }
}
