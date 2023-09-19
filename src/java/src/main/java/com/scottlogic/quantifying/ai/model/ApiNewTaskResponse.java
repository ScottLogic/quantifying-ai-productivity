package com.scottlogic.quantifying.ai.model;

public class ApiNewTaskResponse {
    private String taskId;
    private String message;

    public ApiNewTaskResponse(String taskId, String message) {
        this.taskId = taskId;
        this.message = message;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

