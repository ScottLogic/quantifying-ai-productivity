public class ToDoService : IToDoService
{
    static List<ToDoModel> todoList = null;
    private static readonly string fileName = Path.Combine(
        AppDomain.CurrentDomain.BaseDirectory,
        "ToDoList.json"
    );

    public ToDoService()
    {
        if (todoList == null)
        {
            todoList = ReadToDoFile();
        }
    }

    public List<ToDoModel> GetAllTasks(bool? completedFlag = null)
    {
        if (completedFlag != null)
        {
            return GetTasksByCompletedFlag(completedFlag);
        }
        return todoList;
    }

    public List<ToDoModel> GetTasksByCompletedFlag(bool? completedFlag = null)
    {
        return (
            (completedFlag == null)
                ? todoList
                : (todoList.FindAll(x => x.completedFlag == (bool)completedFlag))
        );
    }

    public ToDoModel GetTasksByUUID(Guid uuid)
    {
        var task = todoList.Find(x => x.uuid == uuid);
        task = task ?? ToDoModel.GetUnknownTask();
        return task;
    }

    public ToDoModel AddTask(ToDoModel newTask)
    {
        newTask.uuid = Guid.NewGuid();
        todoList.Add(newTask);
        var createdTask = GetTasksByUUID(newTask.uuid);
        return createdTask;
    }

    public bool CompleteTask(Guid uuid)
    {
        var task = todoList.Find(x => x.uuid == uuid);
        if (task != null)
        {
            task.completedFlag = true;
            task.completionDate = DateTime.Now;
            return task.completedFlag;
        }
        return false;
    }

    private bool InitToDoFile()
    {
        string jsonString = ToDoModel.ToJson(ToDoModel.GetInitToDoStaticList());
        File.WriteAllText(fileName, jsonString);

        return File.Exists(fileName);
    }

    public List<ToDoModel> ReadToDoFile()
    {
        List<ToDoModel> readToDoList = null;
        if (!File.Exists(fileName))
        {
            InitToDoFile();
        }
        string jsonString = File.ReadAllText(fileName);
        if (!String.IsNullOrEmpty(jsonString))
        {
            readToDoList = ToDoModel.FromJson(jsonString);
        }
        return readToDoList;
    }
}
