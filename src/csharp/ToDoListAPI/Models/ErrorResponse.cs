using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ToDoListAPI.Models
{
    public class ErrorResponse
    {
        // model with Timestamp, status, error and path values
        [Required]
        [JsonPropertyName("timestamp")]
        public DateTime Timestamp { get; set; } = DateTime.Now;

        [Required]
        [JsonPropertyName("status")]
        public int Status { get; set; }

        [Required]
        [JsonPropertyName("error")]
        public string Error { get; set; }

        [Required]
        [JsonPropertyName("path")]
        public string Path { get; set; }

        public ErrorResponse(int status, string error, string path)
        {
            Status = status;
            Error = error;
            Path = path;
        }

        public ErrorResponse() { }
    }
}
