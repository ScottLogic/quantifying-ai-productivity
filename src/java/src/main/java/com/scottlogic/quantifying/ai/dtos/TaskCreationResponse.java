package com.scottlogic.quantifying.ai.dtos;

public class TaskCreationResponse {

  private String uuid;
  private String message;

  public TaskCreationResponse(String uuid, String message) {
    this.uuid = uuid;
    this.message = message;
  }

  public String getUuid() {
    return uuid;
  }

  public String getMessage() {
    return message;
  }
}
