package com.scottlogic.quantifying.ai.exceptions;

import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;

public class CustomErrorResponse {

  private final HttpStatus status;
  private final String message;
  private final String path;
  private final LocalDateTime timestamp;

  public CustomErrorResponse(
      HttpStatus status, String message, String path, LocalDateTime timestamp) {
    this.status = status;
    this.message = message;
    this.path = path;
    this.timestamp = timestamp;
  }

  public HttpStatus getStatus() {
    return status;
  }

  public String getMessage() {
    return message;
  }

  public String getPath() {
    return path;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }
}
