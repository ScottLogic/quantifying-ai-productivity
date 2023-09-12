package com.scottlogic.quantifying.ai.dtos;

public class TaskCompletionResponse {

  private boolean success;
  private String message;

  public TaskCompletionResponse(boolean success, String message) {
    this.success = success;
    this.message = message;
  }

  public boolean isSuccess() {
    return success;
  }

  public String getMessage() {
    return message;
  }
}
