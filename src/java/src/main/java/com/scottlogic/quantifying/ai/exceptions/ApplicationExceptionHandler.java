package com.scottlogic.quantifying.ai.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ApplicationExceptionHandler {

  @ExceptionHandler(EmptyStringParameterException.class)
  public ResponseEntity<Object> handleEmptyStringParameterException(
      EmptyStringParameterException ex, HttpServletRequest request) {

    String pathWithQuery = request.getRequestURI() + "?" + request.getQueryString();
    // Modify the path to include query parameters
    String errorMessage = "Bad Request: " + ex.getMessage();

    CustomErrorResponse errorResponse =
        new CustomErrorResponse(
            HttpStatus.BAD_REQUEST, errorMessage, pathWithQuery, LocalDateTime.now());

    return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
  }
}
