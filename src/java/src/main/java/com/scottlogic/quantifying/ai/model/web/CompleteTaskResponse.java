package com.scottlogic.quantifying.ai.model.web;

import java.io.Serializable;

public class CompleteTaskResponse implements Serializable {
    private boolean success;
    private String message;

    public CompleteTaskResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "CompleteTaskResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
}
