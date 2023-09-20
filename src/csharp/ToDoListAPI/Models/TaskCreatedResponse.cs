namespace ToDoListAPI.Models
{
    public class TaskCreatedResponse
    {
        public Guid TaskId { get; set; }
        public string Message { get; set; }
    }
}
