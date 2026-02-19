package com.company.employee.presentation.exception;

import lombok.Builder;

import java.time.Instant;
import java.util.List;

/**
 * Standard API error response DTO.
 */
@Builder
public record ApiError(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        List<FieldError> fieldErrors
) {
    public record FieldError(
            String field,
            String message,
            Object rejectedValue
    ) {
    }
}
