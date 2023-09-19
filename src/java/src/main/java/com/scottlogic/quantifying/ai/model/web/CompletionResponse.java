package com.scottlogic.quantifying.ai.model.web;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@JsonInclude
@Getter
@Setter
@Builder
public class CompletionResponse {
    @JsonProperty("success")
    private boolean success;
    @JsonProperty("message")
    private String message;

}
