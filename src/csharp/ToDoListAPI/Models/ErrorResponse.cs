using System.Text.Json.Serialization;

namespace ToDoListAPI.Models
{
    public class ErrorResponse
    {
        [JsonPropertyName("timestamp")]
        public DateTime Timestamp { get; set; }

        [JsonPropertyName("statusCode")]
        public int StatusCode { get; set; }

        [JsonPropertyName("error")]
        public string ErrorMessage { get; set; }

        [JsonPropertyName("path")]
        public string Path { get; set; }
    }
}
