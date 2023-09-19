using System.Text.Json.Serialization;

namespace ToDoListAPI.Models;

public class SuccessModel
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; }
}
