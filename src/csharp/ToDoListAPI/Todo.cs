public class Todo
{
    public Guid Uuid { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public DateTime Created { get; set; }
    public DateTime? Complete { get; set; }
    public bool Completed { get; set; }
}
