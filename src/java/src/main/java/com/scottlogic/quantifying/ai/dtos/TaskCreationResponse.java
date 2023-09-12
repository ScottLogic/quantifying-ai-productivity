package com.scottlogic.quantifying.ai.dtos;

public class TaskCreationResponse {

  private String taskId;
  private String message;

  public TaskCreationResponse(String taskId, String message) {
    this.taskId = taskId;
    this.message = message;
  }

  public String getTaskId() {
    return taskId;
  }

  public String getMessage() {
    return message;
  }
}
