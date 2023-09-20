package com.scottlogic.quantifying.ai.model.web;

import java.io.Serializable;
import java.util.UUID;

public class CreateTaskResponse implements Serializable {
    private UUID taskId;
    private String message;

    public CreateTaskResponse(UUID taskId, String message) {
        this.taskId = taskId;
        this.message = message;
    }

    public static CreateTaskResponse fromToDoTask(ToDoTask toDoTask) {
        return new CreateTaskResponse(
                toDoTask.getUuid(),
                "Task " + toDoTask.getName() + " added successfully.");
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "CreateTaskResponse{" +
                "taskId=" + taskId +
                ", message='" + message + '\'' +
                '}';
    }
}
