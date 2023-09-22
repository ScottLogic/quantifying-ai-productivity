package com.scottlogic.quantifying.ai.controllers;

import com.scottlogic.quantifying.ai.model.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.Strings;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@ControllerAdvice
@Slf4j
public class ExceptionHandlerController {

    // Create a method that handles IllegalArgumentException and returns a ResponseEntity with a well-formed json response body containing the status, error, timestamp and path.
    @ExceptionHandler({IllegalArgumentException.class, MissingServletRequestParameterException.class})
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(Exception ex, HttpServletRequest request) {
        log.error("Exception", ex);
        HttpStatus badRequest = HttpStatus.BAD_REQUEST;
        String queryParams = Optional.ofNullable(request.getQueryString()).map(params -> "?" + params).orElse(Strings.EMPTY);
        return ResponseEntity.status(badRequest).body(new ErrorResponse(
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME),
                badRequest.value(),
                badRequest.getReasonPhrase(),
                request.getRequestURI() + queryParams));
    }

}

