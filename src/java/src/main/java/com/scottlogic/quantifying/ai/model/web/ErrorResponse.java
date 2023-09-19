package com.scottlogic.quantifying.ai.model.web;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@JsonInclude
@Getter
@Setter
@Builder
public class ErrorResponse {
    private Instant timestamp;
    private int status;
    private String error;
    private String path;
}
