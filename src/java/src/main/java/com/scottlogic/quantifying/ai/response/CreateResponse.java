package com.scottlogic.quantifying.ai.response;

import java.util.UUID;

public class CreateResponse {
    private UUID taskId;
    private String message;

    public CreateResponse(UUID taskId, String message) {
        this.taskId = taskId;
        this.message = message;
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
}
