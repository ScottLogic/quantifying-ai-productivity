package com.scottlogic.quantifying.ai.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class InvalidUuidException extends RuntimeException {
  public InvalidUuidException() {
    super();
  }
}
