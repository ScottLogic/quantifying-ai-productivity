public class ToDoTaskModel
{
    public Guid uuid { get; set; }
    public string? name { get; set; }
    public string? description { get; set; }
    public DateTime created { get; set; }
    public DateTime? complete { get; set; }
    public bool completed { get; set; }
}
