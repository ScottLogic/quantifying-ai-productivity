package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.web.ErrorResponse;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException e) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .error("Invalid request. " + e.getMessage())
                .status(HttpStatus.BAD_REQUEST.value())
                .timestamp(java.time.Instant.now())
                .build();
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
