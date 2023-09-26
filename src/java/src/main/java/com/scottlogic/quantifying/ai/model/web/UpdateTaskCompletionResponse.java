
package com.scottlogic.quantifying.ai.model.web;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@JsonInclude
@Getter
@Setter
@Builder
public class UpdateTaskCompletionResponse {

    private boolean success;
    private String message;

}
