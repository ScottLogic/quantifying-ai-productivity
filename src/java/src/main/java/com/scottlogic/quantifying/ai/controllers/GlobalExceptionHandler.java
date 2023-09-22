package com.scottlogic.quantifying.ai.controllers;

import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.Instant;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<BadRequestBody> handleNotFoundException(IllegalArgumentException ex, HttpServletRequest request) {
        var path = request.getRequestURI();
        var queryParams = request.getQueryString();
        if (queryParams != null) {
            path += '?' + queryParams;
        }
        return ResponseEntity
                .badRequest()
                .body(new BadRequestBody(path));
    }

    @Getter
    private static class BadRequestBody {

        private Instant timestamp = Instant.now();
        private int status = HttpStatus.BAD_REQUEST.value();
        private String error = HttpStatus.BAD_REQUEST.getReasonPhrase();
        String path;

        public BadRequestBody(String path) {
            this.path = path;
        }
    }
}
