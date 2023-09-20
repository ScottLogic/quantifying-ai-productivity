using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ToDoListAPI.Models;

public class CompleteResponse
{
    public bool Success { get; set; }
    public string Message { get; set; }
}
