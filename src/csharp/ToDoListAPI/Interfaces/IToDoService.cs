public interface IToDoService
{
    List<ToDoModel> GetAllTasks(bool? completedFlag = null);
    List<ToDoModel> GetTasksByCompletedFlag(bool? completedFlag = null);
    ToDoModel GetTasksByUUID(Guid uuid);
    ToDoModel AddTask(ToDoModel newTask);
    bool CompleteTask(Guid uuid);
    List<ToDoModel> ReadToDoFile();
}
